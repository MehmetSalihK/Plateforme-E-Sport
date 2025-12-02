# 🏆 E-Sport Platform - Tournament Management

<div align="center">
  
  **🌍 Languages:**
  [🇫🇷 Français](README.md) | [🇹🇷 Türkçe](README_TR.md)
  
</div>

<div align="center">
  
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20.0.0-339933.svg?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC.svg?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
</div>

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Usage](#-usage)
- [Architecture](#-architecture)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

This E-Sport platform is a comprehensive solution allowing organizers to create and manage competitive tournaments, players to register and participate, and spectators to follow matches in real-time.

### Project Context

Developed as part of a professional Application Developer project, this platform addresses the growing needs of the E-Sport community for professional tournament management.

### Objectives

- ✅ Automate complete E-Sport tournament management
- ✅ Provide a reliable ELO ranking system
- ✅ Offer a real-time experience for participants
- ✅ Ensure security and GDPR compliance
- ✅ Guarantee optimal accessibility

---

## ✨ Features

### 🎮 Tournament Management

- **Creation and configuration** of multi-format tournaments (BO1, BO3, BO5, BO7)
- **Bracket formats**: Single elimination, double elimination, round-robin, swiss
- **Registration management** with FIFO waiting list system
- **Automatic check-in** before tournament start
- **Match scheduling** with time management

### 🏅 Bracket System

- **Automatic generation** of brackets based on chosen format
- **Smart seeding** based on ELO ranking
- **Automatic progression** of winners
- **Manual modification** available for organizers
- **Interactive visualization** of the tournament tree

### 👥 Player & Team Management

- **Player profiles** with detailed statistics
- **Team creation** with invitation system
- **Complete history** of matches and tournaments
- **ELO ranking** global and per game
- **Badges and rewards** (coming soon)

### ⚔️ Match Management

- **Real-time scoreboard** via WebSocket
- **Automatic score updates**
- **Result validation** by organizers
- **Automatic calculation** of ELO changes
- **Penalty management** and delays

---

## 🛠️ Technologies

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: MySQL 8.0
- **WebSocket**: Socket.IO
- **Authentication**: JWT Bearer
- **Logging**: Winston

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

---

## 🚀 Installation

### Prerequisites

- **Node.js** 20 LTS
- **MySQL** 8.0
- **npm** or **yarn**

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/esport-platform.git
cd esport-platform

# 2. Backend Setup
cd backend
cp .env.example .env
npm install
npm run db:create
npm run dev

# 3. Frontend Setup
cd ../frontend
npm install
npm run dev
```

### Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 📖 Usage

### For Players

1. **Register** on the platform
2. **Complete** your player profile
3. **Browse** available tournaments
4. **Register** for a tournament
5. **Check-in** before the start
6. **Play** your matches
7. **View** your statistics and ELO ranking

### For Organizers

1. **Create** a new tournament
2. **Configure** settings (format, bracket, rules)
3. **Publish** the tournament
4. **Manage** registrations
5. **Generate** the bracket automatically
6. **Update** scores in real-time

---

## 🏗️ Architecture

The project follows a clean architecture with separation of concerns:

- **Frontend**: React components, Hooks, Context API
- **Backend**: Controller-Service-Repository pattern
- **Database**: Relational schema with optimized indexes

---

## 🔒 Security

- **Authentication**: Secure JWT with refresh tokens
- **Password Hashing**: Bcrypt
- **Data Protection**: Input validation and sanitization
- **CORS**: Configured for security

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the project
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 👥 Team

**Lead Developer**: Mehmet Salih Kuscu

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for the E-Sport community**

[⬆ Back to Top](#-e-sport-platform---tournament-management)

</div>
