import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Hr,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./types";

interface Props {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  brief: string;
}

const EnquiryEmail = ({ name, email, company, phone, brief }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New enquiry from {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>New enquiry</Heading>
        <Text style={lead}>A new project enquiry has been submitted via the website.</Text>
        <Hr style={hr} />
        <Section style={fieldGroup}>
          <Text style={label}>Name</Text>
          <Text style={value}>{name}</Text>
        </Section>
        <Section style={fieldGroup}>
          <Text style={label}>Email</Text>
          <Text style={value}>{email}</Text>
        </Section>
        {company ? (
          <Section style={fieldGroup}>
            <Text style={label}>Company</Text>
            <Text style={value}>{company}</Text>
          </Section>
        ) : null}
        {phone ? (
          <Section style={fieldGroup}>
            <Text style={label}>Phone</Text>
            <Text style={value}>{phone}</Text>
          </Section>
        ) : null}
        <Section style={fieldGroup}>
          <Text style={label}>Project brief</Text>
          <Text style={{ ...value, whiteSpace: "pre-wrap" }}>{brief}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>Unfold Media Corp · Coimbatore, India</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: EnquiryEmail,
  subject: "New enquiry from unfoldmediacorp.com",
  displayName: "Enquiry notification",
  previewData: {
    name: "Jane Doe",
    email: "jane@example.com",
    company: "Example Co",
    phone: "+91 98765 43210",
    brief: "We are looking for a cinematic brand film for our product launch.",
  },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#e8ded6",
  color: "#110f0b",
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  padding: "40px 20px",
};

const container = {
  backgroundColor: "#ede4dc",
  borderRadius: "2px",
  padding: "40px",
  maxWidth: "560px",
  margin: "0 auto",
};

const heading = {
  fontFamily: 'Playfair Display, Georgia, serif',
  fontSize: "28px",
  fontWeight: 600,
  margin: "0 0 16px",
  color: "#110f0b",
};

const lead = {
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 24px",
  color: "#110f0bb3",
};

const fieldGroup = {
  margin: "0 0 20px",
};

const label = {
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  color: "#ae9e8e",
  margin: "0 0 6px",
  fontFamily: 'JetBrains Mono, monospace',
};

const value = {
  fontSize: "15px",
  lineHeight: "1.6",
  margin: 0,
  color: "#110f0b",
};

const hr = {
  borderColor: "#c7b7a940",
  margin: "24px 0",
};

const footer = {
  fontSize: "12px",
  color: "#110f0bb3",
  margin: 0,
};
