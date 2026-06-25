# IntelliSOFT Patient Management System

A full-stack web application for patient registration, vitals recording, BMI calculation, and health assessments.

## Approach

**Backend:** Built custom RESTful API using Node.js, Express, and MongoDB.
**Frontend:** Built custom React SPA with Vite and Tailwind CSS.

All backend endpoints are custom-built to support the requirements.

## Features

- ✅ Patient Registration (unique Patient ID validation)
- ✅ Vitals recording with auto-calculated BMI
- ✅ Conditional assessment routing (BMI &gt; 25 → Overweight Assessment, BMI ≤ 25 → General Assessment)
- ✅ Overweight Assessment Form (General Health, Diet history, Comments)
- ✅ General Assessment Form (General Health, Drug usage, Comments)
- ✅ Patient Listing with Age, Last BMI, and BMI Status (Underweight/Normal/Overweight)
- ✅ Filter patients by visit date
- ✅ Multiple visits per patient supported
- ✅ Responsive, accessible, Health IT-optimized UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios, Lucide React |
| Backend | Node.js, Express, MongoDB (Mongoose), CORS |
| Deployment | Vercel (Frontend), Render (Backend) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/patients` | Register new patient |
| GET | `/api/patients` | List all patients (optional `?visitDate=` filter) |
| GET | `/api/patients/:id` | Get single patient by Patient ID |
| POST | `/api/patients/:id/vitals` | Add vitals & calculate BMI |
| POST | `/api/patients/:id/assessments` | Add assessment (overweight/general) |

## BMI Classification

- Underweight: BMI &lt; 18.5
- Normal: 18.5 ≤ BMI &lt; 25
- Overweight: BMI ≥ 25

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

