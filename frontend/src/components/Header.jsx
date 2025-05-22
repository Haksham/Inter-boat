import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { GoHome } from "react-icons/go";

function Header() {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [userId, setUserId] = useState(localStorage.getItem("userId")); // Assuming you store userId
    const navigate = useNavigate();

    useEffect(() => {
        const onStorage = () => {
            setUsername(localStorage.getItem("username"));
            setUserId(localStorage.getItem("userId"));};
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        setUsername(null);
        setUserId(null);
        window.location.href = "/login";
    };

    const handleTask = () => {
        if (userId!=0) {navigate(`/client/${userId}`);
        }else if(userId==0){navigate('/host');}};

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