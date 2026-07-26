# 🎯 Interview Preparation Guide: AI Native Software Engineering & Harness Engineering

> **Purpose**: Quick-revise cheatsheet + tricky questions with detailed explanations for interviews on Harness Engineering, Superpower Plugins, ADEs, MCP, and AI-native development.

---

## Part 1: Rapid-Fire Cheatsheet (30-Second Answers)

### What is Harness Engineering?
> **Answer**: A deterministic framework that converts unstructured business inputs (PDF/DOCX/Figma) into structured markdown blueprints (`brd.md`, `architecture.md`, `spec.md`, `task.md`, `SKILL.md`), enforces human-in-the-loop approval gates, and uses MCP servers for tool interoperability — ensuring zero-hallucination AI-driven software development from scratch to CI/CD delivery.

### What is a Superpower Harness Plugin?
> **Answer**: A modular plugin layer that sits between the AI model and the development environment (ADE), providing skills (`SKILL.md`), agent personas (`agents.md`), lifecycle hooks (`hooks.md`), and state persistence (`claude-progress.txt`) to transform any general-purpose AI assistant into a domain-specific, guardrailed software engineering agent.

### What is MCP (Model Context Protocol)?
> **Answer**: An open protocol (by Anthropic) that standardizes how AI models communicate with external tools and data sources. Think of it as "USB-C for AI" — a universal connector. MCP Servers expose tools (Figma API, Playwright browser, filesystem) as structured JSON-RPC endpoints that any MCP-compatible AI agent can invoke.

### What is the Document Pipeline?
> **Answer**: A topologically ordered sequence of markdown files where each file depends on the previous:
> `brd.md` → `architecture.md` → `design.md` → `proposal.md` → `spec.md` → `agents.md` → `dependency_graph.md` → `features.json` → `task.md` → `SKILL.md`

---

## Part 2: ADE Quick-Reference Comparison Table

| Question | AntiGravity | Cursor | VS Code Copilot | Windsurf | OpenSpec/Kiro | Claude Code |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Rule file?** | `.agents/AGENTS.md` | `.cursorrules` | `.github/copilot-instructions.md` | `.windsurfrules` | `.openspec/proposal.md` | `CLAUDE.md` |
| **Scoped rules?** | `skills/*/SKILL.md` | `.cursor/rules/*.mdc` | `.github/prompts/*.prompt.md` | Cascade workflows | `skills/*/SKILL.md` | `.claude/commands/*.md` |
| **MCP config?** | Built-in tool system | `.cursor/mcp.json` | VS Code extensions | `.windsurf/mcp_config.json` | `.openspec/mcp.json` | `.claude/mcp.json` |
| **User gate?** | `ask_question` modal | Composer Accept/Reject | Chat approval modal | Cascade pause step | `kiro gate approve` | CLI prompt confirmation |
| **Multi-file edit?** | Composer (built-in) | `Ctrl+I` Composer | Agent Mode `@workspace` | Cascade autonomous | Agent spec execution | Agentic loop |
| **State file?** | `claude-progress.txt` | Manual progress file | Manual progress file | Memories (auto) + manual | `kiro progress snapshot` | `claude-progress.txt` |
| **Hooks?** | Declarative `hooks.md` | Linter/formatter hooks | VS Code task runners | Cascade rule checks | `hooks.md` validation | `PreToolUse/PostToolUse` bash |

---

## Part 3: Tricky Interview Questions with Expert Explanations

---

### 🔴 Category 1: Conceptual & Architectural Questions

#### Q1: "Why do we need `proposal.md` when we already have `brd.md` and `spec.md`?"

