import { useState,useEffect } from 'react'
import axios from "axios"
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [count, setCount] = useState(0)

  const [blogs, setBlogs] = useState([])

  const fetchBlogs = async () => {
    const response = await axios.get("http://localhost:8000/");
    setBlogs(response.data);
    console.log(response.data);
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
    <Header/>
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Client Blogs</h2>
        <div className="space-y-4">
          {Array.isArray(blogs) && blogs.length > 0 ? (
            blogs.map((blog, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold text-blue-800">{blog.title || `Blog #${idx + 1}`}</h3>
                <p className="text-gray-700 mt-2">{blog.content || blog}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No blogs available.</p>
          )}
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default App
