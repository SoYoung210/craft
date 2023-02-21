import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  polyfill: false,
  siteMetadata: {
    title: `craft`,
    siteUrl: `https://craft.so-so.dev/`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Craft`,
        description: `Build, Collect user interfaces of the future what is exciting and challenging to create.`,
        lang: `ko`,
        icon: `src/images/icon.png`,
      },
    },
    'gatsby-plugin-vanilla-extract',
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /images/,
        },
      },
    },
  ],
};

export default config;
