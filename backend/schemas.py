from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

# pydantic used to define the data model for a garment, which will be used for request and response validation
class GarmentCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=100)
    category: Literal["top", "bottom", "shoes"]
    imageUrl: str = ""

class Garment(GarmentCreate):
    id: int