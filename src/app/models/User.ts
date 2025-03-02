import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  accountNumber: string;
  balance: {
    IRR: mongoose.Types.Decimal128;
    GBP: mongoose.Types.Decimal128;
    EUR: mongoose.Types.Decimal128;
    TRY: mongoose.Types.Decimal128;
    AED: mongoose.Types.Decimal128;
    SEK: mongoose.Types.Decimal128;
    USD: mongoose.Types.Decimal128;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  accountNumber: { type: String, unique: true },
  balance: {
    IRR: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    GBP: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    EUR: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    TRY: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    AED: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    SEK: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    USD: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  },
});

// Hash the password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Set default role if not provided
userSchema.pre<IUser>("save", function (next) {
  if (!this.role) {
    this.role = "user";
  }
  next();
});

// Generate account number before saving
userSchema.pre<IUser>("save", function (next) {
  if (!this.accountNumber) {
    // Generate a random 10-digit account number
    this.accountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
  }
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;