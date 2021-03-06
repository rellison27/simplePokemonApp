const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/pokemon",
    createProxyMiddleware({
      target: "https://pokeapi.co/api/v2",
      changeOrigin: true
    })
  );
};
