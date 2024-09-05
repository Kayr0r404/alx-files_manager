import sha1 from 'sha1';
import uuid4 from 'uuid4';
import dbClient from "../utils/db.js";
import redisClient from '../utils/redis.js';

class AuthController {
  static async getConnect(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
      }

      // Extract and decode the base64 credentials
      const credentials = authHeader.split(' ')[1];
      const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
      const [email, password] = decodedCredentials.split(':');

      // Find the user in the database
      const user = await dbClient.db.collection('users').findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Hash the input password and compare it to the stored hashed password
      const hashedPassword = sha1(password);
      if (hashedPassword !== user.password) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate a UUID for the session token
      const uuid = uuid4();

      // Store the session in Redis with an expiration of 24 hours
      await redisClient.set(`auth_${uuid}`, user._id.toString(), 24 * 60 * 60);

      // Return the session token
      return res.status(200).json({ token: uuid });

    } catch (error) {
      console.error('Error during authentication:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getDisconnect(req, res) {
    try {
      const token = req.headers['x-token'];

      if (!token) {
        return res.status(401).json({ error: 'Missing token' });
      }

      // Remove the token from Redis
      const result = await redisClient.del(`auth_${token}`);

      if (result === 0) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error('Error during disconnect:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AuthController;
