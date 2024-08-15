import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RouteTitle from "../components/RouteTitle";

const Scoreboard = () => {
  const [sb, setSb] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    handleGetScoreBoard(0);
  }, []);

  const handleGetScoreBoard = (page) => {
    // 使用fetch替代jQuery的ajax
    fetch(`http://localhost:8080/api/pp/getScoreboard?page=${page}&size=10`, {
      method: "GET",
      headers: {
        token: JSON.parse(localStorage.getItem("user")).token,
      },
    })
        .then((response) => response.json())
        .then((result) => {
          console.log("Scoreboard received");
          setSb(result.content);
          setTotalPages(result.totalPages);
          setPage(page);
        })
        .catch((error) => {
          console.log("Error getting score board.", error);
        });
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <RouteTitle title="Score board" />
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game Played</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {sb && sb.map((game, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page * 10 + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{game.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">
                    <Link to={``}>Game {game.id}</Link>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <nav className="flex justify-center">
            <ul className="flex items-center">
              <li>
                <button
                    onClick={() => handleGetScoreBoard(page - 1)}
                    disabled={page === 0}
                    className="px-3 py-1 rounded-md mr-2 bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
              </li>
              {[...Array(totalPages).keys()].map((i) => (
                  <li key={i}>
                    <button
                        onClick={() => handleGetScoreBoard(i)}
                        className={`px-3 py-1 rounded-md mx-1 ${
                            page === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      {i + 1}
                    </button>
                  </li>
              ))}
              <li>
                <button
                    onClick={() => handleGetScoreBoard(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1 rounded-md ml-2 bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
  );
};

export default Scoreboard;