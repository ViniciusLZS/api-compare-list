require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require("../repositories/UserRepository");
const isValidUUID = require("../utils/isValidUUID");
const hashPassword = require("../utils/hashPassword");
const isValidEmail = require("../utils/isValidEmail");

class UserController {
  async index(request, response) {
    const user = await UserRepository.findAll();

    response.status(201).json(user);
  }

  async show(request, response) {
    const id = request.id;

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

    if (!password) {
      return response.status(400).json({ error: 'Password is required' });
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

    const hashedPassword = await hashPassword(password);

    const user = await UserRepository.create({
      photo: '',
      name,
      email,
      password: hashedPassword
    });

    response.status(201).json(user);
  }

  async updateData(request, response) {
    const id = request.id;
    const { name, email } = request.body;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid user id' })
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (!email) {
      return response.status(400).json({ error: 'E-mail is required' });
    }

    if (!isValidEmail(email)) {
      return response.status(400).json({ error: 'Invalid E-mail' });
    }

    const userExist = await UserRepository.findById(id);

    if (!userExist) {
      return response.status(404).json({ error: 'User not found' });
    }


    const emailExist = await UserRepository.findByEmail(email);

    if (emailExist && emailExist.name !== userExist.name) {
      return response.status(400).json({ error: 'This e-mail is already in use' });
    }

    const user = await UserRepository.update(id, {
      name,
      email,
    });

    response.json(user);
  }

  async updatePhoto(request, response) {
    const id = request.id;
    const { photo } = request.body;

    if (!photo && typeof (photo) === 'string') {
      return response.status(400).json({ error: 'Photo is required' })
    }

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid user id' })
    }

    const userExist = await UserRepository.findById(id);
    if (!userExist) {
      return response.status(404).json({ error: 'User not found' });
    }


    const user = await UserRepository.updatePhoto(id, {
      photo,
    });

    response.json(user);
  }

  async delete(request, response) {
    const { id } = request.params;

    if (!isValidUUID(id)) {
      return response.status(400).json({ error: 'Invalid user id' });
    }

    const user = await UserRepository.findById(id);

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    await UserRepository.delete(id);

    response.sendStatus(204);
  }

  async login(request, response) {
    const { email, password } = request.body;

    if (!email) {
      return response.status(400).json({ error: 'E-mail is required' });
    }

    if (!password) {
      return response.status(400).json({ error: 'Password is required' });
    }

    if (email && !isValidEmail(email)) {
      return response.status(400).json({ error: 'Invalid E-mail' });
    }

    const userExist = await UserRepository.findByEmail(email);
    if (!userExist) {
      return response.status(404).json({ error: 'E-mail not found' });
    }

    const checkPassword = await bcrypt.compare(password, userExist.password);
    if (!checkPassword) {
      return response.status(400).json({ error: 'Invalid password' });
    }

    const secret = process.env.CLIENT_SECRET;

    const token = jwt.sign({
      id: userExist.id,
    },
      secret,
    )

    response.status(201).json(token);
  }

  async loginWithGoogle(request, response) {
    const { photo, email, name, sub } = request.body;

    if (!email) {
      return response.status(400).json({ error: 'E-mail is required' });
    }

    if (email && !isValidEmail(email)) {
      return response.status(400).json({ error: 'Invalid E-mail' });
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (!sub) {
      return response.status(400).json({ error: 'Sub is required' });
    }

    let userExist = await UserRepository.findByEmail(email);

    if (!userExist) {
      userExist = await UserRepository.create({
        photo: photo || '',
        name,
        email,
        password: sub,
      });
    }

    if (userExist.password !== sub) {
      return response.status(400).json({ error: 'Sub invalid' });
    }

    const secret = process.env.CLIENT_SECRET;

    const token = jwt.sign({
      id: userExist.id,
    },
      secret,
    )


    response.status(201).json(token);
  }
}

module.exports = new UserController();
