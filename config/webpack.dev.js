const webpack = require('webpack')
const { merge } = require('webpack-merge');

// 构建速度分析
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const smp = new SpeedMeasurePlugin();

// 热更新 react 组件 ,会和 上面的构建速度分析plugin冲突，报错提示 runtime is undefined
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const common = require('./webpack.common');
const { resolveApp } = require('./util');

// smp.wrap()
module.exports = merge(common, {
  // 模式
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
  // 开发工具, 开启 source map, 编译调试
  devtool: 'eval-cheap-module-source-map',
  // 实时编译，不用每次都运行 npx webpack --config config/webpack.prod.js 编译
  devServer: {
    static: './dist',
    hot: true, // 热更新
  },

});