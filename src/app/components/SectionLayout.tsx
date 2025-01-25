"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface SectionLayoutProps {
  heroImage: string; // Path to the hero image
  title: string; // Title for the description section
  description?: string; // Optional text content for the description section
  features?: string[]; // Optional array of features (bulleted list)
  descriptionImage?: string; // Optional image for the description section
  headerText?: string; // Optional header text for the hero section
  buttonText?: string; // Optional button text
  buttonLink?: string; // Optional button link
}

function SectionLayout({
  heroImage,
  title,
  description,
  features,
  descriptionImage,
  headerText,
  buttonText,
  buttonLink,
}: SectionLayoutProps) {
  return (
    <div>
      {/* Hero Image Section */}
      <div
        className="hero-container position-relative text-center"
        style={{ position: "relative", textAlign: "center", color: "white" }}
      >
        <Image
          src={heroImage}
          alt="Hero"
          layout="responsive"
          width={1920} // Assumes a default 16:9 aspect ratio
          height={1080}
          objectFit="cover"
          className="hero-image"
        />
        {headerText && (
          <h1 className="position-absolute top-50 start-50 translate-middle fw-bold hero-header">
            {headerText}
          </h1>
        )}
      </div>

      {/* Description or Features Section */}
      <div className="description-container container my-5">
        <h1 className="text-center mb-4">{title}</h1>
        <div className="row align-items-center">
          <div className={`col-md-${descriptionImage ? 6 : 12}`}>
            {description && (
              <p
                style={{
                  fontSize: "1.75rem",
                  textAlign: "center",
                  color: "#990000",
                  lineHeight: "2rem",
                }}
                dangerouslySetInnerHTML={{ __html: description }}
              ></p>
            )}
            {features && (
              <ul
                style={{
                  fontSize: "1.5rem",
                  color: "#333",
                  listStyleType: "disc",
                  paddingLeft: "20px",
                  textAlign: "left",
                }}
              >
                {features.map((feature, index) => (
                  <li key={index} className="mb-2">
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            {buttonText && buttonLink && (
              <div className="text-center mt-4 mb-4 mb-md-0">
                <Link href={buttonLink} className="btn btn-primary btn-lg">
                  {buttonText}
                </Link>
              </div>
            )}
          </div>
          {descriptionImage && (
            <div className="col-md-6 text-center">
              <Image
                src={descriptionImage}
                alt="Description"
                width={300}
                height={450}
                objectFit="contain"
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .hero-header {
          font-size: 3rem;
          padding: 20px;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          max-width: 90%;
          line-height: 1.2;
          text-align: center;
        }

        @media (max-width: 768px) {
          .hero-header {
            font-size: 2rem;
            padding: 15px;
          }
        }

        @media (max-width: 480px) {
          .hero-header {
            font-size: 1.5rem;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default SectionLayout;
