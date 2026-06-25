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
    register: (data) => api.post('/patients', data),
    getAll: (visitDate) => api.get('/patients', { params: { visitDate } }),
    getById: (id) => api.get(`/patients/${id}`),
    addVitals: (id, data) => api.post(`/patients/${id}/vitals`, data),
    addAssessment: (id, data) => api.post(`/patients/${id}/assessments`, data)
};

export default api;