const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'courses.json');

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// Serve static files (including index.html)
app.use(express.static(__dirname));

// --- HELPER FUNCTIONS ---

// Read courses from the JSON file
const readData = () => {
    try {
        // Create file if it doesn't exist
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading file:", error);
        return [];
    }
};

// Save courses to the JSON file
const saveData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing to file:", error);
    }
};

// Validate if the status is one of the allowed values
const isValidStatus = (status) => {
    const allowed = ["Not Started", "In Progress", "Completed"];
    return allowed.includes(status);
};

// --- REST API ENDPOINTS ---

/**
 * GET /api/courses
 * Fetch all courses
 */
app.get('/api/courses', (req, res) => {
    const courses = readData();
    res.json(courses);
});

/**
 * GET /api/courses/stats
 * Returns a summary of all courses by their current status
 */
app.get('/api/courses/stats', (req, res) => {
    const courses = readData();

    // Initialize our stats object
    const stats = {
        total_courses: courses.length,
        by_status: {
            "Not Started": 0,
            "In Progress": 0,
            "Completed": 0
        }
    };

    // Loop through courses and increment the relevant status count
    courses.forEach(course => {
        if (stats.by_status.hasOwnProperty(course.status)) {
            stats.by_status[course.status]++;
        }
    });

    res.json(stats);
});

/**
 * GET /api/courses/:id
 * Fetch a single course by ID
 */
app.get('/api/courses/:id', (req, res) => {
    const courses = readData();
    const course = courses.find(c => c.id === parseInt(req.params.id));
    
    if (!course) {
        return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
});

/**
 * POST /api/courses
 * Add a new course
 */
app.post('/api/courses', (req, res) => {
    const { name, description, target_date, status } = req.body;
    const courses = readData();

    // 1. Validation: Check for missing fields
    if (!name || !description || !target_date || !status) {
        return res.status(400).json({ error: "All fields (name, description, target_date, status) are required" });
    }

    // 2. Validation: Check status value
    if (!isValidStatus(status)) {
        return res.status(400).json({ error: "Invalid status. Must be: 'Not Started', 'In Progress', or 'Completed'" });
    }

    // 3. Create new course object
    const newCourse = {
        id: courses.length > 0 ? courses[courses.length - 1].id + 1 : 1,
        name,
        description,
        target_date,
        status,
        created_at: new Date().toISOString()
    };

    courses.push(newCourse);
    saveData(courses);
    
    res.status(201).json(newCourse);
});

/**
 * PUT /api/courses/:id
 * Update an existing course
 */
app.put('/api/courses/:id', (req, res) => {
    const courses = readData();
    const index = courses.findIndex(c => c.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: "Course not found" });
    }

    const { name, description, target_date, status } = req.body;

    // Validation: If status is being updated, check if it's valid
    if (status && !isValidStatus(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    // Update fields (keep existing values if not provided in request)
    const updatedCourse = {
        ...courses[index],
        name: name || courses[index].name,
        description: description || courses[index].description,
        target_date: target_date || courses[index].target_date,
        status: status || courses[index].status
    };

    courses[index] = updatedCourse;
    saveData(courses);

    res.json(updatedCourse);
});

/**
 * DELETE /api/courses/:id
 * Remove a course
 */
app.delete('/api/courses/:id', (req, res) => {
    let courses = readData();
    const courseExists = courses.some(c => c.id === parseInt(req.params.id));

    if (!courseExists) {
        return res.status(404).json({ error: "Course not found" });
    }

    // Filter out the course with the matching ID
    courses = courses.filter(c => c.id !== parseInt(req.params.id));
    saveData(courses);

    res.json({ message: `Course ${req.params.id} deleted successfully` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`CodeCraftHub API is running at http://localhost:${PORT}`);
    console.log(`Data stored in: ${DATA_FILE}`);
});