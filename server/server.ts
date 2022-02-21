import express from "express";
import { Server } from "http";

import { Transaction, addTransaction } from "./transaction";

export { Server } from "http";

export function createServer(port: number) {
  return new Promise<Server>(resolve => {
    const app = express();
    const history: Transaction[] = [];

    app.use(express.json());

    app.all("/api/tx", async (req, res) => {
      try {
        const { body } = req;

        if(typeof body.client_id !== "number" || parseInt(body.client_id, 10) !== body.client_id) throw new Error("Bad client_id value");
        if(typeof body.date !== "string" || ! body.date.match(/\d\d\d\d-\d\d-\d\d/)) throw new Error("Bad date value");
        if(typeof body.amount !== "number" || body.amount <= 0) throw new Error("Bad amount value");
        if(typeof body.currency !== "string") throw new Error("Bad currency value");

        const { commission, commission_currency } = await addTransaction(body, history);

        res.json({ amount: commission, currency: commission_currency });
      } catch(e) {
        res.status(400).json({ error: e instanceof Error ? e.message : "Unknown error" });
      }
    });

    const server = app.listen(port, () => resolve(server));
  });
}
