const ListRepository = require("../repositories/ListRepository");
const isValidUUID = require("../utils/isValidUUID");

class ListController {
  async index(request, response) {
    const {id} = request.params;
    const { orderBy } = request.query;

    if(id && !isValidUUID(id)) {
      return response.status(400).json({error: 'Invalid user_id'});
    }

    const list = await ListRepository.findAll({id, orderBy});

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

    const list = await ListRepository.create({
      name,
      estimated,
      user_id
    });

    response.status(201).json(list);
  }

  update() { }

  delete() { }
}

module.exports = new ListController();
