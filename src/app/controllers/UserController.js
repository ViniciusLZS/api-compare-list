const UserRepository = require("../repositories/UserRepository");
const isValidUUID = require("../utils/isValidUUID");
const hashPassword = require("../utils/hashPassword");
const isValidEmail = require("../utils/isValidEmail");

class User {
  async index(request, response) {
    const user = await UserRepository.findAll();

    response.status(201).json(user);
  }

  async show(request, response) {
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid user id' });
    }

    const user = await UserRepository.findById(id);

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    response.json(user);
  }

  async store(request, response) {
    const { name, email, password } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (!email) {
      return response.status(400).json({ error: 'E-mail is required' });
    }

    if (email && !isValidEmail(email)) {
      return response.status(400).json({ error: 'Invalid E-mail' });
    }

    if (email) {
      const emailExist = await UserRepository.findByEmail(email);
      if (emailExist) {
        return response.status(400).json({ error: 'This e-mail is already in use' });
      }
    }

    if (!password) {
      return response.status(400).json({ error: 'Password is required' });
    }

    const hashedPassword = await hashPassword(password);
    console.log("🚀 ~ file: UserController.js:56 ~ User ~ store ~ hashedPassword:", hashedPassword);

    const user = await UserRepository.create({
      name,
      email,
      password: hashedPassword
    });

    response.status(201).json(user);
  }

  async update(request, response) {
    // const { id } = request.params;
    // const { name } = request.body;

    // if (!isValidUUID(id)) {
    //   return response.status(400).json({ error: 'Invalid user id' });
    // }


  }

  async delete(request, response) { }
}

module.exports = new User();
