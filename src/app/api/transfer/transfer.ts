import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/app/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

type Currency = "IRR" | "GBP" | "EUR" | "TRY" | "AED" | "SEK" | "USD";

export async function POST(req: Request) {
  await dbConnect();

  // Extract the token from the Authorization header
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
  }

  // Verify the token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // Extract the user ID from the decoded token
  const userId = decoded.userId;

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // Parse the request body
  const { senderAccountNumber, receiverAccountNumber, amount, currency } = await req.json();

  // Validate currency
  const validCurrencies: Currency[] = ["IRR", "GBP", "EUR", "TRY", "AED", "SEK", "USD"];
  if (!validCurrencies.includes(currency as Currency)) {
    return NextResponse.json(
      { message: `Invalid currency: ${currency}` },
      { status: 400 }
    );
  }

  // Convert Decimal128 to number
  const senderBalance = parseFloat(user.balance[currency as Currency].toString());

  // Check if the sender has sufficient balance
  if (senderBalance < amount) {
    return NextResponse.json(
      { message: "Insufficient balance" },
      { status: 400 }
    );
  }

  // Find the receiver by account number
  const receiver = await User.findOne({ accountNumber: receiverAccountNumber });
  if (!receiver) {
    return NextResponse.json({ message: "Receiver not found" }, { status: 404 });
  }

  // Convert Decimal128 to number
  const receiverBalance = parseFloat(receiver.balance[currency as Currency].toString());

  // Update the sender's balance
  user.balance[currency as Currency] = new mongoose.Types.Decimal128((senderBalance - amount).toString());

  // Update the receiver's balance
  receiver.balance[currency as Currency] = new mongoose.Types.Decimal128((receiverBalance + amount).toString());

  // Save the updated sender and receiver
  await user.save();
  await receiver.save();

  // Return the response
  return NextResponse.json({
    message: "Transfer successful",
    senderAccountNumber,
    receiverAccountNumber,
    amount,
    currency,
  });
}