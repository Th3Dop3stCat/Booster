const express = require('express');
const passport = require('passport');
const ShopifyStrategy = require('passport-shopify').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const Shopify = require('shopify-api-node');
const app = express();
const port = process.env.PORT || 3000;

const apiKey = 'd476259f42513821667d199448f2c58d';
const apiSecret = '68337f8a7e1fd1ab07c3f138c5518b70';
const callbackUrl = 'http://dopecatcustoms.com';

app.use(
  session({
    secret: 'J8sDv3pL1zK0gHq9mR6tY1uC2fO5lN4bA7xW3hZ6eV1jQ5rU8yI0aSt9oP6nX2d',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

passport.use(
  new ShopifyStrategy(
    {
      clientID: apiKey,
      clientSecret: apiSecret,
      callbackURL: callbackUrl,
      scope: ['read_products', 'write_products'],
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, {
        accessToken: accessToken,
        shop: profile._json.shop_domain,
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get('/auth', passport.authenticate('shopify'));

app.get(
  '/auth/callback',
  passport.authenticate('shopify', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  }
);

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('Welcome to your Shopify SEO app');
  } else {
    res.redirect('/auth');
  }
});

app.get('/products', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth');
  }

  const shopify = new Shopify({
  shopName: req.user.shop,
  accessToken: req.user.accessToken,
});

  try {
    const products = await shopify.product.list();
    const seoProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      seoTitle: product.metafields_global_title_tag,
      seoDescription: product.metafields_global_description_tag,
    }));

    res.json(seoProducts);
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});

app.put('/products/:id/seo', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth');
  }

  const { id } = req.params;
  const { seoTitle, seoDescription } = req.body;

  if (!seoTitle || !seoDescription) {
    return res.status(400).send('Missing SEO title or description');
  }

  const shopify = new Shopify({
    shopName: req.user.shop,
    accessToken: req.user.accessToken,
  });

  try {
    const updatedProduct = await shopify.product.update(id, {
      metafields_global_title_tag: seoTitle,
      metafields_global_description_tag: seoDescription,
    });

    res.json({
      id: updatedProduct.id,
      title: updatedProduct.title,
      seoTitle: updatedProduct.metafields_global_title_tag,
      seoDescription: updatedProduct.metafields_global_description_tag,
    });
  } catch
(error) {
res.status(500).send('Error updating product SEO metadata');
}
});

//app.listen(port, () => {
app.listen(port, () => {});
console.log("" at http://localhost:${port}