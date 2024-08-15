import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../UserAccount/AuthContext";
import { CircleUserRound } from "lucide-react";

function RouteNav() {
  const { isAuthenticated, user, logout } = useAuth();

  const navLinkClasses = "text-gray-300 hover:text-white transition duration-150 ease-in-out no-underline";
  const activeNavLinkClasses = "text-white font-medium";

  return (
    <header className="bg-gray-800 shadow-lg">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-white text-2xl font-bold">MoneyPort</h1>
          <div className="hidden md:flex space-x-6">
            <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
              Home
            </NavLink>
            <NavLink to="/learningCentre" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
              Learning Centre
            </NavLink>
            <NavLink to="/app/forum/forum" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
              Forum
            </NavLink>
            <NavLink to="/app/vte" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
              Virtual Trading
            </NavLink>
            <NavLink to="/app/pg" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
              Prediction Game
            </NavLink>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <NavLink
                to={`/app/recommendations/${user.id || 1}`}
                className={`flex items-center ${navLinkClasses}`}
              >
                <CircleUserRound className="w-5 h-5 mr-2" />
                <span>{user.username}</span>
              </NavLink>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
              >
                Log out
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out no-underline"
            >
              Log in
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

export default RouteNav;
