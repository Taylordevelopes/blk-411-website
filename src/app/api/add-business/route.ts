import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(req: NextRequest) {
  const client = await pool.connect(); // ✅ Get a client from the pool

  try {
    const body = await req.json();
    const {
      businessData,
      addressData,
      tagsData,
    }: {
      businessData: {
        name: string;
        category: string;
        description?: string | null;
        phoneNumber: string;
        email: string;
        website?: string | null;
        agentCode?: string | null;
      };
      addressData: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        latitude: number;
        longitude: number;
      };
      tagsData: string[];
    } = body;

    // ✅ Begin transaction
    await client.query("BEGIN");

    // ✅ Insert into `businesses` table
    const businessResult = await client.query(
      `INSERT INTO businesses (name, category, description, phone_number, email, website, agent_id)
       VALUES ($1, $2, $3, $4, $5, $6, 
          (SELECT agent_id FROM agents WHERE agent_code = $7 LIMIT 1)) 
       RETURNING business_id`,
      [
        businessData.name,
        businessData.category,
        businessData.description || null,
        businessData.phoneNumber,
        businessData.email,
        businessData.website || null,
        businessData.agentCode || null,
      ]
    );

    const businessId = businessResult.rows[0].business_id;

    // ✅ Insert into `addresses` table
    await client.query(
      `INSERT INTO addresses (business_id, street, city, state, postal_code, country, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        businessId,
        addressData.street,
        addressData.city,
        addressData.state,
        addressData.postalCode,
        addressData.country,
        addressData.latitude,
        addressData.longitude,
      ]
    );

    // ✅ Insert tags if provided
    if (tagsData.length > 0) {
      const tagValues = tagsData
        .map((tag: string) => `(${businessId}, '${tag}')`)
        .join(",");
      await client.query(
        `INSERT INTO tags (business_id, tag_name) VALUES ${tagValues}`
      );
    }

    // ✅ Commit transaction
    await client.query("COMMIT");

    return NextResponse.json(
      { message: "Business added successfully!" },
      { status: 201 }
    );
  } catch (error) {
    await client.query("ROLLBACK"); // ✅ Rollback if any query fails
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client.release(); // ✅ Always release the client back to the pool
  }
}
