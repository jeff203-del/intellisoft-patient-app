import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, Save } from 'lucide-react';
import { patientApi } from '../api/api.js';
import { useApp } from '../context/AppContext.jsx';
import FormInput from '../components/FormInput.jsx';
import RadioGroup from '../components/RadioGroup.jsx';

const OverweightAssessment = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useApp();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    generalHealth: '',
    dietToLoseWeight: '',
    comments: ''
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await patientApi.getById(patientId);
        setPatient(response.data.data);
      } catch {
        showNotification('Patient not found', 'error');
        navigate('/');
      }
    };
    fetchPatient();
  }, [patientId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
    if (!formData.generalHealth) newErrors.generalHealth = 'General health is required';
    if (!formData.dietToLoseWeight) newErrors.dietToLoseWeight = 'This field is required';
    if (!formData.comments.trim()) newErrors.comments = 'Comments are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await patientApi.addAssessment(patientId, {
        ...formData,
        type: 'overweight'
      });
      showNotification('Overweight assessment saved successfully', 'success');
      navigate('/patients');
    } catch {
      showNotification('Failed to save assessment', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <div className="page-header bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Overweight Assessment</h2>
              <p className="text-amber-100 text-sm mt-1">BMI indicates patient is overweight (BMI &gt; 25)</p>
            </div>
          </div>
        </div>

        {/* Patient Banner */}
        <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Patient</p>
              <p className="font-semibold text-gray-900">{patient.fullName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last BMI</p>
              <p className="text-2xl font-bold text-amber-600">
                {patient.vitals?.[patient.vitals.length - 1]?.bmi || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Visit Date"
            type="date"
            required
            value={formData.visitDate}
            onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
            error={errors.visitDate}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RadioGroup
              label="General Health"
              required
              name="generalHealth"
              options={['Good', 'Poor']}
              value={formData.generalHealth}
              onChange={(val) => setFormData(prev => ({ ...prev, generalHealth: val }))}
              error={errors.generalHealth}
            />
            <RadioGroup
              label="Have you ever been on a diet to lose weight?"
              required
              name="dietToLoseWeight"
              options={['Yes', 'No']}
              value={formData.dietToLoseWeight}
              onChange={(val) => setFormData(prev => ({ ...prev, dietToLoseWeight: val }))}
              error={errors.dietToLoseWeight}
            />
          </div>

          <FormInput
            label="Comments"
            type="textarea"
            required
            value={formData.comments}
            onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
            error={errors.comments}
            placeholder="Enter detailed assessment comments..."
          />

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => navigate('/patients')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <span className="animate-spin">⟳</span> : (
                <><Save className="w-4 h-4" /> Save Assessment</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OverweightAssessment;