> **Expert Answer**: Each document serves a fundamentally different purpose in the decision lifecycle:
> 
> | Document | Question It Answers | Audience |
> | :--- | :--- | :--- |
> | `brd.md` | **WHAT** needs to be built? | Product Owner, Stakeholders |
> | `proposal.md` | **WHY** this approach vs alternatives? | Architect, Tech Lead |
> | `spec.md` | **HOW** exactly will it be implemented? | Developer, QA Engineer |
> 
> `proposal.md` is the critical **decision document** between requirements (WHAT) and implementation (HOW). It captures trade-off analysis, alternatives considered, risk mitigation, and breaking change impact. Without it, the AI jumps directly from "build auth" to "here's JWT code" — skipping the architectural reasoning that prevents costly mid-sprint pivots.
>
> **Tricky follow-up**: "Can you skip proposal.md for simple features?"  
> **Answer**: For trivial changes (rename a variable, fix a typo), yes. But the Harness Pipeline exists specifically because AI agents can't distinguish "simple" from "deceptively complex" without explicit human checkpoints.

---

#### Q2: "What happens if the AI generates code without an approved spec.md? Why is this dangerous?"

> **Expert Answer**: Without an approved spec, you get **specification drift** — the AI hallucinates plausible but incorrect API contracts, data schemas, or business rules. This creates three cascading failures:
> 
> 1. **Contract Mismatch**: Frontend calls `POST /api/login` but backend implements `POST /api/auth/sign-in`.
> 2. **Edge Case Omission**: No spec means no documented edge cases (rate limiting, token expiration, concurrent access).
> 3. **Untestable Code**: Without spec-defined success/error responses, QA agents can't write meaningful E2E tests.
>
> The Harness Pipeline prevents this by making `spec.md` a **prerequisite** for code generation. No approved spec = no code generation trigger.

---

#### Q3: "Explain the difference between `.cursorrules` and `CLAUDE.md`. They seem identical."

> **Expert Answer**: They're architecturally similar (both are root-level instruction files) but differ in three critical ways:
> 
> | Dimension | `.cursorrules` | `CLAUDE.md` |
> | :--- | :--- | :--- |
> | **Scoping** | Single file, project-wide only | Multi-level: Global (`~/.claude/CLAUDE.md`) → Project root → Subdirectory |
> | **Override Behavior** | `.cursor/rules/*.mdc` overrides via glob matching | Subdirectory `CLAUDE.md` inherits + extends parent |
> | **Hook System** | No native hooks (relies on external linters) | Native `PreToolUse` / `PostToolUse` bash hook directories |
> | **Permission Model** | Implicit (user clicks Accept/Reject) | Explicit `settings.json` with `allow`/`deny` pattern matching |
> 
> **Key insight for interviews**: Cursor uses **presentation-layer gating** (showing diffs for accept/reject) while Claude Code uses **execution-layer gating** (bash hooks that can programmatically BLOCK tool calls before they execute).

---

#### Q4: "Why does the Harness Pipeline use `claude-progress.txt` instead of a database?"

> **Expert Answer**: Three engineering reasons:
> 
> 1. **LLM Readability**: AI models process plain text natively. A database requires an intermediary query layer, adding complexity and potential hallucination points.
> 2. **Context Window Injection**: `claude-progress.txt` can be directly injected into the model's context window at session start. Database records would need serialization.
> 3. **Cross-ADE Portability**: A plain text file works in AntiGravity, Cursor, Windsurf, Claude Code, and any editor. A SQLite/Postgres database creates ADE-specific dependencies.
> 4. **Git-Trackable**: The file can be committed to version control, creating a full audit trail of AI engineering decisions.
>
> **Tricky follow-up**: "What are the limitations?"  
> **Answer**: No concurrent write safety, no structured queries, grows unbounded over long projects. For large teams, you might supplement with a lightweight JSON log or SQLite alongside the text file.

---

### 🔴 Category 2: MCP & Tool Integration Questions

#### Q5: "How does Figma MCP differ from simply using the Figma REST API?"

