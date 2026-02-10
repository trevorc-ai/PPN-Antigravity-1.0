"""
PPN Research Portal - Backend API
FastAPI application with Supabase integration
"""

import os
from typing import Dict, Any, List
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from supabase import create_client, Client
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="PPN Research Portal API",
    description="Backend API for PPN Research Portal - Clinical Research Data Management",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration - Allow frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
        "http://localhost:3000",  # Alternative ports
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client initialization
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  # Use service key for backend

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError(
        "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env"
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


# Dependency to get Supabase client
def get_supabase() -> Client:
    """Dependency injection for Supabase client"""
    return supabase


# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class HealthCheck(BaseModel):
    """Health check response model"""
    status: str
    timestamp: str
    database: str
    version: str


class FlowEventCreate(BaseModel):
    """Model for creating patient flow events"""
    subject_id: int
    event_type_id: int
    event_date: str  # ISO format date
    session_number: int | None = None
    notes: str | None = None


class FlowEventResponse(BaseModel):
    """Response model for flow events"""
    id: int
    subject_id: int
    event_type_id: int
    event_date: str
    session_number: int | None
    notes: str | None
    created_at: str


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/", tags=["Root"])
async def root() -> Dict[str, str]:
    """Root endpoint - API welcome message"""
    return {
        "message": "PPN Research Portal API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/api/docs"
    }


@app.get("/api/health", response_model=HealthCheck, tags=["Health"])
async def health_check(db: Client = Depends(get_supabase)) -> HealthCheck:
    """
    Health check endpoint
    Verifies database connectivity and returns system status
    """
    try:
        # Test database connection by querying sites table
        response = db.table("sites").select("site_code").limit(1).execute()
        
        return HealthCheck(
            status="healthy",
            timestamp=datetime.utcnow().isoformat(),
            database="connected",
            version="1.0.0"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection failed: {str(e)}"
        )


@app.get("/api/sites", tags=["Sites"])
async def get_sites(db: Client = Depends(get_supabase)) -> List[Dict[str, Any]]:
    """
    Get all sites
    Returns list of all research sites in the network
    """
    try:
        response = db.table("sites").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch sites: {str(e)}"
        )


@app.get("/api/flow-events", tags=["Patient Flow"])
async def get_flow_events(
    subject_id: int | None = None,
    db: Client = Depends(get_supabase)
) -> List[Dict[str, Any]]:
    """
    Get patient flow events
    Optional filter by subject_id
    """
    try:
        query = db.table("log_patient_flow_events").select("*")
        
        if subject_id:
            query = query.eq("subject_id", subject_id)
        
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch flow events: {str(e)}"
        )


@app.post("/api/flow-events", response_model=FlowEventResponse, tags=["Patient Flow"])
async def create_flow_event(
    event: FlowEventCreate,
    db: Client = Depends(get_supabase)
) -> Dict[str, Any]:
    """
    Create a new patient flow event
    """
    try:
        response = db.table("log_patient_flow_events").insert(event.model_dump()).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create flow event"
            )
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create flow event: {str(e)}"
        )


@app.get("/api/flow-event-types", tags=["Reference Data"])
async def get_flow_event_types(db: Client = Depends(get_supabase)) -> List[Dict[str, Any]]:
    """
    Get all flow event types
    Returns reference data for patient flow event classifications
    """
    try:
        response = db.table("ref_flow_event_types").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch flow event types: {str(e)}"
        )


# ============================================================================
# STARTUP/SHUTDOWN EVENTS
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    print("=" * 60)
    print("🚀 PPN Research Portal Backend API Starting")
    print("=" * 60)
    print(f"📊 Supabase URL: {SUPABASE_URL}")
    print(f"🔒 Service Key: {'*' * 20}{SUPABASE_SERVICE_KEY[-8:]}")
    print(f"📚 API Docs: http://localhost:8000/api/docs")
    print("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    print("\n🛑 PPN Research Portal Backend API Shutting Down")


# ============================================================================
# RUN SERVER (for development)
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    )
