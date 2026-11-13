import type { CategoryFilter } from "../types/garment";

type CategoryFilterProps = {
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
};

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="category-filters">
      <button type="button" onClick={() => onCategoryChange("all")} aria-pressed={selectedCategory === "all"}>All</button>
      <button type="button" onClick={() => onCategoryChange("top")} aria-pressed={selectedCategory === "top"}>Tops</button>
      <button type="button" onClick={() => onCategoryChange("bottom")} aria-pressed={selectedCategory === "bottom"}>Bottoms</button>
      <button type="button" onClick={() => onCategoryChange("shoes")} aria-pressed={selectedCategory === "shoes"}>Shoes</button>
    </div>
  );
}