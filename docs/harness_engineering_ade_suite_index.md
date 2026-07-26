# Harness Engineering: Complete ADE Suite Index & Comparative Master Guide

> **AI Native Software Engineering Master Suite**  
> *Complete multi-document suite with enhanced prompts/commands, deep architectural insights, and interview preparation for all major AI Development Environments.*

---

## 📚 Complete Document Suite

### 🏛️ Master Framework & Interview Prep

| Document | Purpose |
| :--- | :--- |
| 📑 **[Master Guidance Document](file:///C:/Users/rajap/.gemini/antigravity-ide/brain/14bfba91-95ba-44b5-a9da-2a05f8362ba1/superpower_harness_master_guidance.md)** | Full Superpower Harness Plugin framework: pipeline, gates, OpenSpec, MCP, Docker, CI/CD |
| 🎯 **[Interview Preparation Guide](file:///C:/Users/rajap/.gemini/antigravity-ide/brain/14bfba91-95ba-44b5-a9da-2a05f8362ba1/interview_preparation_harness_engineering.md)** | 20+ tricky questions with expert answers, rapid-fire cheatsheets, scenario walkthroughs |

### 🛠️ Individual ADE Harness Engineering Manuals

| ADE Manual | Platform | Rule File | Key Prompt Syntax |
| :--- | :--- | :--- | :--- |
| 📖 **[AntiGravity](file:///C:/Users/rajap/.gemini/antigravity-ide/brain/14bfba91-95ba-44b5-a9da-2a05f8362ba1/harness_engineering_antigravity.md)** | Google DeepMind | `.agents/AGENTS.md` | `write_to_file`, `ask_question`, `browser_subagent`, `run_command` |
| 📖 **[Cursor](file:///C:/Users/rajap/.gemini/antigravity-ide/brain/14bfba91-95ba-44b5-a9da-2a05f8362ba1/harness_engineering_cursor.md)** | Anysphere | `.cursorrules` / `.mdc` | `@Codebase`, `@Files`, `@Git`, `Ctrl+I` Composer, Agent Mode |
| 📖 **[GitHub Copilot](file:///C:/Users/rajap/.gemini/antigravity-ide/brain/14bfba91-95ba-44b5-a9da-2a05f8362ba1/harness_engineering_github_copilot.md)** | VS Code + Copilot | `.github/copilot-instructions.md` | `@workspace`, `@terminal`, `#file`, `.prompt.md` templates |
| 📖 **[Windsurf](file:///C:/Users/rajap/.gemini/antigravity-ide/brain/14bfba91-95ba-44b5-a9da-2a05f8362ba1/harness_engineering_windsurf.md)** | Codeium | `.windsurfrules` | Cascade flows, Memories, Command Suggestions, AST indexing |
| 📖 **[OpenSpec & Kiro](file:///C:/Users/rajap/.gemini/antigravity-ide/brain/14bfba91-95ba-44b5-a9da-2a05f8362ba1/harness_engineering_openspec_kiro.md)** | AWS Kiro | `.openspec/` directory | `kiro proposal create`, `kiro gate approve`, `kiro agent run` |
| 📖 **[Claude Code](file:///C:/Users/rajap/.gemini/antigravity-ide/brain/14bfba91-95ba-44b5-a9da-2a05f8362ba1/harness_engineering_claude_code.md)** | Anthropic CLI | `CLAUDE.md` | `/commands`, `PreToolUse`/`PostToolUse` hooks, `claude --resume` |

---

## 🔑 Cross-ADE Universal Prompt Comparison (Gate 1: Generate BRD)

| ADE | Exact Prompt to Generate `brd.md` |
| :--- | :--- |
| **AntiGravity** | `"Read the attached requirements.pdf and generate brd.md with FR-01 through FR-15 and NFR-01 through NFR-05."` |
| **Cursor** | `"@Files requirements.pdf Parse this document and generate brd.md with functional and non-functional requirements."` (Composer: `Ctrl+I`) |
| **GitHub Copilot** | `"@workspace Read #file:docs/requirements.pdf and generate docs/brd.md. Include stakeholder analysis."` |
| **Windsurf** | `"Read requirements.pdf and generate brd.md. Include FR-01 to FR-12, NFR-01 to NFR-05. Stop and show me for review."` (Cascade panel) |
| **OpenSpec/Kiro** | `kiro proposal create "Feature from requirements.pdf"` → Auto-generates `.openspec/proposal.md` |
| **Claude Code** | `claude "Read docs/requirements.pdf and generate docs/brd.md with FR-01 to FR-12."` or `/generate-brd docs/requirements.pdf` |

---

## ⚡ The Universal Harness Principle

> Regardless of the ADE you choose, **the core concept remains the same**:
> 
> 1. **Structured Blueprints** → Eliminate AI hallucinations via deterministic specs
> 2. **Human-in-the-Loop Gates** → Ensure zero unauthorized code commits
> 3. **MCP Tool Interoperability** → Universal AI-to-tool connectivity
> 4. **Lifecycle Hooks** → Preventive (PreToolUse) and detective (PostToolUse) quality controls
> 5. **State Persistence** → Defeat context window decay with `claude-progress.txt`
> 6. **Containerized Delivery** → Multi-stage Docker + automated CI/CD quality gates
