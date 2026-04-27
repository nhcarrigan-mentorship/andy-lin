import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [userKits, setUserKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUser = async (token) => {
    const res = await fetch("http://localhost:5000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    return await res.json();
  };

  const fetchUserKits = async (token) => {
    const res = await fetch("http://localhost:5000/api/userkits", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user kits");
    }

    return await res.json();
  };

  const loadData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [userData, kitsData] = await Promise.all([
        fetchUser(token),
        fetchUserKits(token),
      ]);

      setProfileUser(userData);
      setUserKits(kitsData);
    } catch (err) {
      console.error(err);
      setError("Something went wrong loading profile");
      setProfileUser(null);
      setUserKits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p>{error}</p>
        <button className="mt-4 underline text-blue-600" onClick={loadData}>
          Retry
        </button>
      </div>
    );
  }

  if (!profileUser) {
    return <div className="p-4 text-center">User not found</div>;
  }

  const completedCount = userKits.filter(
    (kit) => kit.status === "completed",
  ).length;

  const backlogCount = userKits.filter(
    (kit) => kit.status === "backlog",
  ).length;

  return (
    <div className="font-bold gap-2">
      <h1 className="text-center text-4xl p-4 font-serif pb-8">Profile</h1>

      <img
        src={profileUser.profilePic}
        alt="Profile"
        className="mx-auto rounded-full object-cover h-50 w-50 border-3"
      />

      <h1 className="text-center pt-2 text-3xl">{profileUser.username}</h1>

      <h2 className="text-center text-xl">{completedCount} Kits Built</h2>

      <h2 className="text-center text-xl pb-2">
        {backlogCount} Kits Backloged
      </h2>

      <button
        className="block mx-auto border-2 p-2 rounded-lg bg-green-700 text-white"
        onClick={() => navigate("/social")}
      >
        Social
      </button>

      <div className="flex flex-wrap justify-center gap-8 p-4">
        {profileUser.uploadedImages?.map((item, index) => (
          <div key={index} className="p-2 border-2 rounded">
            <img src={item.image} alt={item.name} />
            <div className="text-center">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
