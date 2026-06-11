// @ts-check
const { themes } = require("prism-react-renderer");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "OpenCerts",
  tagline: "An easy way to check and verify your certificates",
  favicon: "img/favicon.svg",

  url: "https://docs.opencerts.io",
  baseUrl: "/",

  organizationName: "IMDA",
  projectName: "opencerts-documentation",

  onBrokenLinks: "warn",

  markdown: {
    format: "detect",
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: "../docs",
          sidebarPath: require.resolve("./sidebars.js"),
          lastVersion: "current",
          versions: {
            current: {
              label: "v3",
              path: "",
            },
            v2: {
              label: "v2",
              path: "v2",
            },
            v1: {
              label: "v1",
              path: "v1",
            },
          },
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/favicon.svg",
      navbar: {
        title: "OpenCerts",
        logo: {
          alt: "OpenCerts Logo",
          src: "img/favicon.svg",
        },
        items: [
          {
            type: "docsVersionDropdown",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        logo: {
          alt: "OpenCerts",
          src: "img/logo.svg",
          href: "https://opencerts.io",
          width: 170,
          height: 45,
        },
        links: [
          {
            title: null,
            items: [
              {
                html: '<a href="/" class="footer__logo-link"><img src="/img/favicon.svg" alt="OpenCerts" width="66" height="58" /></a>',
              },
            ],
          },
          {
            title: "Docs",
            items: [
              {
                label: "Getting Started",
                to: "/docs",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discussions",
                href: "https://github.com/OpenCerts/opencerts-website/discussions",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/Opencerts",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} OpenCerts`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
      algolia: {
        appId: "HCPQ0M479I",
        apiKey: "3ad9c57c64dde8b6e48aaf70e0e7b979",
        indexName: "opencerts",
      },
      colorMode: {
        defaultMode: "light",
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
    }),
};

module.exports = config;
