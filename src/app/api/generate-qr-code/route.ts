import { NextResponse } from "next/server";
import pool from "@/app/lib/db"; // ✅ Ensure this is correct

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentCode = searchParams.get("agentCode");

    if (!agentCode) {
      return NextResponse.json(
        { error: "Agent code is required" },
        { status: 400 }
      );
    }

    console.log("Checking Agent Code:", agentCode);

    // ✅ Test Database Connection
    console.log("Testing Database Connection...");
    const testDb = await pool.query("SELECT NOW()");
    console.log("Database Connected Successfully:", testDb.rows[0]);

    const query = "SELECT * FROM agents WHERE agentCode = $1";
    const result = await pool.query(query, [agentCode]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid agent code" },
        { status: 404 }
      );
    }

    console.log("Agent Found:", result.rows[0]);

    return NextResponse.json({ qrCode: "FAKE_QR_CODE" });
  } catch (err) {
    console.error("Error generating QR code:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
