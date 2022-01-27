const { merge } = require('webpack-merge');

// 打包体积分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 压缩 js
const TerserPlugin = require('terser-webpack-plugin');
// 压缩 css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// 从js中抽离出css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 去除无用的样式
const glob = require('glob');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, { 
  mode: 'production', 
  plugins: [
    // 打包体积分析
    new BundleAnalyzerPlugin(),
    // 提取 CSS
    new MiniCssExtractPlugin({
      filename: "[hash].[name].css",
    }),
    // CSS Tree Shaking
    new PurgeCSSPlugin({
      paths: glob.sync(`./src/**/*`,  { nodir: true }),
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerPlugin({
        parallel: 4,
      }),
    ],
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      // 重复打包问题
      cacheGroups:{
        vendors:{ // node_modules里的代码
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          // name: 'vendors', 一定不要定义固定的name
          priority: 10, // 优先级
          enforce: true 
        }
      }
    },
    runtimeChunk: true,
    moduleIds: 'deterministic',
  },
});