> **Expert Answer**: 
> 
> | Dimension | Raw Figma REST API | Figma MCP Server |
> | :--- | :--- | :--- |
> | **Integration** | Requires custom HTTP client code | Standardized JSON-RPC protocol; plug-and-play |
> | **Context** | Developer writes API calls manually | AI agent invokes `figma/get_node` as a native tool |
> | **Cross-ADE** | Custom per-ADE integration needed | Same `mcp.json` config works in Cursor, Claude, Windsurf |
> | **Security** | Token management in application code | Token isolated in MCP server environment variables |
> | **Discovery** | Developer must read API docs | Agent discovers available tools via MCP `listTools` protocol |
>
> **Key insight**: MCP abstracts the API into a **tool interface** that AI models understand natively. The model doesn't need to know HTTP verbs, endpoints, or pagination — it just calls `figma/get_node(file_key, node_id)`.

---

#### Q6: "In the Playwright MCP server, what's the difference between using `playwright/screenshot` and running `npx playwright test`?"

> **Expert Answer**:
> 
> - **`playwright/screenshot` (MCP tool call)**: The AI agent directly controls a live browser session in real-time. It navigates, clicks, fills forms, and captures screenshots interactively — like a human using the browser. The agent can make decisions based on what it sees.
> 
> - **`npx playwright test` (CLI command)**: Executes pre-written test scripts (`.spec.ts` files) in batch mode. The tests are deterministic, predefined, and run without AI intervention.
>
> **When to use which**:
> - Use **Playwright MCP** during Gate 3 (design verification) when the AI needs to visually inspect generated HTML pages against Figma baselines.
> - Use **`npx playwright test`** during Gate 6 (CI/CD) when running established regression test suites.

---

#### Q7: "Can an agent in `agents.md` call MCP tools that aren't listed in its `Authorized MCP Tools` section?"

> **Expert Answer**: **No** — and this is a critical security principle called **Principle of Least Privilege for Agents**.
> 
> In the Harness framework, `agents.md` explicitly declares:
> ```markdown
> ## Agent: Frontend-Presentation-Agent
> - Authorized MCP Tools: figma/get_node, filesystem/write_file
> - File Scope: src/presentation/* only
> ```
> 
> This means:
> - ✅ Can call `figma/get_node` — authorized
> - ❌ Cannot call `playwright/navigate` — not listed, blocked
> - ❌ Cannot write to `src/services/auth.ts` — outside file scope
>
> **Implementation varies by ADE**:
> - **Claude Code**: Enforced via `settings.json` `allow`/`deny` patterns
> - **AntiGravity**: Enforced via `ask_permission` tool and system prompt constraints
> - **Cursor/Windsurf**: Enforced via rule file instructions (softer enforcement)
> - **OpenSpec/Kiro**: Enforced via agent execution sandbox

---

### 🔴 Category 3: Hooks & Lifecycle Questions

#### Q8: "What's the fundamental difference between PreToolUse and PostToolUse hooks?"

> **Expert Answer**:
> 
> | Aspect | PreToolUse Hook | PostToolUse Hook |
> | :--- | :--- | :--- |
> | **Timing** | BEFORE the tool executes | AFTER the tool executes |
> | **Can Block?** | ✅ Yes — exit code 1 prevents execution | ❌ No — tool already executed |
> | **Purpose** | Security gates, permission checks | Quality enforcement, auto-linting, tests |
> | **Example** | Block edits to `.env` files | Run `eslint --fix` after file writes |
> | **Failure Mode** | Tool call never happens | Flags issues but damage may be done |
>
> **Critical insight**: PreToolUse hooks are **preventive controls** (stop bad things from happening). PostToolUse hooks are **detective controls** (find problems after the fact). A mature Harness uses both.

---

#### Q9: "If a PostToolUse hook fails (returns exit code 1), what happens to the code changes already made?"

> **Expert Answer**: **The changes are already applied** — PostToolUse hooks fire AFTER execution. This is why PostToolUse hooks should focus on:
> 1. **Auto-correction** (run linter with `--fix` flag)
> 2. **Alert & log** (flag the issue in `claude-progress.txt`)
> 3. **Trigger rollback** (run `git checkout -- <file>` if tests fail)
>
> A properly designed PostToolUse regression hook:
> ```bash
> npm run test:fast
> if [[ $? -ne 0 ]]; then
>   echo "❌ Tests failed. Rolling back changes..."
>   git checkout -- "$CLAUDE_FILE_PATH"
>   exit 1
> fi
> ```

