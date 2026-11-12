import { useState } from 'react'
import { set } from "idb-keyval"
import './App.css'

import type { Garment, CategoryFilter, NewGarment } from "./types/garment";
import GarmentCard from "./components/GarmentCard";
import GarmentForm from './components/GarmentForm';

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
  const [garments, setGarments] = useState<Garment[]>(initialGarments);

  // selecetedCategory is a state variable that holds the currently selected category filter. 
  // It is initialized to "all", meaning that by default, all garments will be displayed. 
  // setSelectedCategory function is used to update this state variable when a user selects a different category filter.
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");

  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredGarments = garments.filter(garment => selectedCategory === "all" || garment.category === selectedCategory);

  function addGarment(newGarment: NewGarment) {
    setGarments((currentGarments) => [
      ...currentGarments,
      {
        id: Math.max(0, ...currentGarments.map((item) => item.id)) + 1,
        ...newGarment,
      }
    ]);

    setSelectedCategory("all"); // Reset the category filter to "all" after adding a new garment
    setSaveMessage(""); // Clear any previous save message when a new garment is added
  }

  async function saveWardrobe() {
    setIsSaving(true);
    setSaveMessage("");

    try {
      await set("wardrobe", garments);
      setSaveMessage("Wardrobe saved successfully!");
    } catch (error) {
      console.error("Error saving wardrobe:", error);
      setSaveMessage("Failed to save wardrobe.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main>
      <h1>My Wardrobe</h1>
      <p>{filteredGarments.length} of {garments.length} items</p>

      <button type="button" onClick={saveWardrobe} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Wardrobe"}
      </button>
      
      <p role="status">{saveMessage}</p>

      <GarmentForm onAddGarment={addGarment} />

      <div className="category-filters">
        <button type = "button" onClick={() => setSelectedCategory("all")} aria-pressed={selectedCategory === "all"}>All</button>
        <button type = "button" onClick={() => setSelectedCategory("top")} aria-pressed={selectedCategory === "top"}>Tops</button>
        <button type = "button" onClick={() => setSelectedCategory("bottom")} aria-pressed={selectedCategory === "bottom"}>Bottoms</button>
        <button type = "button" onClick={() => setSelectedCategory("shoes")} aria-pressed={selectedCategory === "shoes"}>Shoes</button>
      </div>

      <div className="wardrobe-grid">
      {filteredGarments.map((item) => (
        <GarmentCard key={item.id} garment={item} />
      ))}  
    </div>
    </main>
  )
}

export default App
