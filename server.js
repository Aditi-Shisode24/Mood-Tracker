import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  mood: { type: String, required: true },
});

const Mood = mongoose.model('Mood', moodSchema);

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.log('No authorization header');
      return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token in authorization header');
      return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('Token verification failed:', err);
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ message: 'Token verification failed' });
  }
};

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.post('/api/mood', verifyToken, async (req, res) => {
  try {
    const { mood, date } = req.body;
    const userId = req.userId;
    
    console.log('Received mood request:', { userId, mood, date });

    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const moodDate = date ? new Date(date) : new Date();
    
    let existingMood = await Mood.findOne({
      userId,
      date: {
        $gte: new Date(moodDate.setHours(0, 0, 0, 0)),
        $lt: new Date(moodDate.setHours(23, 59, 59, 999))
      }
    });

    if (existingMood) {
      existingMood.mood = mood;
      await existingMood.save();
      console.log('Updated mood:', existingMood);
    } else {
      const newMood = new Mood({
        userId,
        date: moodDate,
        mood
      });
      await newMood.save();
      console.log('Created new mood:', newMood);
    }

    res.status(201).json({ message: 'Mood logged successfully' });
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({ 
      message: 'Error logging mood',
      error: error.message 
    });
  }
});

app.get('/api/moods', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const moods = await Mood.find({ userId }).sort({ date: 1 });
    res.json(moods);
  } catch (error) {
    console.error('Error fetching mood history:', error);
    res.status(500).json({ message: 'Error fetching mood history' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
