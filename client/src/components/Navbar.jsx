const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center font-bold text-white bg-blue-600 w-9 h-9 rounded-xl">B</div>
        <h1 className="text-xl font-semibold">BizForce CRM</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">Ayushman Jha</p>
          <p className="text-xs text-gray-500">BDA</p>
        </div>
        <div className="flex items-center justify-center text-sm font-medium bg-gray-200 rounded-full w-9 h-9">AJ</div>
      </div>
    </nav>
  );
};

export default Navbar;