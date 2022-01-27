const webpack = require('webpack');

// 生成一个H5，自动引入所有bundle
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 编译进度条
const chalk = require('chalk');
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { resolveApp, isEnvProduction } = require('./util');

module.exports = {
  // 入口文件
  entry: {
    index: '/src/index.js',
  },
  // 输出路径
  output: {
    // bundle 文件名 在生产环境添加 hash
    filename: isEnvProduction ? '[name].[contenthash].bundle.js' : '[name].bundle.js',

    // bundle 文件路径
    path: resolveApp('dist'),

    // 编译前清除目录
    clean: true,
    pathinfo: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template : '/index.html', // 生成时的模版html文件
      title: 'release_v0', // html中的title，需要在模版html中获取配置 <%= htmlWebpackPlugin.options.title %>
    }),
    // 为进度百分比添加了加粗和绿色高亮态样式
    new ProgressBarPlugin({format: ` :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`}),
    new MiniCssExtractPlugin(),
    // 配置全局/共享的 loader 配置
    new webpack.LoaderOptionsPlugin({
      options: {
        // modules 表示 webpack 解析模块时需要解析的目录
        modules: [
          'node-modules',
          'src',
        ]
      }
    })
  ],
  resolve: {
    extensions: ['.tsx','.js'],
    symlinks: false,
    // alias: {
    // 'react-dom': '@hot-loader/react-dom'
    // }
  },
  module: {
    rules: [
      // 内置 Asset Modules ，将 images 图像混入我们的系统中，只需要修改相关配置
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: [
          resolveApp('src'),
        ],
        type: 'asset/resource'
      },
      // 内置 Asset Modules 可以配置接收字体文件
      // 在实际开发过程中，推荐将大图片/字体文件 上传至 CDN，提高加载速度。
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        include: [
          resolveApp('src'),
        ],
        type: 'asset/resource'
      },
      {
        test: /\.css$/i,
        exclude: resolveApp('node_modules'),
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 css 转化成 CommonJS 模块
          'css-loader',
        ] 
      },
      {
        test: /\.less$/,
        exclude: resolveApp('node_modules'),
        use: [
          // style-loader和MiniCssExtractPlugin.loader不能同时使用 
          // 仅生产环境 分离css  开发环境 将 js 字符串生成为 style 节点
          isEnvProduction ? MiniCssExtractPlugin.loader  : 'style-loader', 
          'css-loader',
          // 将 less 编译成 CSS
          'less-loader',
        ]
      },
      {
        test: /\.module\.less$/,
        // include: path.resolve(__dirname, 'src'),
        use: [
          isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              // Enable CSS MOdules features
              modules: true,
              // 0 => no loaders(default)
              // 1 => postcss-loader;
              // 2 => postcss-loader, less-loader
              importLoaders: 2,
            }
          },
          // 将 postcss 编译成 css 
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-preset-env',],
                ],
              }
            }
          },
          {
            loader: 'thread-loader',
            options: {
              workerParallelJobs: 2
            }
          },
          'less-loader',
        ]
      },
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: resolveApp('node_modules'),
        use: [
          {
            loader: 'thread-loader',
            options: {
              workerParallelJobs: 2
            }
          },
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2015',
            },
          }
        ] 
      }
    ],
  },
  cache: {
    type: "filesystem", // 使用文件缓存
  },

}