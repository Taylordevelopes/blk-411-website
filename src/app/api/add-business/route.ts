import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    //Data I am expecting
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

    //Data either be Present from form or Null
    const country = "USA";
    const lat = latitude || null;
    const lon = longitude || null;

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Check if agent code is provided and find agent_id
      let agentId: number | null = null;
      if (agentCode) {
        const agentQuery = `
          SELECT agent_id FROM agents WHERE agent_code = $1
        `;
        const agentResult = await client.query(agentQuery, [agentCode]);
        if (agentResult.rows.length > 0) {
          agentId = agentResult.rows[0].agent_id;
        }
      }

      // 2. Insert the business data
      const businessInsertQuery = `
      INSERT INTO businesses 
        (name, description, phonenumber, email, website, category, agentid, createdat, updatedat)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING businessid;
    `;

      const businessResult = await client.query(businessInsertQuery, [
        name,
        description,
        phoneNumber,
        email,
        website,
        category,
        agentId,
      ]);
      const businessId = businessResult.rows[0].business_id;

      // 3. Insert the address data
      const addressInsertQuery = `
          INSERT INTO addresses 
            (businessid, street, city, state, postalcode, country, latitude, longitude, location, createdat, updatedat)
          VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, 
            CASE 
              WHEN $7 IS NOT NULL AND $8 IS NOT NULL 
              THEN ST_SetSRID(ST_MakePoint($8, $7), 4326) 
              ELSE NULL 
            END, NOW(), NOW())
          RETURNING addressid;
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

      // 4. Insert tags into Tags and BusinessTags tables
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

      for (const tag of tags.split(",")) {
        const tagResult = await client.query(tagInsertQuery, [tag.trim()]);
        const tagId =
          tagResult.rows.length > 0 ? tagResult.rows[0].tag_id : null;
        if (tagId) {
          await client.query(businessTagInsertQuery, [businessId, tagId]);
        }
      }

      // 5. Commit the transaction
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
