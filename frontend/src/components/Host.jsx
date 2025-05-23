import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdOutlineDelete } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import StatusFilter from "./StatusFilter";
import LoadingSpinner from "./LoadingSpinner";
const URL = import.meta.env.VITE_API_BASE_URL;

function Host() {
  const [statusUpdates, setStatusUpdates] = useState({});
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch blogs with React Query
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      // Check session/role before fetching
      const session = await axios.get(`${URL}/me`, { withCredentials: true });
      if (session.data.role !== "host") {
        navigate("/login");
        return [];
      }
      const response = await axios.get(`${URL}/`, { withCredentials: true });
      return response.data;
    }
  });

  // Mutations for status update and delete
  const updateStatusMutation = useMutation({
    mutationFn: async ({ article_id, status }) => {
      await axios.post(`${URL}/host/update-status`, {
        article_id,
        status
      }, { withCredentials: true });
    },
    onSuccess: () => queryClient.invalidateQueries(['blogs'])
  });

  const deleteMutation = useMutation({
    mutationFn: async (article_id) => {
      await axios.post(`${URL}/delete-article`, { article_id }, { withCredentials: true });
    },
    onSuccess: () => queryClient.invalidateQueries(['blogs'])
  });

  const toggleExpand = (articleId) => {
    setExpanded(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
  };

  const handleStatusChange = (articleId, value) => {
    setStatusUpdates(prev => ({
      ...prev,
      [articleId]: value
    }));
  };

  const handleSave = (articleId) => {
    updateStatusMutation.mutate({
      article_id: articleId,
      status: statusUpdates[articleId] || "pending"
    });
  };

  const handleDelete = (articleId) => {
    deleteMutation.mutate(articleId);
  };

  const filteredBlogs = filter === "all"
    ? blogs
    : blogs.filter(blog => (blog.status || "pending").toLowerCase() === filter);

  return (
    <>
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex items-center my-15 justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Client Blogs</h2>
          <StatusFilter filter={filter} setFilter={setFilter} />
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center text-blue-600 py-8"><LoadingSpinner /></div>
          ) : Array.isArray(filteredBlogs) && filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, idx) => (
              <div key={idx}>
                <div className="bg-white p-3 rounded shadow flex items-center justify-between relative">
                  <div>
                    <h3 className="text-lg font-bold text-blue-800">{blog.title || `Blog #${idx + 1}`}</h3>
                    <p className="text-gray-700 mt-2">
                      Article ID: {blog.article_id}<br />
                      Client ID: {blog.client_id}<br />
                      Submitted At: {blog.submitted_at}<br />
                      Status: {blog.status}
                    </p>
                  </div>
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
                      onClick={() => handleSave(blog.article_id)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SiTicktick />
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 my-1 rounded hover:bg-blue-700"
                      onClick={() => handleDelete(blog.article_id)}
                      disabled={deleteMutation.isPending}
                    >
                      <MdOutlineDelete />
                    </button>
                  </div>
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
export default Host;