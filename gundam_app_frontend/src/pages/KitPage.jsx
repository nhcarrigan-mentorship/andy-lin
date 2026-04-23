import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function KitPage() {
  const { kitId } = useParams();
  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // console.log("Kit ID:", kitId);
    if (!kitId) return;

    const fetchKit = async () => {
      try {
        // console.log("Fetching kit with ID:", kitId);
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

async function addToCollection(kitId, status) {
  try {
    // console.log("=== ADD TO COLLECTION START ===");
    // console.log("Kit ID:", kitId);
    // console.log("Status:", status);

    const token = localStorage.getItem("token");
    
    if (!token) {
      setMessage("You must be logged in.");
      return;
    }        

    const res = await fetch("http://localhost:5000/api/userkits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ kitId, status }),
    });

    const contentType = res.headers.get("content-type");

    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = text;
    }

    console.log("Response data:", data);

    if (!res.ok) {
      throw new Error(
        data?.error || `Request failed with status ${res.status}`,
      );
    }

    setMessage("Kit Added Successfully");

    // console.log("=== ADD TO COLLECTION SUCCESS ===");
  } catch (err) {
    console.error("ADD TO COLLECTION ERROR");
    console.error(err);
    setMessage(err.message);
  }
}

async function removeFromCollection(kitId) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must be logged in.");
      return;
    }

    const res = await fetch(`http://localhost:5000/api/userkits/${kitId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to remove");
    }

    setMessage("Kit Removed Successfully");
  } catch (err) {
    console.error(err);
    setMessage(err.message);
  }
}

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

      <div className="my-auto column p-2 flex flex-col mr-20">
        <button
          onClick={() => addToCollection(kit._id, "wishlist")}
          className="border border-2 rounded-xl bg-blue-800 text-white p-2 w-50 hover:bg-blue-900 mb-3"
        >
          Add to Wishlist
        </button>

        <button
          onClick={() => addToCollection(kit._id, "backlog")}
          className="border border-2 rounded-xl bg-blue-800 text-white p-2 w-50 hover:bg-blue-900 mb-3"
        >
          Add to Backlog
        </button>

        <button
          onClick={() => addToCollection(kit._id, "completed")}
          className="border border-2 rounded-xl bg-blue-800 text-white p-2 w-50 hover:bg-blue-900 mb-3"
        >
          Add to Completed
        </button>

        <button
          onClick={() => removeFromCollection(kit._id)}
          className="border border-2 rounded-xl bg-red-800 text-white p-2 w-50 hover:bg-red-900"
        >
          Remove Kit
        </button>

        {message && <p className="mt-3 text-white text-l">{message}</p>}
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
