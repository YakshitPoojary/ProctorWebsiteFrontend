const { override, addBabelPreset, addBabelPlugin } = require('customize-cra');

module.exports = override(
  addBabelPreset('@babel/preset-env'),
  addBabelPreset('@babel/preset-react'),
  addBabelPreset('@babel/preset-typescript'),
  addBabelPlugin('@babel/plugin-proposal-private-property-in-object')
);
