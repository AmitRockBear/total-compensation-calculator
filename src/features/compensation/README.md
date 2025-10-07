# Compensation Feature

This feature handles all compensation calculation functionality including salary, bonuses, benefits, RSU grants, ESPP, and raises.

## Structure

```
compensation/
├── components/          # React components
│   ├── charts/         # Chart components for data visualization
│   ├── forms/          # Form-related components and context
│   ├── sections/       # Section components (Benefits, RSU, ESPP, etc.)
│   ├── compensation-calculator.tsx
│   ├── compensation-root.tsx
│   ├── context.tsx     # Compensation settings context
│   └── summary-panel.tsx
├── hooks/              # Custom React hooks
│   └── use-compensation-summary.ts
├── lib/                # Utilities and helpers
│   ├── constants.ts    # Constants (currencies, colors, etc.)
│   ├── defaults.ts     # Default form values
│   ├── formatters.ts   # Formatting utilities
│   └── utils.ts        # Calculation utilities
├── types/              # TypeScript types and schemas
│   ├── schema.ts       # Zod schemas for validation
│   └── types.ts        # TypeScript type definitions
└── index.ts            # Public API exports
```

## Usage

Import the main component from the feature:

```tsx
import { CompensationRoot } from '~/features/compensation';
```

## Internal Organization

- **Components**: UI components organized by purpose (charts, forms, sections)
- **Hooks**: Reusable React hooks for state and logic
- **Lib**: Pure utility functions and constants
- **Types**: Type definitions and validation schemas

All internal imports use absolute paths with the `~/features/compensation/*` pattern for better maintainability.
