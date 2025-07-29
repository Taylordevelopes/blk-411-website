import { useState } from "react";
import SectionLayout from "../components/SectionLayout";

export default function AboutPage() {
  return (
    <SectionLayout
      heroImage="/about-page-header-pic.jpg"
      title="About Us"
      description={`Welcome to <strong>The Black 411</strong>,<br/><br/> A revolutionary targeted information service that allows consumers to find Black Owned Businesses nationwide.<br/><br/>
        Blacks are one of the leading consumers in this country. We give over 95% of our wealth to other ethnic groups and we don’t get anything in return!! The Black 411™ was created to help grow Black Business, and to make it easier to find and locate black owned businesses..
        <br/><br/>
        
        <em>Join us in building a stronger, more connected national community. </em>`}
      descriptionImage="/woman-phone.jpg"
      buttonText="Register Your Business"
      buttonLink="/registration"
      headerText="Welcome to The Black 411"
    />
  );
}
