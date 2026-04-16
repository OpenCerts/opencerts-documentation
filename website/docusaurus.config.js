// @ts-check
const { themes } = require("prism-react-renderer");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "OpenCerts",
  tagline: "An easy way to check and verify your certificates",
  favicon: "img/favicon.svg",

  url: "https://opencerts.io",
  baseUrl: "/",

  organizationName: "Govtech",
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
        blog: {
          showReadingTime: true,
          onInlineAuthors: "ignore",
          onUntruncatedBlogPosts: "ignore",
        },
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
            type: "doc",
            docId: "index",
            position: "left",
            label: "Docs",
          },
          {
            type: "docsVersionDropdown",
            position: "right",
          },
          { to: "/blog", label: "Blog", position: "left" },
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
              {
                label: "APIs Reference",
                to: "/docs/api/verify",
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
                label: "Blog",
                to: "/blog",
              },
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
        appId: "BH4D9OD16A",
        apiKey: "7231563d1db842994698da0a519e93c8",
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
