import { useNavigate } from "react-router-dom";

export const Appbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/signin");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="h-14 px-6 flex items-center justify-between bg-white shadow">
      
      {/* App Name */}
      <div className="text-xl font-bold text-indigo-600">
        PayFlow
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        <span className="text-gray-700">
          Hello, <span className="font-semibold">{user.firstname}</span>
        </span>

        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
          {user.firstname[0].toUpperCase()}
        </div>

        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600 font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
