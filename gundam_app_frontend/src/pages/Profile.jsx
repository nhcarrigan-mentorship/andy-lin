import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();

  const [status, setStatus] = useState("loading");
  const [profileUser, setProfileUser] = useState(null);
  const [userKits, setUserKits] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [showCompleted, setShowCompleted] = useState(true);
  const [showBacklog, setShowBacklog] = useState(true);
  const [showWishlist, setShowWishlist] = useState(true);
  const [query, setQuery] = useState("");
  const [showCollection, setShowCollection] = useState(true);
  const [showPosts, setShowPosts] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  
  const loadData = async () => {
  const token = localStorage.getItem("token");
  setStatus("loading");

  try {
    let userData;
    let kitsData = [];

    if (username) {
      const [userRes, kitsRes] = await Promise.all([
        fetch(`http://localhost:5000/users/${username}`),
        fetch(`http://localhost:5000/api/userkits/${username}`),
      ]);

      const userDataJson = await userRes.json();
      const kitsDataJson = await kitsRes.json();

      if (!userRes.ok) {
        throw new Error(userDataJson.message || "User not found");
      }

      if (!kitsRes.ok) {
        throw new Error(kitsDataJson.message || "Failed to fetch user kits");
      }

      userData = userDataJson;
      kitsData = kitsDataJson;
    } else {
      if (!token) {
        throw new Error("Login to view your profile");
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

      const loggedInUserId = localStorage.getItem("userId");

      if (username && userData.followers?.includes(loggedInUserId)) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-700 text-white p-8 rounded-2xl shadow-lg text-center w-[400px]">
          <h1 className="text-3xl font-serif mb-4">Loading...</h1>
          <p className="text-lg">Fetching profile data</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-gray-700 text-white p-8 rounded-2xl shadow-lg text-center w-[450px] border">
          <p className="text-3xl">{errorMessage}</p>

          <button
            onClick={loadData}
            className="mt-6 px-6 py-2 rounded-xl bg-blue-700 hover:bg-blue-900 transition border text-xl"
          >
            Retry
          </button>
        </div>

        <div className="bg-gray-700 text-white p-8 rounded-2xl shadow-lg text-center w-[450px] border mt-10">
          <p className="text-3xl">Search for Users</p>

          <button
            onClick={() => navigate("/social")}
            className="mt-6 px-6 py-2 rounded-xl bg-blue-700 hover:bg-blue-900 transition border text-xl"
          >
            Social
          </button>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-700 text-white p-8 rounded-2xl shadow-lg text-center w-[400px]">
          <h1 className="text-3xl font-serif mb-4">User Not Found</h1>
          <p className="text-lg">This profile does not exist.</p>
        </div>
      </div>
    );
  }

  const completedCount = userKits.filter(
    (kit) => kit.status === "completed",
  ).length;

  const backlogCount = userKits.filter(
    (kit) => kit.status === "backlog",
  ).length;

  const filterKits = (status) =>
    userKits
      .filter(
        (userKit) =>
          userKit.status === status &&
          userKit.kit?.name?.toLowerCase().includes(query.toLowerCase()),
      )
      .map((userKit) => (
        <li key={userKit._id} className="hover:text-blue-900">
          <Link
            to={`/kits/${userKit.kit._id}`}
            className="hover:underline"
          >
            {userKit.kit?.name}
          </Link>
        </li>
      ));

  const isOwnProfile = !username;

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setFollowLoading(true);

      const res = await fetch(
        `http://localhost:5000/users/${profileUser._id}/follow`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to follow user");
      }

      setIsFollowing(data.following);
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="font-bold gap-2">
      <h1 className="text-center text-4xl p-4 font-serif pb-8 tracking-wide">
        Profile
      </h1>

      {/*user pfp*/}
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
        className="block mx-auto border-2 p-2 w-50 rounded-lg bg-green-700 text-white hover:bg-green-900"
        onClick={() => navigate("/social")}
      >
        Social
      </button>

      {!isOwnProfile && (
        <button
          onClick={handleFollowToggle}
          disabled={followLoading}
          className="block mx-auto border-2 p-2 w-50 rounded-lg bg-blue-700 text-white hover:bg-blue-900 mt-2"
        >
          {followLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      {/*user posts*/}
      <div id="profile_posts" className="pt-8 w-full">
        <h1
          className="w-full text-center text-3xl font-serif underline cursor-pointer bg-gray-700 p-3 hover:bg-gray-800 hover:text-blue-900 transition duration-100"
          onClick={() => setShowPosts(!showPosts)}
        >
          Posts
        </h1>

        {showPosts && (
          <div className="grid grid-cols-4 gap-8 p-4 pr-8 pl-8">
            {profileUser.kitImages?.map((item, index) => (
              <div
                key={index}
                className="p-2 border-5 rounded-2xl bg-gray-400 w75"
              >
                <img
                  src={item.imageUrl}
                  alt={item.kitName}
                  className="w-full rounded mx-auto"
                />

                <div className="text-center mt-2 text-2xl">{item.kitName}</div>
              </div>
            ))}
          </div>
        )}

        {/*user collection*/}
        <div id="profile_collection" className="pt-6 w-full">
          <h1
            className="w-full text-center text-3xl font-serif underline cursor-pointer bg-gray-700 p-3 hover:bg-gray-800 hover:text-blue-900 transition duration-100"
            onClick={() => setShowCollection(!showCollection)}
          >
            Collection
          </h1>

          {showCollection && (
            <>
              <form className="pt-6">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="block mx-auto w-1/4 border-3 bg-gray-300 rounded-xl p-2"
                />
              </form>

              <div id="completed" className="pb-4 pt-8">
                <h1
                  className="pl-4 text-3xl underline bg-blue-800 font-serif hover:bg-gray-800 hover:text-blue-900 transition duration-100"
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  Completed
                </h1>

                {showCompleted && (
                  <div className="pl-8 bg-gray-500">
                    <ul className="list-disc pl-8 text-2xl space-y-2">
                      {filterKits("completed")}
                    </ul>
                  </div>
                )}
              </div>

              <div id="backlog" className="pb-4">
                <h1
                  className="pl-4 text-3xl underline bg-yellow-800 font-serif hover:bg-gray-800 hover:text-blue-900 transition duration-100"
                  onClick={() => setShowBacklog(!showBacklog)}
                >
                  Backlog
                </h1>

                {showBacklog && (
                  <div className="pl-8 bg-gray-500">
                    <ul className="list-disc pl-8 text-2xl space-y-2">
                      {filterKits("backlog")}
                    </ul>
                  </div>
                )}
              </div>

              <div id="wishlist" className="pb-4">
                <h1
                  className="pl-4 text-3xl underline bg-red-800 font-serif hover:bg-gray-800 hover:text-blue-900 transition duration-100"
                  onClick={() => setShowWishlist(!showWishlist)}
                >
                  Wishlist
                </h1>

                {showWishlist && (
                  <div className="pl-8 bg-gray-500">
                    <ul className="list-disc pl-8 text-2xl space-y-2">
                      {filterKits("wishlist")}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
