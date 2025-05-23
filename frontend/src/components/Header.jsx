import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import axios from "axios";
const URL=import.meta.env.VITE_API_BASE_URL;

function Header() {
    const [username, setUsername] = useState(null);
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch session user info from backend
        axios.get(`${URL}/me`, { withCredentials: true })
            .then(res => {
                setUsername(res.data.username);
                setUserId(res.data.id);
                setRole(res.data.role);
            })
            .catch(() => {
                setUsername(null);
                setUserId(null);
                setRole(null);
            });
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${URL}/logout`, {}, { withCredentials: true });
        } catch (err) {}
        setUsername(null);
        setUserId(null);
        setRole(null);
        window.location.href = "/login";
    };

    const handleTask = () => {
        if (role === "host") {
            navigate("/host");
        } else if (role === "client") {
            navigate(`/client/${userId}`);
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow">
            <div className="flex justify-between items-center bg-white shadow p-4">
                <Link to={"/"}>
                    <button className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition"><GoHome /></button>
                </Link>
                <span className="text-2xl font-bold text-blue-700">Inter-Boat</span>
                {username ? (
                    <div className="flex items-center space-x-2">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={handleTask}>{username}</button>
                        <button
                            className="bg-red-600 text-white px-4 py-3 rounded hover:bg-red-700 transition"
                            onClick={handleLogout}>
                            <FiLogOut />
                        </button>
                    </div>
                ) : (<Link to={"/Login"}><button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Login</button></Link>)}
            </div>
        </header>
    );
}
export default Header;