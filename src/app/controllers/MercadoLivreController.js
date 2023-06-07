const MeliObject = require('../../database/MeliObject');

class MercadoLivreController {
  async categories(request, response) {
    try {
      const accessToken = process.env.ACCESS_TOKEN;
      const meliObject = new MeliObject(accessToken);

      const categories = await meliObject.get('/sites/MLB/categories');
      console.log("🚀 ~ file: MercadoLivreController.js:12 ~ MercadoLivreController ~ index ~ categories:", categories)

      if (categories.length > 0) {
        response.status(200).json(categories);
      } else {
        response.status(404).json({ error: 'No categories found' });
      }
    } catch (error) {
      console.log('Something went wrong', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }

  async products(request, response) {
    const { categoryId, product } = request.params;

    try {
      if (!product) {
        return response.status(400).json({ error: 'Name is required' });
      }

      if (!categoryId) {
        return response.status(400).json({ error: 'Name is required' });
      }

      const accessToken = process.env.ACCESS_TOKEN;
      const meliObject = new MeliObject(accessToken);

      const products = await meliObject.get(`/sites/MLB/search?category=${categoryId}&q=${encodeURIComponent(product)}`);

      if (products.results.length > 0) {
        response.status(200).json(products);
      } else {
        response.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      console.log('Something went wrong', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new MercadoLivreController();
