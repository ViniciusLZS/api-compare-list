module.exports = (request, response, next) => {
  // const originURL = String(process.env.ORIGIN_URL)
  // const allowedOrigins = [originURL];
  // const origin = request.headers.origin;

  // if (allowedOrigins.includes(origin)) {
  // }
  // response.setHeader('Access-Control-Allow-Origin', '*');

  // response.setHeader('Access-Control-Allow-Methods', '*');
  // response.setHeader('Access-Control-Allow-Headers', '*');
  // response.setHeader('Access-Control-Max-Age', '10');
  response.setHeader('Access-Control-Allow-Origin', 'https://compare-list.vercel.app');
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, HEAD');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Max-Age', '10');

  next();
}
