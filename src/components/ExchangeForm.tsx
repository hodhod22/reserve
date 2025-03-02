"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { exchangeCurrency } from "@/app/features/exchangeSlice";
import { RootState } from "@/app/store/store";


const ExchangeForm = () => {
   const { data: session } = useSession(); // Get the session
  const dispatch = useDispatch<any>();
  const { user, loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const { loading, success, error } = useSelector(
    (state: RootState) => state.exchange
  );

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(0);

  // Log the user balance for debugging
  useEffect(() => {
    console.log("User balance:", user?.balance);
  }, [user]);

  const handleExchange = async () => {
    if (amount > 0) {
      try {
        const response = await fetch("/api/auth/exchange", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`, // Include the session token
          },
          body: JSON.stringify({ fromCurrency, toCurrency, amount }),
        });

        if (!response.ok) {
          throw new Error("Exchange failed");
        }

        const data = await response.json();
        dispatch(exchangeCurrency(data)); // Dispatch the result to Redux
      } catch (error) {
        console.error(error);
        alert("Exchange failed");
      }
    } else {
      alert("Please enter a valid amount");
    }
  };


  // Show loading state if user data is not yet available
  if (authLoading || !user) {
    return <div>Loading...</div>;
  }

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
          {Object.keys(user.balance).map((currency) => (
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
          {Object.keys(user.balance).map((currency) => (
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