import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();

  const [status, setStatus] = useState("loading");
  const [profileUser, setProfileUser] = useState(null);
  const [userKits, setUserKits] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = async () => {
    const token = localStorage.getItem("token");
    setStatus("loading");

    try {
      let userData;
      let kitsData = [];

      if (username) {
        const res = await fetch(`http://localhost:5000/users/${username}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "User not found");
        }

        userData = data;
      } else {
        if (!token) {
          throw new Error("No token found");
        }

        const [userRes, kitsRes] = await Promise.all([
          fetch("http://localhost:5000/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:5000/api/userkits", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const userDataJson = await userRes.json();
        const kitsDataJson = await kitsRes.json();

        if (!userRes.ok) {
          throw new Error("Failed to fetch user");
        }

        if (!kitsRes.ok) {
          throw new Error("Failed to fetch kits");
        }

        userData = userDataJson;
        kitsData = kitsDataJson;
      }

      setProfileUser(userData);
      setUserKits(kitsData);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err.message);
      setProfileUser(null);
      setUserKits([]);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadData();
  }, [username]);

  if (status === "loading") {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (status === "error") {
    return (
      <div className="p-4 text-center">
        <p>{errorMessage}</p>
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
        src={profileUser.pfpLink || "/default-pfp.png"}
        alt="Profile"
        className="mx-auto rounded-full object-cover h-50 w-50 border-3"
      />

      <h1 className="text-center pt-2 text-3xl">{profileUser.username}</h1>

      <h2 className="text-center text-xl">{completedCount} Kits Built</h2>

      <h2 className="text-center text-xl pb-2">
        {backlogCount} Kits Backloged
      </h2>

      <button
        className="block mx-auto border-2 p-2 w-50 rounded-lg bg-green-700 text-white"
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
