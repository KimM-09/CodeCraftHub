# CodeCraftHub: Learning Management Platform

## Project Overview

CodeCraftHub is a full-stack web application designed to help users track and manage their learning goals and courses. Built with Node.js and Express.js for the backend API, and vanilla JavaScript for the frontend, it provides a simple yet powerful interface for organizing educational pursuits.

The application allows users to create, read, update, and delete courses, track their progress through different statuses (Not Started, In Progress, Completed), and view statistics about their learning journey. Data is persisted locally in a JSON file, making it easy to run without external databases.

This application was created using Generative AI. Google's Gemini was used to generate the backend app.js file while Bolt.new was use to generate the frontend index.html file.

## Features

- **Course Management**: Add, edit, delete, and view courses
- **Progress Tracking**: Track course status (Not Started, In Progress, Completed)
- **Statistics Dashboard**: View summary statistics of all courses by status
- **Responsive Design**: Modern, mobile-friendly user interface
- **RESTful API**: Well-documented API endpoints for all operations
- **Local Data Storage**: No database required - uses JSON file for persistence
- **Real-time Updates**: Frontend updates immediately after API operations

## Installation Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Steps

1. **Clone or download the project**:
   ```bash
   git clone <repository-url>
   cd CodeCraftHub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify installation**:
   Check that `node_modules` folder is created and contains the required packages.

## How to Run the Application

### Development Mode

1. **Start the server**:
   ```bash
   npm start
   ```
   or
   ```bash
   node app.js
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

3. **The application will load** with the frontend interface and API ready to use.

### Alternative: Using npm dev script

If you have Node.js with watch mode support:
```bash
npm run dev
```

This will start the server with automatic restarts on file changes.

## API Endpoint Documentation

The API provides RESTful endpoints for managing courses. All endpoints return JSON responses.

### Base URL
```
http://localhost:5000/api/courses
```

### Endpoints

#### 1. GET /api/courses
Retrieve all courses.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Python Basics",
    "description": "Learn Python fundamentals",
    "target_date": "2025-12-31",
    "status": "Not Started",
    "created_at": "2026-03-09T23:24:20.826Z"
  }
]
```

#### 2. GET /api/courses/stats
Get statistics summary of all courses by status.

**Response:**
```json
{
  "total_courses": 1,
  "by_status": {
    "Not Started": 1,
    "In Progress": 0,
    "Completed": 0
  }
}
```

#### 3. GET /api/courses/:id
Retrieve a single course by ID.

**Parameters:**
- `id` (number): Course ID

**Response:**
```json
{
  "id": 1,
  "name": "Python Basics",
  "description": "Learn Python fundamentals",
  "target_date": "2025-12-31",
  "status": "Not Started",
  "created_at": "2026-03-09T23:24:20.826Z"
}
```

**Error Response (404):**
```json
{
  "error": "Course not found"
}
```

#### 4. POST /api/courses
Create a new course.

**Request Body:**
```json
{
  "name": "JavaScript Advanced",
  "description": "Master advanced JavaScript concepts",
  "target_date": "2026-06-30",
  "status": "Not Started"
}
```

**Response:**
```json
{
  "id": 2,
  "name": "JavaScript Advanced",
  "description": "Master advanced JavaScript concepts",
  "target_date": "2026-06-30",
  "status": "Not Started",
  "created_at": "2026-03-09T23:30:00.000Z"
}
```

#### 5. PUT /api/courses/:id
Update an existing course.

**Parameters:**
- `id` (number): Course ID

**Request Body:**
```json
{
  "name": "JavaScript Advanced",
  "description": "Master advanced JavaScript concepts including ES6+",
  "target_date": "2026-07-15",
  "status": "In Progress"
}
```

**Response:**
```json
{
  "id": 2,
  "name": "JavaScript Advanced",
  "description": "Master advanced JavaScript concepts including ES6+",
  "target_date": "2026-07-15",
  "status": "In Progress",
  "created_at": "2026-03-09T23:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Course not found"
}
```

#### 6. DELETE /api/courses/:id
Delete a course.

**Parameters:**
- `id` (number): Course ID

**Response:**
```json
{
  "message": "Course 2 deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Course not found"
}
```

### Status Codes
- `200`: Success
- `404`: Resource not found
- `500`: Internal server error

## Troubleshooting

### Common Issues

#### 1. "Failed to fetch courses" or API errors in the frontend
**Cause:** Server is not running or port 5000 is occupied.
**Solution:**
- Ensure the server is started: `node app.js`
- Check if port 5000 is available: `netstat -ano | findstr :5000`
- If port is in use, kill the process or change the port in `app.js`

#### 2. "CORS error" or fetch requests failing
**Cause:** Opening `index.html` directly as a file instead of through the server.
**Solution:**
- Always access the application at `http://localhost:5000`
- Do not open `index.html` directly in the browser

#### 3. "Error reading file" in server logs
**Cause:** Issues with `courses.json` file permissions or corruption.
**Solution:**
- Check file permissions on `courses.json`
- If corrupted, delete the file and restart the server (it will create a new empty file)

#### 4. npm start fails with execution policy error (Windows)
**Cause:** PowerShell execution policy blocks npm scripts.
**Solution:**
- Run PowerShell as Administrator
- Execute: `Set-ExecutionPolicy RemoteSigned`
- Or use `node app.js` directly

#### 5. Port 5000 already in use
**Cause:** Another application is using the port.
**Solution:**
- Find the process: `netstat -ano | findstr :5000`
- Kill the process: `taskkill /PID <PID> /F`
- Or change the port in `app.js`: `const PORT = 3000;`

#### 6. Data not persisting
**Cause:** Server crashes or file write errors.
**Solution:**
- Check server logs for file write errors
- Ensure the application has write permissions to the directory
- Data is stored in `courses.json` - back it up if needed

### Getting Help

If you encounter issues not covered here:
1. Check the server console for error messages
2. Verify all dependencies are installed: `npm list`
3. Ensure Node.js version is compatible
4. Check that `courses.json` exists and is readable/writable

### Development Tips

- Use browser developer tools (F12) to inspect network requests
- Check the Network tab for failed API calls
- Use `console.log` in the browser console to debug frontend issues
- Server logs appear in the terminal where you ran `node app.js`