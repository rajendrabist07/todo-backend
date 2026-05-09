# Express Todo Backend

A simple Express + MongoDB backend for the todo app. This backend provides user authentication and task management APIs.

## 📦 Features

- User signup and login with JWT authentication
- Task creation, retrieval, update, and delete
- Request authorization with Bearer tokens
- MongoDB data storage

## 🚀 Getting Started

1. Install dependencies:

   ```bash
   cd /Users/rajendrabist/Desktop/Express-js
   npm install
   ```

2. Create a `.env` file:

   ```env
   PORT=5001
   MONGO_URI=mongodb://127.0.0.1:27017/authDB
   JWT_SECRET=my_secret
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. API base URL:
   - `http://localhost:5001`

## 🧩 Available Endpoints

### Authentication

- `POST /api/signup` - Register a new user
- `POST /api/login` - Log in and receive a JWT token

### Tasks (protected)

- `GET /api/task` - Get all tasks for the authenticated user
- `POST /api/task` - Create a new task
- `PUT /api/task/:id` - Update a task
- `DELETE /api/task/:id` - Delete a task

## 🔐 Authorization

- Requests to `/api/task` endpoints require an `Authorization` header:
  ```http
  Authorization: Bearer <token>
  ```

## 📌 Notes

- Frontend proxy is configured in `todo-app/vite.config.js` to forward `/api` to `http://127.0.0.1:5001`
- Keep `.env` out of source control and use `.gitignore` to protect secrets
