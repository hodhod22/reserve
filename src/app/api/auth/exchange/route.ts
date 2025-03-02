import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/app/models/User";
import ExchangeRate from "@/app/models/ExchangeRate";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

type Currency = "IRR" | "GBP" | "EUR" | "TRY" | "AED" | "SEK" | "USD";

export async function POST(req: Request) {
  await dbConnect();

  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const userId = decoded.userId;

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { fromCurrency, toCurrency, amount } = await req.json();

  const validCurrencies: Currency[] = ["IRR", "GBP", "EUR", "TRY", "AED", "SEK", "USD"];
  if (!validCurrencies.includes(fromCurrency as Currency)) {
    return NextResponse.json(
      { message: `Invalid fromCurrency: ${fromCurrency}` },
      { status: 400 }
    );
  }
  if (!validCurrencies.includes(toCurrency as Currency)) {
    return NextResponse.json(
      { message: `Invalid toCurrency: ${toCurrency}` },
      { status: 400 }
    );
  }

  // Convert Decimal128 to number
  const fromBalance = parseFloat(user.balance[fromCurrency as Currency].toString());
  const toBalance = parseFloat(user.balance[toCurrency as Currency].toString());

  console.log("From Balance:", fromBalance);
  console.log("Amount:", amount);
  console.log("To Balance:", toBalance);

  if (fromBalance < amount) {
    return NextResponse.json(
      { message: "Insufficient balance" },
      { status: 400 }
    );
  }

  const exchangeRates = await ExchangeRate.findOne().sort({ timestamp: -1 });
  if (!exchangeRates) {
    return NextResponse.json(
      { message: "Exchange rates not found" },
      { status: 500 }
    );
  }

  const rate = parseFloat(exchangeRates.rates[toCurrency as Currency].toString()) /
               parseFloat(exchangeRates.rates[fromCurrency as Currency].toString());
  const convertedAmount = amount * rate;

  // Update the balance using Decimal128
  user.balance[fromCurrency as Currency] = new mongoose.Types.Decimal128((fromBalance - amount).toString());
  user.balance[toCurrency as Currency] = new mongoose.Types.Decimal128((toBalance + convertedAmount).toString());

  await user.save();

  return NextResponse.json({
    message: "Exchange successful",
    fromCurrency,
    toCurrency,
    amount,
    convertedAmount,
  });
}