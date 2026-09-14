# PsychAssess Frontend

A modern, responsive dashboard built with **React**, **TypeScript**, and **Tailwind CSS**.

## 🎨 Design System

The UI implements a custom design system inspired by **Shadcn UI** but built from scratch to avoid heavy dependencies.

- **Styling:** Tailwind CSS v4 with `oklch` color spaces for vibrant, accessible colors in Light and Dark modes.
- **Icons:** `lucide-react` for consistent, lightweight iconography.
- **Components:** Located in `src/components/ui/`, these "dumb" components (Card, Badge, Button) are reusable and decoupled from app logic.

## 🚀 Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

> The app will be available at http://localhost:5173.

## 🛠️ Key Features Implementation

### PDF Export

This project uses `jsPDF` to generate clinical reports entirely on the client side. This avoids server load and provides immediate downloads for the user.

> Location: src/components/assessment/NarrativeSection.tsx

### CamelCase Interceptor

The backend uses Python's snake_case (e.g., first_name), while the frontend uses JavaScript's camelCase (e.g., firstName).

Implemented a global Axios interceptor in src/services/api.ts to automatically transform request and response data.

This ensures code consistency across the entire stack without manual mapping.

### Dark Mode

Theme preference is persisted in localStorage and respects the system preference by default.

> Implementation: src/components/Layout.tsx and src/index.css.
