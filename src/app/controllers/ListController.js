const ListRepository = require("../repositories/ListRepository");
const ProductRepository = require("../repositories/ProductRepository");
const isValidUUID = require("../utils/isValidUUID");

class ListController {
  async index(request, response) {
    const userId = request.id;
    const { orderBy } = request.query;

    if (userId && !isValidUUID(userId)) {
      return response.status(400).json({ error: 'Invalid user_id' });
    }

    const list = await ListRepository.findAll({ userId, orderBy });

    if (!list) {
      return response.status(404).json({ error: 'List not found' });
    }

    response.json(list);
  }

  async show(request, response) {
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid List id' });
    }

    const list = await ListRepository.findById(id);

    if (!list) {
      return response.status(404).json({ error: 'List not found' });
    }

    response.json(list);
  }

  async store(request, response) {
    const { name, estimated } = request.body;
    const userId = request.id;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (!estimated) {
      return response.status(400).json({ error: 'Value is required' });
    }

    if (userId && !isValidUUID(userId)) {
      return response.status(400).json({ error: 'Invalid user_id' });
    }

    const userIdExist = await ListRepository.findUserId(userId);

    if (!userIdExist) {
      return response.status(404).json({ error: 'User_id not found' });
    }

    const list = await ListRepository.create({
      name,
      estimated: Number(estimated),
      userId
    });

    response.status(201).json(list);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, estimated } = request.body;
    const user_id = request.id;

    if (id && !isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid list id' })
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (!estimated) {
      return response.status(400).json({ error: 'Estimated is required' });
    }

    if (user_id && !isValidUUID(user_id)) {
      return response.status(400).json({ error: 'Invalid user_id' });
    }

    const listExist = await ListRepository.findById(id);

    if (!listExist) {
      return response.status(404).json({ error: 'List not found' });
    }

    const userIdExist = await ListRepository.findUserId(user_id);

    if (!userIdExist) {
      return response.status(404).json({ error: 'User_id not found' });
    }

    const list = await ListRepository.update(
      id,
      {
        name,
        estimated: Number(estimated),
        user_id
      }
    );

    response.status(201).json(list);
  }

  async delete(request, response) {
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid list id' });
    }

    const list = await ListRepository.findById(id);

    if (!list) {
      return response.status(404).json({ error: 'List not found' });
    }

    await ListRepository.delete(id);

    response.sendStatus(204);
  }

  async copy(request, response) {
    const userId = request.id;
    const { id } = request.params;

    if (userId && !isValidUUID(userId)) {
      return response.status(400).json({ error: 'Invalid user_id' });
    }

    if (id && !isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid list id' })
    }

    const userIdExist = await ListRepository.findUserId(userId);

    if (!userIdExist) {
      return response.status(404).json({ error: 'User_id not found' });
    }

    const listExist = await ListRepository.findById(id);

    if (!listExist) {
      return response.status(404).json({ error: 'List not found' });
    }

    const createdList = await ListRepository.create({
      name: 'Copia',
      estimated: listExist.estimated,
      userId
    });

    const products = await ProductRepository.findAll({ id });

    if (products) {
      products.forEach(async (product) => {
        await ProductRepository.create({
          name: product.name,
          value:0,
          amount: product.amount,
          total: 0,
          measure_id: product.measure_id || null,
          image: product.image || null,
          list_id: createdList.id,
        })
      });
    }

    response.status(201).json(createdList);
  }
}

module.exports = new ListController();
