import { createContext, useContext, useReducer } from "react";
import $ from "jquery";

import request from "../utils/request";
import axios from "axios";

const AuthContext = createContext();

function reducer(state, action) {
  const u = state.user;
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    case "resetGame":
      return { ...state, user: { ...u, hasActiveGame: "false" } };
    case "startGame":
      return {
        ...state,
        user: { ...u, gameDuration: action.payload, hasActiveGame: "true" },
      };
    default:
      throw new Error("Unknown action type");
  }
}

const initialState = {
  user: null,
  isAuthenticated: false,
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  async function login(username, password) {
    const result = await $.ajax({
      url: `http://localhost:8080/api/user/login`,
      data: {
        user: {
          username: username,
          password: password,
        },
      },
      method: "POST",
      success: (res) => {
        console.log("ajax success login ...");
        const user = JSON.parse(JSON.stringify(res));
        localStorage.setItem("user", JSON.stringify(res));
        dispatch({
          type: "login",
          payload: user,
        });
        return res;
      },
      error: (err) => {
        console.log("error login");
        console.dir(err);
      },
    });

    console.dir(result);
    return result;
  }

  function relogin(user) {
    dispatch({
      type: "login",
      payload: user,
    });
    localStorage.setItem("user", JSON.stringify(user));
  }

  function resetGame() {
    dispatch({
      type: "resetGame",
      payload: null,
    });
  }

  function startGame(gameDuration) {
    dispatch({
      type: "startGame",
      payload: gameDuration,
    });
  }

  async function logout() {
    let result;
    await $.ajax({
      url: `http://localhost:8080/api/user/logout`,
      method: "GET",
      success: (res) => {
        console.log("log out success");
        localStorage.removeItem("user");
        dispatch({
          type: "logout",
        });
        result = true;
      },
      error: (err) => {
        console.log("Log out encountered error");
        result = false;
      },
    });
    return result;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        relogin,
        resetGame,
        startGame,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Auth context is used outside AuthProvider.");
  return context;
}

export { useAuth, AuthProvider };
