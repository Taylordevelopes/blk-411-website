"use client";

import React from "react";
import Image from "next/image";
import Container from "react-bootstrap/Container";

export default function SuccessPage() {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center py-5"
      style={{ minHeight: "100vh" }}
    >
      {/* Logo */}
      <Image
        src="/blk411logonew.svg"
        alt="BLK 411 Logo"
        width={350} // Adjust size as needed
        height={350}
        priority
      />

      {/* Success Message */}
      <h1 className="mt-4 text-success fw-bold">Success!</h1>
      <p className="lead mt-3 mb-4" style={{ maxWidth: "600px" }}>
        Thank you for registering your business with The Black 411! Our team is
        now implementing your business in our database, you will receive a
        welcome package and more information to the email you provided, within
        the next<strong> 72 hours</strong>. We appreciate your trust in us.
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
