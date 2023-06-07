const fetch = require('node-fetch');

class MeliObject {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.apiBaseUrl = 'https://api.mercadolibre.com';
  }

  async get(endpoint) {
    const url = `${this.apiBaseUrl}${endpoint}`;
    const config = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    };

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
