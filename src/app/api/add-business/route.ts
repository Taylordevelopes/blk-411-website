import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("🚀 Received payload:", JSON.stringify(data, null, 2));

    // Ensure correct data structure
    const {
      name,
      category,
      description = null,
      phoneNumber,
      email,
      website = null,
      street,
      city,
      state,
      postalCode,
      latitude,
      longitude,
      tags = [],
      agentCode,
    } = data;

    console.log("🔹 Extracted Name:", name);

    const country = "USA";
    const lat = latitude || null;
    const lon = longitude || null;

    // Get a database connection
    const client = await pool.connect();

    try {
      await client.query("BEGIN"); // Start transaction

      // 1️⃣ Retrieve agent ID if an agent code is provided
      let agentId: number | null = null;
      if (agentCode && agentCode.trim() !== "") {
        const agentQuery = `SELECT agentid FROM agents WHERE agent_code = $1`;
        const agentResult = await client.query(agentQuery, [agentCode]);

        if (agentResult.rows.length > 0) {
          agentId = agentResult.rows[0].agentid;
        }
      }

      // 2️⃣ Insert business
      const businessInsertQuery = `
        INSERT INTO businesses (name, description, phonenumber, email, website, category, agentid, createdat, updatedat)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING businessid;
      `;

      const businessResult = await client.query(businessInsertQuery, [
        name,
        description,
        phoneNumber,
        email,
        website,
        category,
        agentId, // Can be NULL if no agentCode found
      ]);

      const businessId = businessResult.rows[0].businessid;

      // 3️⃣ Insert address
      const addressInsertQuery = `
        INSERT INTO addresses (businessid, street, city, state, postalcode, country, latitude, longitude, location, createdat, updatedat)
        VALUES ($1, $2, $3, $4, $5, $6, $7::double precision, $8::double precision, 
          CASE 
            WHEN $7 IS NOT NULL AND $8 IS NOT NULL 
            THEN ST_SetSRID(ST_MakePoint($8::double precision, $7::double precision), 4326)
            ELSE NULL 
          END, NOW(), NOW());
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

      // 4️⃣ Insert tags & associate with business
      if (tags.length > 0) {
        const tagInsertQuery = `
          INSERT INTO tags (tagname, createdat)
          VALUES ($1, NOW())
          ON CONFLICT (tagname) DO NOTHING
          RETURNING tagid;
        `;

        const businessTagInsertQuery = `
          INSERT INTO businesstags (businessid, tagid, createdat)
          VALUES ($1, $2, NOW());
        `;

        for (const tag of tags) {
          const tagResult = await client.query(tagInsertQuery, [tag.trim()]);
          const tagId =
            tagResult.rows.length > 0 ? tagResult.rows[0].tagid : null;

          if (tagId) {
            await client.query(businessTagInsertQuery, [businessId, tagId]);
          }
        }
      }

      // 5️⃣ Commit transaction
      await client.query("COMMIT");

      return NextResponse.json(
        { message: "Business added successfully!" },
        { status: 201 }
      );
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release(); // Release DB connection
    }
  } catch (err) {
    console.error("Error adding business:", err);
    return NextResponse.json(
      { message: "Failed to add business", error: (err as Error).message },
      { status: 500 }
    );
  }
}
