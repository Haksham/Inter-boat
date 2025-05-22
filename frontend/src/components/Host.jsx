import { useState, useEffect } from 'react';
import axios from "axios";

function Host() {
  const [blogs, setBlogs] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState("all");

  const toggleExpand = (articleId) => {
    setExpanded(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
  };

  const fetchBlogs = async () => {
    const response = await axios.get("http://localhost:8000/");
    setBlogs(response.data);
  };

  const handleStatusChange = (articleId, value) => {
    setStatusUpdates(prev => ({
      ...prev,
      [articleId]: value
    }));
  };

  const handleSave = async (articleId) => {
    try {
      await axios.post("http://localhost:8000/host/update-status", {
        article_id: articleId,
        status: statusUpdates[articleId] || "pending"
      });
      fetchBlogs();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (articleId) => {
    try {
      await axios.post("http://localhost:8000/delete-article", {
        article_id: articleId
      });
      fetchBlogs();
    } catch (err) {
      alert("Failed to delete article");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter blogs based on status
  const filteredBlogs = filter === "all"
    ? blogs
    : blogs.filter(blog => (blog.status || "pending").toLowerCase() === filter);

  return (
    <>
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Client Blogs</h2>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded ${filter === "accepted" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
              onClick={() => setFilter("accepted")}
            >
              Accepted
            </button>
            <button
              className={`px-3 py-1 rounded ${filter === "rejected" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
              onClick={() => setFilter("rejected")}
            >
              Rejected
            </button>
            <button
              className={`px-3 py-1 rounded ${filter === "pending" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {Array.isArray(filteredBlogs) && filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, idx) => (
              <div key={idx}>
                <div className="bg-white p-4 rounded shadow flex items-center justify-between relative">
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
                  <div className="mr-4 flex flex-col items-center">
                    <select
                      className="border rounded px-2 py-1 mb-2"
                      value={statusUpdates[blog.article_id] || blog.status || "pending"}
                      onChange={e => handleStatusChange(blog.article_id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => handleSave(blog.article_id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 my-1 rounded hover:bg-blue-700"
                      onClick={() => handleDelete(blog.article_id)}>
                      Delete
                    </button>
                  </div>
                  {/* View More Button on bottom right */}
                  <button
                    className="absolute right-2 bottom-2 text-blue-600 hover:underline text-sm"
                    onClick={() => toggleExpand(blog.article_id)}
                  >
                    {expanded[blog.article_id] ? "Hide" : "View More"}
                  </button>
                </div>
                {/* Article description/content, shown if expanded */}
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
export default Host;