"use client";

import React from "react";
import Container from "react-bootstrap/Container";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer
      id="contact-footer"
      className="position-relative bg-light py-5 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: "url('/footerimage.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "60% 15%", // Move the background image down
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "400px", // Adjust height as needed
        marginTop: "auto",
      }}
    >
      <style jsx>{`
        @media (max-width: 768px) {
          footer {
            background-position: center center !important; /* Center the background for mobile */
            background-size: cover !important; /* Ensure full image is visible on smaller screens */
            height: 420px !important; /* Adjust height for smaller screens */
          }
        }
      `}</style>
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay
          zIndex: 0,
        }}
      ></div>

      <Container
        className="d-flex flex-column align-items-center text-white text-center"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "600px",
          padding: "30px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 className="mb-4">Contact Us</h2>

        <p className="mb-2">
          <FaMapMarkerAlt className="me-2" /> Atlanta , GA
        </p>
        <p className="mb-2">
          <FaPhone className="me-2" /> (404) 939-4411
        </p>
        <p className="mb-4">
          <FaEnvelope className="me-2" /> sales@black411.net
        </p>

        {/* Social Media Links */}
        <div className="d-flex gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white fs-3"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white fs-3"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white fs-3"
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white fs-3"
          >
            <FaLinkedin />
          </a>
        </div>

        <p className="mt-4">
          &copy; {new Date().getFullYear()} The Black 411. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
