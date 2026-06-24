import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, TrendingUp, ArrowRight } from 'lucide-react';
import { patientApi } from '../api/api.js';
import { useApp } from '../context/AppContext.jsx';
import FormInput from '../components/FormInput.jsx';

const Vitals = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { setCurrentPatient, setLastBMI, showNotification } = useApp();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
    bmi: ''
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await patientApi.getById(patientId);
        setPatient(response.data.data);
        setCurrentPatient(response.data.data);
      } catch {
        showNotification('Patient not found', 'error');
        navigate('/');
      }
    };
    fetchPatient();
  }, [patientId]);

  // Auto-calculate BMI
  useEffect(() => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) {
      const bmi = (w / Math.pow(h / 100, 2)).toFixed(2);
      setFormData(prev => ({ ...prev, bmi }));
    }
  }, [formData.height, formData.weight]);

  const validate = () => {
    const newErrors = {};
    if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
    if (!formData.height || formData.height <= 0) newErrors.height = 'Valid height is required';
    if (!formData.weight || formData.weight <= 0) newErrors.weight = 'Valid weight is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await patientApi.addVitals(patientId, {
        visitDate: formData.visitDate,
        height: formData.height,
        weight: formData.weight
      });
      
      const bmi = response.data.data.bmi;
      setLastBMI(bmi);
      showNotification(`Vitals recorded. BMI: ${bmi}`, 'success');
      
      // Navigate based on BMI
      if (bmi > 25) {
        navigate(`/overweight-assessment/${patientId}`);
      } else {
        navigate(`/general-assessment/${patientId}`);
      }
    } catch {
      showNotification('Failed to save vitals', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getBMIStatus = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'text-amber-600';
    if (bmi < 25) return 'text-emerald-600';
    return 'text-rose-600';
  };

  if (!patient) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Patient Vitals</h2>
              <p className="text-primary-100 text-sm mt-1">Record height, weight & calculate BMI</p>
            </div>
          </div>
        </div>

        {/* Patient Info Banner */}
        <div className="bg-primary-50 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <TrendingUp className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Patient</p>
            <p className="font-semibold text-gray-900">{patient.fullName}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-gray-500">ID</p>
            <p className="font-mono font-medium text-primary-700">{patient.patientId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Visit Date"
              type="date"
              required
              value={formData.visitDate}
              onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
              error={errors.visitDate}
            />
            <div />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Height (cm)"
              type="number"
              required
              min="1"
              step="0.1"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
              error={errors.height}
              placeholder="e.g., 175"
            />
            <FormInput
              label="Weight (kg)"
              type="number"
              required
              min="1"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              error={errors.weight}
              placeholder="e.g., 70"
            />
          </div>

          {/* BMI Display */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <label className="form-label">BMI (Auto-calculated)</label>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getBMIStatus(formData.bmi)}`}>
                {formData.bmi || '—'}
              </span>
              <span className="text-gray-400 text-sm">kg/m²</span>
            </div>
            {formData.bmi && (
              <p className={`mt-2 text-sm font-medium ${getBMIStatus(formData.bmi)}`}>
                {formData.bmi < 18.5 ? 'Underweight' : 
                 formData.bmi < 25 ? 'Normal Weight' : 'Overweight'}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => navigate('/patients')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading || !formData.bmi} className="btn-primary flex items-center gap-2">
              {loading ? <span className="animate-spin">⟳</span> : (
                <>Next Step <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Vitals;