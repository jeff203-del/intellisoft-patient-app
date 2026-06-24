import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, UserPlus, Activity, Filter } from 'lucide-react';
import { patientApi } from '../api/api.js';
import { useApp } from '../context/AppContext.jsx';

const PatientListing = () => {
  const { showNotification } = useApp();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPatients = async (date = '') => {
    setLoading(true);
    try {
      const response = await patientApi.getAll(date || undefined);
      setPatients(response.data.data);
    } catch {
      showNotification('Failed to load patients', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleFilter = () => {
    fetchPatients(filterDate);
  };

  const clearFilter = () => {
    setFilterDate('');
    fetchPatients();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Underweight': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Normal': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Overweight': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card">
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Patient Listing</h2>
                <p className="text-primary-100 text-sm mt-1">View all registered patients and their status</p>
              </div>
            </div>
            <Link to="/" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              New Patient
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2 items-center">
            <Filter className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button onClick={handleFilter} className="btn-primary py-2.5">
              Filter
            </button>
            {filterDate && (
              <button onClick={clearFilter} className="btn-secondary py-2.5">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Patient Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Age</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Gender</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Last BMI</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">BMI Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Visits</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    <span className="animate-spin inline-block mr-2">⟳</span> Loading patients...
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="w-8 h-8 text-gray-300" />
                      <p>No patients found</p>
                      {filterDate && <p className="text-sm">Try clearing the date filter</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{patient.fullName}</p>
                        <p className="text-xs text-gray-500 font-mono">{patient.patientId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{patient.age} years</td>
                    <td className="py-4 px-4 text-gray-700">{patient.gender}</td>
                    <td className="py-4 px-4">
                      <span className="font-mono font-medium text-gray-900">
                        {patient.lastBMI || '—'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(patient.lastBMIStatus)}`}>
                        {patient.lastBMIStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">
                        {patient.vitalsCount} vitals, {patient.assessmentsCount} assessments
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/vitals/${patient.patientId}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline"
                      >
                        Add Visit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientListing;