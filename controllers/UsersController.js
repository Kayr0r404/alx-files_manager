import crypto from 'crypto';
import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

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

  static async getMe(req, res) {
    try {
      // Get the token from the 'x-token' header
      const token = req.headers['x-token'];

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized. Token is missing' });
      }

      // Retrieve the user ID associated with the token from Redis
      const userId = await redisClient.get(`auth_${token}`);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized. Invalid token' });
      }
      console.log(userId);
      // Find the user in the MongoDB database by ID
      const user = await dbClient.db.collection('users').findOne({ userId });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized. User not found' });
      }

      // Return the user's email and ID only
      return res.status(200).json({
        id: user._id,
        email: user.email,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
