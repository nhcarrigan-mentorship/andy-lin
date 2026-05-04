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

    {/*user posts*/}
      <div id="profile_posts" className="pt-8 w-full">
        <h1
          className="w-full text-center text-3xl font-serif underline cursor-pointer bg-gray-700 p-3 hover:bg-gray-800 hover:text-blue-900 transition duration-100"
          onClick={() => setShowPosts(!showPosts)}
        >
          Posts
        </h1>
        
        <div className="flex flex-wrap justify-center gap-8 p-4">
          {profileUser.uploadedImages?.map((item, index) => (
            <div key={index} className="p-2 border-2 rounded">
              <img src={item.image} alt={item.name} />
              <div className="text-center">{item.name}</div>
            </div>
          ))}
        </div>

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
