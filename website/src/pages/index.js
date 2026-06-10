import React from "react";
import { Redirect } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

// Landing page now redirects straight to the docs Getting Started page.
export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const docsUrl = `${siteConfig.baseUrl}docs`.replace(/\/{2,}/g, "/");
  return <Redirect to={docsUrl} />;
}
