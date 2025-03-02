"use client"
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store/store';
import { IUser } from '../app/models/User'; // Adjust the path to your User model
import { initiateTransfer, transferSuccess, transferFailure, resetTransfer } from '../app/features/transferSlice';

export default function SendCurrency() {
  const [receiverAccountNumber, setReceiverAccountNumber] = useState<string>('');
  const [amount, setAmount] = useState<number>(0); // Change to number
  const [currency, setCurrency] = useState<keyof IUser['balance']>('USD');

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { loading, error, success } = useSelector((state: RootState) => state.transfer);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(initiateTransfer());

    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderAccountNumber: user?.accountNumber,
          receiverAccountNumber,
          amount, // No need to parseFloat since it's already a number
          currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Transaction failed');
      }

      dispatch(transferSuccess(data.message));
    } catch (err) {
      dispatch(transferFailure(err instanceof Error ? err.message : 'Transaction failed'));
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Send Currency</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Receiver Account Number */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Receiver Account Number
          </label>
          <input
            type="text"
            value={receiverAccountNumber}
            onChange={(e) => setReceiverAccountNumber(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))} // Convert to number
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Currency Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as keyof IUser['balance'])}
            className="w-full p-2 border rounded-md"
          >
            <option value="IRR">IRR</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="TRY">TRY</option>
            <option value="AED">AED</option>
            <option value="SEK">SEK</option>
            <option value="USD">USD</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Send'}
        </button>
      </form>

      {/* Status Messages */}
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error}
          <button
            onClick={() => dispatch(resetTransfer())}
            className="ml-2 text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md">
          Transfer successful!
          <button
            onClick={() => dispatch(resetTransfer())}
            className="ml-2 text-green-700 hover:text-green-900"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}