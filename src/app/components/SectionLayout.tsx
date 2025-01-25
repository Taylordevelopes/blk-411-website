"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Carousel from "react-bootstrap/Carousel";

interface CarouselImage {
  src: string;
  headerText: string;
  position: "top-left" | "top-center" | "top-right" | "center";
  maxWidth?: string; // Optional max-width for individual slides
  marginBottom?: string; // Optional margin-bottom for longer text
}

interface SectionLayoutProps {
  heroImage?: string; // Optional hero image path
  carouselImages?: CarouselImage[]; // Array of carousel images with headers and positions
  title: string; // Title for the description section
  description?: string; // Optional text content for the description section
  features?: string[]; // Optional array of features (bulleted list)
  descriptionImage?: string; // Optional image for the description section
  buttonText?: string; // Optional button text
  buttonLink?: string; // Optional button link
  headerText?: string;
}

function SectionLayout({
  heroImage,
  carouselImages,
  title,
  description,
  features,
  descriptionImage,
  buttonText,
  buttonLink,
}: SectionLayoutProps) {
  // Helper function to determine header position styles
  const getPositionStyles = (position: string): React.CSSProperties => {
    switch (position) {
      case "top-left":
        return {
          position: "absolute",
          top: "15%",
          left: "5%",
          textAlign: "left" as const,
        };
      case "top-center":
        return {
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center" as const,
        };
      case "top-right":
        return {
          position: "absolute",
          top: "15%",
          right: "5%",
          textAlign: "right" as const,
        };
      case "center":
      default:
        return {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center" as const,
        };
    }
  };

  return (
    <div>
      {/* Hero Image or Carousel Section */}
      <div
        className="hero-container position-relative text-center"
        style={{ position: "relative", textAlign: "center", color: "white" }}
      >
        {carouselImages && carouselImages.length > 0 ? (
          <Carousel>
            {carouselImages.map((item, index) => (
              <Carousel.Item key={index}>
                <Image
                  src={item.src}
                  alt={`Slide ${index + 1}`}
                  layout="responsive"
                  width={1920}
                  height={1080}
                  objectFit="cover"
                  className="hero-image"
                />
                <Carousel.Caption
                  style={{
                    ...getPositionStyles(item.position),
                  }}
                >
                  <h1
                    className="carousel-header"
                    style={{
                      maxWidth: item.maxWidth || "60%", // Default max-width if not provided
                      marginBottom: item.marginBottom || "0", // Default margin-bottom
                    }}
                  >
                    {item.headerText}
                  </h1>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          heroImage && (
            <Image
              src={heroImage}
              alt="Hero"
              layout="responsive"
              width={1920}
              height={1080}
              objectFit="cover"
              className="hero-image"
            />
          )
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
        .carousel-header {
          font-size: 2rem;
          padding: 20px;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
          color: #fff;
          text-align: center;
          line-height: 1.2;
        }

        @media (max-width: 768px) {
          .carousel-header {
            font-size: 2rem;
            padding: 15px;
            max-width: 80%;
          }
        }

        @media (max-width: 480px) {
          .carousel-header {
            font-size: 12px;
            padding: 10px;
            max-width: 90%;
          }
        }
      `}</style>
    </div>
  );
}

export default SectionLayout;
