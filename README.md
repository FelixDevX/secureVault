# 🔐 SecureVault

A modern, secure file storage application built with the MERN stack. Files are encrypted with AES-256-GCM before being stored on Cloudinary, ensuring end-to-end security.

## ✨ Features

- **AES-256-GCM Encryption** — Files are encrypted in memory before upload
- **Cloudinary Storage** — Scalable cloud storage for encrypted files
- **Google Authentication** — Sign in with Google via Identity Services
- **Email/Password Auth** — Traditional JWT-based authentication
- **Password-Protected Files** — Optional per-file password protection
- **File Preview** — In-browser preview for images, PDFs, and text files
- **Dark Mode** — Modern Google Drive-inspired UI with dark/light themes
- **Responsive Design** — Works on desktop and mobile devices

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS v4    |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB (Mongoose)                 |
| Storage    | Cloudinary (raw resource type)     |
| Auth       | JWT, bcryptjs, Google Identity     |
| Encryption | AES-256-GCM (Node.js crypto)      |

## 📁 Project Structure

```
secureVault/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth & Theme contexts
│   │   ├── pages/          # Login, Register, Dashboard, Profile
│   │   └── services/       # API service layer
│   └── vite.config.js
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # DB & Cloudinary config
│   │   ├── controllers/    # Auth, Google Auth, File controllers
│   │   ├── middleware/      # JWT auth middleware
│   │   ├── models/         # User & File Mongoose models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Encryption utilities
│   └── .env.example        # Environment template
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Google Cloud Console project (for OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/secureVault.git
cd secureVault
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Copy the example env file and fill in your credentials:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your values:

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

### 4. Run the Application

```bash
# Terminal 1 — Start the server
cd server
npm run dev

# Terminal 2 — Start the client
cd client
npm run dev
```

The client runs on `http://localhost:5173` and the server on `http://localhost:5000`.

## 🔒 Security

- Files are encrypted with **AES-256-GCM** in memory before upload — Cloudinary never sees plaintext data.
- Passwords are hashed with **bcryptjs** (12 salt rounds).
- Authentication uses **JWT tokens** with configurable expiry.
- Google OAuth uses **ID token verification** — no Google passwords are stored.
- Environment variables keep all credentials out of source code.

## 📄 License

This project is licensed under the MIT License.
