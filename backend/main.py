from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import Garment, GarmentCreate

app = FastAPI(title = "AI Virtual Wardrobe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)

sample_garments = [
    Garment(id=1, name="T-shirt", category="top", imageUrl=""),
    Garment(id=2, name="Jeans", category="bottom", imageUrl=""),
]

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/v1/garments", response_model=list[Garment])
def get_garments():
    return sample_garments

@app.post("/v1/garments", response_model=Garment, status_code=201)
async def create_garment(garment: GarmentCreate):
    next_id = max((item.id for item in sample_garments), default=0,) + 1

    new_garment = Garment(id=next_id, **garment.model_dump())
    sample_garments.append(new_garment)
    return new_garment