---

### 🔴 Category 4: State Management & Context Questions

#### Q10: "What is context window decay and how does `claude-progress.txt` solve it?"

> **Expert Answer**: **Context window decay** is when earlier conversation turns get pushed out of the model's fixed context window (e.g., 200K tokens) during long engineering sessions. The model literally "forgets" early decisions.
> 
> `claude-progress.txt` solves this by externalizing critical state:
> ```
> [COMPLETED] TASK-003: spec.md approved. JWT with bcrypt 12 rounds.
> [CURRENT]   TASK-004: Implementing auth middleware at src/middleware/auth.ts:42
> [BLOCKED]   TASK-005: Waiting for DB migration script.
> [HANDOFF]   "Resume at auth.ts line 42, implementing token refresh logic."
> ```
> 
> At session start, the agent reads this file and instantly recovers:
> - What was already decided (no re-debating JWT vs sessions)
> - Exact file and line to resume work
> - Known blockers to avoid wasted cycles
>
> **Interview follow-up**: "Is this the same as RAG?"  
> **Answer**: No. RAG retrieves relevant chunks from a large corpus. `claude-progress.txt` is a **structured session state log** — it's deterministic, complete, and manually curated. RAG is probabilistic and may miss critical context.

---

#### Q11: "How do you handle context handoff between two different agents (e.g., Frontend-Agent finishes, QA-Agent starts)?"

> **Expert Answer**: Three mechanisms work together:
> 
> 1. **`claude-progress.txt`**: QA-Agent reads current state including completed frontend tasks.
> 2. **`spec.md`**: QA-Agent reads the same API contract that Frontend-Agent implemented against.
> 3. **`agents.md`**: QA-Agent's system prompt explicitly references which Frontend-Agent artifacts to validate.
>
> The key principle: **Agents don't communicate directly**. They communicate through **shared specification files** — this prevents information loss and ensures reproducibility.

---

### 🔴 Category 5: Practical Scenario Questions

#### Q12: "Walk me through what happens when a user says 'Build me a login page' in each ADE."

> **Expert Answer (Comparative Flow)**:
> 
> **AntiGravity**:
> 1. Planning Mode activates → Creates `implementation_plan.md` → Waits for user approval
> 2. On approval → Creates `task.md` → Executes skills sequentially
> 3. Uses `browser_subagent` to visually verify the rendered page
> 
> **Cursor**:
> 1. Agent Mode reads `.cursorrules` → Checks `.cursor/rules/*.mdc` for matching globs
> 2. Composer generates multi-file diff → User clicks Accept/Reject per file
> 3. Runs terminal commands for testing
> 
> **GitHub Copilot**:
> 1. Agent Mode (`@workspace`) reads `.github/copilot-instructions.md`
> 2. Checks for matching `.github/prompts/*.prompt.md` template
> 3. Generates code in VS Code Diff Editor → User accepts/discards
> 
> **Windsurf**:
> 1. Cascade activates → Reads `.windsurfrules` for pipeline enforcement
> 2. Executes multi-step flow autonomously (up to configured step limit)
> 3. Pauses at review checkpoint → User approves or redirects
> 
> **OpenSpec/Kiro**:
> 1. Creates `proposal.md` FIRST → Blocks until user runs `kiro proposal approve`
> 2. Only then generates `spec.md` → Blocks again until `kiro gate approve --gate 4`
> 3. Executes agent with bound SKILL.md
> 
> **Claude Code**:
> 1. Reads `CLAUDE.md` → Checks `settings.json` permissions
> 2. PreToolUse hooks validate → Agent writes code → PostToolUse hooks lint
> 3. CLI prompts user for confirmation before applying changes

---

#### Q13: "Your Playwright MCP test detects a visual regression. What's the correct Harness Pipeline response?"

