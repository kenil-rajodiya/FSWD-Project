const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cineguide";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ User Schema
const User = mongoose.model("User", new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchLater: [{ type: String }],
}));

// ✅ Function to Find Correct TMDB ID
async function findCorrectTMDBId(title) {
    try {
        console.log(`🔍 Searching for correct TMDB ID for: ${title}`);
        const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=${process.env.TMDB_API_KEY}`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results[0].id.toString();
        }
    } catch (error) {
        console.error("❌ Error searching for correct TMDB ID:", error);
    }
    return null;
}

// ✅ Register User
app.post('/register', async (req, res) => {
    try {
        console.log("🔹 Registration Request:", req.body);
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, watchLater: [] });

        await newUser.save();
        console.log("✅ User Registered:", newUser);
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('❌ Registration Error:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// ✅ Login User
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔹 Login Attempt:", email);

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });

        res.json({ token, userId: user._id, username: user.username, watchLater: user.watchLater });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

// ✅ Add to Watch Later (Avoid Duplicates)
app.post('/watchlater', async (req, res) => {
    try {
        const { userId, movieId } = req.body;
        console.log("🔹 Adding to Watch Later:", userId, movieId);

        if (!userId || !movieId) {
            return res.status(400).json({ error: 'Invalid request, userId and movieId required' });
        }

        await User.findByIdAndUpdate(userId, { $addToSet: { watchLater: movieId } });

        res.json({ message: 'Added to Watch Later' });

    } catch (error) {
        console.error("❌ Watch Later Error:", error);
        res.status(500).json({ error: 'Error adding to Watch Later' });
    }
});

// ✅ Remove from Watch Later
app.delete('/watchlater/:userId/:movieId', async (req, res) => {
    try {
        const { userId, movieId } = req.params;
        console.log("🔹 Removing from Watch Later:", userId, movieId);

        if (!userId || !movieId) {
            return res.status(400).json({ error: 'Invalid request, userId and movieId required' });
        }

        const user = await User.findByIdAndUpdate(userId, { $pull: { watchLater: movieId } }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Removed from Watch Later', watchLater: user.watchLater });

    } catch (error) {
        console.error("❌ Remove Watch Later Error:", error);
        res.status(500).json({ error: 'Error removing from Watch Later' });
    }
});

// ✅ Get Watch Later List (Auto-Correct Invalid IDs)
app.get('/watchlater/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let validWatchLater = [];
        for (const movieId of user.watchLater) {
            const checkUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`;
            const checkResponse = await fetch(checkUrl);

            if (checkResponse.ok) {
                validWatchLater.push(movieId);
            } else {
                console.warn(`⚠️ Invalid Movie ID: ${movieId}. Searching for correct ID...`);
                const correctedId = await findCorrectTMDBId(movieId);
                if (correctedId) {
                    validWatchLater.push(correctedId);
                    await User.findByIdAndUpdate(req.params.userId, { $addToSet: { watchLater: correctedId } });
                }
            }
        }

        await User.findByIdAndUpdate(req.params.userId, { watchLater: validWatchLater });
        res.json({ watchLater: validWatchLater });
    } catch (error) {
        console.error("❌ Fetching Watch Later Error:", error);
        res.status(500).json({ error: 'Error fetching Watch Later list' });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.stack);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});







// ✅ Feedback Schema
const Feedback = mongoose.model("Feedback", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}));


// ✅ Handle Feedback Submission
app.post('/feedback', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        console.log("🔹 Feedback Received:", req.body);

        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newFeedback = new Feedback({ name, email, message });
        await newFeedback.save();

        console.log("✅ Feedback Saved:", newFeedback);
        res.status(201).json({ message: "Thank you for your feedback!" });

    } catch (error) {
        console.error("❌ Feedback Error:", error);
        res.status(500).json({ error: "Error submitting feedback" });
    }
});



