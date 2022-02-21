import { createContext } from "react";

interface IContext {
  amount: number;
  currency: string;
  error: string;

  updateContext: (update: Partial<IContext>) => void;
}

export const defaultContext: IContext = {
  amount:        0,
  currency:      "",
  error:         "",
  updateContext: () => {}
};

export const Context = createContext(defaultContext);
