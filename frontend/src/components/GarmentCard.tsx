import type { Garment } from "../types/garment";

type GarmentCardProps = {
  garment: Garment;
};

export default function GarmentCard({ garment }: GarmentCardProps) {
  return (
    <article className="garment-card">
      {garment.imageUrl ? (
        <img
          src={garment.imageUrl}
          alt={garment.name}
          width={180}
          height={180}
        />
      ) : (
        <p>No image available</p>
      )}

      <h2>{garment.name}</h2>
      <p>{garment.category}</p>
    </article>
  );
}