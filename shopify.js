const Shopify = require('shopify-api-node');
const config = require('./config');

function createShopifyInstance(accessToken, shop) {
  return new Shopify({
    shopName: shop,
    apiKey: config.SHOPIFY_API_KEY,
    password: accessToken,
    autoLimit: { calls: 2, interval: 1000, bucketSize: 35 },
  });
}

module.exports = { createShopifyInstance };
