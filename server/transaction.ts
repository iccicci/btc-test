import fetch from "node-fetch";

export interface Transaction {
  client_id: number;
  date: string;
  amount: number;
  currency: string;
  countervalue?: number;
  commission?: number;
  commission_currency?: string;
}

function getFirstOfMonth(date: string) {
  const tokens = date.split("-");

  tokens[2] = "01";

  return tokens.join("-");
}

export async function addTransaction(tx: Transaction, history: Transaction[]) {
  const firstOfMonth = getFirstOfMonth(tx.date);
  const res = await fetch(`https://api.exchangerate.host/${tx.date}`);
  const { rates } = (await res.json()) as { rates: Record<string, number> };

  if(! rates[tx.currency]) throw new Error(`Bad currency: '${tx.currency}'`);

  tx.commission_currency = "EUR";
  tx.countervalue = Math.round((tx.amount / rates[tx.currency]) * 100) / 100;

  // Default pricing
  tx.commission = Math.ceil(tx.countervalue * 0.5) / 100;

  // Minimum commission
  if(tx.commission < 0.05) tx.commission = 0.05;

  // Client with a discount
  if(tx.client_id === 42) tx.commission = 0.05;

  // Simulate SELECT SUM(countervalue) FROM transactions WHERE client_id = tx.client_id AND date >= firstOfMonth AND date <= tx.date
  const turnover = history.filter(_ => _.client_id === tx.client_id && _.date >= firstOfMonth && _.date <= tx.date).reduce((ret, _) => ret + (_.countervalue || 0), 0);

  // High turnover discount
  if(turnover > 1000) tx.commission = 0.03;

  history.push(tx);

  return tx;
}
