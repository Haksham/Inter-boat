import {Link} from "react-router-dom";
function Header(){
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <div className="flex justify-between items-center bg-white shadow p-4">
        <Link to={"/"}><button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Home</button></Link>
        <span className="text-2xl font-bold text-blue-700">Inter-Boat</span>
        <Link to={"/Login"}><button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Login</button></Link>
        </div>
        </header>
    )
}
export default Header;