> **Expert Answer**: The response depends on which gate the regression is caught:
> 
> - **Caught at Gate 3 (Design Review)**: Go back to `design.md`. Re-query Figma MCP for the latest frame. Regenerate HTML. The regression is likely a **stale design token** issue.
> 
> - **Caught at Gate 6 (Pre-Deployment)**: This is a **code regression**. Check `claude-progress.txt` for recent task completions. Run `git diff` to identify the change that caused it. Roll back the specific commit and re-run Playwright.
> 
> - **Caught in CI/CD Pipeline**: Block the deployment. Upload Playwright screenshots as CI artifacts. Create a new `proposal.md` to address the regression. The fix goes through the full pipeline again (Gates 3→4→5→6).
>
> **Key principle**: Visual regressions are NEVER fixed by directly editing code. They trigger a **spec review loop** because the regression may indicate a spec-code mismatch.

---

#### Q14: "A junior developer asks: 'Why can't I just use ChatGPT to write the code directly? Why do we need all these markdown files?'"

> **Expert Answer**: Great question! Here's the hierarchy of AI-assisted coding maturity:
> 
> | Level | Approach | Problems |
> | :--- | :--- | :--- |
> | Level 0 | Copy-paste from ChatGPT | No context, no consistency, hallucinations |
> | Level 1 | IDE inline suggestions (Copilot Tab) | No architecture awareness, fragment-level only |
> | Level 2 | Chat-based coding (Cursor Chat, Copilot Chat) | Session-bound context, no persistence |
> | Level 3 | Agent-based coding (Cursor Composer, Windsurf Cascade) | Multi-file but no human gates, spec drift |
> | **Level 4** | **Harness Engineering** | **Full pipeline: specs → gates → agents → hooks → state → CI/CD** |
> 
> The markdown files are the **connective tissue** that makes AI coding deterministic, auditable, and safe for production. Without them, you're at Level 2-3 — fine for prototypes, dangerous for production.

---

### 🔴 Category 6: Advanced & Gotcha Questions

#### Q15: "What's the difference between `SKILL.md` in AntiGravity vs `SKILL.md` in OpenSpec?"

> **Expert Answer**: Structurally identical (YAML frontmatter + markdown body), but contextually different:
> 
> - **AntiGravity SKILL.md**: Loaded by trigger-matching against the `name` and `description` fields in YAML frontmatter. The IDE auto-discovers skills in `.agents/skills/` without registration.
> - **OpenSpec SKILL.md**: Explicitly bound to agents via `agents.md`. Not auto-discovered — must be referenced in the agent declaration. Kiro runs skills via `kiro agent run <Agent> --skill <path>`.
>
> **Key difference**: AntiGravity uses **implicit discovery** (convention over configuration). OpenSpec uses **explicit binding** (configuration over convention).

---

#### Q16: "If `.cursorrules` and `.cursor/rules/02-figma.mdc` conflict, which wins?"

> **Expert Answer**: The `.mdc` file wins — but **only for files matching its glob pattern**. For all other files, `.cursorrules` applies.
> 
> Priority (highest to lowest):
> 1. `.cursor/rules/*.mdc` (glob-matched, highest specificity)
> 2. `.cursorrules` (project-wide fallback)
> 3. User Settings → Custom Instructions (IDE-level global)
>
> **Gotcha**: If two `.mdc` files have overlapping globs (e.g., `src/**/*` and `src/auth/**/*`), **both** are loaded and combined. There's no "override" — they stack.

---

#### Q17: "Can you use Harness Engineering without any ADE — just plain `vim` and terminal?"

> **Expert Answer**: **Yes!** The Harness Pipeline is ADE-agnostic by design:
> 1. Create the markdown files manually (`brd.md`, `spec.md`, etc.)
> 2. Use any LLM API (Claude API, OpenAI API) with the files as context
> 3. Run MCP servers standalone via `npx @playwright/mcp-server`
> 4. Maintain `claude-progress.txt` manually
> 
> The ADEs add convenience (auto-discovery, visual diffs, inline suggestions), but the **core engineering discipline** — structured specs, human gates, state tracking — works with any text editor.

