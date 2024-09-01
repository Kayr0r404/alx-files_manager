import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {

    static getStatus(request, response) {
        response.statusCode = 200;
        if (redisClient.isAlive && dbClient.isAlive) {
            response.end(`{"redis": true, "db": true }`)
        }
    }

    static getStats(request, response) {
        response.statusCode = 200;
        response.end(`{ "users": ${dbClient.nbUsers}, "files": ${dbClient.nbFiles} }`);

    }
}

export default AppController;