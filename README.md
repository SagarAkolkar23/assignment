# Healthcare Backend API (Django + DRF + PostgreSQL)

A RESTful backend system for managing users, patients, doctors, and patient-doctor assignments using Django, Django REST Framework, SimpleJWT, and PostgreSQL.

## Project Structure

- `config/`: Project settings, URL routing, custom DRF exception handler, and shared validators.
- `accounts/`: Custom email-authenticated `User` model and JWT auth APIs (`/api/auth/...`).
- `patients/`: User-scoped patient management APIs (`/api/patients/...`).
- `doctors/`: Doctor directory APIs (`/api/doctors/...`).
- `mappings/`: Patient-doctor assignment APIs (`/api/mappings/...`).

## Setup Instructions

1. **Create and activate a virtual environment** (already set up in `.venv`):
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```
2. **Install dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```
3. **Configure environment variables**:
   Copy `.env.example` to `.env` and fill in your `SECRET_KEY` and PostgreSQL credentials (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`).
4. **Create the PostgreSQL database**:
   ```sql
   CREATE DATABASE healthcare_db;
   ```
5. **Run database migrations**:
   ```powershell
   python manage.py migrate
   ```
6. **Start the development server**:
   ```powershell
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register/` — Register a new user (`name`, `email`, `password`).
- `POST /api/auth/login/` — Log in with `email` and `password` to receive JWT `access` and `refresh` tokens.
- `POST /api/auth/token/refresh/` — Refresh an access token using a `refresh` token.

### Patients (Authenticated)
- `POST /api/patients/` — Create a new patient (automatically linked to the logged-in user).
- `GET /api/patients/` — Retrieve all patients created by the logged-in user.
- `GET /api/patients/<id>/` — Retrieve a specific patient owned by the logged-in user.
- `PUT /api/patients/<id>/` — Update a specific patient owned by the logged-in user.
- `DELETE /api/patients/<id>/` — Delete a specific patient owned by the logged-in user.

### Doctors (Authenticated)
- `POST /api/doctors/` — Add a new doctor.
- `GET /api/doctors/` — Retrieve all doctors.
- `GET /api/doctors/<id>/` — Retrieve details of a specific doctor.
- `PUT /api/doctors/<id>/` — Update doctor details.
- `DELETE /api/doctors/<id>/` — Delete a doctor record.

### Patient-Doctor Mappings (Authenticated)
- `POST /api/mappings/` — Assign a doctor (`doctor`) to a patient (`patient`).
- `GET /api/mappings/` — Retrieve all patient-doctor mappings for the user's patients.
- `GET /api/mappings/<patient_id>/` — Get all doctors assigned to a specific patient.
- `DELETE /api/mappings/<id>/` — Remove a doctor-patient mapping by mapping ID.

## Running Tests

```powershell
python manage.py test
```

## Postman

Import `postman_collection.json` into Postman, set `base_url` (default `http://127.0.0.1:8000`), and run `Auth -> Login` first to populate `access_token`.
