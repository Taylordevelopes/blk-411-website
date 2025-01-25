"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Container from "react-bootstrap/Container";

export default function ConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    const processBusinessData = async () => {
      const businessData = sessionStorage.getItem("businessData");

      if (businessData) {
        try {
          const response = await fetch("/api/add-business", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: businessData,
          });

          if (response.ok) {
            sessionStorage.removeItem("businessData");
            router.push("/success"); // Redirect to success page
          } else {
            throw new Error("Failed to add business.");
          }
        } catch (error) {
          console.error("Error adding business:", error);
          alert("An error occurred while saving the business.");
        }
      }
    };

    processBusinessData();
  }, [router]);

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

      {/* Processing Message */}
      <h2 className="mt-4 text-primary">
        Processing your business registration...
      </h2>
      <p className="text-muted mt-3">
        Please wait while we complete the registration process.
      </p>
    </Container>
  );
}
