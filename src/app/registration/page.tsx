"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { FaQuestionCircle } from "react-icons/fa";
import { geocodeAddress } from "../utils/geocodeService";
import Image from "next/image";
import { STATES } from "../utils/statesList";

type FormData = {
  name: string;
  category: string;
  description?: string;
  phoneNumber: string;
  mobileNumber: string;
  email: string;
  website?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number | "";
  longitude: number | "";
  tags: string;
  agentCode?: string;
};

export default function CustomerAddBusiness() {
  const [agentCode, setAgentCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Extract the agent code from URL only on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("ref") || "";
      setAgentCode(code); // ✅ Only set this after hydration
    }
  }, []);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    description: "",
    phoneNumber: "",
    mobileNumber: "",
    email: "",
    website: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    latitude: "",
    longitude: "",
    tags: "",
    agentCode: "",
  });

  useEffect(() => {
    if (agentCode !== null) {
      setFormData((prev) => ({ ...prev, agentCode }));
    }
  }, [agentCode]);

  const [errors, setErrors] = useState<{
    phoneNumber?: string;
    email?: string;
    postalCode?: string;
  }>({});

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;

    // Always update the selected category
    setFormData((prevFormData) => {
      let updatedTags = prevFormData.tags.split(",").map((tag) => tag.trim());

      // Remove previous category tags if any
      const categoryList = [
        "Food & Dining",
        "Retail & Shopping",
        "Health & Wellness",
        "Beauty & Personal Care",
        "Home Services",
        "Automotive Services",
        "Financial Services",
        "Legal Services",
        "Real Estate",
        "Technology & IT",
        "Education & Tutoring",
        "Event Services",
        "Arts & Entertainment",
        "Construction & Contractors",
        "Medical Services",
        "Transportation",
        "Professional Services",
        "Travel & Hospitality",
        "Non-Profit & Community",
        "Childcare Services",
        "Pet Services",
        "Manufacturing & Industrial",
        "Media & Marketing",
        "Sports & Fitness",
      ];

      updatedTags = updatedTags.filter((tag) => !categoryList.includes(tag));

      // Add new selected category as a tag
      if (selectedCategory) {
        updatedTags.push(selectedCategory);
      }

      return {
        ...prevFormData,
        category: selectedCategory,
        tags: updatedTags.join(","),
      };
    });
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    let error = "";

    if (name === "phoneNumber" || name === "mobileNumber") {
      const formattedValue = value
        .replace(/[^\d]/g, "") // Remove non-digits
        .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"); // Format as (XXX) XXX-XXXX
      setFormData({ ...formData, [name]: formattedValue });

      // Validate phone number
      if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formattedValue)) {
        error = "Must be a valid phone number (no dashes -).";
      }
    } else if (name === "email") {
      setFormData({ ...formData, [name]: value });

      // Validate email
      if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(value)) {
        error = "Enter a valid email address.";
      }
    } else if (name === "postalCode") {
      setFormData({ ...formData, [name]: value });

      // Validate postal code
      if (!/^\d{5}$/.test(value)) {
        error = "Postal code must be 5 digits.";
      }
    } else if (name === "latitude" || name === "longitude") {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : parseFloat(value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Update errors state
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     // Step 1: Get latitude and longitude using Google Geocoding
  //     const { latitude, longitude } = await geocodeAddress(
  //       formData.street,
  //       formData.city,
  //       formData.state,
  //       formData.postalCode
  //     );

  //     // Step 2: Prepare business data
  //     const businessData = {
  //       ...formData,
  //       latitude,
  //       longitude,
  //       country: "USA", // Default country
  //     };

  //     console.log("Submitting business data:", businessData);

  //     // Step 3: Call your API to create PayPal order
  //     const response = await fetch("/api/create-paypal-order", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         purchase_units: [
  //           {
  //             reference_id: "business_registration",
  //             amount: {
  //               value: "76.00",
  //               currency_code: "USD",
  //             },
  //           },
  //         ],
  //         application_context: {
  //           brand_name: "Black 411", // Your business name
  //           locale: "en-US",
  //           shipping_preference: "NO_SHIPPING",
  //           user_action: "PAY_NOW", // Emphasize immediate payment
  //           return_url: "https://master.d1z33tci1o905c.amplifyapp.com/success",
  //           cancel_url: "https://yourwebsite.com/cancel",
  //           landing_page: "GUEST_CHECKOUT",
  //         },
  //       }),
  //     });
  //     const data = await response.json();

  //     if (response.ok && data.id) {
  //       console.log("Redirecting to PayPal with order ID:", data.id);

  //       // Store business data temporarily in sessionStorage for post-payment processing
  //       sessionStorage.setItem("businessData", JSON.stringify(businessData));

  //       // Redirect to PayPal checkout page
  //       window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.id}`;
  //     } else {
  //       throw new Error("Failed to create PayPal order.");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     alert("An error occurred. Please try again.");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Geocode address
      const { latitude, longitude } = await geocodeAddress(
        formData.street,
        formData.city,
        formData.state,
        formData.postalCode
      );

      // Step 2: Prepare data
      const businessData = {
        name: formData.name,
        category: formData.category,
        description: formData.description || null,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        website: formData.website || null,
        agentCode:
          formData.agentCode && formData.agentCode.trim() !== ""
            ? formData.agentCode
            : null,
        status: "Pending",
      };

      const addressData = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        latitude,
        longitude,
      };

      const citylocationsData = {
        city: formData.city,
        state: formData.state,
        latitude,
        longitude,
      };

      const tagsData = formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "")
        : [];

      console.log("Submitting business data:", {
        businessData,
        addressData,
        tagsData,
        citylocationsData,
      });

      // Step 3: Save to your API first
      const apiRes = await fetch("/api/add-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessData,
          addressData,
          tagsData,
          citylocationsData,
        }),
      });

      if (!apiRes.ok) {
        const errorData = await apiRes.json();
        throw new Error(errorData.message || "Failed to add business.");
      }

      const { businessId } = await apiRes.json(); // 🔥 Get returned business ID

      // ✅ Store businessId for status update later
      localStorage.setItem("businessId", businessId);

      // Optional: Store full data if needed post-payment
      sessionStorage.setItem(
        "businessData",
        JSON.stringify({
          businessData,
          addressData,
          tagsData,
          citylocationsData,
        })
      );

      // Step 4: Create PayPal order
      const paypalRes = await fetch("/api/create-paypal-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchase_units: [
            {
              reference_id: "business_registration",
              amount: {
                value: "75.00",
                currency_code: "USD",
              },
            },
          ],
          application_context: {
            brand_name: "Black 411",
            locale: "en-US",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            return_url: "https://theblack411.net/success",
            cancel_url: "https://theblack411.net/cancel",
            landing_page: "LOGIN",
          },
        }),
      });

      const paypalData = await paypalRes.json();

      if (paypalRes.ok && paypalData.id) {
        console.log("Redirecting to PayPal with order ID:", paypalData.id);
        window.location.href = `https://www.paypal.com/checkoutnow?token=${paypalData.id}`;
      } else {
        throw new Error("Failed to create PayPal order.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Submission error:", error.message);
        alert(`An error occurred: ${error.message}`);
      } else {
        console.error("Unknown submission error occurred.");
        alert("An unknown error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderTooltip = (message: string) => <Tooltip>{message}</Tooltip>;
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    const newTag = tagInput.trim();

    if (
      newTag &&
      !formData.tags
        .split(",")
        .map((t) => t.trim())
        .includes(newTag)
    ) {
      const updatedTags = formData.tags ? `${formData.tags},${newTag}` : newTag;

      setFormData({ ...formData, tags: updatedTags });
      setTagInput(""); // clear input
    }
  };
  const handleTagRemove = (index: number) => {
    const tagsArray = formData.tags.split(",").filter((_, i) => i !== index);
    setFormData({ ...formData, tags: tagsArray.join(",") });
  };

  return (
    <Container className="pb-5  ">
      <Row className="justify-content-center">
        <Col md={10}>
          <div className="text-center mb-4">
            <Image
              src="/blk411logonew.svg"
              alt="BLK 411 Logo"
              width={350} // Adjust size if needed
              height={350}
              priority
            />
            <h2 className="mt-3">Register Your Business</h2>
          </div>
          <Form onSubmit={handleSubmit}>
            {/* Business Details */}
            <h4>Business Details</h4>
            <Form.Group className="mb-3" controlId="businessName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter business name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="businessCategory">
              <Form.Label className="d-flex align-items-center">
                Category
                <OverlayTrigger
                  placement="left"
                  overlay={renderTooltip(
                    "Select the main category that best fits your business type."
                  )}
                >
                  <FaQuestionCircle
                    className="ms-2 text-primary"
                    style={{ cursor: "pointer" }}
                  />
                </OverlayTrigger>
              </Form.Label>

              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Retail & Shopping">Retail & Shopping</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Beauty & Personal Care">
                  Beauty & Personal Care
                </option>
                <option value="Home Services">Home Services</option>
                <option value="Automotive Services">Automotive Services</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Legal Services">Legal Services</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Technology & IT">Technology & IT</option>
                <option value="Education & Tutoring">
                  Education & Tutoring
                </option>
                <option value="Event Services">Event Services</option>
                <option value="Arts & Entertainment">
                  Arts & Entertainment
                </option>
                <option value="Construction & Contractors">
                  Construction & Contractors
                </option>
                <option value="Medical Services">Medical Services</option>
                <option value="Transportation">Transportation</option>
                <option value="Car Buying">Car Sales</option>
                <option value="Professional Services">
                  Professional Services
                </option>
                <option value="Travel & Hospitality">
                  Travel & Hospitality
                </option>
                <option value="Non-Profit & Community">
                  Non-Profit & Community
                </option>
                <option value="Childcare Services">Childcare Services</option>
                <option value="Pet Services">Pet Services</option>
                <option value="Manufacturing & Industrial">
                  Manufacturing & Industrial
                </option>
                <option value="Media & Marketing">Media & Marketing</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="businessDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter business description"
                rows={3}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="businessPhoneNumber">
              <Form.Label>Business Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter business phone number"
                isInvalid={!!errors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="businessMobileNumber">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter your mobile number"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="businessEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="businessWebsite">
              <Form.Label>Website or Social Handles</Form.Label>
              <Form.Control
                type=""
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website URL"
              />
            </Form.Group>

            {/* Address Details */}
            <h4>Address Details</h4>
            <Form.Group className="mb-3" controlId="addressStreet">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Enter street address"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="addressCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="addressState">
              <Form.Label>State</Form.Label>
              <Form.Select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value="">Select a state</option>
                {STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="addressPostalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
                isInvalid={!!errors.postalCode}
              />
              <Form.Control.Feedback type="invalid">
                {errors.postalCode}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Tags */}
            <h4>Tags</h4>
            <Form.Group className="mb-3" controlId="businessTags">
              <Form.Label>Tags</Form.Label>

              {/* Render tag chips */}
              <div className="d-flex flex-wrap align-items-center mb-2">
                {formData.tags.split(",").map((tag, index) =>
                  tag.trim() ? (
                    <span
                      key={index}
                      className="badge bg-primary text-white me-2 mb-2"
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      {tag.trim()}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        style={{ fontSize: "0.6em" }}
                        onClick={() => handleTagRemove(index)}
                      ></button>
                    </span>
                  ) : null
                )}
              </div>

              {/* Input + Add button */}
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Enter a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="me-2"
                />
                <Button
                  variant="success" // ✅ green background, white text
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="fw-bold text-white"
                >
                  + Press Here To Add Tag
                </Button>
              </div>
            </Form.Group>
            <h4>Agent Referral Code</h4>
            <Form.Group className="mb-3" controlId="agentCode">
              <Form.Label>Agent Code</Form.Label>
              <Form.Control
                type="text"
                name="agentCode"
                value={formData.agentCode}
                onChange={handleChange} // ✅ Ensure it's controlled when needed
                className="bg-light"
                readOnly={!!agentCode}
                placeholder="Enter agent code if applicable"
              />
            </Form.Group>

            {/* Submit Button */}
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Add Business"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
