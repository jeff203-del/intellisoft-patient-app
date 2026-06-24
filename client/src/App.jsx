import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Layout from './components/Layout.jsx';
import Registration from './pages/Registration.jsx';
import Vitals from './pages/Vitals.jsx';
import OverweightAssessment from './pages/OverweightAssessment.jsx';
import GeneralAssessment from './pages/GeneralAssessment.jsx';
import PatientListing from './pages/PatientListing.jsx';

function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/vitals/:patientId" element={<Vitals />} />
          <Route path="/overweight-assessment/:patientId" element={<OverweightAssessment />} />
          <Route path="/general-assessment/:patientId" element={<GeneralAssessment />} />
          <Route path="/patients" element={<PatientListing />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}

export default App;