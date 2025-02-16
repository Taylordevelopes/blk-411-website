import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

// Function to handle incoming POST request
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      name,
      category,
      description,
      phoneNumber,
      email,
      website,
      street,
      city,
      state,
      postalCode,
      latitude,
      longitude,
      tags,
      agentCode,
    } = data;

    // Convert empty strings to null for latitude and longitude
    const lat = latitude || null;
    const lon = longitude || null;
    const country = "USA"; // Country is always USA

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert the business data
      const businessInsertQuery = `
        INSERT INTO Businesses (Name, Description, PhoneNumber, Email, Website, Category, AgentCode, CreatedAt, UpdatedAt)
        VALUES ($1, $2, $3, $4, $5, $6,$7, NOW(), NOW())
        RETURNING BusinessID
      `;

      const businessResult = await client.query(businessInsertQuery, [
        name,
        description,
        phoneNumber,
        email,
        website,
        category,
        agentCode || null,
      ]);
      const businessId = businessResult.rows[0].businessid;

      // Insert the address data
      const addressInsertQuery = `
        INSERT INTO Addresses (BusinessID, Street, City, State, PostalCode, Country, Latitude, Longitude, Location, CreatedAt, UpdatedAt)
        VALUES ($1, $2, $3, $4, $5, $6, $7::double precision, $8::double precision, 
          CASE 
            WHEN $7 IS NOT NULL AND $8 IS NOT NULL 
            THEN ST_SetSRID(ST_MakePoint($8::double precision, $7::double precision), 4326)
            ELSE NULL
          END, NOW(), NOW())
      `;

      await client.query(addressInsertQuery, [
        businessId,
        street,
        city,
        state,
        postalCode,
        country,
        lat,
        lon,
      ]);

      // Insert tags
      const tagInsertQuery = `
        INSERT INTO Tags (TagName, CreatedAt)
        VALUES ($1, NOW())
        ON CONFLICT (TagName) DO NOTHING
        RETURNING TagID
      `;
      const businessTagInsertQuery = `
        INSERT INTO BusinessTags (BusinessID, TagID, CreatedAt)
        VALUES ($1, $2, NOW())
      `;

      for (const tag of tags.split(",")) {
        const tagResult = await client.query(tagInsertQuery, [tag.trim()]);
        const tagId =
          tagResult.rows.length > 0 ? tagResult.rows[0].tagid : null;

        if (tagId) {
          await client.query(businessTagInsertQuery, [businessId, tagId]);
        }
      }

      // Commit transaction
      await client.query("COMMIT");

      return NextResponse.json(
        { message: "Business added successfully!" },
        { status: 201 }
      );
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error adding business:", err);
    return NextResponse.json(
      { message: "Failed to add business", error: (err as Error).message },
      { status: 500 }
    );
  }
}
