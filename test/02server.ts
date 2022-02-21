import fetch from "node-fetch";
import { deepStrictEqual as deq } from "assert";

import { Server, createServer } from "../server/server";
import { Transaction } from "../server/transaction";

const port = 3002;

async function callApi(tx: Transaction) {
  const res = await fetch(`http://localhost:${port}/api/tx`, { body: JSON.stringify(tx), headers: { "Content-Type": "application/json" }, method: "POST" });

  return await res.json();
}

describe("transactions", () => {
  let server: Server;
  let res: unknown;

  before(async () => (server = await createServer(port)));

  after(() => server.close());

  describe("bad client_id 1", () => {
    before(async () => (res = await callApi({ client_id: "test" } as unknown as Transaction)));
    it("body", () => deq(res, { error: "Bad client_id value" }));
  });

  describe("bad client_id 2", () => {
    before(async () => (res = await callApi({ client_id: 0.1 } as unknown as Transaction)));
    it("body", () => deq(res, { error: "Bad client_id value" }));
  });

  describe("bad date 1", () => {
    before(async () => (res = await callApi({ client_id: 1, date: {} } as unknown as Transaction)));
    it("body", () => deq(res, { error: "Bad date value" }));
  });

  describe("bad date 2", () => {
    before(async () => (res = await callApi({ client_id: 1, date: "test" } as unknown as Transaction)));
    it("body", () => deq(res, { error: "Bad date value" }));
  });

  describe("bad amount 1", () => {
    before(async () => (res = await callApi({ client_id: 1, date: "2022-01-23", amount: [] } as unknown as Transaction)));
    it("body", () => deq(res, { error: "Bad amount value" }));
  });

  describe("bad amount 2", () => {
    before(async () => (res = await callApi({ client_id: 1, date: "2022-01-23", amount: -2 } as unknown as Transaction)));
    it("body", () => deq(res, { error: "Bad amount value" }));
  });

  describe("bad currency 1", () => {
    before(async () => (res = await callApi({ client_id: 1, date: "2022-01-23", amount: 2, currency: 0 } as unknown as Transaction)));
    it("body", () => deq(res, { error: "Bad currency value" }));
  });

  describe("bad currency 2", () => {
    before(async () => (res = await callApi({ client_id: 1, date: "2022-01-23", amount: 2, currency: "test" } as unknown as Transaction)));
    it("body", () => deq(res, { error: "Bad currency: 'test'" }));
  });

  describe("minimum commission", () => {
    before(async () => (res = await callApi({ client_id: 1, date: "2022-01-23", currency: "USD", amount: 10 })));
    it("body", () => deq(res, { amount: 0.05, currency: "EUR" }));
  });

  describe("std commission", () => {
    before(async () => (res = await callApi({ client_id: 1, date: "2022-01-24", currency: "USD", amount: 2000 })));
    it("body", () => deq(res, { amount: 8.83, currency: "EUR" }));
  });

  describe("commission for discounted client", () => {
    before(async () => (res = await callApi({ client_id: 42, date: "2022-01-25", currency: "USD", amount: 2000 })));
    it("body", () => deq(res, { amount: 0.05, currency: "EUR" }));
  });

  describe("turnover commission", () => {
    before(async () => (res = await callApi({ client_id: 1, date: "2022-01-26", currency: "USD", amount: 2000 })));
    it("body", () => deq(res, { amount: 0.03, currency: "EUR" }));
  });

  describe("turnover commission for discounted client", () => {
    before(async () => (res = await callApi({ client_id: 42, date: "2022-01-27", currency: "USD", amount: 2000 })));
    it("body", () => deq(res, { amount: 0.03, currency: "EUR" }));
  });
});
