const { response } = require("express");
const ProductRepository = require("../repositories/ProductRepository");
const isValidUUID = require("../utils/isValidUUID");

class ProductController {
  async index(request, response) {
    const { id } = request.params;
    const { orderBy } = request.query;

    if (id && !isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid list_id' });
    }

    if (id) {
      const listIdExist = await ProductRepository.findByListId(id);

      if (!listIdExist) {
        return response.status(400).json({ error: 'List_id not found' })
      }
    }

    const products = await ProductRepository.findAll({ id, orderBy });

    response.json(products);
  }

  async show(request, response) {
    const { id } = request.params;

    if (id && !isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid id' });
    }

    const product = await ProductRepository.findById(id);

    if (!product) {
      return response.status(404).json({ error: 'Product not found' });
    }

    response.json(product);
  }

  async store(request, response) {
    const { name, value, amount, measureId, listId } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (!listId) {
      return response.status(400).json({ error: 'List_id is required' });
    }

    if (measureId && !isValidUUID(measureId)) {
      return response.status(400).json({ error: 'Invalid Measure_id' })
    }

    if (!isValidUUID(listId)) {
      return response.status(400).json({ error: 'Invalid list_id' })
    }

    if (measureId) {
      const measureIdExist = await ProductRepository.findByMeasureId(measureId);

      if (!measureIdExist) {
        return response.status(400).json({ error: 'Measure_id not found' })
      }
    }

    if (listId) {
      const listIdExist = await ProductRepository.findByListId(listId);

      if (!listIdExist) {
        return response.status(400).json({ error: 'List_id not found' })
      }
    }

    const list = await ProductRepository.create({
      name,
      value: Number(value),
      amount: Number(amount),
      measure_id: measureId || null,
      list_id: listId
    })

    response.status(201).json(list);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, value, amount, measure_id, list_id } = request.body;

    if (id && !isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid list id' })
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (!measure_id) {
      return response.status(400).json({ error: 'Measure_id is required' });
    }

    if (!list_id) {
      return response.status(400).json({ error: 'List_id is required' });
    }

    if (!isValidUUID(measure_id)) {
      return response.status(400).json({ error: 'Invalid Measure_id' })
    }

    if (!isValidUUID(list_id)) {
      return response.status(400).json({ error: 'Invalid list_id' })
    }

    if (measure_id) {
      const measureIdExist = await ProductRepository.findByMeasureId(measure_id);

      if (!measureIdExist) {
        return response.status(400).json({ error: 'Measure_id not found' })
      }
    }

    if (list_id) {
      const listIdExist = await ProductRepository.findByListId(list_id);

      if (!listIdExist) {
        return response.status(400).json({ error: 'List_id not found' })
      }
    }

    const list = await ProductRepository.update(
      id,
      {
        name,
        value,
        amount,
        measure_id,
        list_id
      }
    )

    response.json(list);
  }

  async delete(request, response) {
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid product id' });
    }

    const product = await ProductRepository.findById(id);

    if (!product) {
      return response.status(404).json({ error: 'Product not found' });
    }

    await ProductRepository.delete(id);

    response.sendStatus(204);
  }
}

module.exports = new ProductController();
