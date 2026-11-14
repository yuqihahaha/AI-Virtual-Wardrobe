import { useState } from 'react';
import type { Garment, NewGarment } from '../types/garment';
import { fetchGarments } from '../api/garments';
import { createGarment } from '../api/garments';
import GarmentForm from './GarmentForm';

export default function BackendGarments() {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  async function loadGarments() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchGarments();
      setGarments(result);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load garments.");
    } finally {
      setIsLoading(false);
    }
  }

  async function addBackendGarment(newGarment: NewGarment) {
    await createGarment(newGarment);
    await loadGarments();
  }

  return (
    <section>
        <h2>Backend garments preview</h2>

        <GarmentForm onAddGarment={addBackendGarment} />

        <button type="button" onClick={loadGarments} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load Garments from Backend"}
        </button>

        {error && <p role="alert">{error}</p>}

        <ul>
            {garments.map((garment) => (
                <li key={garment.id}>
                    {garment.name} - {garment.category}
                </li>
            ))}
        </ul>

        {hasLoaded && garments.length === 0 && (
            <p>The backend returned no garments.</p>
        )}
    </section>
  );
}