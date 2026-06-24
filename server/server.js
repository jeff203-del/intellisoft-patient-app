import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import patientRoutes from './routes/patients.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Allows local dev AND your deployed Vercel frontend
app.use(cors({
    origin: ['http://localhost:3000', 'https://intellisoft-patient-app.vercel.app'],
    credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/patients', patientRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/intellisoft_patients';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} (WITHOUT DATABASE)`);
        });
    });