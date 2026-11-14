import { useRef, useState } from "react";
import type { Garment, NewGarment } from "../types/garment";
import { useId } from "react";

type GarmentFormProps = {
  onAddGarment: (garment: NewGarment) => void | Promise<void>;
};

export default function GarmentForm({
  onAddGarment,
}: GarmentFormProps) {
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [newName, setNewName] = useState("");
    const [newCategory, setNewCategory] = useState<Garment["category"]>("top");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [imageError, setImageError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const formId = useId();

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

    async function handleSubmit() {
        const name = newName.trim();
        if (!name || isSubmitting) return;

        if (photoInputRef.current?.files?.length && !newImageUrl) return; // If a file is selected but newImageUrl is empty, do not add the garment

        setIsSubmitting(true);
        setSubmitError("");

        try {
            await onAddGarment({
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
        } catch {
            setSubmitError("Failed to add garment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
        <fieldset disabled={isSubmitting}>
      <label htmlFor={`${formId}-name`}>Garment name</label>
      <input
        type="text"
        id={`${formId}-name`}
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
        placeholder="e.g. Blue sweater"
        required
      />

      <label htmlFor={`${formId}-category`}>Category</label>
      <select
        id={`${formId}-category`}
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

      <label htmlFor={`${formId}-photo`}>Clothing photo</label>
      <input
        ref={photoInputRef}
        id={`${formId}-photo`}
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

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Garment"}
      </button>
      <p>You're adding: {newName}</p>
    </fieldset>
    {submitError && <p role="alert">{submitError}</p>}
    </form>
  );
}