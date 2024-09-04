import crypto from 'crypto';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;

    // Check if email is provided
    if (!email) {
      return response.status(400).json({ error: 'Missing email' });
    }

    // Check if password is provided
    if (!password) {
      return response.status(400).json({ error: 'Missing password' });
    }

    // Check if the user already exists
    const existingUser = await dbClient.getUser({ email });
    if (existingUser) {
      return response.status(400).json({ error: 'Already exists' });
    }

    // Hash the password
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Insert the new user into the database
    const result = await dbClient.db.collection('users').insertOne({
      email: email,
      password: hashedPassword,
    });

    // Send response with the new user's ID
    return response.status(201).json({
      id: result.insertedId,
      email: email,
    });
  }
}

export default UsersController;
