import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(req: NextRequest) {
  const client = await pool.connect();

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
        mobileNumber?: string | null;
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

    // ✅ Get `agentid` from `agents` using `agentcode`
    let agentId: number | null = null;
    if (businessData.agentCode) {
      const agentResult = await client.query(
        `SELECT agentid FROM agents WHERE agentcode = $1 LIMIT 1`,
        [businessData.agentCode]
      );
      agentId =
        agentResult.rows.length > 0 ? agentResult.rows[0].agentid : null;
    }

    // ✅ Insert into `businesses` table
    const businessResult = await client.query(
      `INSERT INTO businesses (name, category, description, phonenumber, mobilenumber, email, website, agentid, status, createdat, updatedat)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW(), NOW()) 
       RETURNING businessid`,
      [
        businessData.name,
        businessData.category,
        businessData.description || null,
        businessData.phoneNumber,
        businessData.mobileNumber || null,
        businessData.email,
        businessData.website || null,
        agentId, // ✅ Set `agentid` correctly
      ]
    );

    const businessId = businessResult.rows[0].businessid;

    // ✅ Insert into `addresses` table
    await client.query(
      `INSERT INTO addresses (businessid, street, city, state, postalcode, country, latitude, longitude, isprimary, createdat, updatedat)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, NOW(), NOW())`,
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

    // ✅ Handle `tagsData`
    if (tagsData.length > 0) {
      for (const tag of tagsData) {
        // Check if tag exists
        const tagResult = await client.query(
          `SELECT tagid FROM tags WHERE tagname = $1`,
          [tag]
        );
        let tagId = tagResult.rows.length > 0 ? tagResult.rows[0].tagid : null;

        // If tag doesn't exist, insert new tag
        if (!tagId) {
          const newTagResult = await client.query(
            `INSERT INTO tags (tagname, createdat) VALUES ($1, NOW()) RETURNING tagid`,
            [tag]
          );
          tagId = newTagResult.rows[0].tagid;
        }

        // Link tag to business in `businesstags`
        await client.query(
          `INSERT INTO businesstags (businessid, tagid, createdat) VALUES ($1, $2, NOW())`,
          [businessId, tagId]
        );
      }
    }

    // ✅ Commit transaction
    await client.query("COMMIT");

    return NextResponse.json(
      { message: "Business added successfully!", businessId },
      { status: 201 }
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("🚨 Database Insert Error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    client.release(); // ✅ Always release the client back to the pool
  }
}
