# Security policy

## Reporting a vulnerability

Please do not open a public issue with exploit details. Use GitHub's private
security advisory feature on this repository, or contact the maintainers
privately. Include the affected file, a short reproduction, and the impact.

## Safe defaults

These protections are enabled by default:

- **External plugins are disabled.** Downloading and executing a plugin from a
  URL requires `ALLOW_EXTERNAL_PLUGINS=true`. When enabled, only HTTPS URLs on
  allowlisted hosts are accepted. The default allowlist contains raw GitHub,
  GitHub Gist, jsDelivr, and githack hosts. Add more with
  `EXTERNAL_PLUGIN_ALLOWED_HOSTS=host1,host2`.
- **Plugin downloads are bounded.** Files must be JavaScript, at most 200 KB,
  and are fetched with a 15 second timeout and no redirects.
- **Plugin names are sanitized.** Installed files are written as
  `features/plugin_<id>.js`; a download cannot choose an arbitrary path.
- **Owner eval is disabled.** The `>` and `$` JavaScript evaluators require
  `ALLOW_OWNER_EVAL=true`. Leave this off unless you actively need it.
- **Plugin removal cannot traverse paths.** `remove` only deletes a sanitized
  `plugin_<id>.js` file, plus a registered legacy `<id>.js` file that belongs
  to a database entry.
- **No shell interpolation for media tools.** ffmpeg features use
  `child_process.execFile` with argument arrays instead of shell strings.
- **The status web server** disables `X-Powered-By` and sends
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and a
  restrictive `Content-Security-Policy`.

## Credentials

Earlier revisions of this repository contained real credentials. Removing them
from the current revision does **not** remove them from Git history. Treat every
value that was ever committed as compromised and rotate it:

| Credential | Where it was | Rotation |
| --- | --- | --- |
| Heroku API key | `app.json` | Heroku Dashboard → Account settings → API key → Regenerate |
| ACRCloud access key and secret | `lib/index.js` | ACRCloud console → project credentials |
| Telegraph access token | `features/paste.js` | Create a new Telegraph account/token |
| Instagram/Facebook session cookies | `lib/scraper.js` | Log out the sessions and change the password |
| Pinterest session cookie | `lib/scraper.js` | Log out the session and change the password |

Put replacements in `config.env` (gitignored):

```env
ACRCLOUD_HOST=identify-eu-west-1.acrcloud.com
ACRCLOUD_ACCESS_KEY=
ACRCLOUD_ACCESS_SECRET=
TELEGRAPH_ACCESS_TOKEN=
PINTEREST_COOKIE=
INSTAGRAM_COOKIE=
FACEBOOK_COOKIE=
```

To purge history, rewrite it with `git filter-repo` or the BFG Repo-Cleaner and
force-push. Coordinate with anyone who has forks or clones, because old commits
remain valid until every copy is updated.

## Dependencies

Run the production audit regularly:

```sh
npm audit --omit=dev
```

`package.json` pins patched versions with `overrides` for known vulnerable
transitive packages. Do not run `npm audit fix --force` blindly; it can install
breaking major versions. Test the bot after every dependency change.

## Operational advice

- Keep `config.env`, `session/`, and `database/` private.
- Use a dedicated WhatsApp number, and make the bot owner number an account you
  control.
- Do not enable `ALLOW_EXTERNAL_PLUGINS` or `ALLOW_OWNER_EVAL` on a public bot
  unless you understand that they allow arbitrary code execution by the owner.
- Restrict who can reach the status server if you expose it publicly.
