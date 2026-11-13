import { get, set } from "idb-keyval";
import type { Garment } from "../types/garment";

const STORAGE_KEY = "wardrobe";

export function saveGarments(garments: Garment[]) {
    return set(STORAGE_KEY, garments);
}

export function loadGarments() {
    return get<Garment[]>(STORAGE_KEY);
}