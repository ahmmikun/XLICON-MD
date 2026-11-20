const dns = require('dns');
const net = require('net');
const path = require('path');

const MAX_PLUGIN_BYTES = 200 * 1024;

// Hosts that are allowed to serve external plugins. raw GitHub/Gist/CDN only:
// they return the file contents directly, without an HTML wrapper.
const DEFAULT_PLUGIN_HOSTS = [
    'raw.githubusercontent.com',
    'gist.githubusercontent.com',
    'cdn.jsdelivr.net',
    'raw.githack.com',
    'rawcdn.githack.com',
];

const truthy = (value) => String(value || '').trim().toLowerCase() === 'true';

function isExternalPluginsEnabled() {
    return truthy(process.env.ALLOW_EXTERNAL_PLUGINS);
}

function isOwnerEvalEnabled() {
    return truthy(process.env.ALLOW_OWNER_EVAL);
}

function isPrivateIPv4(ip) {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
        return true;
    }
    const [a, b, c] = parts;
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    if (a === 169 && b === 254) return true; // link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 0 && (c === 0 || c === 2)) return true;
    if (a === 192 && b === 168) return true;
    if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking
    if (a === 198 && b === 51 && c === 100) return true; // documentation
    if (a === 203 && b === 0 && c === 113) return true; // documentation
    if (a >= 224) return true; // multicast, reserved, broadcast
    return false;
}

function isPrivateIPv6(ip) {
    const value = ip.toLowerCase().split('%')[0];
    if (value === '::' || value === '::1') return true;
    if (value.startsWith('::ffff:')) {
        const mapped = value.slice('::ffff:'.length);
        if (net.isIPv4(mapped)) return isPrivateIPv4(mapped);
        // ::ffff:7f00:1 is an IPv4-mapped address written as hex.
        const hex = mapped.split(':');
        if (hex.length === 2) {
            const high = parseInt(hex[0], 16);
            const low = parseInt(hex[1], 16);
            if (Number.isFinite(high) && Number.isFinite(low)) {
                const v4 = [high >> 8, high & 0xff, low >> 8, low & 0xff].join('.');
                return isPrivateIPv4(v4);
            }
        }
        return true;
    }
    if (/^f[cd]/.test(value)) return true; // unique local fc00::/7
    if (/^fe[89ab]/.test(value)) return true; // link-local fe80::/10
    if (/^ff/.test(value)) return true; // multicast
    if (/^2001:db8:/.test(value)) return true; // documentation
    if (/^2002:/.test(value)) return true; // 6to4 (can embed private IPv4)
    if (/^64:ff9b:/.test(value)) return true; // NAT64 (can embed private IPv4)
    return false;
}

function isPrivateAddress(ip) {
    if (net.isIPv4(ip)) return isPrivateIPv4(ip);
    if (net.isIPv6(ip)) return isPrivateIPv6(ip);
    return true;
}

function normalizeHostname(hostname) {
    return String(hostname || '')
        .trim()
        .toLowerCase()
        .replace(/^\[|\]$/g, '')
        .replace(/\.$/, '');
}

function isBlockedHostname(hostname) {
    const host = normalizeHostname(hostname);
    if (!host) return true;
    if (host === 'localhost') return true;
    return ['.localhost', '.local', '.internal', '.lan', '.home.arpa'].some((suffix) => host.endsWith(suffix));
}

function allowedPluginHosts() {
    const hosts = new Set(DEFAULT_PLUGIN_HOSTS);
    String(process.env.EXTERNAL_PLUGIN_ALLOWED_HOSTS || '')
        .split(',')
        .map((host) => normalizeHostname(host))
        .filter(Boolean)
        .forEach((host) => hosts.add(host));
    return hosts;
}

async function assertPublicHost(hostname) {
    const host = normalizeHostname(hostname);
    if (isBlockedHostname(host)) {
        throw new Error(`Blocked host: ${host}`);
    }

    if (net.isIP(host)) {
        if (isPrivateAddress(host)) throw new Error(`Blocked private address: ${host}`);
        return;
    }

    let records;
    try {
        records = await dns.promises.lookup(host, { all: true, verbatim: true });
    } catch (error) {
        throw new Error(`Could not resolve host: ${host}`);
    }
    if (!records.length) throw new Error(`Could not resolve host: ${host}`);
    for (const record of records) {
        if (isPrivateAddress(record.address)) {
            throw new Error(`Blocked private address for host: ${host}`);
        }
    }
}

async function assertTrustedPluginUrl(rawUrl) {
    let parsed;
    try {
        parsed = new URL(String(rawUrl || '').trim());
    } catch (error) {
        throw new Error('Invalid plugin URL');
    }

    if (parsed.protocol !== 'https:') throw new Error('Plugin URLs must use HTTPS');
    if (parsed.username || parsed.password) throw new Error('Plugin URLs must not contain credentials');
    if (parsed.port && parsed.port !== '443') throw new Error('Plugin URLs must use port 443');

    const host = normalizeHostname(parsed.hostname);
    const hosts = allowedPluginHosts();
    if (!hosts.has('*') && !hosts.has(host)) {
        throw new Error(`Plugin host is not allowed: ${host}. Add it to EXTERNAL_PLUGIN_ALLOWED_HOSTS if you trust it.`);
    }

    await assertPublicHost(host);
    return parsed;
}

function assertSafePluginSource(source, sourceUrl = 'plugin') {
    const code = String(source || '');
    if (!code.trim()) throw new Error('Plugin source is empty');
    if (Buffer.byteLength(code, 'utf8') > MAX_PLUGIN_BYTES) {
        throw new Error(`Plugin is larger than ${Math.round(MAX_PLUGIN_BYTES / 1024)} KB`);
    }
    if (code.includes('\0')) throw new Error('Plugin source contains a null byte');
    if (/^\s*<(!doctype|html|head|body)/i.test(code)) {
        throw new Error(`Expected JavaScript but received HTML from ${sourceUrl}`);
    }
    return code;
}

function sanitizePluginId(value) {
    const id = String(value || '')
        .trim()
        .replace(/\.js$/i, '')
        .replace(/^plugin[_-]?/i, '')
        .replace(/[^A-Za-z0-9_-]/g, '')
        .toLowerCase();
    if (!id || id.length > 64) throw new Error('Invalid plugin name');
    return id;
}

function safePathWithin(baseDir, fileName) {
    const base = path.resolve(baseDir);
    const target = path.resolve(base, fileName);
    if (target !== base && !target.startsWith(base + path.sep)) {
        throw new Error('Path escapes the target directory');
    }
    return target;
}

function pluginFilePath(featuresDir, id) {
    const safeId = sanitizePluginId(id);
    return safePathWithin(featuresDir, `plugin_${safeId}.js`);
}

function legacyPluginFilePath(featuresDir, id) {
    const safeId = sanitizePluginId(id);
    return safePathWithin(featuresDir, `${safeId}.js`);
}

function isExternalPluginFile(fileName) {
    return /^plugin_[A-Za-z0-9_-]+\.js$/.test(String(fileName || ''));
}

module.exports = {
    MAX_PLUGIN_BYTES,
    isExternalPluginsEnabled,
    isOwnerEvalEnabled,
    isPrivateAddress,
    assertPublicHost,
    assertTrustedPluginUrl,
    assertSafePluginSource,
    sanitizePluginId,
    safePathWithin,
    pluginFilePath,
    legacyPluginFilePath,
    isExternalPluginFile,
};
