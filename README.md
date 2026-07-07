# 🏫 CampusNexus - Campus Sharing & Services Platform

CampusNexus is a modern, multi-tier campus community platform designed to empower university students through a collaborative sharing economy, localized event management, and secure real-time messaging.

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [System Architecture](#-system-architecture)
4. [Database & ER Schema](#-database--er-schema)
5. [Tech Stack](#-tech-stack)
6. [Getting Started & Setup](#-getting-started--setup)
   - [Prerequisites](#prerequisites)
   - [Backend Setup](#1-backend-setup)
   - [Web Frontend Setup](#2-web-frontend-setup)
   - [Mobile Frontend Setup](#3-mobile-frontend-setup-campusloop)
7. [Security & Validation](#-security--validation)
8. [License](#-license)

---

## 🌟 Project Overview
University students frequently face financial strain when purchasing high-cost textbooks, calculators, electronics, or cycles for short-term use. At the same time, finding verified campus-specific events or connecting with peers securely remains fragmented.

**CampusNexus** solves these challenges by providing:
* **P2P Sharing & Rental Marketplace:** A secure environment to buy, sell, or rent items within a verified student community.
* **Campus Event Hub:** A centralized registry for academic, cultural, sports, and hackathon events.
* **Peer-to-Peer Collaboration:** Embedded persistent messaging, review/rating history, and a transaction wallet ledger system.

---

## 🚀 Key Features

### 🛒 P2P Marketplace & Escrow-like Rentals
* **Category Search & Filter:** Easily browse items, filters by category, price, and listing type (Buy/Rent).
* **State-Machine Rental Engine:** Tracks leasing agreements through a robust lifecycle:
  `REQUESTED ➔ APPROVED ➔ ACTIVE (RENTED) ➔ RETURNED ➔ COMPLETED`
* **Auto-Fund Release:** Rental funds are securely locked and only released to the owner's wallet once the renter marks the item returned and the owner confirms.

### 📅 Campus Event Hub
* Centralized dashboard showing upcoming events.
* Supports category categorization (Academic, Cultural, Sports, Hackathons).
* **Slot Verification & Registration:** Prevents double-booking and tracks registered attendees.

### 💬 Real-Time Messenger & Reviews
* Dedicated peer-to-peer chat system allowing buyers and sellers/renters to discuss items, handovers, and coordinate meetups.
* Double-sided feedback loop where campus users can leave ratings (1-5 stars) and comments on completed rentals.

### 💳 Virtual Wallet & Ledger
* Auto-initialized wallet upon registration with a sign-up bonus of **৳100**.
* Records every transaction (deposits, withdrawals, rental payments, escrow releases) in a persistent history log.

---

## 📐 System Architecture

CampusNexus is organized as a multi-tier project with three primary sub-projects:

```
CampusNexus/
├── Backend/          # Node.js + Express + TypeScript API Server
├── WebFrontend/      # React + Vite Web Application
└── Frontend/         # React Native + Expo Mobile Application (CampusLoop)
```

### 💻 Directory Breakdown

#### 1. [Backend](file:///d:/SRS_Final_Project/CampusNexus/CampusNexus/Backend)
* **Design Pattern:** Controller-Service-Repository pattern implemented in TypeScript.
* **Data Layer:** Sequelize ORM mapping JavaScript entities directly to a relational MySQL Database.
* **Validation:** Strict runtime input verification and sanitation using `Zod` schemas.

#### 2. [WebFrontend](file:///d:/SRS_Final_Project/CampusNexus/CampusNexus/WebFrontend)
* **State Management:** Integrated React Context API to manage authorization, profile, and cart data globally.
* **Network Requests:** Custom Axios instances with automatic Private Interceptors to inject JWT bearer tokens on all API requests.
* **Aesthetics:** Clean, customized CSS design system prioritizing dark mode compatibility, card layout grids, and dashboard viewports.

#### 3. [Frontend (Mobile App - CampusLoop)](file:///d:/SRS_Final_Project/CampusNexus/CampusNexus/Frontend)
* **Framework:** React Native + Expo with file-based routing via `Expo Router`.
* **Styling:** `NativeWind` implementing Tailwind CSS utility classes on mobile screens.
* **Services:** Integrated Firebase / Firestore configurations for mobile client services.

---

## 🗄️ Database & ER Schema

The database uses a fully normalized relational MySQL structure (adhering to 1NF, 2NF, and 3NF). 

### Entity Relationships:
* **Users & Wallets:** One-to-One relationship (`user ||--|| wallet`).
* **Users & Listings:** One-to-Many relationship (`user ||--o{ item`).
* **Rentals:** Connects `item`, `renter`, and `owner` dynamically to log starting dates, return dates, and agreements.
* **Transactions & Reviews:** Logged and linked directly to their respective user profiles and rental/item instances.

```
                  ┌──────────────┐
                  │     USER     │
                  └──────┬───────┘
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │  WALLET  │   │  ITEMS   │   │  EVENTS  │
    └──────────┘   └─────┬────┘   └─────┬────┘
                         ▼              ▼
                   ┌──────────┐   ┌──────────┐
                   │ RENTALS  │   │ EVENTREG │
                   └─────┬────┘   └──────────┘
                         ▼
                   ┌──────────┐
                   │ REVIEWS  │
                   └──────────┘
```

---

## 🛠️ Tech Stack

* **Language:** JavaScript, TypeScript
* **Backend Framework:** Node.js, Express.js
* **Frontend Web:** React (Vite)
* **Frontend Mobile:** React Native, Expo, Expo Router
* **Database & ORM:** MySQL, Sequelize ORM
* **Authentication:** JSON Web Tokens (JWT), BcryptJS
* **Styling:** Custom CSS (Web), Tailwind CSS & NativeWind (Mobile)

---

## ⚙️ Getting Started & Setup

### Prerequisites
* **Node.js** (v18.x or above)
* **MySQL Server** running locally or hosted online.

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd CampusNexus/Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=9000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=campusnexus
   DB_USER=root
   DB_PASS=your_mysql_password
   NODE_ENV=development
   BCRYPT_SALT_ROUND=10
   JWT_ACCESS_SECRET=your_jwt_secret_key
   JWT_ACCESS_EXPIRES=1d
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_REFRESH_EXPIRE=30d
   ```
4. Seed or sync the database and start the development server:
   ```bash
   npm run dev
   ```

---

### 2. Web Frontend Setup

1. Navigate to the WebFrontend directory:
   ```bash
   cd CampusNexus/WebFrontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables by creating `.env`:
   ```env
   VITE_API_URL=http://localhost:9000/api/v1
   ```
4. Launch the web application:
   ```bash
   npm run dev
   ```

---

### 3. Mobile Frontend Setup (CampusLoop)

1. Navigate to the Frontend directory:
   ```bash
   cd CampusNexus/Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```
4. Run the app:
   * Scan the QR code using the Expo Go app on your iOS/Android device.
   * Press `a` for Android Emulator, `i` for iOS Simulator, or `w` for Web.

---

## 🔒 Security & Validation

1. **JSON Web Tokens (JWT):** All restricted routes (e.g., wallet checkouts, chat messages, posts) are protected by Express authorization middlewares checking for valid JWT signatures.
2. **Request Validation:** Every payload sent to the backend is validated against Zod schemas (`src/modules/*/validation.ts`). Requests violating data types or containing malicious inputs are rejected with a structured `400 Bad Request` code before database queries are made.
3. **Password Cryptography:** User credentials are encrypted at registration using `bcryptjs` with 10 salt rounds. Plaintext passwords are never stored in the database.

---

## 📄 License
This project is licensed under the ISC License.

