const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/devProgressTracker')
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

fetch('/api/projects')
  .then(response => response.json())
  .then(data => {
    // Handle data
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Define User Schema and Model
const userSchema = new mongoose.Schema({
    userID: String,
    projects: [
        {
            name: String,
            difficulty: Number,
            completed: Boolean,
        },
    ],
    totalXP: Number,
    currentLevel: Number,
});

const User = mongoose.model('User', userSchema);

// API Routes
app.get('/api/projects', async (req, res) => {
    try {
        const user = await User.findOne({ userID: 'defaultUser' });
        if (user) {
            res.json(user.projects);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/projects', async (req, res) => {
    const { name, difficulty } = req.body;
    try {
        let user = await User.findOne({ userID: 'defaultUser' });
        if (!user) {
            user = new User({ userID: 'defaultUser', projects: [], totalXP: 0, currentLevel: 1 });
        }
        user.projects.push({ name, difficulty, completed: false });
        await user.save();
        res.status(201).json(user.projects);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ userID: 'defaultUser' });
        if (user) {
            const project = user.projects.id(id);
            if (project) {
                project.completed = !project.completed;
                user.totalXP += project.difficulty * 100;
                if (user.totalXP >= user.currentLevel * 1000) {
                    user.currentLevel++;
                    user.totalXP -= user.currentLevel * 1000;
                }
                await user.save();
                res.json(user.projects);
            } else {
                res.status(404).json({ message: 'Project not found' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});