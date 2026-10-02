# AGENTS.md

## Strict Rules for Baileys Reference & Troubleshooting

When diagnosing issues, implementing features, fixing bugs, or looking up Baileys-related functionality for this project, the LLM / AI agent **MUST ONLY** consult the following two authoritative sources:

---

### 1. Local Baileys Source Code (`node_modules/baileys`)
The active, installed version of Baileys in this project is located entirely within:
```
node_modules/baileys/
```
- **Socket & Events**: `node_modules/baileys/lib/Socket/` (e.g., `messages-send.js`, `socket.js`, `groups.js`, `messages-recv.js`)
- **Binary Protocols & Utils**: `node_modules/baileys/lib/WABinary/`, `node_modules/baileys/lib/Utils/`
- **Default Config & Types**: `node_modules/baileys/lib/Defaults/index.js`, `node_modules/baileys/lib/Types/`
- **Bundled Documentation**: `node_modules/baileys/README.md`

**Instruction**: Always inspect the actual installed files in `node_modules/baileys` to verify exact parameters, function signatures, error nodes, and behavior. Do not assume or hallucinate method signatures or configuration keys.

---

### 2. Official Baileys Documentation & MCP
- **MCP Endpoint**: `https://baileys.wiki/mcp`
- **Official Documentation**: `https://baileys.wiki`

**Instruction**: Whenever looking up official guides, architectural patterns, breaking changes, or recommended practices, use the Baileys MCP endpoint (`https://baileys.wiki/mcp`) and the official wiki documentation.

---

### Summary Rule
- **No Hallucinations / Outdated Snippets**: Do not rely on generic, outdated internet snippets, StackOverflow answers, or obsolete Baileys v4/v5 patterns.
- **Authoritative Resolution**: Always resolve Baileys inquiries and troubleshooting exclusively through:
  1. The installed code inside `node_modules/baileys/`
  2. The Baileys MCP / docs at `https://baileys.wiki/mcp`
