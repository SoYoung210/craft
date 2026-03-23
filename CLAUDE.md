# CLAUDE.md

## Critical Rules

1. **ALWAYS use `pnpm` as the package manager.** Never use npm or yarn.

## Project Overview

Next.js 16 web app with React 19, TypeScript, ESLint, Prettier, and Tailwind CSS 4.

## Commands

- `pnpm run dev` - Start dev server (Turbopack)
- `pnpm run lint` - Fix linting/formatting (ESLint + Prettier)

## Critical Code Rules

- **Import motion from `motion/react`**, NOT `framer-motion`
- **Screen-Owns-Hooks pattern** for multi-step flows: screen components own their hooks, analytics, and internal state. Pages are thin orchestrators that manage step transitions via `onComplete` callbacks. See `onboarding/page.tsx` as the reference implementation.

## Workflow Orchestration

### 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user

---

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Capture Lessons**: Update `tasks/lessons.md` after corrections

---

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

---

## Code Style

- Conventional commits: `fix:`, `feat:`, `refactor:`, `docs:`, `test:`
- **Never add Co-Authored-By lines** to commit messages
- **Do not add comments to code.** No inline comments, no explanatory remarks, no `// ...` annotations in code changes.
- Prefer explicit types over inference where it aids readability
- Destructure imports when possible

## Cost Efficiency

- Prefer CLI tools over MCP servers (less context overhead)
- Use `gh` for GitHub-specific operations (PRs, issues, releases)
- Delegate verbose operations (test runs, log analysis) to subagents when possible
- Keep responses concise — show code, not prose
- Typecheck after a series of changes, not after every edit

## Safety

- `trash` > `rm`
