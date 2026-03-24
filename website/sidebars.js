/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "category",
      label: "OpenCerts",
      items: [
        "index",
        "transcripts",
        "skills-passport",
        "verifier",
        "multi-issuer",
      ],
    },
    {
      type: "category",
      label: "API",
      items: ["api/verify", "api/status"],
    },
    {
      type: "category",
      label: "Migrations",
      items: [
        "migrations/oa_to_trustvc",
        "migrations/renderer_w3c_vc",
      ],
    },
    {
      type: "category",
      label: "Misc",
      items: ["help/faq", "admin-website", "help/linkedin"],
    },
  ],
};

module.exports = sidebars;
