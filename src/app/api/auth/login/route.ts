import dbConnect from "../../../../lib/dbConnect";
import { NextResponse } from "next/server";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function POST(request: Request) {
  await dbConnect();

  const { email, password } = await request.json();
  console.log("Login Request:", { email, password });

  try {
    const user = await User.findOne({ email });
    console.log("User Found:", user);

    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      console.log("Password does not match");
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Return the token, user data, and role
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        balance:user.balance,
        accubtNumber:user.accountNumber
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}