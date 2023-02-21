import { graphql, useStaticQuery } from 'gatsby';
import { ReactNode } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';

interface Props {
  title: string;
  description?: string;
  thumbnailSrc: string | undefined;
  children?: ReactNode;
}
export default function SEO(props: Props) {
  const { title, description, thumbnailSrc, children } = props;
  const {
    title: siteTitle,
    description: defaultDescription,
    siteUrl,
  } = useSiteMetadata();
  const location = useLocation();

  const seo = {
    title: `${title} — ${siteTitle}`,
    description: description ?? defaultDescription,
    image: `${siteUrl}${thumbnailSrc}`,
    url: `${siteUrl}${location.pathname}`,
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:image" content={seo.image} />
      {children}
    </>
  );
}

function useSiteMetadata() {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
    }
  `);

  return data.site.siteMetadata;
}
