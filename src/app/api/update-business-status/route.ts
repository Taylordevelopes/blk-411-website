import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { businessId, newStatus } = await req.json();

    if (!businessId || !newStatus) {
      return NextResponse.json(
        { message: "Missing businessId or newStatus." },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    await client.query(
      `UPDATE businesses SET status = $1, updatedat = NOW() WHERE businessid = $2`,
      [newStatus, businessId]
    );
    client.release();

    return NextResponse.json({ message: "Status updated successfully." });
  } catch (error) {
    console.error("🚨 Error updating status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
