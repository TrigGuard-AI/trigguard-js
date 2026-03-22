import { verifyReceipt } from "../src/index.js";

const receipt = {
  decision: "PERMIT",
  timestamp: new Date().toISOString(),
};

verifyReceipt(receipt).then(console.log).catch(console.error);
