"use client";

import { useState } from "react";
import { exchangeCurrency } from "@/app/features/exchangeSlice";
import { RootState } from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";
 import { useAppDispatch, useAppSelector } from "../hooks/exchange-hook";


const ExchangeForm = () => {
  
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading, success, error } = useAppSelector(
    (state: RootState) => state.exchange
  );

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(0);

  const handleExchange = async () => {
    if (amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to perform this action");
      return;
    }

    try {
      const response = await fetch("/api/auth/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token
        },
        body: JSON.stringify({ fromCurrency, toCurrency, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Exchange failed");
      }

      const data = await response.json();
      console.log("Exchange Response:", data);

      dispatch(exchangeCurrency(data)); // Dispatch the result to Redux
      alert("Exchange successful!");
    } catch (error) {
      console.error("Exchange Error:", error);
      alert(error instanceof Error ? error.message : "Exchange failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
        Currency Exchange
      </h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          From Currency
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {Object.keys(user?.balance || {}).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          To Currency
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {Object.keys(user?.balance || {}).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Enter amount"
        />
      </div>

      <button
        onClick={handleExchange}
        disabled={loading}
        className={`w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition ${
          loading && "opacity-50 cursor-not-allowed"
        }`}
      >
        {loading ? "Exchanging..." : "Exchange"}
      </button>

      {success && (
        <p className="text-green-600 text-center mt-4">Exchange Successful!</p>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default ExchangeForm;

