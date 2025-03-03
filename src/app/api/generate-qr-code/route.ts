import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import QRCode from "qrcode";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const agentCode = url.searchParams.get("agentCode");

    if (!agentCode) {
      return NextResponse.json({ error: "Missing agentCode" }, { status: 400 });
    }

    // 🔍 Check if the agent code exists in the database
    const agentResult = await pool.query(
      "SELECT agentID FROM Agents WHERE agentCode = $1",
      [agentCode]
    );

    if (agentResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid agent code" },
        { status: 404 }
      );
    }

    const referralURL = `https://theblack411.net/registration?ref=${agentCode}`;
    const qrCodeDataURL = await QRCode.toDataURL(referralURL); // Generate QR code as Base64

    return NextResponse.json({ qrCode: qrCodeDataURL });
  } catch (error) {
    console.error("Error generating QR Code:", error);
    return NextResponse.json(
      { error: "Failed to generate QR Code" },
      { status: 500 }
    );
  }
}
