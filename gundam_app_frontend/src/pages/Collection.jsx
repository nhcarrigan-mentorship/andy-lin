import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//import { kits } from "../userKits";

function Collection() {
  const [showCompleted, setShowCompleted] = useState(true);
  const [showBacklog, setShowBacklog] = useState(true);
  const [showWishlist, setShowWishlist] = useState(true);
  const [query, setQuery] = useState("");
  const [kits, setKits] = useState([]);

  //kit searching
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  //fetch from backend
  useEffect(() => {
    const fetchKits = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/userkits", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setKits(data)
        if (!res.ok) {
          console.error("FETCH ERROR:", data);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchKits();
  }, []);

 const handleBuildDateChange = async (kitId, date) => {
   try {
     await fetch(`http://localhost:5000/api/userkits/${kitId}`, {
       method: "PATCH",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${localStorage.getItem("token")}`,
       },
       body: JSON.stringify({
         buildDate: date,
       }),
     });

     setKits((prev) =>
       prev.map((k) => (k._id === kitId ? { ...k, buildDate: date } : k)),
     );
   } catch (err) {
     console.error(err);
   }
 };

 const filterKits = (status, isCompleted = false) =>
   (Array.isArray(kits) ? kits : [])
     .filter(
       (userKit) =>
         userKit.status === status &&
         userKit.kit?.name?.toLowerCase().includes(query.toLowerCase()),
     )
     .map((userKit) => (
       <li
         key={userKit._id}
         className="flex items-center justify-between gap-4 hover:text-blue-900"
       >
         <Link
           to={`/kits/${userKit.kit._id}`}
           className="hover:underline text-xl"
         >
           {userKit.kit?.name}
         </Link>

         {isCompleted && (
           <input
             type="date"
             value={userKit.buildDate ? userKit.buildDate.slice(0, 10) : ""}
             onChange={(e) =>
               handleBuildDateChange(userKit._id, e.target.value)
             }
             className="border bg-gray-300 rounded px-2 py-1"
           />
         )}
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
          className="flex items-center justify-between pl-4 pr-4 text-3xl underline bg-blue-800 font-serif cursor-pointer"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          <span>Completed</span>
          <span className="text-lg no-underline pr-10">Build Date</span>
        </h1>

        {showCompleted && (
          <div className="pl-8 bg-gray-500">
            <ul className="list-disc pl-8 text-2xl space-y-2">
              {filterKits("completed", true)}
            </ul>
          </div>
        )}
      </div>

      <div id="backlog" className="pb-4">
        <h1
          className="pl-4 text-3xl underline bg-yellow-800 font-serif cursor-pointer"
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
          className="pl-4 text-3xl underline bg-red-800 font-serif cursor-pointer"
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
