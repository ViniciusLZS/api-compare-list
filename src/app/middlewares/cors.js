module.exports = (request, response, next) => {
  const originURL = String(process.env.ORIGIN_URL)
  // const allowedOrigins = [originURL];
  // const origin = request.headers.origin;

  // if (allowedOrigins.includes(origin)) {
  // }
  response.setHeader('Access-Control-Allow-Origin', originURL);

  response.setHeader('Access-Control-Allow-Methods', '*');
  response.setHeader('Access-Control-Allow-Headers', '*');
  response.setHeader('Access-Control-Max-Age', '10');
  next();
}
