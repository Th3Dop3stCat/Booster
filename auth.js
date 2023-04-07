const passport = require('passport');
const ShopifyStrategy = require('passport-shopify').Strategy;
const config = require('./config');

passport.use(
  new ShopifyStrategy(
    {
      clientID: config.SHOPIFY_API_KEY,
      clientSecret: config.SHOPIFY_API_SECRET,
      callbackURL: `${config.APP_URL}/auth/callback`,
      scope: config.SCOPES.split(','),
    },
    function (accessToken, refreshToken, profile, done) {
      // You can save the access token and store information to a database here
      done(null, { accessToken, shop: profile._json.shop });
    }
  )
);

module.exports = passport;
