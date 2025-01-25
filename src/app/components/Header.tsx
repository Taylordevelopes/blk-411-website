"use client";

import React from "react";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

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
          className="justify-content-center"
        >
          {/* Navigation links on the right */}
          <Nav>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/aboutus">About Us</Nav.Link>
            <Nav.Link href="/features">Our Features</Nav.Link>
            <Nav.Link href="/registration">Register Your Business</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
