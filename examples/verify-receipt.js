import { TrigGuard } from "../src/index.js";

const tg = new TrigGuard();

const receipt = {
  decision: "PERMIT",
  timestamp: new Date().toISOString(),
};

tg.verify
  .receipt(receipt)
  .then((r) => console.log(r.valid, r))
  .catch(console.error);
