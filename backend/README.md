# PPN Research Portal - Backend API

FastAPI-based backend for the PPN Research Portal. Provides REST API endpoints for clinical research data management with Supabase integration.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your Supabase credentials
```

Required environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Your Supabase service role key (backend only!)

### 3. Sync Database Schema

Run the schema sync to create missing tables:

```sql
-- In Supabase SQL Editor, run:
backend/sync_schema.sql
```

This creates:
- `ref_flow_event_types` - Reference data for patient flow classifications
- `log_patient_flow_events` - Patient journey event tracking

### 4. Run the Server

```bash
# Development mode (auto-reload)
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --port 8000
```

Server will start at: `http://localhost:8000`

## 📚 API Documentation

Once the server is running:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 🔧 API Endpoints

### Health & Status
- `GET /` - Root welcome message
- `GET /api/health` - Health check with database connectivity test

### Sites
- `GET /api/sites` - List all research sites

### Patient Flow
- `GET /api/flow-events` - Get patient flow events (optional `?subject_id=` filter)
- `POST /api/flow-events` - Create new flow event
- `GET /api/flow-event-types` - Get all flow event type reference data

## 🗂️ Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variable template
├── .env                 # Your local config (DO NOT COMMIT)
├── sync_schema.sql      # Database schema for missing tables
└── README.md            # This file
```

## 🔒 Security Notes

1. **Service Key vs Anon Key**
   - Frontend uses `SUPABASE_ANON_KEY` (limited permissions)
   - Backend uses `SUPABASE_SERVICE_KEY` (full access)
   - NEVER expose the service key to the frontend

2. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Backend bypasses RLS with service key (be careful!)
   - Frontend enforces RLS through anon key

3. **CORS**
   - Only configured origins can access the API
   - Update `ALLOWED_ORIGINS` in .env for production

## 🧪 Testing

### Health Check

```bash
curl http://localhost:8000/api/health
```

### Get Sites

```bash
curl http://localhost:8000/api/sites
```

### Create Flow Event

```bash
curl -X POST http://localhost:8000/api/flow-events \
  -H "Content-Type: application/json" \
  -d '{
    "subject_id": 1,
    "event_type_id": 1,
    "event_date": "2026-02-09",
    "session_number": null,
    "notes": "Initial screening completed"
  }'
```

## 🐛 Troubleshooting

### Connection Refused
- Ensure backend is running on port 8000
- Check if another process is using port 8000: `lsof -i :8000`

### Database Connection Failed
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in `.env`
- Check Supabase project status
- Ensure service key has correct permissions

### CORS Errors
- Add frontend URL to `ALLOWED_ORIGINS` in `.env`
- Restart backend after env changes

## 📋 Development Workflow

1. Make changes to `main.py`
2. Server auto-reloads (if using `--reload`)
3. Test via Swagger UI or curl
4. Check logs for errors

## 🚢 Deployment

For production deployment:

1. Set `API_RELOAD=false` in production env
2. Use a production WSGI server (uvicorn with workers)
3. Set up SSL/TLS termination
4. Configure production CORS origins
5. Enable logging and monitoring

Example production command:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📝 Notes

- This backend was scaffolded to resolve "Missing Backend" critical issue
- Tables `log_patient_flow_events` and `ref_flow_event_types` are now defined
- Frontend can now query these tables without 404 errors
- All endpoints follow project security requirements (no PHI/PII collection)

---

**Built with:** FastAPI 🚀 | Supabase 🔥 | Python 🐍
