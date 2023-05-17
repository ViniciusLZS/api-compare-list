const MeasureRepository = require("../repositories/MeasureRepository");
const isValidUUID = require("../utils/isValidUUID");

class MeasureController {
  async index(request, response) {
    const measures = await MeasureRepository.findAll();

    response.json(measures);
  }

  async show(request, response) {
    const { id } = request.params;

    if (id && !isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid measure id' });
    }

    const measure = await MeasureRepository.findById(id);

    if (!measure) {
      return response.status(404).json({ error: 'Measure not found' });
    }

    response.json(measure);
  }

  async store(request, response) {
    const { name } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const nameLowerCase = name.toLowerCase();
    if (name) {
      const measureExist = await MeasureRepository.findByName(nameLowerCase);
      if (measureExist) {
        return response.status(400).json({ error: 'This measure already exist' });
      }
    }

    const measure = await MeasureRepository.create({ nameLowerCase });

    response.status(201).json(measure);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name } = request.body;

    if (id && !isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid measure id' })
    }

    const idExist = await MeasureRepository.findById(id);

    if (!idExist) {
      return response.status(404).json({ error: 'Id not found' });
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const nameLowerCase = name.toLowerCase();

    const measure = await MeasureRepository.update(id, { nameLowerCase });

    response.json(measure);
  }

  async delete(request, response) {
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid measure id' });
    }

    const measure = await MeasureRepository.findById(id);

    if (!measure) {
      return response.status(404).json({ error: 'Measure not found' });
    }

    await MeasureRepository.delete(id);

    response.sendStatus(204);
  }

}

module.exports = new MeasureController();
