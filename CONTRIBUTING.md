# Contributing to 24K Realtors CRM

We love pull requests! Here is a quick guide on how you can contribute to this project:

## 🤝 Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## 🚀 How to Contribute

1. **Find or open an issue**: Before writing code, search the issues tracker to ensure the bug or feature hasn't already been reported or discussed. If not, open a new issue.
2. **Fork the repository**: Fork the repo on GitHub and clone your fork locally.
3. **Set up local development**:
   - Run `npm install --legacy-peer-deps` to install dependencies.
   - Run `npx prisma generate` to set up local database schemas.
   - Run `npm run dev` to boot the hot-reloading development server.
4. **Make changes**: Keep changes focused and add descriptive commits.
5. **Ensure code format and build compliance**:
   - Run `npm run build` to make sure TypeScript checks and static page generations complete without errors.
6. **Submit a Pull Request**: Push your branch to GitHub and open a pull request against our `main` branch.

## 📋 Coding Standards
- Use **TypeScript** for strict type checking on all component parameters.
- Structure pages inside the Next.js `(dashboard)` routing folder.
- Maintain client-side data persistence checks inside [src/lib/mock-data.ts](src/lib/mock-data.ts) where appropriate to keep local storage states consistent across transitions.

Thank you for contributing!
