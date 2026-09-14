# PsychAssess Backend API

A high-performance REST API built with **FastAPI** and **Python 3.10**.

## 🏗️ Architecture

The application follows a Service-Repository pattern to decouple business logic from the HTTP transport layer.

```text
app/
├── models/         # Pydantic data schemas (Request/Response validation)
├── routers/        # API Endpoints (Assessments, Notes)
├── services/       # Business Logic (Narrative generation, Data loading)
├── db.py           # In-memory database simulation
└── main.py         # App entrypoint and CORS config
```

## 🚀 Local Setup
If you are not using Docker, follow these steps to run the backend locally.

### 1. Create a virtual environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Server
```bash
uvicorn app.main:app --reload
```

> The API will be available at http://localhost:8000.

## Testing
We use pytest for unit testing.

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v
```

### 📝 Key Design Decisions

- Pydantic Models: Used extensively to enforce type safety. For example, NoteCreate ensures notes always have content and an author before reaching the logic layer.

- Service Layer: The NarrativeService contains the logic for interpreting IQ scores. This makes it easy to unit test the logic without spinning up the entire API.

- Data Consistency: The app loads sample_data.json from the root directory on startup to populate the in-memory store.