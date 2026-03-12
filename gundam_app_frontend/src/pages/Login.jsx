import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const [message, setMessage] = useState("")

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

      setMessage(data.message);
    } catch (err) {
      setMessage("Server error");
    }
  };


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
