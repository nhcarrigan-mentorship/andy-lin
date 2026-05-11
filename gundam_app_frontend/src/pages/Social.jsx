import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Social() {
  const [query, setQuery] = useState(""); 
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 font-bold">
      <h1 className="text-4xl text-center pb-8">Social</h1>

      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="block mx-auto w-1/4 border-3 bg-gray-300 rounded-xl p-2 mb-6"
        />
      </form>

      <div className="flex flex-wrap justify-center gap-6 pt-1">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.username}`}
              className="flex flex-col items-center border-4 p-4 rounded-lg w-75 bg-gray-400 transition duration-300 hover:bg-gray-800 group"
            >
              <img
                src={user.pfpLink || "/default-pfp.png" }
                alt={user.username}
                className="w-30 h-30 rounded-full object-cover mb-2 border-2 text-white transition duration-300 group-hover:brightness-50"
              />
              <span className="text-xl font-semibold">{user.username}</span>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-800 text-lg mt-4 w-full">
            No users match your search.
          </p>
        )}
      </div>
    </div>
  );
}
