import { useState, useEffect } from 'react';
import axios from "axios";
import StatusFilter from "./StatusFilter";
import LoadingSpinner from "./LoadingSpinner";

const URL = import.meta.env.VITE_API_BASE_URL;

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL);
      setBlogs(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const toggleExpand = (articleId) => {
    setExpanded(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
  };

  const filteredBlogs = filter === "all" ? blogs : blogs.filter(blog => (blog.status || "pending").toLowerCase() === filter);

  return (
    <>
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex items-center mt-15 justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Client Blogs</h2>
          <StatusFilter filter={filter} setFilter={setFilter} />
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-blue-600 py-8"><LoadingSpinner /></div>
          ) : Array.isArray(filteredBlogs) && filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, idx) => (
              <div key={idx}>
                <div className="bg-white p-4 rounded shadow relative">
                  <h3 className="text-lg font-bold text-blue-800">{blog.title || `Blog #${idx + 1}`}</h3>
                  <p className="text-gray-700 mt-2">
                    Article ID: {blog.article_id}<br />
                    Client ID: {blog.client_id}<br />
                    Submitted At: {blog.submitted_at}<br />
                    Status: {blog.status}
                  </p>
                  <button
                    className="absolute right-2 bottom-2 text-blue-600 hover:underline text-sm"
                    onClick={() => toggleExpand(blog.article_id)}>
                    {expanded[blog.article_id] ? "Hide" : "View More"}
                  </button>
                </div>
                {expanded[blog.article_id] && (
                  <div className="bg-gray-100 px-4 py-2 rounded-b shadow-inner text-gray-800">
                    <strong>Description:</strong>
                    <div className="whitespace-pre-line mt-1">{blog.content || "No description available."}</div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No blogs available.</p>
          )}
        </div>
      </div>
    </>
  );
}
export default Home;