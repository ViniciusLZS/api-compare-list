const ListRepository = require("../repositories/ListRepository");
const isValidUUID = require("../utils/isValidUUID");

class ListController {
  async index(request, response) {
    const { id } = request.params;
    const { orderBy } = request.query;

    if (id && !isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid user_id' });
    }

    const list = await ListRepository.findAll({ id, orderBy });

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
    const { name, estimated, user_id } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (!estimated) {
      return response.status(400).json({ error: 'Value is required' });
    }

    if (user_id && !isValidUUID(user_id)) {
      return response.status(400).json({ error: 'Invalid user_id' });
    }

    const userIdExist = await ListRepository.findUserId(user_id);

    if(!userIdExist) {
      return response.status(404).json({error: 'User_id not found'});
    }

    const list = await ListRepository.create({
      name,
      estimated,
      user_id
    });

    response.status(201).json(list);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, estimated, user_id } = request.body;

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

    const userIdExist = await ListRepository.findUserId(user_id);

    if(!userIdExist) {
      return response.status(404).json({error: 'User_id not found'});
    }

    const list = await ListRepository.update(
      id,
      {
        name,
        estimated,
        user_id
      }
    );

    response.json(list);
  }

  async delete(request, response) {
    const {id} = request.params;

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
}

module.exports = new ListController();
