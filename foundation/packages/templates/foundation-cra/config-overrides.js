const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');
module.exports = override(
    addWebpackAlias({
        '~': path.resolve(__dirname, 'src'),
        '~/components': path.resolve(__dirname, 'src/components'),
        '~/pages': path.resolve(__dirname, 'src/pages'),
        '~/layouts': path.resolve(__dirname, 'src/layouts'),
        '~/features': path.resolve(__dirname, 'src/features'),
        '~/routes': path.resolve(__dirname, 'src/routes'),
        '~/store': path.resolve(__dirname, 'src/store'),
        '~/utils': path.resolve(__dirname, 'src/utils'),
        '~/styles': path.resolve(__dirname, 'src/styles'),
        '~/i18n': path.resolve(__dirname, 'src/i18n'),
    })
);
