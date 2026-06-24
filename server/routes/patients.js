import express from 'express';
import Patient from '../models/Patient.js';

const router = express.Router();

// GET all patients (with optional visit date filter)
router.get('/', async(req, res) => {
    try {
        const { visitDate } = req.query;
        let query = {};

        if (visitDate) {
            const date = new Date(visitDate);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            query.$or = [
                { 'vitals.visitDate': { $gte: date, $lt: nextDay } },
                { 'assessments.visitDate': { $gte: date, $lt: nextDay } }
            ];
        }

        const patients = await Patient.find(query).sort({ createdAt: -1 });

        const formatted = patients.map(p => ({
            _id: p._id,
            patientId: p.patientId,
            fullName: p.fullName,
            age: p.age,
            gender: p.gender,
            dateOfBirth: p.dateOfBirth,
            registrationDate: p.registrationDate,
            lastBMI: p.getLastBMI(),
            lastBMIStatus: p.getLastBMIStatus(),
            vitalsCount: p.vitals.length,
            assessmentsCount: p.assessments.length
        }));

        res.json({ success: true, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single patient
router.get('/:id', async(req, res) => {
    try {
        const patient = await Patient.findOne({ patientId: req.params.id });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.json({ success: true, data: patient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST register new patient
router.post('/', async(req, res) => {
    try {
        const { patientId, registrationDate, firstName, lastName, middleName, dateOfBirth, gender } = req.body;

        // Check if patient ID already exists
        const existing = await Patient.findOne({ patientId });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Patient ID already exists' });
        }

        const patient = new Patient({
            patientId,
            registrationDate: new Date(registrationDate),
            firstName,
            lastName,
            middleName: middleName || '',
            dateOfBirth: new Date(dateOfBirth),
            gender
        });

        await patient.save();
        res.status(201).json({ success: true, data: patient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST add vitals
router.post('/:id/vitals', async(req, res) => {
    try {
        const { visitDate, height, weight } = req.body;
        const bmi = parseFloat((weight / Math.pow(height / 100, 2)).toFixed(2));

        const patient = await Patient.findOne({ patientId: req.params.id });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        patient.vitals.push({
            visitDate: new Date(visitDate),
            height: parseFloat(height),
            weight: parseFloat(weight),
            bmi
        });

        await patient.save();
        res.json({ success: true, data: { bmi, vital: patient.vitals[patient.vitals.length - 1] } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST add assessment
router.post('/:id/assessments', async(req, res) => {
    try {
        const { visitDate, generalHealth, dietToLoseWeight, usingDrugs, comments, type } = req.body;

        const patient = await Patient.findOne({ patientId: req.params.id });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        const assessmentData = {
            visitDate: new Date(visitDate),
            generalHealth,
            comments,
            type
        };

        if (type === 'overweight') {
            assessmentData.dietToLoseWeight = dietToLoseWeight;
        } else {
            assessmentData.usingDrugs = usingDrugs;
        }

        patient.assessments.push(assessmentData);
        await patient.save();

        res.json({ success: true, data: patient.assessments[patient.assessments.length - 1] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;