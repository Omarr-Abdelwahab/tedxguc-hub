*TEDxGUC Hub*

A full-stack platform for managing TEDxGUC events, talks, and content in a centralized system.

🚀 Overview

TEDxGUC Hub is a production-style web application built to streamline how TEDxGUC events and talks are organized and presented. It connects event data, recorded talks, and admin tools into a single structured platform.

🛠 Tech Stack

Frontend: React, Tailwind CSS.
Backend: Node.js.
Database: MySQL.
Deployment: Vercel.

✨ Key Features
Event dashboard displaying TEDxGUC updates and information
Talks section showcasing recorded TEDx content
Admin functionality for managing events and content data
Automated email notifications for system updates
Structured data management with seeded initial content
Fully responsive UI across devices
⚙️ System Design

The application is split into a frontend and backend architecture:

Frontend handles UI rendering and user interaction
Backend exposes REST APIs for events, talks, and admin operations
Database layer stores structured event and content data
Seeder script initializes development data for fast setup
CI/CD pipeline ensures consistent deployment and updates
🚀 Setup Instructions
git clone <repository-url>
cd tedxguc-hub-main
Frontend
cd frontend
bun install
bun run dev
Backend
cd backend
npm install
node seedData.js
npm run dev

👀 Preview


https://github.com/user-attachments/assets/aad3c654-252b-426c-844b-5e3904d6222d



📌 Why This Project Matters

This project demonstrates full-stack development skills, including API design, frontend architecture, backend integration, and deployment workflow management. It reflects practical experience in building and shipping a production-style web application.
