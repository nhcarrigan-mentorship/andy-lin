import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div
      id="NavBar"
      className="sticky top-0 bg-gray-700 flex font-bold text-2xl pl-4 font-serif z-50"
    >
      <img src="/logo.png" className="h-10 my-auto" />
      <h1 className="my-auto text-3xl">Gunpla Collection</h1>
      <div className="flex gap-8 ml-auto p-2 pr-4">
        <Link to="/" className="hover:text-blue-900 px-3 py-1 text-3xl">
          Kits
        </Link>
        <Link
          to="/collection"
          className="hover:text-blue-900 px-3 py-1 text-3xl"
        >
          Collection
        </Link>
        <Link
          to="/profile"
          className="hover:text-blue-900 px-3 py-1 text-3xl"
        >
          Profile
        </Link>
        <Link to="/login" className="hover:text-blue-900 px-3 py-1 text-3xl">
          Log In
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
