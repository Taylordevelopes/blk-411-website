"use client";

import React from "react";
import Container from "react-bootstrap/Container";

export default function CancelPage() {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center py-5"
      style={{ minHeight: "100vh" }}
    >
      <h1 className="text-danger fw-bold">Payment Canceled</h1>
      <p className="lead mt-3 mb-4" style={{ maxWidth: "600px" }}>
        It looks like you canceled your PayPal checkout. No payment has been
        processed. If this was a mistake, you can return to the registration
        form and try again.
      </p>
      <a href="/registration" className="btn btn-primary">
        Return to Registration
      </a>
    </Container>
  );
}
