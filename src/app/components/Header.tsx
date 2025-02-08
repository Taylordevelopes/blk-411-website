"use client";

import React from "react";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Link from "next/link";

function Header() {
  return (
    <Navbar
      bg="white"
      variant="light"
      expand="lg"
      className="py-3 shadow-sm border-bottom sticky-top"
    >
      <Container>
        {/* Logo on the left */}
        <Navbar.Brand href="/">
          <Image
            src="/blk411logo.png"
            alt="BLK 411 Logo"
            width={150}
            height={50}
          />
        </Navbar.Brand>

        {/* Navbar toggler for mobile view */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-between"
        >
          {/* Navigation links in the center */}
          <Nav className="mx-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/aboutus">About Us</Nav.Link>
            <Nav.Link href="/features">Our Features</Nav.Link>
            <Nav.Link href="/registration">Register Your Business</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
          </Nav>

          {/* "Black 411 Agent" button on the right */}
          <Link href="/agent-qr" passHref>
            <Button variant="primary" className="px-3 fw-bold">
              Black 411 Agent
            </Button>
          </Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
