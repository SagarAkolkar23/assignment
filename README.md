# CareSync — Healthcare Management System

A full-stack healthcare management application built with **Django**, **Django REST Framework (DRF)**, **PostgreSQL**, **SimpleJWT**, and a **React (JavaScript + Vite)** frontend. Authenticated users can register, log in, manage patient and doctor records, and assign doctors to patients through a secure REST API and responsive web UI.

---

## How to Start This Project

### Prerequisites
- **Python 3.10+** (verified on Python 3.14)
- **PostgreSQL** (running locally on port `5432`)
- **Node.js 18+** and **npm**

---

### 1. Start PostgreSQL & Create the Database
Make sure your PostgreSQL server is running, then create the database (default name: `healthcare_db`):

```sql
CREATE DATABASE healthcare_db;
```

---

### 2. Configure & Start the Backend (`backend/`)

1. **Create / activate the Python virtual environment** (a `.venv` is already included at the repository root):
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```
   *(Or create one if missing: `python -m venv .venv`)*

2. **Install Python dependencies**:
   ```powershell
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   Copy `backend/.env.example` to `backend/.env` and update your `SECRET_KEY` and PostgreSQL credentials:
   ```env
   SECRET_KEY=replace-with-a-secure-random-secret-key
   DEBUG=True
   ALLOWED_HOSTS=127.0.0.1,localhost
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

   DB_NAME=healthcare_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432

   JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
   JWT_REFRESH_TOKEN_LIFETIME_DAYS=7
   ```

4. **Apply database migrations**:
   ```powershell
   python manage.py migrate
   ```

5. **Start the Django API server**:
   ```powershell
   python manage.py runserver
   ```
   The backend API will be running at `http://127.0.0.1:8000`.

---

### 3. Start the Frontend (`frontend/`)

Open a **second terminal** at the repository root:

```powershell
cd frontend
npm install
npm run dev
```

The React dev server will start at **`http://localhost:5173`** and automatically proxy `/api` requests to `http://127.0.0.1:8000` (configured in `frontend/vite.config.js`).

> **Tip:** To run a production frontend build, run `npm run build` inside `frontend/`.

---

## About the Overall Project

CareSync separates concerns cleanly into an independent **Django REST API** (`backend/`) and a **React SPA** (`frontend/`), communicating over JSON/HTTPS with stateless **JWT Bearer authentication**.

### Repository Structure

```text
Assignment/
├── backend/                     # Django + DRF + PostgreSQL API server
│   ├── config/                  # Settings, root URLs, custom exception handler, validators
│   ├── accounts/                # Custom email-based User model & JWT auth endpoints
│   ├── patients/                # User-owned patient records & CRUD APIs
│   ├── doctors/                 # Doctor directory & CRUD APIs
│   ├── mappings/                # Patient-doctor assignments & lookup APIs
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                     # Local secrets & DB credentials (gitignored)
│
├── frontend/                    # React (JavaScript + Vite) client
│   ├── src/
│   │   ├── components/          # Shared UI (AppLayout, ProtectedRoute, AlertBanner, Modal)
│   │   ├── context/             # AuthContext for JWT session state
│   │   ├── services/            # apiClient.js (Axios + Bearer injection + auto-refresh)
│   │   └── pages/               # One self-contained folder per page:
│   │       ├── Login/           # LoginPage.jsx, components/, services/
│   │       ├── Register/        # RegisterPage.jsx, components/, services/
│   │       ├── Dashboard/       # DashboardPage.jsx, components/, services/
│   │       ├── Patients/        # PatientsPage.jsx, components/, services/
│   │       ├── Doctors/         # DoctorsPage.jsx, components/, services/
│   │       └── Mappings/        # MappingsPage.jsx, components/, services/
│   ├── package.json
│   └── vite.config.js
│
├── postman_collection.json      # Importable Postman collection for all API endpoints
└── README.md
```

### How Frontend & Backend Work Together
1. **Registration & Login**: Users sign up via `/register` (`POST /api/auth/register/`) and sign in via `/login` (`POST /api/auth/login/`).
2. **JWT Session Management**: `apiClient.js` stores `access` and `refresh` tokens in `localStorage`, injects `Authorization: Bearer <access>` into every protected request, and automatically refreshes expired access tokens via `POST /api/auth/token/refresh/`.
3. **Protected Routes**: `ProtectedRoute.jsx` guards `/`, `/patients`, `/doctors`, and `/mappings`, redirecting unauthenticated visitors to `/login`.

