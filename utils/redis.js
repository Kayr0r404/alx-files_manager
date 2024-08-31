import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.setex).bind(this.client);
    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });
  }

  /**
   * Checks connection to Redis.
   * @returns true when the connection to Redis is successful, otherwise false.
   */
  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return this.getAsync(key);
  }

  async set(key, value, timeInSeconds) {
    try {
      this.setAsync(key, timeInSeconds, value);
    } catch (err) {
      console.error(`Failed to set key ${key}`, err);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error(`Failed to delete key ${key}`, err);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
