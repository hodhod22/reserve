import dbConnect from "../../../../lib/dbConnect";
import { NextResponse } from "next/server";
import User from "../../../models/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, email, password } = await request.json();

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Create a new user
    const user = new User({ username, email, password });

    // Log the user object before saving
    console.log("User before save:", user);

    // Save the user to the database
    await user.save();

    // Log the user object after saving
    console.log("User after save:", user);

    // Return the newly created user object
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          accountNumber: user.accountNumber,
          balance: user.balance,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
