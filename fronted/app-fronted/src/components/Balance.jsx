import { useEffect, useState } from "react";
import axios from "axios";

export const Balance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:3000/api/v1/account/balance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBalance(res.data.balance);
      } catch (error) {
        console.error("Failed to fetch balance", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading balance...</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="font-bold text-lg">Your Balance:</div>
      <div className="font-semibold text-lg text-green-600">
        ₹ {balance}
      </div>
    </div>
  );
};
