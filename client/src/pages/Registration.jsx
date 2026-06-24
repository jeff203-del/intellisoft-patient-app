import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Calendar, User } from 'lucide-react';
import { patientApi } from '../api/api.js';
import { useApp } from '../context/AppContext.jsx';
import FormInput from '../components/FormInput.jsx';
import RadioGroup from '../components/RadioGroup.jsx';

const Registration = () => {
  const navigate = useNavigate();
  const { setCurrentPatient, showNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    patientId: '',
    registrationDate: new Date().toISOString().split('T')[0],
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: ''
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.patientId.trim()) newErrors.patientId = 'Patient ID is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await patientApi.register(formData);
      setCurrentPatient(response.data.data);
      showNotification('Patient registered successfully!', 'success');
      navigate(`/vitals/${formData.patientId}`);
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors({ patientId: 'This Patient ID already exists' });
        showNotification('Patient ID already exists', 'error');
      } else {
        showNotification('Registration failed. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <UserPlus className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Patient Registration</h2>
              <p className="text-primary-100 text-sm mt-1">Enter patient demographic details</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="Patient ID"
              required
              value={formData.patientId}
              onChange={(e) => updateField('patientId', e.target.value)}
              error={errors.patientId}
              placeholder="e.g., P-2026-001"
            />
            <FormInput
              label="Registration Date"
              type="date"
              required
              value={formData.registrationDate}
              onChange={(e) => updateField('registrationDate', e.target.value)}
              error={errors.registrationDate}
            />
            <div />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="First Name"
              required
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              error={errors.firstName}
              placeholder="Enter first name"
            />
            <FormInput
              label="Middle Name (Optional)"
              value={formData.middleName}
              onChange={(e) => updateField('middleName', e.target.value)}
              placeholder="Enter middle name"
            />
            <FormInput
              label="Last Name"
              required
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              error={errors.lastName}
              placeholder="Enter last name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Date of Birth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => updateField('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
            />
            <RadioGroup
              label="Gender"
              required
              name="gender"
              options={['Male', 'Female']}
              value={formData.gender}
              onChange={(val) => updateField('gender', val)}
              error={errors.gender}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setFormData({
                patientId: '',
                registrationDate: new Date().toISOString().split('T')[0],
                firstName: '',
                lastName: '',
                middleName: '',
                dateOfBirth: '',
                gender: ''
              })}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Register Patient
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;