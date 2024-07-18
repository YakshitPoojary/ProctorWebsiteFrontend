const { override, addBabelPreset, addBabelPlugin } = require('customize-cra');

const addBabelPluginWithLooseMode = (pluginName) => {
  return (config) => {
    return addBabelPlugin([pluginName, { loose: true }])(config);
  };
};

module.exports = override(
  addBabelPreset(['@babel/preset-env', { loose: true }]),
  addBabelPreset('@babel/preset-react'),
  addBabelPreset('@babel/preset-typescript'),
  addBabelPluginWithLooseMode('@babel/plugin-proposal-private-property-in-object'),
  addBabelPluginWithLooseMode('@babel/plugin-transform-class-properties'),
  addBabelPluginWithLooseMode('@babel/plugin-transform-private-methods')
);
