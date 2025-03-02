// components/LiveExchange.tsx
"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExchangeRates } from "../app/features/exchangeRateSlice";
import { RootState , AppDispatch } from "../app/store/store";
import { FaSync } from "react-icons/fa";

const LiveExchange = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rates, loading, error } = useSelector(
    (state: RootState) => state.exchangeRates
  );

  useEffect(() => {
    dispatch(fetchExchangeRates());
  }, [dispatch]);

  const currencies = ["IRR", "GBP", "EUR", "TRY", "AED", "SEK", "USD"];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        Live Exchange Rates <FaSync className="ml-2" />
      </h2>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currencies.map((currency) => (
          <div key={currency} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-lg font-semibold">{currency}</p>
            <p className="text-gray-700">
              {rates[currency as keyof typeof rates]} {/* Type assertion */}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveExchange;