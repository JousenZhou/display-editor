const path = require('path');
function resolve(dir) {
    return path.join(__dirname, './', dir);
}
module.exports = {
    /* 静态资源路径*/
    publicPath: './',
    chainWebpack: (config) => {
        config.module.rule('svg').exclude.add(resolve('src/svg')).end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/svg'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            });
    }
};
