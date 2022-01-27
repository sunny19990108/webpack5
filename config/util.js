const fs = require('fs');
const path = require('path');

/**
 * path.resolve(__dirname, 'src')  返回当前文件绝对路径/src
 * resolveApp(relativePath)  返回relativePath文件所在的绝对路径
 */
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const isEnvProduction = process.env.NODE_ENV === 'production';
console.log('NODE_ENV', process.env.NODE_ENV);

module.exports = {
  resolveApp,
  isEnvProduction
}