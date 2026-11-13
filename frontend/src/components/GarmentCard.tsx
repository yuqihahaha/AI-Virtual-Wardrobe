import { useState } from "react";
import type { Garment, GarmentEdits } from "../types/garment";

type GarmentCardProps = {
  garment: Garment;
  onRemove: (id: number) => void;
  onUpdate: (id: number, edits: GarmentEdits) => void;
};

export default function GarmentCard({ garment, onRemove, onUpdate }: GarmentCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(garment.name);
    const [draftCategory, setDraftCategory] = useState<Garment["category"]>(garment.category);


    function startEditing() {
        setDraftName(garment.name);
        setDraftCategory(garment.category);
        setIsEditing(true);
    }

    function applyChanges() {
        const name = draftName.trim();
        if (!name) return;

        onUpdate(garment.id, { name, category: draftCategory });
        setIsEditing(false);
    }

    return (
        <article className="garment-card">
        {garment.imageUrl ? (
            <img
            src={garment.imageUrl}
            alt={garment.name}
            width={180}
            height={180}
            />
        ) : (
            <p>No image available</p>
        )}

        {isEditing ? (
            <div>
                <label htmlFor={`garment-name-${garment.id}`}>Name:</label>
                <input
                    id={`garment-name-${garment.id}`}
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                />
                <label htmlFor={`garment=category-${garment.id}`}>Category:</label>
                <select 
                id = {`garment-category-${garment.id}`}
                value={draftCategory}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === "top" || value === "bottom" || value === "shoes") {
                        setDraftCategory(value);
                    }
                }}
                >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="shoes">Shoes</option>
                </select>
                <button type="button" onClick={applyChanges} disabled={!draftName.trim()}>Apply Changes</button>
                <button type="button" onClick={() => setIsEditing(false)}> Cancel</button>
            </div>
        ) : (
            <h2>{garment.name}</h2>
        )}

        <p>{garment.category}</p>

        {!isEditing && (
            <button type="button" onClick={startEditing}>
                Edit
            </button>
        )}
            
        <button type="button" onClick={() => onRemove(garment.id)} aria-label={`Remove ${garment.name}`} >
            Remove
        </button>
        </article>
    );
}