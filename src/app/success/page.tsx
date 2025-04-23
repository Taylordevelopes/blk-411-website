"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Container from "react-bootstrap/Container";

export default function SuccessPage() {
  useEffect(() => {
    const activateBusiness = async () => {
      const businessId = localStorage.getItem("businessId");
      if (!businessId) {
        console.warn("⚠️ No businessId found in localStorage.");
        return;
      }

      try {
        const response = await fetch("/api/update-business-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId, newStatus: "Active" }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to update status.");
        }

        console.log("✅ Business marked as Active.");
        localStorage.removeItem("businessId"); // Clean up once done
      } catch (error) {
        console.error("🚨 Error updating business status:", error);
      }
    };

    activateBusiness();
  }, []);

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center py-5"
      style={{ minHeight: "100vh" }}
    >
      {/* Logo */}
      <Image
        src="/blk411logonew.svg"
        alt="BLK 411 Logo"
        width={350}
        height={350}
        priority
      />

      {/* Success Message */}
      <h1 className="mt-4 text-success fw-bold">Success!</h1>
      <p className="lead mt-3 mb-4" style={{ maxWidth: "600px" }}>
        Thank you for registering your business with The Black 411! Our team is
        now implementing your business in our database. You will receive a
        welcome package and more information to the email you provided within
        the next <strong>72 hours</strong>. We appreciate your trust in us.
      </p>

      {/* Feel-good Statement */}
      <p className="text-muted" style={{ maxWidth: "600px" }}>
        You&apos;ve just taken an important step towards empowering Black-owned
        businesses and strengthening our national community. Welcome to The
        Black 411 family!
      </p>
    </Container>
  );
}
