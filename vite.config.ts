import { defineApplicationConfig } from '@vben/vite-config';
 

export default defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'element-plus/dist/locale/zh-cn.mjs',
        'element-plus/dist/locale/en.mjs',
      ],
    },
    server: {
      https:true,
      proxy: {
        '/oa-admin': {
          target: 'https://localhost:3000/',
          changeOrigin: true,
          ws: true,
          secure:false,
          configure: (proxy, options) => {
            console.log( 'oa-admin:', options.target);
            console.log('-----------------------------------');
          }, 
        },
      },
    }, 
  },
});
