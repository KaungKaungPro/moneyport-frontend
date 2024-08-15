import tradeOpText from "../../utils/tradeOpText";
import { useTIContext } from "../VTELayout";

function TradeInstruction({ ti, handleRemove }) {
  return (
    <div className="row align-items-center">
      <div className="col-2">{tradeOpText(ti.op)}</div>
      <div className="col-4">Qty: {Number(ti.quantity).toFixed(0)}</div>
      <div className="col-4">Price: {Number(ti.price).toFixed(2)}</div>
      <div className="col-2">
        <button onClick={handleRemove} className="btn text-white w-50 rounded">
          &#x274c;
        </button>
      </div>
    </div>
  );
}

export default TradeInstruction;
