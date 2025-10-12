# EduShare – MVP for Hackathon 4FSDT

EduShare is a minimum‑viable product built for the **Hackathon 4FSDT** challenge.  It aims to support public school teachers by providing an easy way to create and share interactive learning activities and resources with their students.  The platform separates user roles into **Teachers** and **Students** and includes authentication, a teacher dashboard, a student view and API endpoints.

## 🎯 Problem & Vision

Teachers in public schools often spend valuable personal time creating lesson materials and searching for supplementary resources.  Research shows that over three‑quarters of teachers build their own materials and 78 % turn to the internet for supplementary materials.  At the same time, technology is increasingly seen as essential to classroom instruction, yet teachers need tools with ready‑made content and time‑saving workflows.  Common pain points include time management, communication gaps with students and families and limited access to engaging digital resources.

EduShare addresses these issues by giving teachers a single space to create quizzes (activities), share digital resources and instantly publish them to students.  Students log in to access the latest activities, take quizzes and explore shared links.  The platform is designed to be intuitive and accessible so that teachers can spend less time on logistics and more time on teaching.

## 🧱 Project Structure

This repository follows a monorepo layout with separate `server` and `web` folders:

```
hackathon4fsdt/
├── server/   # Node.js/Express backend (TypeScript, Prisma, PostgreSQL)
├── web/      # Next.js frontend (React, TypeScript, Tailwind)
└── README.md # Project documentation
```

### Backend (`server`)

* **Express server** written in TypeScript (`src/index.ts`) with modular routes and controllers.
* **Prisma ORM** with a PostgreSQL schema defining `User`, `Activity`, `Question` and `Resource` models (`prisma/schema.prisma`).  The `Role` enum differentiates teachers and students.
* **Authentication** via JSON Web Tokens (JWT).  Users can register and log in; tokens are required for all protected routes.
* **Activity endpoints** allow teachers to create activities and add questions, and anyone to list activities.
* **Resource endpoints** allow teachers to share resources and anyone to list them.
* Configuration is managed via `.env` (see `.env.example`).

### Frontend (`web`)

* **Next.js 13** using the App Router and TypeScript.
* **Tailwind CSS** for styling; global styles live in `src/app/globals.css`.
* **Zustand** store with custom hook `useAuth` to manage authentication state and talk to the backend.
* **Axios** configured in `src/services/api.ts` with automatic token injection and Next.js rewrites to proxy `/api` requests to the backend.
* **Teacher dashboard** (`/dashboard`) where teachers can create activities, share resources and add questions; lists existing activities and resources.
* **Student view** (`/student`) that lists activities and resources.  Students can start a quiz, answer questions sequentially and see progress.
* **Login/Register page** (`/login`) with role selection (teacher/student) built with accessible forms and responsive design.  A screenshot of the plain‑HTML version used during development is shown below.

## 🚀 Quick Start

These steps assume you have **Node.js (>=16)**, **npm** and **PostgreSQL** installed.

1. **Clone the repository** and navigate to the project root.

   ```bash
   git clone <repo-url>
   cd hackathon4fsdt
   ```

2. **Server Setup**

   ```bash
   cd server
   # Install dependencies
   npm install

   # Copy environment template and set your values
   cp .env.example .env
   # edit .env to add DATABASE_URL and JWT_SECRET

   # Run database migrations and generate Prisma client
   npx prisma generate
   npx prisma migrate dev --name init

   # Start the server in development mode
   npm run dev
   ```

   The server will start on `http://localhost:4000`.  It exposes `/api/auth`, `/api/activities` and `/api/resources` endpoints.

3. **Frontend Setup**

   In a new terminal:

   ```bash
   cd web
   npm install
   npm run dev
   ```

   The Next.js app will start on `http://localhost:3000`.  Thanks to the rewrite rule in `next.config.js`, all requests to `/api` are proxied to the backend.

4. **Login as teacher or student**

   - Navigate to `http://localhost:3000/login` and register a new account.  Choose `Teacher` or `Student` from the role dropdown.
   - Teachers are redirected to `/dashboard` where they can create quizzes and share resources.
   - Students are redirected to `/student` where they can start quizzes and view shared resources.

## 📐 Design Prototype

Although a full Figma prototype could not be embedded here, conceptual designs were produced to visualize the key screens.  These mockups illustrate the login page, teacher dashboard and student view.

| Page | Conceptual Design |
| --- | --- |
| **Login / Register** | ![Login screen]({{file:file-GJni3vETChvQRz5HMKLnwy}}) |
| **Teacher Dashboard** | ![Teacher dashboard]({{file:file-Y63cTypF8r4i37pQC3vVSh}}) |
| **Student View** | ![Student view]({{file:file-KH1H4mEdm2EQUf6R1zYdbV}}) |

These serve as inspiration for a proper Figma design. In a production setting the prototype would be hosted in Figma with interactive flows.

## 📄 Documentation & Next Steps

This project is a proof‑of‑concept MVP.  Future improvements could include:

- **Real‑time collaboration:** allow multiple teachers to co‑author activities and see live edits.
- **Gradebook & analytics:** record student quiz results and display progress dashboards to teachers.
- **Media uploads:** enable teachers to attach files or videos as resources.
- **Notifications & messaging:** improve communication between teachers, students and families.
- **Responsive mobile experience:** optimize UI for mobile devices and offline access.

### Running Tests

For brevity, no unit tests are included, but the project is structured to accommodate testing using **Jest** or **Vitest**.  Services and controllers are decoupled to facilitate mocking and isolated tests.

## 📬 Contact

For questions about this project or to report issues, please open an issue in the repository or contact the author via the hackathon submission portal.