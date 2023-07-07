const { response } = require("express");
const ProductRepository = require("../repositories/ProductRepository");
const isValidUUID = require("../utils/isValidUUID");
const calcTotalList = require("../utils/calcTotalList");

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
    const { name, value, amount, total, measure_id, image, list_id } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (!list_id) {
      return response.status(400).json({ error: 'List_id is required' });
    }

    if (measure_id && !isValidUUID(measure_id)) {
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

    let listIdExist;
    if (list_id) {
      listIdExist = await ProductRepository.findByListId(list_id);

      if (!listIdExist) {
        return response.status(400).json({ error: 'List_id not found' })
      }
    }

    const list = await ProductRepository.create({
      name,
      value: Number(value),
      amount: Number(amount),
      total: Number(total),
      measure_id: measure_id || null,
      image: image || null,
      list_id,
    })

    if (total) {
      const calcTotal = calcTotalList(Number(total), listIdExist.total)

      await ProductRepository.listUpdate({
        total: calcTotal,
        list_id,
      });
    }

    response.status(201).json(list);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, value, amount, total, measure_id, image, list_id } = request.body;

    if (id && !isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid list id' })
    }

    const product = await ProductRepository.findById(id);
    if (!product) {
      return response.status(400).json({ error: 'Product_id not found' })
    }

    let listIdExist;
    if (list_id) {
      listIdExist = await ProductRepository.findByListId(list_id);

      if (!listIdExist) {
        return response.status(400).json({ error: 'List_id not found' })
      }
    }

    const products = await ProductRepository.update(
      id,
      {
        name,
        value: Number(value),
        amount: Number(amount),
        total: Number(total),
        measure_id: measure_id || null,
        image: image || null,
        list_id,
      }
    )

    if (product.total !== Number(total)) {
      const calcTotal = calcTotalList(Number(total), listIdExist.total, product.total)
      await ProductRepository.listUpdate({
        total: calcTotal,
        list_id
      });
    }

    response.status(201).json(products);
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

    const list = await ProductRepository.findByListId(product.list_id);

    const calc = list.total - product.total;

    await ProductRepository.listUpdate({ total: calc, list_id: list.id });

    response.sendStatus(204);
  }
}

module.exports = new ProductController();
