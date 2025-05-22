import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    try{
      const response = await axios.post("http://localhost:8000/createClient", { username, password });
      if (response.data.success && response.data.role === "client") {
        navigate(`/login`);
      } else {
        setError("Invalid credentials or unknown role.");
      }
    }catch(err) {setError("Invalid credentials.");}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"/>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"/>
          </div>
          {error && (<div className="text-red-600 font-medium text-center">{error}</div>)}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold text-lg">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">Login in here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;