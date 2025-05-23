import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const URL=import.meta.env.VITE_API_BASE_URL;

function Add() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }
    try {
      await axios.post(`${URL}/client/${id}/add-article`,{
        client_id: id, title, content,
      }, { withCredentials: true } );
      navigate(`/client/${id}`);
    } catch (err) {setError("Failed to add article.");}
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Article</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required/>
        </div>
        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={content}
            onChange={e => setContent(e.target.value)}
            required/>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          Add Article
        </button>
      </form>
    </div>
);}
export default Add;