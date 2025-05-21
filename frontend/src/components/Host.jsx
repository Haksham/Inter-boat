import { useState, useEffect } from 'react';
import axios from "axios";

function Host() {
  const [blogs, setBlogs] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

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
      await axios.post("http://localhost:8000/update-status", {
        article_id: articleId,
        status: statusUpdates[articleId] || "pending"
      });
      fetchBlogs(); // Refresh blogs after update
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (articleId) => {
    try {
      await axios.post("http://localhost:8000/delete-article", {
        article_id: articleId
      });
      fetchBlogs(); // Refresh blogs after delete
    } catch (err) {
      alert("Failed to delete article");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Client Blogs</h2>
        <div className="space-y-4">
          {Array.isArray(blogs) && blogs.length > 0 ? (
            blogs.map((blog, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow flex items-center justify-between">
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
                {/* Select and Save button on the left */}
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