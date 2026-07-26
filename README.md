# 🚀 Learn Harness Engineering 1X

> **The definitive reference suite for AI Native Software Engineering & Harness Engineering across all major AI Development Environments (ADEs).**

---

## 📚 What is Harness Engineering?

Harness Engineering is a **deterministic framework** that converts unstructured business inputs (PDF/DOCX/Figma) into structured markdown blueprints, enforces human-in-the-loop approval gates, and uses MCP (Model Context Protocol) servers for tool interoperability — ensuring zero-hallucination AI-driven software development from scratch to CI/CD delivery.

---

## 📂 Repository Structure

```
LearnHarnessEngineering1X/
├── README.md
└── docs/
    ├── superpower_harness_master_guidance.md        # 🏛️ Master Framework Document
    ├── harness_engineering_ade_suite_index.md        # 🗺️ ADE Suite Index & Cross-Reference
    ├── ade-guides/
    │   ├── harness_engineering_antigravity.md        # 📖 AntiGravity (Google DeepMind)
    │   ├── harness_engineering_cursor.md             # 📖 Cursor (Anysphere)
    │   ├── harness_engineering_github_copilot.md     # 📖 VS Code + GitHub Copilot
    │   ├── harness_engineering_windsurf.md           # 📖 Windsurf (Codeium)
    │   ├── harness_engineering_openspec_kiro.md      # 📖 OpenSpec & Kiro (AWS)
    │   └── harness_engineering_claude_code.md        # 📖 Claude Code (Anthropic CLI)
    └── interview-prep/
        └── interview_preparation_harness_engineering.md  # 🎯 Interview Q&A Guide
```

---

## 📖 Document Guide

### 🏛️ Master Framework
| Document | Description |
| :--- | :--- |
| [Superpower Harness Master Guidance](docs/superpower_harness_master_guidance.md) | Complete Superpower Harness Plugin framework: document pipeline, OpenSpec integration, MCP servers (Figma & Playwright), 6 user approval gates, Docker containerization, and GitHub Actions CI/CD. |
| [ADE Suite Index](docs/harness_engineering_ade_suite_index.md) | Cross-ADE comparison table, universal prompt comparison, and links to all individual guides. |

### 🛠️ ADE-Specific Guides
| ADE | Guide | Core Rule File | Key Commands |
| :--- | :--- | :--- | :--- |
| AntiGravity | [Guide](docs/ade-guides/harness_engineering_antigravity.md) | `.agents/AGENTS.md` | `write_to_file`, `ask_question`, `browser_subagent` |
| Cursor | [Guide](docs/ade-guides/harness_engineering_cursor.md) | `.cursorrules` / `.mdc` | `@Codebase`, `@Files`, `Ctrl+I` Composer |
| GitHub Copilot | [Guide](docs/ade-guides/harness_engineering_github_copilot.md) | `.github/copilot-instructions.md` | `@workspace`, `#file`, `.prompt.md` |
| Windsurf | [Guide](docs/ade-guides/harness_engineering_windsurf.md) | `.windsurfrules` | Cascade flows, Memories, AST indexing |
| OpenSpec & Kiro | [Guide](docs/ade-guides/harness_engineering_openspec_kiro.md) | `.openspec/` directory | `kiro proposal`, `kiro gate approve` |
| Claude Code | [Guide](docs/ade-guides/harness_engineering_claude_code.md) | `CLAUDE.md` | `/commands`, `PreToolUse`/`PostToolUse` hooks |

### 🎯 Interview Preparation
| Document | Description |
| :--- | :--- |
| [Interview Prep Guide](docs/interview-prep/interview_preparation_harness_engineering.md) | 20+ tricky questions with expert answers, rapid-fire cheatsheet, cross-ADE scenario walkthroughs, and gotcha questions. |

---

## 🔑 Core Concepts at a Glance

### Document Pipeline Order
```
PDF/DOCX → brd.md → architecture.md → design.md → proposal.md → spec.md
→ agents.md → dependency_graph.md → features.json → task.md → SKILL.md
```

### 6 User Approval Gates
1. **Gate 1**: BRD Scope & Constraints
2. **Gate 2**: Architecture & MCP Access
3. **Gate 3**: OpenSpec Proposal & UI Wireframes
4. **Gate 4**: API Contracts & Agent Permissions
5. **Gate 5**: Execution Plan & Task Skills
6. **Gate 6**: Final Acceptance & Deployment

### MCP Servers
- **Figma MCP**: Design token extraction → HTML/CSS presentation layer
- **Playwright MCP**: Automated E2E browser testing & screenshot regression

---

## 🤝 Contributing

Feel free to open issues or pull requests to improve these guides.

---

## 📜 License

This repository is for educational purposes. Created as part of AI Native Engineer Training.
