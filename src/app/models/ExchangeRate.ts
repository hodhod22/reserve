// models/ExchangeRate.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IExchangeRate extends Document {
  base: string;
  rates: {
    IRR: number;
    GBP: number;
    EUR: number;
    TRY: number;
    AED: number;
    SEK: number;
    USD: number;
  };
  timestamp: Date;
}

const exchangeRateSchema: Schema = new mongoose.Schema({
  base: { type: String, required: true },
  rates: {
    IRR: { type: Number, required: true },
    GBP: { type: Number, required: true },
    EUR: { type: Number, required: true },
    TRY: { type: Number, required: true },
    AED: { type: Number, required: true },
    SEK: { type: Number, required: true },
    USD: { type: Number, required: true },
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.ExchangeRate ||
  mongoose.model<IExchangeRate>("ExchangeRate", exchangeRateSchema);
