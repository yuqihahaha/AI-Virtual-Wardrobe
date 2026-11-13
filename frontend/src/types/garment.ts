export type Garment = {
  id: number;
  name: string;
  category: "top" | "bottom" | "shoes";
  imageUrl: string;
};

export type CategoryFilter = "all" | Garment["category"];

export type NewGarment = Omit<Garment, "id">;

export type GarmentEdits = Pick<Garment, "name" | "category">;

