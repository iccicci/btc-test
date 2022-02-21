import { useState } from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import { Context, defaultContext } from "./context";

import Result from "./Result";
import Transaction from "./Transaction";

function Home() {
  return <Link to="/transaction">New transaction</Link>;
}

export default function App() {
  const [contextState, setContext] = useState(defaultContext);

  return (
    <Context.Provider value={{ ...contextState, updateContext: update => setContext({ ...contextState, ...update }) }}>
      <Box style={{ margin: 20 }}>
        <BrowserRouter>
          <Routes>
            <Route path="/result" element={<Result />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </Context.Provider>
  );
}
