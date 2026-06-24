import mongoose from 'mongoose';

const vitalSchema = new mongoose.Schema({
    visitDate: { type: Date, required: true },
    height: { type: Number, required: true, min: 0 },
    weight: { type: Number, required: true, min: 0 },
    bmi: { type: Number, required: true }
}, { timestamps: true });

const assessmentSchema = new mongoose.Schema({
    visitDate: { type: Date, required: true },
    generalHealth: { type: String, enum: ['Good', 'Poor'], required: true },
    dietToLoseWeight: { type: String, enum: ['Yes', 'No'] },
    usingDrugs: { type: String, enum: ['Yes', 'No'] },
    comments: { type: String, required: true },
    type: { type: String, enum: ['overweight', 'general'], required: true }
}, { timestamps: true });

const patientSchema = new mongoose.Schema({
    patientId: { type: String, required: true, unique: true, index: true },
    registrationDate: { type: Date, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true, default: '' },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    vitals: [vitalSchema],
    assessments: [assessmentSchema]
}, { timestamps: true });

// Virtual for full name
patientSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`;
});

// Virtual for age
patientSchema.virtual('age').get(function() {
    const diff = Date.now() - this.dateOfBirth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

// Method to get last BMI status
patientSchema.methods.getLastBMIStatus = function() {
    if (!this.vitals || this.vitals.length === 0) return 'N/A';
    const lastBMI = this.vitals[this.vitals.length - 1].bmi;
    if (lastBMI < 18.5) return 'Underweight';
    if (lastBMI < 25) return 'Normal';
    return 'Overweight';
};

// Method to get last BMI value
patientSchema.methods.getLastBMI = function() {
    if (!this.vitals || this.vitals.length === 0) return null;
    return this.vitals[this.vitals.length - 1].bmi;
};

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;