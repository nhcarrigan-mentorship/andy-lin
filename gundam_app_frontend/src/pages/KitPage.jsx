import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function KitPage() {
  const { kitId } = useParams();
  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("Kit ID:", kitId);
    if (!kitId) return;

    const fetchKit = async () => {
      try {
        console.log("Fetching kit with ID:", kitId);
        const response = await fetch(`http://localhost:5000/kits/${kitId}`);
        if (!response.ok) throw new Error("Kit not found");
        const data = await response.json();
        setKit(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchKit();
  }, [kitId]);

  if (loading) return <div className="p-4">Loading kit info...</div>;
  if (error || !kit) return <div className="p-4">Kit not found.</div>;

  return (
    <div className="font-bold flex p-4">
      <div className="w-1/2 mx-auto">
        <h1 className="text-3xl font-bold">{kit.name}</h1>
        <p className="text-gray-900 mb-4">
          {kit.grade} | {kit.series}
        </p>
        <img
          src={kit.imageUrl}
          alt={kit.name}
          className="h-[50vh] w-auto object-contain"
        />
        <p className="mt-4">Release Year: {kit.releaseYear}</p>
        <p>Kit Number: {kit.kitNumber}</p>
      </div>

      <div className="w-1/2 border border-3 rounded-lg h-[80vh] flex flex-col justify-center items-center">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Rating:</h2>
          <p>{kit.kitRating ?? "No rating yet"}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Instructions:</h2>
          {kit.instructionsUrl ? (
            <a
              href={kit.instructionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Instructions
            </a>
          ) : (
            <p>No instructions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
