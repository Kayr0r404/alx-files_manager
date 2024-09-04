import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static async getStatus(request, response) {
    const redisStatus = await redisClient.isAlive();
    const dbStatus = await dbClient.isAlive();

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ redis: redisStatus, db: dbStatus }));
  }

  static async getStats(request, response) {
    const nbUsers = await dbClient.nbUsers();
    const nbFiles = await dbClient.nbFiles();

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ users: nbUsers, files: nbFiles }));
  }
}

export default AppController;
