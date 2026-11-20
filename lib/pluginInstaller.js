const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const {
    MAX_PLUGIN_BYTES,
    isExternalPluginsEnabled,
    assertTrustedPluginUrl,
    assertSafePluginSource,
    sanitizePluginId,
    pluginFilePath,
} = require('./security');

const USER_AGENT = 'XLICON-MD/plugin-installer';

function extractPluginPattern(source) {
    const code = String(source || '');
    const patterns = [
        /pattern\s*:\s*['"`]([^'"`]+)['"`]/,
        /pattern\s*:\s*\/((?:\\.|[^/])+)\//,
    ];
    for (const expression of patterns) {
        const match = code.match(expression);
        if (match && match[1]) return match[1];
    }
    return null;
}

async function downloadPluginSource(rawUrl) {
    if (!isExternalPluginsEnabled()) {
        throw new Error('External plugins are disabled. Set ALLOW_EXTERNAL_PLUGINS=true to enable them.');
    }

    const url = await assertTrustedPluginUrl(rawUrl);
    const response = await axios.get(url.href, {
        responseType: 'text',
        transformResponse: [(data) => data],
        timeout: 15000,
        maxRedirects: 0,
        maxContentLength: MAX_PLUGIN_BYTES,
        maxBodyLength: MAX_PLUGIN_BYTES,
        headers: {
            Accept: 'application/javascript, text/plain;q=0.9, */*;q=0.1',
            'User-Agent': USER_AGENT,
        },
        validateStatus: (status) => status >= 200 && status < 300,
    });

    const source = assertSafePluginSource(response.data, url.href);
    return { source, url: url.href };
}

async function installPluginFromUrl(rawUrl, featuresDir) {
    const { source, url } = await downloadPluginSource(rawUrl);
    const pattern = extractPluginPattern(source);
    if (!pattern) throw new Error('Plugin does not declare a "pattern"');

    const id = sanitizePluginId(pattern);
    const target = pluginFilePath(featuresDir, id);

    await fs.ensureDir(path.dirname(target));
    await fs.writeFile(target, source, { encoding: 'utf8', mode: 0o600 });
    try {
        await fs.chmod(target, 0o600);
    } catch (error) {
        // chmod is not supported on every platform (for example Windows).
    }

    return { id, file: target, url, source };
}

module.exports = {
    extractPluginPattern,
    downloadPluginSource,
    installPluginFromUrl,
};
