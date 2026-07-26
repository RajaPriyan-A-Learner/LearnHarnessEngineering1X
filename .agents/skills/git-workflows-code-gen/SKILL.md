---
name: "Git Workflows and Code Generation Guidelines"
description: "Guidelines and instructions for branch management, conventional commit structures, merge conflict resolution in monorepos, and standardized boilerplate templates for code generation."
---

# Git Workflows and Code Generation Guidelines

This skill file outlines the procedures, standards, and code generation templates for managing source control and scaffolding new codebase assets in the Wealth Management Advisor Console.

---

## 1. Git Workflow & Merge Guide

### A. Branch Naming Conventions
Always create branches off the `main` branch using the following structure:
*   **Features**: `feature/wma-[task-id]-[short-description]` (e.g. `feature/wma-102-holdings-grid`)
*   **Bug Fixes**: `bugfix/wma-[task-id]-[short-description]` (e.g. `bugfix/wma-204-auth-refresh-loop`)
*   **Hotfixes**: `hotfix/wma-[short-description]` (e.g. `hotfix/wma-masking-leak`)

### B. Conventional Commit Guidelines
Commit messages must adhere to the Conventional Commits specification to facilitate automated changelog creation:
```
<type>(<scope>): <short description>
```
*   `feat`: A new feature (e.g., `feat(holdings): integrate virtualized grid scrolling`)
*   `fix`: A bug fix (e.g., `fix(auth): resolve memory leak on session logout`)
*   `docs`: Documentation changes only (e.g., `docs(readme): add docker setup guide`)
*   `style`: Formatting, semi-colons, styling changes (no production code modifications)
*   `refactor`: Code changes that neither fix a bug nor add a feature
*   `test`: Adding missing tests or correcting existing tests
*   `chore`: Updating build tasks, package configurations, or dependencies

### C. Merge Conflict Resolution in Monorepos
In npm workspaces, conflicts often occur in `package-lock.json` files when parallel branches update shared packages.
Follow this safety flow to resolve locks:
1.  Abort any messy auto-merge state:
    ```bash
    git merge --abort
    ```
2.  Pull the latest target branch and start the merge again:
    ```bash
    git merge origin/main
    ```
3.  For conflicts in `package-lock.json`, check out the current target version, then re-generate it to guarantee dependency tree alignment:
    ```bash
    git checkout --ours package-lock.json
    npm install
    git add package-lock.json
    ```
4.  Run verification test commands before completing the merge commit:
    ```bash
    npm run typecheck
    npm run test
    ```

---

## 2. Code Generation Templates

When creating new features, components, or state stores, use these exact patterns to maintain architectural consistency.

### A. React Component Scaffold (Atomic UI / Feature Module)
Create components in a dedicated subdirectory with the following file layout:
- `MyComponent.tsx` (Component logic)
- `MyComponent.module.css` (CSS Module styles)
- `MyComponent.test.tsx` (Unit tests)
- `index.ts` (Clean export)

#### Component File Template (`MyComponent.tsx`)
```tsx
import React from 'react';
import styles from './MyComponent.module.css';

interface MyComponentProps {
  title: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children?: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  variant = 'primary',
  onClick,
  children
}) => {
  return (
    <div className={`${styles.container} ${styles[variant]}`} role="region" aria-label={title}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.body}>{children}</div>
      {onClick && (
        <button className={styles.actionButton} onClick={onClick} type="button">
          Execute Action
        </button>
      )}
    </div>
  );
};
```

#### Styling File Template (`MyComponent.module.css`)
```css
.container {
  padding: var(--spacing-md, 16px);
  border-radius: var(--border-radius-lg, 8px);
  background-color: var(--color-bg-card, #1e293b);
  border: 1px solid var(--color-border, #334155);
}

.primary {
  border-left: 4px solid var(--color-accent-blue, #3b82f6);
}

.secondary {
  border-left: 4px solid var(--color-accent-gray, #64748b);
}

.title {
  margin: 0 0 var(--spacing-sm, 8px) 0;
  font-size: var(--font-size-lg, 18px);
  color: var(--color-text-primary, #f8fafc);
}

.body {
  color: var(--color-text-secondary, #94a3b8);
}

.actionButton {
  margin-top: var(--spacing-md, 16px);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-accent-blue);
  color: #ffffff;
  border: none;
  border-radius: var(--border-radius-sm, 4px);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.actionButton:hover {
  opacity: 0.9;
}
```

### B. Zustand State Store Slice Scaffold
```typescript
import { StateCreator } from 'zustand';

export interface UIState {
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const createUISlice: StateCreator<UIState, [], [], UIState> = (set) => ({
  isSidebarOpen: true,
  theme: 'dark',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setTheme: (theme) => set({ theme }),
});
```

### C. Vitest Component Test Scaffold
```tsx
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  test('renders title and children text correctly', () => {
    render(<MyComponent title="Test Title">Child Content</MyComponent>);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('calls onClick callback when button is clicked', () => {
    const handleClick = vi.fn();
    render(<MyComponent title="Title" onClick={handleClick} />);
    
    const button = screen.getByRole('button', { name: /execute action/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```
