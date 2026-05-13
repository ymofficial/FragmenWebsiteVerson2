import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SupportMessage from "@/models/SupportMessage";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newMessage = await SupportMessage.create({
      name,
      email,
      message,
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Support API Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
