import type { Garment, NewGarment } from "../types/garment";

export async function fetchGarments(): Promise<Garment[]> {
    const response = await fetch("http://127.0.0.1:8000/v1/garments", {
        signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as Garment[];
}

export async function createGarment(newGarment: NewGarment): Promise<Garment> {
    const response = await fetch("http://127.0.0.1:8000/v1/garments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newGarment),
    });

    if (!response.ok) {
        throw new Error(`Could not create garment: HTTP ${response.status}`);
    }

    const data = await response.json();
    return data as Garment;
}