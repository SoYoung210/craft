// eslint-disable-next-line no-undef
module.exports = {
  presets: [
    'babel-preset-gatsby',
    [
      '@babel/preset-env',
      {
        loose: true,
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    ['@babel/preset-typescript'],
  ],
};
