function Footer() {
  return (
    <footer className="bg-white shadow-inner mt-0 py-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <span className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Inter-Boat. All rights reserved.
        </span>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="https://github.com/haksham" target="_blank" className="text-blue-600 hover:underline">GitHub </a>
          <a href="mailto:harsh924hashvm@gmail.com" className="text-blue-600 hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;