---

#### Q18: "What's the most common mistake teams make when implementing Harness Engineering?"

> **Expert Answer**: **Skipping User Gates under time pressure.** Teams often:
> 1. Auto-approve Gate 1 (BRD) without reading → Wrong scope gets built
> 2. Skip Gate 3 (Proposal) → Wrong architecture gets committed
> 3. Skip Gate 5 (Task Review) → Agent generates hallucinated test cases
> 
> The second most common mistake: **Not updating `claude-progress.txt`** → Agent restarts from scratch on next session, wasting tokens and time.

---

#### Q19: "How do Windsurf Memories differ from `claude-progress.txt`?"

> **Expert Answer**:
> 
> | Aspect | Windsurf Memories | `claude-progress.txt` |
> | :--- | :--- | :--- |
> | **Creation** | Auto-generated by IDE after conversations | Manually maintained by agent or developer |
> | **Content** | User preferences & learned patterns | Task execution state & checkpoints |
> | **Format** | Internal IDE database (not human-readable) | Plain text (human & LLM readable) |
> | **Portability** | Locked to Windsurf IDE | Works in any ADE or text editor |
> | **Granularity** | High-level preferences ("user prefers PostgreSQL") | Line-level execution state ("resume at auth.ts:42") |
> | **Git-trackable** | ❌ No | ✅ Yes |
>
> **Best practice**: Use BOTH. Windsurf Memories for preferences, `claude-progress.txt` for execution state.

---

#### Q20: "Explain the 'USB-C for AI' analogy for MCP. Where does it break down?"

> **Expert Answer**: 
> **Where it works**: Just like USB-C provides a universal physical connector for charging, data transfer, and display output — MCP provides a universal protocol for AI models to connect to any tool (Figma, Playwright, GitHub, filesystem).
> 
> **Where it breaks down**:
> 1. **No guaranteed compatibility**: USB-C cables all fit the same port. MCP servers have different tool schemas — `figma/get_node` has completely different arguments than `playwright/click`.
> 2. **No hot-swap**: You can unplug a USB-C device and plug in another. Switching MCP servers requires config changes and server restart.
> 3. **No power negotiation**: USB-C auto-negotiates voltage. MCP has no built-in capability negotiation — the agent must know what tools exist via `listTools`.

---

## Part 4: Quick-Fire Round (One-Line Answers)

| Question | Answer |
| :--- | :--- |
| What file does Cursor use for rules? | `.cursorrules` or `.cursor/rules/*.mdc` |
| What file does Claude Code use? | `CLAUDE.md` |
| What file does Copilot use? | `.github/copilot-instructions.md` |
| What file does Windsurf use? | `.windsurfrules` |
| What file does OpenSpec use? | `.openspec/proposal.md` + `spec.md` |
| What file does AntiGravity use? | `.agents/AGENTS.md` + `skills/*/SKILL.md` |
| What is a Cascade? | Windsurf's multi-step autonomous agent flow. |
| What is a Composer? | Cursor's multi-file editing agent mode. |
| What does `@workspace` do? | Copilot Agent Mode with full codebase access. |
| What is `PreToolUse`? | A hook that runs BEFORE a tool executes; can block it. |
| What is `PostToolUse`? | A hook that runs AFTER a tool executes; can't block but can fix. |
| What is `features.json`? | Machine-readable feature registry for CI verification. |
| What is `agents.md`? | Subagent persona definitions with tool/scope permissions. |
| What does `proposal.md` answer? | WHY this approach vs alternatives. |
| What does `spec.md` answer? | HOW exactly the API/system will be implemented. |
| What does `brd.md` answer? | WHAT needs to be built. |
| How many User Gates? | 6 gates (BRD → Arch → Proposal → Spec → Task → Deploy). |
| What is context window decay? | When early conversation turns are pushed out of memory. |
| How to fix context decay? | `claude-progress.txt` externalizes state to a file. |
| What is MCP? | Model Context Protocol — universal AI-to-tool connector. |
