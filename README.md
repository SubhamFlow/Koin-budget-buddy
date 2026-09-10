# Koin - Smart Budgeting Companion

**Koin** (`Koin-budget-buddy`) is a modern, full-stack web application designed to help you track expenses, understand your spending, and stay on top of your money with less stress. It turns your raw financial numbers into a cleaner, smarter money routine with complete clarity.

---

## 🌟 Key Features

* **Expense Tracking:** Monitor daily and monthly spending effortlessly with real-time updates.
* **Spending Insights:** Get clear visibility and analytics into where your money is going.
* **Category Organization:** Categorize transactions to analyze and optimize your financial habits.
* **Habit Building:** Develop better financial habits with actionable, structured data.
* **Google Authentication:** Quick, secure, and seamless sign-in using Google Auth.

---

## 🛠️ Tech Stack & Architecture

This repository is built using a modern Next.js project setup:

* **Framework:** [Next.js](https://nextjs.org/) (App Router & React ecosystem)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)
* **Code Quality & Linting:** [ESLint](https://eslint.org/) flat config setup (`eslint.config.mjs`)
* **Package Manager:** `npm` (configured via `package.json` and `package-lock.json`)

---

## 📁 Repository Structure

```text
Koin-budget-buddy/
├── lib/             # Shared helper functions, utilities, and integrations
├── public/          # Static assets (images, icons, fonts)
├── src/             # Core application code (pages, components, layouts, styles)
├── .gitignore       # Git ignore configuration
├── AGENTS.md        # AI/Agent guidelines and prompts
├── CLAUDE.md        # Claude project memory and environment rules
├── eslint.config.mjs# Linting configuration
├── jsconfig.json    # JavaScript paths and compiler configurations
├── next.config.mjs  # Next.js custom configuration
├── package.json     # Project dependencies and script runner
├── postcss.config.mjs# PostCSS plugin settings
└── README.md        # Project documentation


Command,Description
npm run dev,Starts the development server
npm run build,Builds the application for production
npm start,Runs the built production application
npm run lint,Runs ESLint to check for code issues
