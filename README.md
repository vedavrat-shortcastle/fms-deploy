# FMS

Federation Management System built with Next.js 15, Prisma, tRPC, and shadcn/ui.

## Prerequisites

- Node.js 20+
- pnpm
- Git

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Next-Auth + 2FA
- **UI:** shadcn/ui
- **Forms:** React Hook Form + Zod
- **API:** tRPC
- **Charts:** Recharts
- **Deployment:** Vercel

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/subscription-shortcastle/fms.git
   cd fms
   ```

2. Install Node.js 20.15.0 using nvm:

   ```bash
   nvm install 20.15.0
   nvm use
   ```

3. Install pnpm if you don't have it:

   - **macOS/Linux**:

     ```bash
     curl -fsSL https://get.pnpm.io/install.sh | sh -
     ```

   - **Windows**:

     ```powershell
     iwr https://get.pnpm.io/install.ps1 -useb | iex
     ```

4. Install dependencies:

   ```bash
   pnpm install
   ```

5. Setup husky:

   ```bash
   pnpm prepare
   ```

6. Start the development server:

   ```bash
   pnpm dev
   ```

## Notes

1. Make sure to follow conventional commits: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
2. Use Prettier for code formatting.
3. We are using ESLint for lint checks.
4. Do not disable/ignore the pre-commit hook while creating commits.
5. Ensure your code passes all linting and formatting checks before pushing changes.
