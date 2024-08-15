import React, { useEffect, useState } from "react";
import { useAuth } from "../UserAccount/AuthContext";
import { useNavigate } from "react-router-dom";

const GameDurationOption = ({ value, label, checked, onChange }) => (
    <label className="flex items-center space-x-3 mb-3 cursor-pointer">
      <input
          type="radio"
          className="form-radio h-5 w-5 text-green-600"
          name="gameDuration"
          value={value}
          checked={checked}
          onChange={onChange}
      />
      <span className="text-gray-700 font-medium">{label}</span>
    </label>
);

function StartVT() {
  const { startGame, user } = useAuth();
  const [gameDuration, setGameDuration] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.hasActiveGame === "true") {
      navigate("/app/vte/dashboard");
    }
  }, [user, navigate]);

  const handleGameDurationChange = (e) => {
    setGameDuration(parseInt(e.target.value));
  };

  const startVirtualTrading = () => {
    startGame(gameDuration);
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Start Virtual Trading</h1>
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Game Duration</h2>
            <div className="space-y-2">
              {[
                { value: 3, label: "3 game days" },
                { value: 7, label: "7 game days" },
                { value: 14, label: "14 game days" },
                { value: 30, label: "30 game days" },
              ].map((option) => (
                  <GameDurationOption
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      checked={gameDuration === option.value}
                      onChange={handleGameDurationChange}
                  />
              ))}
            </div>
            <button
                className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                onClick={startVirtualTrading}
            >
              Start Virtual Trading
            </button>
          </div>
        </div>
      </div>
  );
}

export default StartVT;