// app/api/auth/exchange/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import User from "@/app/models/User";
import ExchangeRate from "@/app/models/ExchangeRate";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();

  // Get the session
  const session = await getServerSession(authOptions);
  console.log("Session in /api/auth/exchange:", session);

  // Check if session.user.email is defined
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
  }

  const { fromCurrency, toCurrency, amount } = await req.json();

  // Find the user by email
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Check if the user has sufficient balance
  if (user.balance[fromCurrency as keyof typeof user.balance] < amount) {
    return NextResponse.json(
      { message: "Insufficient Balance" },
      { status: 400 }
    );
  }

  // Fetch the latest exchange rates
  const exchangeRates = await ExchangeRate.findOne().sort({ timestamp: -1 });
  if (!exchangeRates) {
    return NextResponse.json(
      { message: "Exchange rates not found" },
      { status: 500 }
    );
  }

  // Calculate the converted amount
  const rate =
    exchangeRates.rates[toCurrency] / exchangeRates.rates[fromCurrency];
  const convertedAmount = amount * rate;
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (!user.balance) {
    return NextResponse.json(
      { message: "User balance not found" },
      { status: 400 }
    );
  }
  type Currency = keyof typeof user.balance;

  const isCurrency = (currency: string): currency is Currency => {
    return Object.keys(user.balance).includes(currency);
  };
if (!isCurrency(fromCurrency) || !isCurrency(toCurrency)) {
  return NextResponse.json({ message: "Invalid currency" }, { status: 400 });
}

if (user.balance[fromCurrency] < amount) {
  return NextResponse.json(
    { message: "Insufficient Balance" },
    { status: 400 }
  );
}

user.balance[fromCurrency] -= amount;
user.balance[toCurrency] += convertedAmount;

  // Save the updated user
  await user.save();

  return NextResponse.json({
    message: "Exchange Successful",
    fromCurrency,
    toCurrency,
    amount,
    convertedAmount,
  });
}
