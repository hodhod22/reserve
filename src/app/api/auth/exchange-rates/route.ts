// app/api/exchange-rates/route.ts
import { NextResponse } from "next/server";
import ExchangeRate from "../../../models/ExchangeRate";
import dbConnect from "@/lib/dbConnect";
import axios from "axios";

export async function GET() {
  await dbConnect();

  try {
    // Fetch live exchange rates from an external API
    const apiKey = process.env.EXCHANGE_API_KEY;
    if (!apiKey) {
      throw new Error("Exchange rate API key is missing");
    }
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
    );

    const { base_code: base, conversion_rates: rates } = response.data;
    if (!rates) {
      throw new Error("Exchange rates are missing in the API response");
    }

    // Save the exchange rates to MongoDB
    const exchangeRate = new ExchangeRate({
      base,
      rates: {
        USD: rates.USD,
        IRR: rates.IRR,
        GBP: rates.GBP,
        EUR: rates.EUR,
        TRY: rates.TRY,
        AED: rates.AED,
        SEK: rates.SEK,
      },
      timestamp: new Date(), // Convert timestamp to Date
    });

    await exchangeRate.save();

    return NextResponse.json({ success: true, data: exchangeRate });
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch exchange rates" },
      { status: 500 }
    );
  }
}
