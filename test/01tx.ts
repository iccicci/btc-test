import { strictEqual as eq } from "assert";

import { Transaction, addTransaction } from "../server/transaction";

describe("transactions", () => {
  const history: Transaction[] = [];
  let tx: Transaction;

  describe("minimum commission", () => {
    before(async () => (tx = await addTransaction({ client_id: 1, date: "2022-01-23", currency: "USD", amount: 10 }, history)));
    it("value", () => eq(tx.commission, 0.05));
  });

  describe("std commission", () => {
    before(async () => (tx = await addTransaction({ client_id: 1, date: "2022-01-24", currency: "USD", amount: 2000 }, history)));
    it("value", () => eq(tx.commission, 8.83));
  });

  describe("commission for discounted client", () => {
    before(async () => (tx = await addTransaction({ client_id: 42, date: "2022-01-25", currency: "USD", amount: 2000 }, history)));
    it("value", () => eq(tx.commission, 0.05));
  });

  describe("turnover commission", () => {
    before(async () => (tx = await addTransaction({ client_id: 1, date: "2022-01-26", currency: "USD", amount: 2000 }, history)));
    it("value", () => eq(tx.commission, 0.03));
  });

  describe("turnover commission for discounted client", () => {
    before(async () => (tx = await addTransaction({ client_id: 42, date: "2022-01-27", currency: "USD", amount: 2000 }, history)));
    it("value", () => eq(tx.commission, 0.03));
  });
});
