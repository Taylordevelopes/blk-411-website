"use client";

import { useState } from "react";
import { Container, Form, Button, Image, Alert } from "react-bootstrap";

export default function AgentQR() {
  const [agentCode, setAgentCode] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateQR = async () => {
    setQrCode(null); // Reset previous QR codes
    setErrorMessage(null); // Clear error message

    if (!agentCode.trim()) {
      setErrorMessage("Please enter an agent code.");
      return;
    }

    try {
      const res = await fetch(`/api/generate-qr-code?agentCode=${agentCode}`);

      if (res.status === 404) {
        setErrorMessage("Invalid agent code. Please check and try again.");
        return;
      }

      const data = await res.json();

      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setQrCode(data.qrCode);
      }
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      {/* Header Section */}
      <h1 className="mb-4 text-primary fw-bold">Agent QR Code Generator</h1>
      <p className="text-muted text-center" style={{ maxWidth: "500px" }}>
        Enter your unique agent code below to generate your referral QR code.
        Show this to potential customers so they can register with your
        referral!
      </p>

      {/* Input Section */}
      <div
        className="bg-light p-4 rounded shadow-sm w-100"
        style={{ maxWidth: "400px" }}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Enter Agent Code:</Form.Label>
            <Form.Control
              type="text"
              value={agentCode}
              onChange={(e) => setAgentCode(e.target.value)}
              maxLength={6}
              placeholder="e.g., ABC123"
              className="text-center"
            />
          </Form.Group>
          <Button
            variant="primary"
            className="w-100"
            onClick={handleGenerateQR}
          >
            Generate QR Code
          </Button>
        </Form>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <Alert
          variant="danger"
          className="mt-3 w-100 text-center"
          style={{ maxWidth: "400px" }}
        >
          {errorMessage}
        </Alert>
      )}

      {/* QR Code Display */}
      {qrCode && (
        <div className="mt-5 p-3 bg-white shadow-sm rounded text-center">
          <h4 className="text-success">Your QR Code</h4>
          <p className="text-muted">Scan this to refer new businesses!</p>
          <Image
            src={qrCode}
            alt="Agent QR Code"
            fluid
            className="border rounded p-2"
          />
        </div>
      )}
    </Container>
  );
}
