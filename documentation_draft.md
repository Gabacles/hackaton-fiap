# EduShare Documentation Draft

## Executive Summary

EduShare is a web‑based platform created during the **Hackathon 4FSDT** to support public school teachers in managing and sharing learning materials.  Teachers frequently spend personal time creating lesson content and searching for supplemental resources; over 77 % of them develop their own materials and 78 % seek additional content online【353419263248785†L68-L90】.  Technology adoption is high (85 % use technology multiple times a week【308748868467740†L173-L223】) but existing tools often lack simplicity and integration, leading to time management issues and communication gaps【877928689073630†L66-L76】.  EduShare provides a clean and intuitive portal where teachers can create interactive quizzes (“activities”), share resources and immediately publish them to students.  Students log in to see assigned activities and resources, start quizzes and engage with content.  The MVP demonstrates the core concept and sets the stage for further development.

## Problem Statement & Justification

Public school teachers face mounting challenges:

1. **Time‑consuming content creation** – Teachers spend hours crafting worksheets, quizzes and digital activities.  Many rely on self‑made materials【353419263248785†L68-L90】.
2. **Scattered resources** – Links, documents and multimedia content are often stored in disparate platforms, making it hard to keep track.
3. **Limited engagement tools** – Basic learning management systems may not provide interactive quizzes or gamified experiences.
4. **Communication gaps** – Without a unified space, students may miss important assignments or resources【877928689073630†L66-L76】.

EduShare addresses these problems by combining quiz creation, resource sharing and role‑based access into a single platform.  By simplifying workflows, it reduces the overhead of lesson preparation and ensures students always know where to find their materials.

## Solution Description

EduShare’s core features include:

### Authentication & Roles

Users register as **Teacher** or **Student**.  Authentication is handled via JWT, with hashed passwords for security.  Teachers and students share a login page but are directed to different dashboards once authenticated.

### Teacher Dashboard

After logging in, teachers can:

- **Create Activities** – Provide a title and description to generate a new quiz.  After creation, questions can be added via a dedicated form.  Each question accepts a text prompt and multiple choice options.
- **Share Resources** – Add links (and later, files) with a title.  Resources appear instantly in the resources list.
- **View Lists** – See all created activities and resources with counts of questions.  Future versions can include editing and deletion.
- **Add Questions** – Select an activity and append a new multiple‑choice question.  Options are entered as comma‑separated text for the MVP.

### Student Workspace

Students see:

- **Activities List** – A list of available quizzes.  Each item shows the title and description with a *Start* button.  When starting an activity, questions are presented one at a time.  Students select answers sequentially; at completion, they receive a completion message.
- **Resources List** – Links shared by teachers open in a new tab.  This encourages exploration of curated content.

### Technology Stack & Architecture

**Frontend:** Built with **Next.js 13** using the App Router and **React**.  **Tailwind CSS** provides a design system and responsive styles.  **Zustand** manages global authentication state.  **Axios** handles HTTP requests, configured with an interceptor to attach the JWT to every request.  A rewrite rule proxies `/api` requests to the backend during development.

**Backend:** Implemented with **Express** and **TypeScript**.  **Prisma ORM** connects to **PostgreSQL** via models defined in `schema.prisma`.  The `User` model includes an enum `Role` for teacher/student.  Other models include `Activity`, `Question` and `Resource`.  Passwords are hashed with `bcryptjs` and JWTs are signed with `jsonwebtoken`.  Route middlewares ensure that only authenticated users access protected endpoints and that teacher‑only routes are restricted.

**Folder Structure:** The monorepo is organized into `server` and `web` directories following clean architecture principles.  Controllers, services and routes are separated to promote maintainability.  On the frontend, the `src/app` directory contains page components while `hooks` and `services` encapsulate state management and API logic.

## Development Process

The team employed an iterative process inspired by design thinking:

1. **Empathize & Research:** Gathered insights on teacher pain points and the prevalence of self‑created resources【353419263248785†L68-L90】.  Recognized that time and organisation are major hurdles【308748868467740†L173-L223】【877928689073630†L66-L76】.
2. **Define:** Formulated the problem statement: “How might we help teachers efficiently create and share engaging materials with students?”
3. **Ideate:** Brainstormed features such as quiz builders, resource hubs, chat functions and analytics.  Selected quiz and resource sharing as core features for the MVP.
4. **Prototype:** Sketched low‑fidelity wireframes and produced conceptual designs using generative tools to visualize the login page, teacher dashboard and student view.
5. **Build:** Implemented the backend and frontend in parallel, focusing on modular code and clean APIs.  Verified API behaviour using cURL and integrated forms on the frontend.
6. **Test & Iterate:** Conducted manual tests to ensure flows (registration, login, activity creation, quiz taking) worked as expected.  Adjusted forms and API calls based on feedback.

## Repository & Prototype Links

- **Code Repository:** The full source code lives in this repository (`hackathon4fsdt`).  Follow the instructions in `README.md` to run the project locally.
- **Design Prototypes:** Conceptual mockups are embedded in the README and represent the intended Figma prototypes.  A fully interactive Figma file can be generated by importing these designs into Figma or using the provided visuals as a guide.

## Learnings & Reflections

Developing EduShare highlighted the importance of focusing on a core set of features that directly address user pain points.  The MVP does not attempt to replicate full learning management systems; instead it targets the specific workflow of creating quizzes and sharing resources.  Using Next.js’s App Router simplified routing while Prisma provided a type‑safe way to interact with PostgreSQL.  One challenge encountered was working within a constrained environment without access to package registries; this required building parts of the prototype in plain HTML/JS before migrating to a Next/Express stack.  Generative tools were used to produce visual designs when traditional design tools were inaccessible.

## Next Steps

To mature EduShare beyond an MVP, we propose the following enhancements:

1. **User Management & Profiles:** allow teachers to edit activities and resources, and students to track their progress.
2. **Grading & Analytics:** automatically grade quizzes and provide dashboards with performance metrics.
3. **Collaborative Authoring:** enable co‑teaching scenarios where multiple teachers can co‑create and share activities.
4. **File Uploads & Rich Media:** support uploading PDFs, images and videos instead of just URLs.
5. **Communication Tools:** integrate messaging or forum features to close communication gaps between teachers, students and parents.
6. **Accessibility & Offline Mode:** ensure the platform works on low‑bandwidth devices and adds offline caching.

Through ongoing development and community feedback, EduShare has the potential to become a go‑to resource hub for teachers and students in public schools.