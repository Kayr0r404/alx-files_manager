// utils/redis.js

import { createClient } from 'redis';

class RedisClient {
    constructor() {
        this.client = createClient();
        this.client.on('error', (err) => console.log('Redis Client Error', err.toString()));
        this.client.connect();
    }

    async isAlive() {
        return this.client.isReady;
    }

    async get(key) {
        try {
            return await this.client.get(key);
        } catch (err) {
            console.error('Error getting key from Redis:', err.toString());
        }
    }

    async set(key, value, timeInSec) {
        try {
            await this.client.set(key, value, { EX: timeInSec });
        } catch (err) {
            console.error('Error setting key in Redis:', err.toString());
        }
    }

    async del(key) {
        try {
            await this.client.del(key);
        } catch (err) {
            console.error('Error deleting key from Redis:', err.toString());
        }
    }
}

const redisClient = new RedisClient();
export default redisClient;
