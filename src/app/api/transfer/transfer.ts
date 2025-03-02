// pages/api/transfer.ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User from "../../models/User";
import { IUser } from "../../models/User";
interface TransferRequest {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  currency: keyof IUser["balance"];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { senderAccountNumber, receiverAccountNumber, amount, currency } =
    req.body as TransferRequest;

  if (!senderAccountNumber || !receiverAccountNumber || !amount || !currency) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Connect to the database
    await dbConnect();

    // Find sender and receiver
    const sender = await User.findOne({ accountNumber: senderAccountNumber });
    const receiver = await User.findOne({
      accountNumber: receiverAccountNumber,
    });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    // Check if sender has sufficient balance
    if (sender.balance[currency] < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Perform the transaction
    sender.balance[currency] -= amount;
    receiver.balance[currency] += amount;

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Transaction successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Transaction failed" });
  }
}