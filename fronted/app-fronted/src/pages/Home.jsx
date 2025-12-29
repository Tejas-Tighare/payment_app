import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="backdrop-blur-md bg-white/20 p-10 rounded-2xl shadow-2xl w-[90%] max-w-md text-center border border-white/30">

        <h1 className="text-4xl font-extrabold text-white mb-4">
          PayFlow 💸
        </h1>

        <p className="text-white/80 mb-8 text-sm">
          Fast • Secure • Reliable payments for everyone
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-purple-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/signin")}
            className="border border-white text-white font-semibold py-3 rounded-lg hover:bg-white hover:text-purple-700 transition-all duration-200"
          >
            Sign In
          </button>
        </div>

        <p className="text-xs text-white/60 mt-6">
          Secure payments powered by PayFlow
        </p>
      </div>
    </div>
  );
};
