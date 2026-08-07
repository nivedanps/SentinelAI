# SentinelAI

Disaster Intelligence & Emergency Response Coordination Platform.

## Project structure

- `backend/` - FastAPI backend service
- `frontend/` - React + Vite frontend application

## Requirements

- Python 3.11+ (recommended)
- Node.js 18+ / npm 10+ or Yarn
- MongoDB for the backend

## Backend setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```
3. Create a `.env` file in `backend/` if you want to override defaults.

### Example `.env`

```env
SECRET_KEY=your-secret-key
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=disaster_intelligence_db
ENVIRONMENT=development
DEBUG=True
ANTIGRAVITY_AI_API_KEY=your-ai-api-key
ANTIGRAVITY_AI_ENDPOINT=https://api.antigravity.ai/v1/analyze
```

## Run the backend

From the `backend/` folder:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API docs are available at:

- `http://localhost:8000/api/v1/docs`
- `http://localhost:8000/api/v1/redoc`

## Frontend setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

## Run the frontend

From the `frontend/` folder:

```bash
npm run dev
```

Then open the local Vite URL displayed in the terminal, typically `http://localhost:5173`.

## Notes

- The backend uses MongoDB and expects it to be running locally by default.
- The frontend is configured to allow CORS from `http://localhost:5173` and `http://localhost:3000`.
- If you change backend host or port, update the frontend API client accordingly.

## Project goals

This repository implements a coordinated emergency response platform with:

- GIS-aware incident tracking
- hospital, shelter, resource, and volunteer management
- weather and analytics services
- AI-assisted intelligence fusion

## License

Add a license file or choose a license to apply to this project.
