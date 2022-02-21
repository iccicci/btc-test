import { useContext } from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

import { Context } from "./context";

export default function Result() {
  const { amount, currency, error } = useContext(Context);

  return (
    <Box>
      <Link to="/">Home</Link> - <Link to="/transaction">New transaction</Link>
      <br />
      <br />
      {error ? (
        `There was an error processing transaction: ${error}`
      ) : (
        <Box>
          Transaction completed, commission: {currency} {amount}
        </Box>
      )}
    </Box>
  );
}
