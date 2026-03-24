import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./index.module.css";

function HomeSplash() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroText}>
          <h2 className={styles.heroTitle}>
            <span className="title-orange">Open</span>
            <span className="title-blue">Certs</span>
          </h2>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <div className="pluginRowBlock">
            <div className="pluginWrapper buttonWrapper">
              <a
                className="button"
                href="https://opencerts.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try It Out
              </a>
            </div>
            <div className="pluginWrapper buttonWrapper">
              <a className="button" href="/docs">
                Read the doc
              </a>
            </div>
          </div>
          <div className={styles.blogPosts}>
            <h3>Check out our latest blog posts:</h3>
            <ul>
              <li>
                <a href="/blog/2020/11/17/transcript-2.1">
                  17/11/2020: Transcript v2.1
                </a>
              </li>
              <li>
                <a href="/blog/2020/10/08/new-error-types">
                  08/10/2020: New error types for better error handling
                </a>
              </li>
              <li>
                <a href="/blog/2020/05/12/multi-issuers">
                  12/05/2020: Multi issuers and deploy verify API
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.heroLogo}>
          <img
            src="/img/undraw_certification_aif8.png"
            alt="OpenCerts"
          />
        </div>
      </div>
    </header>
  );
}

function Feature({ image, title, dark }) {
  return (
    <section className={clsx(styles.featureSection, dark && styles.featureDark)}>
      <div className="container text--center">
        <h3>{title}</h3>
        <img src={image} alt={title} className={styles.featureImage} />
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomeSplash />
      <main>
        <Feature
          image="/img/what.png"
          title="What we can help you do"
          dark
        />
        <Feature image="/img/how.png" title="How it works" />
      </main>
    </Layout>
  );
}
