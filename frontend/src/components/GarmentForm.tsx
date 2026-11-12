import { useRef, useState } from "react";
import type { Garment, NewGarment } from "../types/garment";

type GarmentFormProps = {
  onAddGarment: (garment: NewGarment) => void;
};

export default function GarmentForm({
  onAddGarment,
}: GarmentFormProps) {
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [newName, setNewName] = useState("");
    const [newCategory, setNewCategory] = useState<Garment["category"]>("top");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [imageError, setImageError] = useState("");

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
      const file = event.target.files?.[0];
      setImageError(""); // Clear any previous error message
      setNewImageUrl(""); // Clear the previous image URL
  
      if (!file) return;
  
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setImageError("Choose a valid image file (JPEG, PNG, or WebP).");
        return;
      }
  
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setImageError("Choose an image smaller than 5MB.");
        return;
      }
  
      const reader = new FileReader();
  
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setNewImageUrl(reader.result);
        }
      };
  
      reader.onerror = () => {
        setImageError("Failed to read the image file.");
      };
  
      reader.readAsDataURL(file);
    }

    function handleSubmit() {
        const name = newName.trim();
        if (!name) return;

        if (photoInputRef.current?.files?.length && !newImageUrl) return; // If a file is selected but newImageUrl is empty, do not add the garment

        onAddGarment({
            name,
            category: newCategory,
            imageUrl: newImageUrl,
        });
        
        setNewName("");
        setNewCategory("top");
        setNewImageUrl("");
        setImageError("");

        if (photoInputRef.current) {
            photoInputRef.current.value = ""; // Reset the file input
        }
    }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <label htmlFor="garment-name">Garment name</label>
      <input
        type="text"
        id="garment-name"
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
        placeholder="e.g. Blue sweater"
        required
      />

      <label htmlFor="garment-category">Category</label>
      <select
        id="garment-category"
        value={newCategory}
        onChange={(event) => {
          const value = event.target.value;

          if (value === "top" || value === "bottom" || value === "shoes") {
            setNewCategory(value);
          }
        }}
      >
        <option value="top">Top</option>
        <option value="bottom">Bottom</option>
        <option value="shoes">Shoes</option>
      </select>

      <label htmlFor="garment-photo">Clothing photo</label>
      <input
        ref={photoInputRef}
        id="garment-photo"
        type="file"
        accept="image/jpeg, image/png, image/webp"
        onChange={handleImageChange}
      />
      {imageError && <p role="alert">{imageError}</p>}
      {newImageUrl && (
        <img
          src={newImageUrl}
          alt="Selected clothing preview"
          width={180}
          height={180}
          style={{ objectFit: "contain" }}
        />
      )}

      <button type="submit">Add Garment</button>
      <p>You're adding: {newName}</p>
    </form>
  );
}