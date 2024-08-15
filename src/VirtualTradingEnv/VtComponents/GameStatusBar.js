import { useEffect } from "react";
import { useTIContext, useUserContext } from "../VTELayout";
import VTNav from "./VTNav";
import { totalValue } from "../../utils/computePortfolio";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../UserAccount/AuthContext";

function GameStatusBar() {
  let { tradeInstructions, setTradeInstructions, mainBoard } = useTIContext();
  const { user } = useAuth();
  const { portfolios, v$, gameDay, refreshOnNext } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (mainBoard != null) {
      console.log(`mainboard loaded in gamestatusbar`);
    } else {
      console.log(`mainboard not loaded in gamestatusbar`);
    }
  }, [portfolios, v$, gameDay, mainBoard]);

  async function handleNext() {
    if (tradeInstructions.length > 0) {
      console.log("Sending trade data");
      for (var ti of tradeInstructions) {
        const sc = ti.stockCode;
        await $.ajax({
          url: `http://localhost:8080/api/vt/sendTrade/${
            user.userId ? user.userId : "1"
          }`,
          method: "POST",
          headers: { token: JSON.parse(localStorage.getItem("user")).token },
          data: {
            instr: ti,
          },
          success: (res) => {
            console.log(`success posting trade instruction for stock ${sc}`);
          },
          error: (err) => {
            console.dir(err);
            console.log(`error posting trade instruction for stock ${sc}`);
          },
        });
      }
      setTradeInstructions([]);

      refreshOnNext(() => {});
    } else {
      console.log("No trade. Proceed to next day");
      navigate("/app/vte");
      refreshOnNext(() => {});
    }
  }

  return (
    <div className="d-flex flex-row justify-content-between align-items-center w-100 p-2">
      <div className="w-100 p-1 rounded bg-success-subtle text-dark d-flex flex-row justify-content-between">
        <div className="d-flex flex-row p-1 justify-content-start w-75">
          <div className="mt-2">
            <span className="ms-4 mt-1">Game Day {gameDay}</span>
            <span className="ms-4 mt-1">v${Number(v$).toFixed(2)}</span>
            <span className="ms-4 mt-1">
              Total Value: v$
              {mainBoard &&
                Number(totalValue(portfolios, v$, mainBoard.stockData)).toFixed(
                  0
                )}
            </span>
          </div>
          <VTNav />
        </div>
        <button
          className="me-4 btn bg-primary text-white align-self-center"
          style={{ height: "50px" }}
          onClick={handleNext}
        >
          Next Game Day
        </button>
      </div>
    </div>
  );
}

export default GameStatusBar;
