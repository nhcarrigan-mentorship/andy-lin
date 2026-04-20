import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile({ user, currentUser }) {
  const navigate = useNavigate();

  if (!user) return <div className="p-4 text-center">User not found.</div>;

  const completedCount = user.kits.filter(
    (kit) => kit.status === "completed"
  ).length;

  const backlogCount = user.kits.filter(
    (kit) => kit.status === "backlog"
  ).length;

  const [following, setFollowing] = useState(false);

  const isCurrentUser = currentUser && user.id === currentUser.id;

  return (
    <div className="font-bold gap-2">
      {!isCurrentUser && (
        <button
          className="hover:underline text-2xl pt-4 pb-4 pl-4 hover:text-blue-800"
          onClick={() => navigate("/social")}
        >
          &larr; Back to Socials
        </button>
      )}

      {isCurrentUser && (
      <h1 className="text-center text-4xl p-4 font-serif pb-8">Profile</h1>
      )}

      <img
        src={user.profilePic}
        alt={`${user.username} Profile Pic`}
        className="mx-auto rounded-full object-cover h-50 w-50 border-3 text-white"
      />

      <h1 className="text-center pt-2 text-3xl">{user.username}</h1>

      <h2 className="text-center text-xl text-gray-900">
        {completedCount} Kits Built
      </h2>

      <h2 className="text-center text-xl text-gray-900 pb-2">
        {backlogCount} Kits Backloged
      </h2>

      {isCurrentUser ? (
        <button
          className="block mx-auto border-2 p-2 rounded-lg bg-green-600 hover:bg-green-700 w-40 text-white"
          onClick={() => navigate("/social")}
        >
          Social
        </button>
      ) : (
        <button
          className={`block mx-auto border-2 p-2 rounded-lg w-40 text-white ${
            following
              ? "bg-red-800 hover:bg-gray-800"
              : "bg-blue-800 hover:bg-gray-700"
          }`}
          onClick={() => setFollowing(!following)}
        >
          {following ? "Unfollow" : "Follow"}
        </button>
      )}

      <h1 className="text-center pt-6 text-xl">Uploaded photos</h1>
      <p className="text-center text-sm italic pb-2">
        *Pictures are not mine, just using for demo
      </p>

      <div className="flex flex-wrap justify-center gap-8 p-4">
        {user.uploadedImages.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center border-2 p-2 rounded hover:shadow-lg transition w-[45%] sm:w-[30%] md:w-[20%] bg-gray-400"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-auto object-contain mb-2"
            />
            <span className="text-center text-xl">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
