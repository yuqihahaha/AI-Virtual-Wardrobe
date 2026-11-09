import { useState } from 'react'
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
  const [garments, setGarments] = useState<Garment[]>(initialGarments);
  const [newName, setNewName] = useState("");
  // selecetedCategory is a state variable that holds the currently selected category filter. 
  // It is initialized to "all", meaning that by default, all garments will be displayed. 
  // setSelectedCategory function is used to update this state variable when a user selects a different category filter.
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const filteredGarments = garments.filter(garment => selectedCategory === "all" || garment.category === selectedCategory);

  return (
    <main>
      <h1>My Wardrobe</h1>
      <p>{filteredGarments.length} of {garments.length} items</p>

      {/* event.preventDefault() prevents submission from reloading the page */}
      {/* onChange updates state whenever you type */}  

      <form onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="garment-name">Garment name</label>
        <input
          type="text"
          id="garment-name"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="e.g. Blue sweater"
          required
        />
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
          <img src={garment.imageUrl} alt={garment.name} width={180} height={180} style = {{ objectFit: "contain"}}/>
          <h2>{garment.name}</h2>
          <p>{garment.category}</p>
        </article>
      ))}  
    </div>
    </main>
  )
}

export default App
