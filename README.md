# Authentication
# Authentication & File Management System

A full-stack project for user authentication, file upload (with Cloudinary), and file content extraction and summarization (using OCR and Gemini AI).

---

## Features

- **User Registration & Login** (with JWT authentication)
- **File Upload** (supports images, PDFs, etc., stored on Cloudinary)
- **File Content Extraction** (OCR for images, text extraction for PDFs)
- **File Summarization** (using Gemini AI)
- **Role-based User Model** (user/admin)
- **RESTful API** (Express.js backend)
- **MongoDB Database** (via Mongoose)

---

## Project Structure

```
authentication/
  ├── client/                # Frontend app (not included in this README)
  └── server/                # Backend API
      ├── config/            # DB and Cloudinary config
      ├── controllers/       # Route controllers (user, file)
      ├── middleware/        # Auth, upload, error handler
      ├── models/            # Mongoose models
      ├── routes/            # API route definitions
      ├── services/          # File extraction, Gemini AI
      ├── eng.traineddata    # OCR language data (Tesseract)
      ├── index.js           # Server entry point
      ├── package.json       # Backend dependencies
      └── ,env.example       # Example environment variables
```

---

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm
- MongoDB instance (local or Atlas)
- Cloudinary account
- Gemini API key (for summarization)

---

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables:**
   - Copy the example file and fill in your values:
     ```bash
     cp ,env.example .env
     ```
   - Edit `.env` with your credentials:
     ```
     PORT=3001
     MONGO_URL=your_mongodb_url
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     GEMINI_API_KEY=your_gemini_api_key
     ```

3. **Start the backend server:**
   ```bash
   npm run server
   ```
   - The server will run on the port specified in `.env` (default: 3001).

---

## API Endpoints

### User Authentication

- `POST /api/user/register`
  - Register a new user.
  - **Body:** `{ name, email, password }`
- `POST /api/user/login`
  - Login and receive a JWT.
  - **Body:** `{ email, password }`

### File Upload & Summarization

- `POST /api/files/upload`
  - Upload a file to Cloudinary.
  - **Form Data:** `file` (single file)
- `POST /api/files/upload-summary`
  - Upload a file, extract its content (OCR for images, text for PDFs), and get a summary using Gemini AI.
  - **Form Data:** `file` (single file)

---

## User Model

The user schema (`models/User.js`) includes:
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (String, enum: `user` or `admin`, default: `user`)
- Timestamps for creation and update

---

## Environment Variables

See `server/,env.example` for all required variables:

```
PORT=3001
MONGO_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

## Main Dependencies

- express
- mongoose
- bcrypt
- jsonwebtoken
- multer
- cloudinary
- tesseract.js
- pdf-parse
- @google/generative-ai (Gemini)
- dotenv

---

## How It Works

- **User registration/login**: Securely stores user info and issues JWTs.
- **File upload**: Accepts files via multipart/form-data, uploads to Cloudinary.
- **File extraction**: Uses Tesseract for images, pdf-parse for PDFs.
- **Summarization**: Sends extracted text to Gemini AI for a summary.

---

## License

ISC (or specify your own)

---

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Tesseract.js](https://tesseract.projectnaptha.com/)
- [Gemini AI](https://ai.google.dev/)

---

## API Testing with Postman

A Postman collection (`Authorization.postman_collection.json`) is included for easy API testing.

### How to Use:
1. Open Postman (desktop or web app).
2. Click `Import` and select the `Authorization.postman_collection.json` file from the `server/` directory.
3. The collection includes requests for:
   - User registration (`/api/user/register`)
   - User login (`/api/user/login`)
   - File upload (`/api/files/upload`)
   - File upload and summary (`/api/files/upload-summary`)
4. For file upload requests, update the file path in the request body to a file on your own system.
5. (Optional) If you add protected/admin endpoints, add your JWT token to the `Authorization` header as `Bearer <token>`.

### Example:
- To test file upload, select the `upload-data` request, click on the file field, and choose a PDF or image from your computer.
- Click `Send` to see the API response.

---

