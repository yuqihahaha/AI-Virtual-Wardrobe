import { useRef, useState } from 'react'
import './App.css'

type Garment = {
  id: number;
  name: string;
  category: "top" | "bottom" | "shoes";
  imageUrl: string
}

type CategoryFilter = "all" | Garment["category"];

const initialGarments: Garment[] = [
  {
    id: 1,
    name: "white T-shirt",
    category: "top",
    imageUrl: "/images/white-tshirt.jpeg",
  },
  {
    id: 2,
    name: "skirt",
    category: "bottom",
    imageUrl: "/images/skirt.png",
  },
  {
    id: 3,
    name: "boots",
    category: "shoes",
    imageUrl: "/images/boots.jpeg",
  }
];

function App() {
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  const [garments, setGarments] = useState<Garment[]>(initialGarments);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Garment["category"]>("top");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [imageError, setImageError] = useState("");

  // selecetedCategory is a state variable that holds the currently selected category filter. 
  // It is initialized to "all", meaning that by default, all garments will be displayed. 
  // setSelectedCategory function is used to update this state variable when a user selects a different category filter.
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const filteredGarments = garments.filter(garment => selectedCategory === "all" || garment.category === selectedCategory);

  function addGarment() {
    const name = newName.trim();
    if (!name) return;

    if (photoInputRef.current?.files?.length && !newImageUrl) return; // If a file is selected but newImageUrl is empty, do not add the garment

    setGarments((currentGarments) => [
      ...currentGarments,
      {
        id: Math.max(0, ...currentGarments.map((item) => item.id)) + 1, 
        name,
        category: newCategory,
        imageUrl: newImageUrl,
      }
    ]);

    setNewName("");
    setNewImageUrl("");
    setImageError("");
    setNewCategory("top");
    setSelectedCategory("all");

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  }

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

  return (
    <main>
      <h1>My Wardrobe</h1>
      <p>{filteredGarments.length} of {garments.length} items</p>

      {/* event.preventDefault() prevents submission from reloading the page */}
      {/* onChange updates state whenever you type */}  

      <form onSubmit={(event) => { 
        event.preventDefault();
        addGarment();
      }}>
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
        {newImageUrl && <img src={newImageUrl} alt="Selected clothing preview" width={180} height={180} style={{ objectFit: "contain" }} />}  

        <button type="submit">Add Garment</button>
        <p>You're adding: {newName}</p>
      </form>

      <div className="category-filters">
        <button type = "button" onClick={() => setSelectedCategory("all")} aria-pressed={selectedCategory === "all"}>All</button>
        <button type = "button" onClick={() => setSelectedCategory("top")} aria-pressed={selectedCategory === "top"}>Tops</button>
        <button type = "button" onClick={() => setSelectedCategory("bottom")} aria-pressed={selectedCategory === "bottom"}>Bottoms</button>
        <button type = "button" onClick={() => setSelectedCategory("shoes")} aria-pressed={selectedCategory === "shoes"}>Shoes</button>
      </div>

      <div className="wardrobe-grid">
      {filteredGarments.map(garment => (
        <article className="garment-card" key={garment.id}>
          {garment.imageUrl ? ( 
            <img src={garment.imageUrl} alt={garment.name} width={180} height={180} style = {{ objectFit: "contain"}}/>
          ) : (
            <div className="placeholder-image">
              <p>No image available</p>
            </div>
          )}
          <h2>{garment.name}</h2>
          <p>{garment.category}</p>
        </article>
      ))}  
    </div>
    </main>
  )
}

export default App
