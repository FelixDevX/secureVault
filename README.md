# 🔐 SecureVault

A modern, secure file storage application built with the MERN stack. SecureVault encrypts files using **AES-256-GCM** before storing them on Cloudinary, providing an additional layer of security for sensitive user files.

---

## 🌐 Live Deployment

### Frontend

🚀 **SecureVault Web Application**

https://vault-nine-livid.vercel.app/

### Backend

⚙️ **SecureVault Backend API**

https://vault-q9gr.onrender.com/

### API Base URL

https://vault-q9gr.onrender.com/api

---

## ✨ Features

* 🔐 **AES-256-GCM Encryption** — Files are encrypted in memory before upload.
* ☁️ **Cloudinary Storage** — Scalable cloud storage for encrypted files.
* 🔑 **Google Authentication** — Sign in with Google using Google Identity Services.
* 👤 **Email/Password Authentication** — Traditional JWT-based authentication.
* 🛡️ **Password-Protected Files** — Optional password protection for individual files.
* 👁️ **File Preview** — In-browser preview for images, PDFs, and text files.
* 🌙 **Dark Mode** — Modern Google Drive-inspired UI with dark/light themes.
* 📱 **Responsive Design** — Works across desktop and mobile devices.
* 🔒 **JWT Authentication** — Protected API routes using JSON Web Tokens.
* 🗄️ **MongoDB Database** — Stores users, file metadata, and file information.

---

# 🏗️ Application Architecture

SecureVault follows a full-stack architecture consisting of a React frontend, Node.js/Express backend, MongoDB database, and Cloudinary storage.

```text
                         ┌─────────────────────┐
                         │        User         │
                         │      Browser        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Frontend       │
                         │   React + Vite      │
                         │   Tailwind CSS      │
                         └──────────┬──────────┘
                                    │
                              REST API / JWT
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Backend       │
                         │ Node.js + Express   │
                         └──────┬───────┬──────┘
                                │       │
                    ┌───────────┘       └───────────┐
                    ▼                               ▼
             ┌──────────────┐                ┌──────────────┐
             │   MongoDB    │                │  Cloudinary  │
             │   Database   │                │   Storage    │
             └──────────────┘                └──────────────┘
```

---

# 🖥️ Frontend

The SecureVault frontend is a React-based single-page application built using **React 19, Vite, and Tailwind CSS v4**.

## Frontend Responsibilities

* User registration
* User login
* Google authentication
* Dashboard
* File upload interface
* File listing
* File download
* File deletion
* File preview
* Password-protected file access
* User profile
* Authentication state
* Dark/light theme
* Responsive UI
* Communication with backend REST APIs

## Frontend Technologies

| Technology      | Purpose                             |
| --------------- | ----------------------------------- |
| React 19        | User interface                      |
| Vite            | Frontend development and build tool |
| Tailwind CSS v4 | Styling and responsive design       |
| JavaScript      | Application logic                   |
| React Context   | Authentication and theme state      |
| REST API        | Backend communication               |

## Frontend Structure

```text
client/
├── src/
│   ├── components/
│   │   └── Reusable UI components
│   │
│   ├── context/
│   │   ├── AuthContext
│   │   └── ThemeContext
│   │
│   ├── pages/
│   │   ├── Login
│   │   ├── Register
│   │   ├── Dashboard
│   │   └── Profile
│   │
│   ├── services/
│   │   └── API service layer
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── vite.config.js
└── package.json
```

---

# ⚙️ Backend

The SecureVault backend is built using **Node.js and Express.js** and provides the REST API for the application.

## Backend Responsibilities

* User registration
* User login
* JWT authentication
* Google authentication
* Password hashing
* File encryption
* File upload
* File download
* File deletion
* File password protection
* MongoDB operations
* Cloudinary integration
* Authorization
* Protected API endpoints

## Backend Technologies

