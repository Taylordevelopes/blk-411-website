import { NextResponse } from "next/server";
import pool from "@/app/lib/db"; // Ensure this is the correct path

export async function GET() {
  try {
    console.log("Testing Database Connection...");
    const res = await pool.query("SELECT NOW()");
    console.log("Connected to Database:", res.rows[0]);
    return NextResponse.json({
      message: "Connected Successfully",
      time: res.rows[0],
    });
  } catch (err) {
    console.error("Database Connection Error:", err);
    return NextResponse.json(
      { error: "Failed to connect to DB", details: err },
      { status: 500 }
    );
  }
}
