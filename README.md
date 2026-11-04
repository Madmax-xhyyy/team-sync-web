# TeamSync Web

TeamSync Web is the frontend application for **TeamSync**, a team collaboration platform that helps organizations coordinate projects, manage work, and collaborate with their members.

This repository contains the web client. It is built with React, TypeScript, and Vite, and communicates with the TeamSync REST API.

- **Live application:** https://teamsync-henna-seven.vercel.app

## Tech Stack

### Core

- React 19
- TypeScript
- Vite 8
- React Router DOM 7

### UI and Styling

- Tailwind CSS 4
- Base UI
- shadcn
- Lucide React
- Geist variable font
- `class-variance-authority`, `clsx`, and `tailwind-merge`

### Data and State

- TanStack Query
- Zustand
- Axios

### Forms and Validation

- React Hook Form
- Zod
- `@hookform/resolvers`

### Developer Tools

- ESLint
- Prettier
- TypeScript

## Features

TeamSync is designed as a centralized collaboration experience for organization and project work. The broader platform scope includes:

- User authentication and profile management
- Organization and member management
- Project management
- Task management and Kanban workflows
- Task comments and collaboration
- Notifications and activity history
- Dashboards and project reporting

The exact availability of each feature depends on the current implementation and the connected API. Refer to the application routes and source modules for the authoritative list of implemented frontend functionality.

## Architecture

The web client is a Vite-powered single-page application (SPA). It communicates with the backend through REST endpoints using JSON over HTTP/HTTPS.

```text
Browser
   |
   v
React + TypeScript + Vite
   |
   | HTTP/HTTPS (JSON)
   v
TeamSync REST API
   |
   v
MongoDB
```

The backend is maintained separately. Configure the frontend with the API's base URL using the environment variable expected by the API client in this repository.

## Prerequisites

- Node.js (use a current LTS release compatible with the installed Vite version)
- npm
- Git
- Access to a running TeamSync API for authenticated and data-backed functionality

The theme test script specifically requires **Node.js 22.18 or newer**.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Madmax-xhyyy/team-sync-web.git
cd team-sync-web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and set the backend API URL using the exact variable name read by the API client.

For example, if the source code uses `VITE_API_BASE_URL`:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

> **Important:** `VITE_API_BASE_URL` is an example placeholder, not a confirmed variable name. Check the Axios/API client configuration in `src` and use the variable name defined there. Vite only exposes client-side environment variables prefixed with `VITE_`. Never put private API keys, database credentials, JWT signing secrets, or OAuth client secrets in frontend environment variables.

For local development, make sure the backend is running and allows requests from the frontend origin through its CORS configuration.

### 4. Start the development server

```bash
npm run dev
```

Vite prints the local development URL in the terminal (commonly `http://localhost:5173`).

### 5. Create a production build

```bash
npm run build
```

This runs the TypeScript project build and creates the optimized static frontend output in `dist/`.

### 6. Preview the production build locally

```bash
npm run preview
```

## Available Scripts

| Command                | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `npm run dev`          | Start the Vite development server                           |
| `npm run build`        | Type-check/build the project and generate production assets |
| `npm run lint`         | Run ESLint                                                  |
| `npm run preview`      | Preview the production build locally                        |
| `npm run test:theme`   | Run the theme behavior tests (Node.js 22.18+)               |
| `npm run format`       | Format files with Prettier                                  |
| `npm run format:check` | Check formatting without modifying files                    |

## Theme Customization

Theme configuration is centralized in `src/styles/theme.css`.

- `:root` defines the light theme.
- `:root.dark` defines the dark theme.
- The theme file also defines typography, border radius, chart colors, status colors, and workspace preview shadow.

Use semantic Tailwind theme utilities in components, such as:

- `bg-background`
- `bg-card`
- `text-foreground`
- `text-muted-foreground`
- `border-border`

Prefer semantic theme tokens over hardcoded colors so the interface remains consistent across light and dark modes. When changing a background token, verify its matching foreground token and check contrast in both themes.

The appearance setting supports **Light**, **Dark**, and **System** modes. System is the default and follows operating-system theme changes. Explicit preferences are stored in the browser under the `teamsync-theme` localStorage key and synchronized across tabs. Selecting System removes the explicit override. The theme also remains usable in the current tab when browser storage is unavailable.

The early theme initialization script in `index.html` prevents an incorrect-theme flash during page load. Keep its storage key and media query aligned with `src/lib/theme.ts`.

Run the theme behavior tests with:

```bash
npm run test:theme
```

## Deployment

The application is configured for deployment as a static frontend. The repository includes a `vercel.json` file, and the live application is hosted on Vercel.

To deploy:

1. Import the Git repository into Vercel.
2. Select the Vite framework preset (or configure the build settings manually).
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Add the required frontend environment variables in the Vercel project settings.
6. Deploy and verify that the frontend can reach the production TeamSync API.

### SPA Routing

Because this is a single-page application, direct navigation to nested client-side routes must be rewritten to the application entry point. Preserve and verify the repository's `vercel.json` rewrite configuration when changing deployment settings.

### Production Configuration

- Use the HTTPS URL of the deployed API.
- Configure backend CORS to allow the deployed frontend origin.
- Do not expose secrets in `VITE_` variables; frontend variables are bundled into client-accessible assets.
- Verify authentication redirects, protected routes, API error handling, and page refresh behavior on nested routes after deployment.

## Development Guidelines

When adding or changing features:

- Keep components focused and reusable.
- Keep API communication in the existing API/service layer rather than embedding request logic throughout UI components.
- Use TanStack Query for server-state fetching, caching, and mutations where the existing architecture does so.
- Use Zustand for shared client state where appropriate.
- Validate user input with the existing React Hook Form and Zod patterns.
- Reuse shared UI components and semantic theme tokens.
- Keep TypeScript types explicit and avoid unnecessary `any` usage.
- Handle loading, empty, success, and error states.
- Ensure protected UI routes are backed by authorization checks in the API; frontend route guards alone do not secure data.
- Add or update tests when changing behavior.

## Quality Checks

Before submitting changes, run:

```bash
npm run lint
npm run format:check
npm run build
npm run test:theme
```

## Related Repository

- **TeamSync API:** The separate Spring Boot backend repository. Configure the frontend API base URL to point to its local or deployed API instance.

## License

No license has been specified for this repository. Add a `LICENSE` file and update this section before distributing the project under an open-source license.
