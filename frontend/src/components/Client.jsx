import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import StatusFilter from "./StatusFilter";
const URL = import.meta.env.VITE_API_BASE_URL;
import LoadingSpinner from "./LoadingSpinner";

function Client() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true); // Add loading state

  const handleDelete = async (articleId) => {
    try {
      await axios.post(`${URL}/delete-article`, { article_id: articleId }, { withCredentials: true });
      setArticles(articles.filter(article => article.article_id !== articleId));
    } catch (err) { alert("Failed to delete article"); }
  };

  const handleEdit = (articleId) => { navigate(`/client/${id}/edit/${articleId}`); };

  const handleAdd = () => { navigate(`/client/${id}/add`); };

  const toggleExpand = (articleId) => {
    setExpanded(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
  };

  // Filter articles based on status
  const filteredArticles = filter === "all" ? articles : articles.filter(article => (article.status || "pending").toLowerCase() === filter);

  useEffect(() => {
    setLoading(true);
    axios.get(`${URL}/me`, { withCredentials: true })
      .then(res => {
        if (res.data.role !== "client") {
          navigate("/login");
        } else {
          axios.get(`${URL}/client/${id}/articles`, { withCredentials: true })
            .then(res => setArticles(res.data))
            .finally(() => setLoading(false));
        }
      })
      .catch(() => {
        navigate("/login");
        setLoading(false);
      });
  }, [id, navigate]);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex justify-between my-15 items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Articles</h2>
        <div className="flex items-center">
          <StatusFilter filter={filter} setFilter={setFilter} />
          <button
            className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2"
            onClick={handleAdd}
            aria-label="Add Article"
          >
            <IoIosAddCircle />
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-blue-600 py-8"><LoadingSpinner /></div>
        ) : Array.isArray(filteredArticles) && filteredArticles.length > 0 ? (
          filteredArticles.map((article, idx) => (
            <div key={idx}>
              <div className="bg-white p-4 rounded shadow flex items-center justify-between relative">
                <div>
                  <h3 className="text-lg font-bold text-blue-800">{article.title}</h3>
                  <p className="text-gray-700 mt-2">
                    Article ID: {article.article_id}<br />
                    Submitted At: {article.submitted_at}<br />
                    Status: {article.status}
                  </p>
                </div>
                <div className="flex flex-col items-center ml-4">
                  <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mb-2"
                    onClick={() => handleEdit(article.article_id)}>
                    <MdEdit />
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(article.article_id)}>
                    <MdOutlineDelete />
                  </button>
                </div>
                {/* View More Button on bottom right */}
                <button
                  className="absolute right-2 bottom-2 text-blue-600 hover:underline text-sm"
                  onClick={() => toggleExpand(article.article_id)}>
                  {expanded[article.article_id] ? "Hide" : "View More"}
                </button>
              </div>
              {/* Article description/content, shown if expanded */}
              {expanded[article.article_id] && (
                <div className="bg-gray-100 px-4 py-2 rounded-b shadow-inner text-gray-800">
                  <strong>Description:</strong>
                  <div className="whitespace-pre-line mt-1">{article.content || "No description available."}</div>
                </div>
              )}
            </div>
          ))) : (<p className="text-gray-500">No articles available.</p>)}
      </div>
    </div>
  );
}
export default Client;