| Technology               | Purpose                 |
| ------------------------ | ----------------------- |
| Node.js                  | Backend runtime         |
| Express.js               | REST API framework      |
| MongoDB                  | Database                |
| Mongoose                 | MongoDB object modeling |
| JWT                      | Authentication          |
| bcryptjs                 | Password hashing        |
| Google Identity Services | Google authentication   |
| Node.js Crypto           | AES-256-GCM encryption  |
| Cloudinary               | Encrypted file storage  |

## Backend Structure

```text
server/
├── src/
│   ├── config/
│   │   └── Database & Cloudinary configuration
│   │
│   ├── controllers/
│   │   ├── Auth controller
│   │   ├── Google Auth controller
│   │   └── File controller
│   │
│   ├── middleware/
│   │   └── JWT authentication middleware
│   │
│   ├── models/
│   │   ├── User model
│   │   └── File model
│   │
│   ├── routes/
│   │   ├── Authentication routes
│   │   └── File routes
│   │
│   └── utils/
│       └── Encryption utilities
│
├── .env.example
├── package.json
└── server.js
```

---

# 🛠️ Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Frontend       | React 19, Vite, Tailwind CSS v4         |
| Backend        | Node.js, Express.js                     |
| Database       | MongoDB, Mongoose                       |
| Storage        | Cloudinary                              |
| Authentication | JWT, bcryptjs, Google Identity Services |
| Encryption     | AES-256-GCM                             |
| API            | REST API                                |
| Development    | Git, GitHub, VS Code                    |
| Deployment     | Vercel + Render                         |

---

# 📁 Complete Project Structure

```text
secureVault/
│
├── client/                         # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── context/                # Auth & Theme contexts
│   │   ├── pages/                  # Login, Register, Dashboard, Profile
│   │   └── services/               # API service layer
│   │
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
├── server/                         # Node.js + Express Backend
│   ├── src/
│   │   ├── config/                 # DB & Cloudinary configuration
│   │   ├── controllers/            # Auth & File controllers
│   │   ├── middleware/             # JWT authentication
│   │   ├── models/                 # User & File models
│   │   ├── routes/                 # API routes
│   │   └── utils/                  # Encryption utilities
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

# 🔄 Frontend ↔ Backend Communication

The frontend communicates with the backend through REST APIs.

```text
┌──────────────────────┐
│   React Frontend     │
│   Vite + Tailwind    │
└──────────┬───────────┘
           │
           │ HTTP / REST API
           │ JWT Authentication
           ▼
┌──────────────────────┐
│   Express Backend    │
│   Node.js            │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌──────────┐ ┌──────────────┐
│ MongoDB  │ │  Cloudinary  │
│ Database │ │ File Storage │
└──────────┘ └──────────────┘
```

The **frontend** handles the user interface and user experience.

The **backend** handles authentication, authorization, encryption, business logic, database operations, and cloud storage.

---

# 🔐 How File Encryption Works

SecureVault encrypts files before sending them to Cloudinary.

## Upload Flow

```text
User selects file
       ↓
Frontend sends file
       ↓
Backend receives file
       ↓
AES-256-GCM Encryption
       ↓
Encrypted file
       ↓
Cloudinary
       ↓
File metadata stored in MongoDB
```

## Download Flow

```text
User requests file
       ↓
JWT Authentication
       ↓
Authorization Check
       ↓
Encrypted file retrieved
       ↓
AES-256-GCM Decryption
       ↓
File returned to authenticated user
```

---

# 🔒 Security

SecureVault implements several security mechanisms:

* **AES-256-GCM encryption** for files.
* Files are encrypted before Cloudinary storage.
* **bcryptjs** is used for password hashing.
* **JWT** is used for authentication.
* Google authentication uses **ID token verification**.
* Protected routes require authentication.
* File access is restricted to authorized users.
* Sensitive credentials are stored using environment variables.
* Backend secrets are not exposed to the frontend.
* `.env` files should never be committed to GitHub.
* Encryption keys should never be exposed in client-side code.

---

# 🚀 Getting Started

## Prerequisites

Before running SecureVault, install:

* Node.js 18+
* npm
* MongoDB Atlas account or local MongoDB
* Cloudinary account
* Google Cloud Console project for OAuth

---

## 1. Clone the Repository

```bash
git clone https://github.com/FelixDevX/secureVault.git

