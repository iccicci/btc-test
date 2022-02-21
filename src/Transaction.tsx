import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moment } from "moment";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterMoment";
import { CircularProgress } from "@mui/material";

import { Context } from "./context";

const currencies = [
  { value: "EUR", label: "Euro" },
  { value: "JPY", label: "JP Yen" },
  { value: "USD", label: "US Dollar" }
];

type DateChangeHandler = (date: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null, keyboardInputValue?: string | undefined) => void;
type StringChangeHandler = React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;

function toISOString(date: Date) {
  return date.toISOString().substring(0, 10);
}

export default function Transaction() {
  const required = "This field is required";
  const { updateContext } = useContext(Context);
  const [{ clientIdValue, clientId, clientIdError }, setClientId] = useState({ clientIdValue: "", clientId: 0, clientIdError: required });
  const [{ dateValue, date, dateError }, setDate] = useState({ dateValue: "", date: "", dateError: required });
  const [{ amountValue, amount, amountError }, setAmount] = useState({ amountValue: "", amount: 0, amountError: required });
  const [{ currencyValue, currency, currencyError }, setCurrency] = useState({ currencyValue: "", currency: "", currencyError: required });
  const error = clientIdError !== " " || dateError !== " " || amountError !== " " || currencyError !== " ";
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const handleClientIdChange: StringChangeHandler = event => {
    const error = "Not zero positive integer expected";
    const { value } = event.target;
    const clientId = parseInt(value, 10);
    const clientIdError = value ? (value === clientId.toString() ? (clientId <= 0 ? error : " ") : error) : required;

    setClientId({ clientIdValue: value, clientId, clientIdError });
  };

  const handleDatetChange: DateChangeHandler = (value, string) => {
    const moment = value as unknown as Moment;
    const dateError = moment.isValid() ? (toISOString(moment.toDate()) > toISOString(new Date()) ? "Date can't be in the future" : " ") : string ? "Valid date is expected" : required;
    const dateValue = moment.isValid() ? toISOString(moment.toDate()) : string || "";

    setDate({ dateValue, date: dateValue, dateError });
  };

  const handleAmountChange: StringChangeHandler = event => {
    const error = "Not zero positive number expected";
    const { value } = event.target;
    const amount = parseFloat(value);
    const amountError = value ? (value === amount.toString() ? (amount <= 0 ? error : " ") : error) : required;

    setAmount({ amountValue: value, amount, amountError });
  };

  const handleChangeCurrency: StringChangeHandler = event => {
    const { value } = event.target;

    setCurrency({ currencyValue: value, currency: value, currencyError: " " });
  };

  const send = async () => {
    let error = "";
    let body;

    try {
      setSending(true);

      const res = await fetch(`/api/tx`, {
        body:    JSON.stringify({ client_id: clientId, date, amount, currency }),
        headers: { "Content-Type": "application/json" },
        method:  "POST"
      });

      body = await res.json();
      ({ error } = body);
    } catch(e) {
      error = e instanceof Error ? e.message : "Unknown error";
    }

    updateContext({ amount: body.amount, currency: body.currency, error });
    navigate("/result");
  };

  return (
    <Box>
      <Link to="/">Home</Link>
      <br />
      <br />
      <TextField error={clientIdError !== " "} label="Client Id" helperText={clientIdError} value={clientIdValue} onChange={handleClientIdChange} />
      <br />
      <br />
      <LocalizationProvider dateAdapter={DateAdapter}>
        <DesktopDatePicker
          label="Date"
          inputFormat="yyyy-MM-DD"
          value={dateValue}
          onChange={handleDatetChange}
          renderInput={params => <TextField {...params} error={dateError !== " "} helperText={dateError} />}
        />
      </LocalizationProvider>
      <br />
      <br />
      <TextField error={amountError !== " "} label="Amount" helperText={amountError} value={amountValue} onChange={handleAmountChange} />
      <br />
      <br />
      <TextField select error={currencyError !== " "} label="Currency" helperText={currencyError} value={currencyValue} onChange={handleChangeCurrency}>
        {currencies.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>
      <br />
      <br />
      {sending ? (
        <CircularProgress />
      ) : (
        <Button disabled={error} variant="outlined" onClick={send}>
          send
        </Button>
      )}
    </Box>
  );
}
