import { useEffect, useState } from 'react'
import './App.css'

import type { Garment, CategoryFilter, NewGarment, GarmentEdits } from "./types/garment";
import { loadGarments, saveGarments } from "./storage/wardrobeStorage";
import GarmentCard from "./components/GarmentCard";
import GarmentForm from './components/GarmentForm';
import CategoryFilters from './components/CategoryFilter';

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
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    let cancelled = false;

    async function restoreWardrobe() {
      try {
        const savedGarments = await loadGarments();

        if (!cancelled && savedGarments !== undefined) {
          setGarments(savedGarments);
        }
      } catch {
        if (!cancelled) {
          setLoadError("Failed to load wardrobe.");
        }
      } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      }

    restoreWardrobe();

    return () => {
      cancelled = true;
    };
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const filteredGarments = garments.filter(garment => {
    const matchesCategory = selectedCategory === "all" || garment.category === selectedCategory;
    const matchesSearch = garment.name.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  function addGarment(newGarment: NewGarment) {
    setGarments((currentGarments) => [
      ...currentGarments,
      {
        id: Math.max(0, ...currentGarments.map((item) => item.id)) + 1,
        ...newGarment,
      }
    ]);

    setSelectedCategory("all"); // Reset the category filter to "all" after adding a new garment
    setSearchQuery(""); // Clear the search query after adding a new garment
    setSaveMessage(""); // Clear any previous save message when a new garment is added
  }

  async function saveWardrobe() {
    setIsSaving(true);
    setSaveMessage("");

    try {
      await saveGarments(garments);
      setSaveMessage("Wardrobe saved successfully!");
    } catch (error) {
      console.error("Error saving wardrobe:", error);
      setSaveMessage("Failed to save wardrobe.");
    } finally {
      setIsSaving(false);
    }
  }

  function removeGarment(id: number) {
    setGarments((currentGarments) => currentGarments.filter((garment) => garment.id !== id));
    setSaveMessage("Garment removed. Save your wardrobe to persist changes.");
  }

  function updateGarment(id: number, edits: GarmentEdits) {
    setGarments((currentGarments) =>
      currentGarments.map((garment) =>
        garment.id === id ? { ...garment, ...edits } : garment
      )
    );
    setSaveMessage("Garment updated. Save your wardrobe to persist changes.");
  }

  if (isLoading) {
    return <p role="status">Loading wardrobe...</p>;
  }

  if (loadError) {
    return <p role="alert">{loadError}</p>;
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

      <label htmlFor="wardrobe-search">Search your wardrobes</label>
      <input
        id="wardrobe-search"
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name"
      />

      <CategoryFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {filteredGarments.length === 0 && (
        <p>
          {garments.length === 0 ? "Your wardrobe is empty. Add your first garment!" 
          : "No garments match your search and category."}
        </p>
      )}

      <div className="wardrobe-grid">
      {filteredGarments.map((item) => (
        <GarmentCard key={item.id} garment={item} onRemove={removeGarment} onUpdate={updateGarment} />
      ))}  
    </div>
    </main>
  )
}

export default App
