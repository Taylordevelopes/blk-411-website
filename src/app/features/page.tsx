"use client";

import React from "react";
import SectionLayout from "../components/SectionLayout";

export default function FeaturesPage() {
  return (
    <div>
      <SectionLayout
        heroImage="/contact-header-pic.jpg"
        headerText="Our Features"
        title="Why Use Us?"
        features={[
          "The Black 411™ is  FAST…..SIMPLE….IMMEDIATE",
          "There is currently no charge to use the service. Use the service as many times as you’d like for free!",
          "Business pay as low as $75 per year to list with The Black 411.",
          "You can choose to receive quarterly reports with all the leads we sent to your business",
          "We also provide a Business finder for large corporation seeking minority vendors",
          "The Service is available 24 hours a day, 7 days per week. You get the numbers and locations you want when you need them!",
          "Easy Integration with Social Media Platforms",
          "Detailed Analytics to Track Your Business Performance",
          "Mobile-Friendly Design for On-the-Go Access",
        ]}
        descriptionImage="/our-features-page-pic.jpg"
        buttonText="Sign Up Now"
        buttonLink="/registrtation"
      />
    </div>
  );
}
