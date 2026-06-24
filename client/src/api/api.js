import axios from 'axios';

const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const patientApi = {
    // Register patient
    register: (data) => api.post('/patients', data),

    // Get all patients
    getAll: (visitDate) => api.get('/patients', { params: { visitDate } }),

    // Get single patient
    getById: (id) => api.get(`/patients/${id}`),

    // Add vitals
    addVitals: (id, data) => api.post(`/patients/${id}/vitals`, data),

    // Add assessment
    addAssessment: (id, data) => api.post(`/patients/${id}/assessments`, data)
};

export default api;