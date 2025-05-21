import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Client() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/client/${id}/articles`)
      .then(res => setArticles(res.data));
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Articles</h2>
      <div className="space-y-4">
        {Array.isArray(articles) && articles.length > 0 ? (
          articles.map((article, idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold text-blue-800">{article.title}</h3>
              <p className="text-gray-700 mt-2">
                Article ID: {article.article_id}<br />
                Submitted At: {article.submitted_at}<br />
                Status: {article.status}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No articles available.</p>
        )}
      </div>
    </div>
  );
}
export default Client;