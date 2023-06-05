const fetch = require('node-fetch');

class MeliObject {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.apiBaseUrl = 'https://api.mercadolibre.com';
  }

  async get(endpoint) {
    const url = `${this.apiBaseUrl}${endpoint}`;
    console.log("🚀 ~ file: MeliObject.js:10 ~ MeliObject ~ get ~ url:", url)
    const config = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    };
    console.log("🚀 ~ file: MeliObject.js:15 ~ MeliObject ~ get ~ config:", config)

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MeliObject;