---

## About the Backend (`backend/`)

The backend follows a modular Django app architecture backed by **PostgreSQL** via **Django ORM** and **Django REST Framework**.

### Apps & Database Models

| App | Model | Purpose & Key Rules |
| --- | --- | --- |
| `accounts` | `User` | Custom `AbstractBaseUser` + `PermissionsMixin` using `email` as `USERNAME_FIELD`, plus `name`, `is_active`, `is_staff`, and `date_joined`. |
| `patients` | `Patient` | Stores `created_by` (`FK -> User`), `name`, `age` (`0–150`), `gender` (`Male`/`Female`/`Other`), `phone`, `email`, `address`, `medical_history`, and timestamps. Queries are strictly scoped to `created_by=request.user`. |
| `doctors` | `Doctor` | Stores `created_by` (`FK -> User`), `name`, `specialization`, unique `email`, `phone`, `years_of_experience` (`0–80`), and timestamps. |
| `mappings` | `PatientDoctorMapping` | Links `patient` (`FK -> Patient`) and `doctor` (`FK -> Doctor`) with `assigned_by`, `notes`, and `assigned_at`. Enforces a database-level `UniqueConstraint(fields=['patient', 'doctor'])` and verifies the patient belongs to `request.user`. |
| `config` | — | Loads environment variables via `python-dotenv`, configures `SIMPLE_JWT` and `django-cors-headers`, provides shared phone/text validators (`validators.py`), and formats errors uniformly (`exceptions.py`). |

### API Endpoints

#### 1. Authentication (`/api/auth/`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register/` | Public | Register a new user with `name`, `email`, and `password`. |
| `POST` | `/api/auth/login/` | Public | Authenticate with `email` and `password`; returns `access`, `refresh`, and `user`. |
| `POST` | `/api/auth/token/refresh/` | Public | Obtain a new `access` token using a `refresh` token. |

#### 2. Patients (`/api/patients/`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/patients/` | Authenticated | Create a new patient owned by the logged-in user. |
| `GET` | `/api/patients/` | Authenticated | List all patients created by the logged-in user. |
| `GET` | `/api/patients/<id>/` | Authenticated | Get details of a specific patient owned by the user. |
| `PUT` | `/api/patients/<id>/` | Authenticated | Update a patient record owned by the user. |
| `DELETE` | `/api/patients/<id>/` | Authenticated | Delete a patient record owned by the user. |

#### 3. Doctors (`/api/doctors/`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/doctors/` | Authenticated | Add a new doctor profile. |
| `GET` | `/api/doctors/` | Authenticated | Retrieve all registered doctors. |
| `GET` | `/api/doctors/<id>/` | Authenticated | Retrieve details of a specific doctor. |
| `PUT` | `/api/doctors/<id>/` | Authenticated | Update a doctor profile. |
| `DELETE` | `/api/doctors/<id>/` | Authenticated | Delete a doctor record. |

#### 4. Patient-Doctor Mappings (`/api/mappings/`)
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/mappings/` | Authenticated | Assign a doctor to one of the user's patients. |
| `GET` | `/api/mappings/` | Authenticated | Retrieve all patient-doctor mappings for the user's patients. |
| `GET` | `/api/mappings/<patient_id>/` | Authenticated | Retrieve all doctors assigned to a specific patient. |
| `DELETE` | `/api/mappings/<id>/` | Authenticated | Remove a doctor-patient assignment by mapping ID. |

### Validation & Error Format
A custom DRF exception handler (`config/exceptions.py`) normalizes validation and permission errors into consistent JSON responses:

```json
{
  "error": "Request failed validation or could not be processed.",
  "status_code": 400,
  "details": {
    "email": ["A user with this email already exists."]
  }
}
```

### Running Backend Tests
Run the full automated test suite from inside `backend/`:

```powershell
cd backend
..\.venv\Scripts\python.exe manage.py test -v 2
```

### Testing with Postman
Import [postman_collection.json](./postman_collection.json) into Postman, ensure `base_url` is `http://127.0.0.1:8000`, and run **Auth → Login User** first so the collection automatically stores `access_token` for all protected requests.
