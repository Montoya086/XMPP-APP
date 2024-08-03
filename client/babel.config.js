module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@components': './components/index.ts',
          '@store': './store/index.ts',
          '@themes': './themes/index.ts',
        },
      },
    ],
  ],
};
