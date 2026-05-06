import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  //login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Logged in successfully");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMessage("Logged out");
    window.location.reload(); 
  };

  const handlePfpSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/users/update-pfp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pfpLink: form.pfpLink,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Profile picture updated");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  const handleKitSubmit = async (e) => {
    e.preventDefault();

    if (!form.kitName || !form.kitImageLink) {
      setMessage("Both kit name and image link are required");
      return;
    }    

    try {
      const res = await fetch("http://localhost:5000/users/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          kitName: form.kitName,
          kitImageLink: form.kitImageLink,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Post made successfully");
        setForm((prev) => ({
          ...prev,
          kitName: "",
          kitImageLink: "",
        }));
      } else {
        setMessage(data.message || "Failed to make post");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  //logout 
  if (token) {
    return (
      <div className="font-bold text-center mt-50">
        {/*pfp image*/}
        <h1 className="text-4xl font-serif mt-6">Profile Pic Link</h1>
        <form onSubmit={handlePfpSubmit}>
          <input
            type="text"
            name="pfpLink"
            value={form.pfpLink || ""}
            onChange={handleChange}
            placeholder="Profile Pic Link"
            className="block mx-auto mt-5 w-[20%] border-3 bg-gray-300 rounded-xl p-2"
          />
        </form>

        {/*post kit pic*/}
        <h1 className="text-4xl font-serif mt-20">Create New Post</h1>
        <form onSubmit={handleKitSubmit}>
          <input
            type="text"
            name="kitImageLink"
            value={form.kitImageLink || ""}
            onChange={handleChange}
            placeholder="Kit Image Link"
            className="block mx-auto mt-5 w-[20%] border-3 bg-gray-300 rounded-xl p-2"
          />
          <input
            type="text"
            name="kitName"
            value={form.kitName || ""}
            onChange={handleChange}
            placeholder="Kit Name"
            className="block mx-auto mt-5 w-[20%] border-3 bg-gray-300 rounded-xl p-2"
          />

          <button
            className="bg-blue-800 border text-white rounded-xl p-2 hover:bg-blue-900 w-96 mt-5"
            type="submit"
          >
            Post Kit
          </button>
        </form>

        {message && (
          <p className="mt-10 text-xl text-blue-500 font-semibold">{message}</p>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-800 border text-white rounded-xl p-2 hover:bg-red-900 w-96 mt-25"
        >
          Log Out
        </button>
      </div>
    );
  }

  //usual login
  return (
    <div className="font-bold">
      <h1 className="text-center text-4xl p-4 font-serif pb-8">Log In</h1>
      <div id="login_block" className="flex justify-center mt-20">
        <form
          onSubmit={handleSubmit}
          className="p-4 flex flex-col gap-2 max-w-sm font-sans"
        >
          <label className="text-2xl" htmlFor="email">
            Enter your email:
          </label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded-lg p-2 bg-gray-300 w-96 mb-3"
          />

          <label className="text-2xl" htmlFor="password">
            Enter your password:
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="border rounded-lg p-2 bg-gray-300 w-96 mb-3"
          />

          {message && (
            <p className="mb-1 text-center text-xl text-blue-500 font-semibold">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-800 border text-white rounded-xl p-2 hover:bg-blue-900 w-96"
          >
            Log In
          </button>

          <h1>Make an account?</h1>
          <Link
            to="/signup"
            className="bg-gray-700 border text-white rounded-xl p-2 hover:bg-gray-900 text-center w-96"
          >
            Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
