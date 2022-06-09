import { defineConfig } from 'umi';
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import routes from './src/route';

export default defineConfig({
  title: 'umi-template',
  nodeModulesTransform: {
    type: 'none'
  },
  hash: true,
  routes: routes,
  fastRefresh: {},
  history: { type: "hash" },
  antd: {},
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading'
  },
  // 反向代理
  proxy: {
    "/idms/": {
      target: "https://sdz.yiyatong.net.cn", // 设置代理的目标，即真实的服务器地址
      changeOrigin: true, // 设置是否跨域请求资源
      secure: false  // 若代理的地址是https协议，需要配置这个属性
      // "pathRewrite": { "^/api" : "" } // 表示是否重写请求地址，比如这里的配置，就是把 /api 替换成空字符
    }
  },
  targets: {
    ie: 11
  },
  chainWebpack(config) {
    // 使用day.js替换moment.js
    config.plugin('AntdDayjsWebpackPlugin').use(AntdDayjsWebpackPlugin);

    // gzip压缩
    if(process.env.NODE_ENV === 'production'){
      config
        .plugin('compression-webpack-plugin')
        .use(CompressionPlugin, [{
          test: /\.js$|\.html$|\.css$/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        }])
    }
  }
});
