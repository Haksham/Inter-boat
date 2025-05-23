import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineDelete } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import StatusFilter from "./StatusFilter";
import LoadingSpinner from "./LoadingSpinner";
const URL = import.meta.env.VITE_API_BASE_URL;

function Host() {
  const [blogs, setBlogs] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${URL}/me`, { withCredentials: true })
      .then(res => {
        if (res.data.role !== "host") {
          navigate("/login");
        } else {
          fetchBlogs();
        }
      })
      .catch(() => navigate("/login"));
    // eslint-disable-next-line
  }, [navigate]);

  const toggleExpand = (articleId) => {
    setExpanded(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${URL}/`, { withCredentials: true });
      setBlogs(response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (articleId, value) => {
    setStatusUpdates(prev => ({
      ...prev,
      [articleId]: value
    }));
  };

  const handleSave = async (articleId) => {
    try {
      await axios.post(`${URL}/host/update-status`, {
        article_id: articleId,
        status: statusUpdates[articleId] || "pending"
      },
        { withCredentials: true });
      fetchBlogs();
    } catch (err) { alert("Failed to update status"); }
  };

  const handleDelete = async (articleId) => {
    try {
      await axios.post(`${URL}/delete-article`, {
        article_id: articleId
      },
        { withCredentials: true });
      fetchBlogs();
    } catch (err) { alert("Failed to delete article"); }
  };

  const filteredBlogs = filter === "all" ? blogs : blogs.filter(blog => (blog.status || "pending").toLowerCase() === filter);

  return (
    <>
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex items-center my-15 justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Client Blogs</h2>
          <StatusFilter filter={filter} setFilter={setFilter} />
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-blue-600 py-8"><LoadingSpinner /></div>
          ) : Array.isArray(filteredBlogs) && filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, idx) => (
              <div key={idx}>
                <div className="bg-white p-3 rounded shadow flex items-center justify-between relative">
                  {/* Blog details */}
                  <div>
                    <h3 className="text-lg font-bold text-blue-800">{blog.title || `Blog #${idx + 1}`}</h3>
                    <p className="text-gray-700 mt-2">
                      Article ID: {blog.article_id}<br />
                      Client ID: {blog.client_id}<br />
                      Submitted At: {blog.submitted_at}<br />
                      Status: {blog.status}
                    </p>
                  </div>
                  {/* Select and Save/Delete buttons on the right */}
                  <div className="flex flex-col items-center">
                    <select
                      className="border rounded px-2 py-1 mb-2"
                      value={statusUpdates[blog.article_id] || blog.status || "pending"}
                      onChange={e => handleStatusChange(blog.article_id, e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => handleSave(blog.article_id)}>
                      <SiTicktick />
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 my-1 rounded hover:bg-blue-700"
                      onClick={() => handleDelete(blog.article_id)}>
                      <MdOutlineDelete />
                    </button>
                  </div>
                  {/* View More Button on bottom right */}
                  <button
                    className="absolute right-2 bottom-2 text-blue-600 hover:underline text-sm"
                    onClick={() => toggleExpand(blog.article_id)}>
                    {expanded[blog.article_id] ? "Hide" : "View More"}
                  </button>
                </div>
                {/* Article description/content, shown if expanded */}
                {expanded[blog.article_id] && (
                  <div className="bg-gray-100 px-4 py-2 rounded-b shadow-inner text-gray-800">
                    <strong>Description:</strong>
                    <div className="whitespace-pre-line mt-1">{blog.content || "No description available."}</div>
                  </div>)}
              </div>
            ))) : (<p className="text-gray-500">No blogs available.</p>)}
        </div>
      </div>
    </>
  );
}
export default Host;