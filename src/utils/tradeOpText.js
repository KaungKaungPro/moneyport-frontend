export default function tradeOpText(op) {
  if (op === 1) {
    return "Buy";
  } else if (op === 2) {
    return "Sell";
  } else if (op === 3) {
    return "BuyInstruction";
  } else {
    return "SellInstruction";
  }
}