cd secureVault
```

---

## 2. Install Backend Dependencies

```bash
cd server

npm install
```

---

## 3. Install Frontend Dependencies

Open another terminal:

```bash
cd client

npm install
```

---

# ⚙️ Environment Variables

## Backend Environment

Create:

```text
server/.env
```

Copy the example environment file:

```bash
cd server

cp .env.example .env
```

Configure:

```env
PORT=5000

MONGODB_URI=mongodb+srv://...

JWT_SECRET=your_jwt_secret

ENCRYPTION_KEY=your_64_char_hex_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Frontend Environment

Create:

```text
client/.env
```

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://vault-q9gr.onrender.com/api
```

---

# ▶️ Running Locally

## Start Backend

Open Terminal 1:

```bash
cd server

npm run dev
```

Backend:

```text
http://localhost:5000
```

## Start Frontend

Open Terminal 2:

```bash
cd client

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🌍 Production Deployment

SecureVault is deployed using:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas
* **File Storage:** Cloudinary

## Frontend

Production frontend:

https://vault-nine-livid.vercel.app/

## Backend

Production backend:

https://vault-q9gr.onrender.com/

## Backend API

Production API base URL:

https://vault-q9gr.onrender.com/api

---

# 🔗 Production Configuration

### Frontend Environment Variable

```env
VITE_API_URL=https://vault-q9gr.onrender.com/api
```

### Backend Environment Variable

```env
CLIENT_URL=https://vault-nine-livid.vercel.app
```

This allows the deployed frontend to communicate with the deployed backend.

---

# 🗄️ Database

SecureVault uses **MongoDB with Mongoose**.

The database stores information such as:

* User accounts
* Authentication information
* File metadata
* File references
* Password-protection information
* Application-specific file data

The actual file storage is handled separately through Cloudinary.

---

# ☁️ Cloudinary

SecureVault uses Cloudinary for scalable cloud file storage.

Configure the following environment variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Encrypted files are uploaded to Cloudinary instead of storing plaintext files directly on the server.

---

# 🔑 Google Authentication

SecureVault supports Google authentication using **Google Identity Services**.

Required environment variable:

```env
GOOGLE_CLIENT_ID=your_google_client_id
```

The authentication flow uses Google ID token verification rather than storing a user's Google password.

---

# 📡 API

The backend provides REST API endpoints for:

* Authentication
* User management
* Google authentication
* File upload
* File download
* File deletion
* File preview
* Password-protected files

API Base URL:

```text
https://vault-q9gr.onrender.com/api
```

---

# 🧰 Development Commands

## Frontend

```bash
cd client

npm install

npm run dev

npm run build
```

## Backend

```bash
cd server

npm install

npm run dev
```

---

# 🧪 Testing the Application

After deployment:

1. Open the SecureVault frontend.
2. Create a new account.
3. Sign in using email/password or Google.
4. Open the dashboard.
5. Upload a file.
6. Verify that the file appears in your dashboard.
7. Preview or download the file.
8. Test password protection if enabled.
9. Test file deletion.
10. Verify authentication and protected routes.

---

# 🛡️ Important Security Notes

Never commit the following to GitHub:

```text
.env
API keys
Cloudinary secrets
MongoDB passwords
JWT secrets
Encryption keys
Google OAuth secrets
```

Use `.env.example` to document required environment variables without exposing their actual values.

---

# 📌 Project Highlights

SecureVault demonstrates practical implementation of:

* Full-stack MERN development
* React frontend development
* Node.js and Express backend development
* REST API development
* JWT authentication
* Google authentication
* Password hashing
* AES-256-GCM encryption
* MongoDB database integration
* Cloudinary cloud storage
* Protected API routes
* File upload and management
* File preview
* Password-protected files
* Responsive React UI
* Dark/light theme
* Vercel deployment
* Render deployment

---

# 📄 License

This project is licensed under the **MIT License**.
