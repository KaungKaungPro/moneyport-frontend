import { NavLink } from "react-router-dom";

function VTNav() {
  return (
    <div className="ms-4">
      <nav className="d-flex flex-row justify-content-end align-items-center">
        <NavLink
          to="/app/vte/dashboard"
          className="link-opacity-50-hover text-decoration-none text-blue me-3 p-2"
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/app/vte/portfolios"
          className="link-opacity-50-hover text-decoration-none text-blue me-3 p-2"
        >
          Portfolios
        </NavLink>
        <NavLink
          to="/app/vte/ti"
          className="link-opacity-50-hover text-decoration-none text-blue me-3 p-2"
        >
          Pending Trades
        </NavLink>
        <NavLink
          to="/app/vte/sb"
          className="link-opacity-50-hover text-decoration-none text-blue me-3 p-2"
        >
          Scoreboard
        </NavLink>
      </nav>
    </div>
  );
}

export default VTNav;
