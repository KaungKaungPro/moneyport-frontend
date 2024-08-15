import { Outlet, useNavigate } from "react-router-dom";
import style from "./VTELayout.module.css";
import RouteNav from "../components/RouteNav";
import GameStatusBar from "./VtComponents/GameStatusBar";
import Loader from "../components/Loader";
import { createContext, useContext, useEffect, useState } from "react";
import $ from "jquery";
import {
  parseGameDay,
  parsePortfolio,
  parseVDollar,
} from "../utils/computePortfolio";
import { useAuth } from "../UserAccount/AuthContext";

const TIContext = createContext();
const UserContext = createContext();

function VTELayout() {
  const { user, resetGame } = useAuth();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mb, setMb] = useState(null);
  const [finalTradePrice, setFinalTradePrice] = useState(null);
  const [tis, setTis] = useState([]);
  const [pfs, setPfs] = useState([]);
  const [vDollars, setVDollars] = useState(0);
  const [gd, setGd] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    if (user.hasActiveGame === "true") {
      setLoading(true);
      console.log(`Starting virtual trade for ${user.userId}`);
      console.dir(user);
      $.ajax({
        url: `http://localhost:8080/api/vt/startVirtualTrade/${
          user.userId ? user.userId : "1"
        }/${user.gameDuration ? user.gameDuration : "3"}`,
        method: "GET",
        headers: { token: JSON.parse(localStorage.getItem("user")).token },
        success: (res) => {
          console.dir(res);
          console.log(
            `called startVirtualTrade success. User Id: ${user.userId}`
          );

          setPfs(parsePortfolio(res));
          setVDollars(parseVDollar(res));
          setGd(parseGameDay(res));
        },
        error: (err) => {
          console.log(err);
          setLoading(false);
        },
      }).then((res) => {
        $.ajax({
          url: `http://localhost:8080/api/vt/getMainBoardData/${
            user.userId ? user.userId : "1"
          }`,
          method: "GET",
          headers: { token: JSON.parse(localStorage.getItem("user")).token },
          success: (res) => {
            setMb(res);
            setLoading(false);
            console.log("success called mainboard");
            console.dir(res);
          },
          error: (err) => {
            setLoading(false);
            console.log("error calling getMainBoard");
          },
        });
      });
    }
  }, [user]);

  function refreshOnNext(callback) {
    setLoading(true);
    $.ajax({
      url: `http://localhost:8080/api/vt/nextGameDay/${
        user.userId ? user.userId : "1"
      }`,
      method: "GET",
      headers: { token: JSON.parse(localStorage.getItem("user")).token },
      success: (res) => {
        console.log(`called nextGameDay success. User Id: ${user.userId}`);
        console.dir(res);
        if (res.game_end) {
          console.log(`game ended`);
          resetGame();
          console.dir(res);
          setFinalTradePrice(res);
          return;
        }
        setPfs(parsePortfolio(res));
        setVDollars(parseVDollar(res));
        setGd(parseGameDay(res));
        return;
      },
      error: (err) => {
        console.log(err);
        setLoading(false);
      },
    })
      .then((res) => {
        console.log(`next ajax ... game end: ${res.gameEnd}`);
        if (res.game_end) {
          const game_sign = res.game_sign;
          navigate(`/app/vte/gameScore/${game_sign}`);
          setLoading(false);
        } else {
          console.log(`retrieving main board after next game day`);
          $.ajax({
            url: `http://localhost:8080/api/vt/getMainBoardData/${
              user.userId ? user.userId : "1"
            }`,
            method: "GET",
            headers: { token: JSON.parse(localStorage.getItem("user")).token },
            success: (res) => {
              setMb(res);
              setLoading(false);
              console.log("success called mainboard");
              console.dir(res);
            },
            error: (err) => {
              setLoading(false);
              console.log("error calling getMainBoard");
            },
          });
        }
      })
      .then((res) => {
        callback();
      });
  }

  return (
    <UserContext.Provider
      value={{
        userId: user.userId,
        setUserId: setUserId,
        portfolios: pfs,
        setPortfolios: setPfs,
        v$: vDollars,
        setV$: setVDollars,
        gameDay: gd,
        setGameDay: setGd,
        refreshOnNext: refreshOnNext,
      }}
    >
      <TIContext.Provider
        value={{
          mainBoard: mb,
          setMainBoard: setMb,
          tradeInstructions: tis,
          setTradeInstructions: setTis,
          finalTradePrice: finalTradePrice,
        }}
      >
        {loading && <Loader />}
        <div style={style.app}>
          <RouteNav />
          {user.hasActiveGame === "true" && <GameStatusBar />}
          <Outlet />
        </div>
      </TIContext.Provider>
    </UserContext.Provider>
  );
}

function useUserContext() {
  const context = useContext(UserContext);
  return context;
}

function useTIContext() {
  const context = useContext(TIContext);
  return context;
}

export { VTELayout, useUserContext, useTIContext };
