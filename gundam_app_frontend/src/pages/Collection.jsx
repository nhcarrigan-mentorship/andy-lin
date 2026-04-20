import { useState } from "react";
import { kits } from "../userKits";

function Collection() {
  const [showCompleted, setShowCompleted] = useState(true);
  const [showBacklog, setShowBacklog] = useState(true);
  const [showWishlist, setShowWishlist] = useState(true);
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const filterKits = (status) =>
    kits
      .filter(
        (kit) =>
          kit.status === status &&
          kit.name.toLowerCase().includes(query.toLowerCase())
      )
      .map((kit, index) => (
        <li key={index} className="hover:text-white">
          {kit.name}
        </li>
      ));

  return (
    <div className="font-bold gap-2">
      <h1 className="text-center text-4xl p-4 font-serif pb-8">Collection</h1>

      <form>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          className="block mx-auto w-1/4 border-3 bg-gray-300 rounded-xl p-2"
        />
      </form>

      <div id="completed" className="pb-4 pt-8">
        <h1
          className="pl-4 text-3xl underline bg-blue-700 font-serif cursor-pointer"
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
          className="pl-4 text-3xl underline bg-yellow-700 font-serif cursor-pointer"
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
          className="pl-4 text-3xl underline bg-red-700 font-serif cursor-pointer"
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
    </div>
  );
}

export default Collection;
