import { createClient } from 'redis';

class RedisClient {
    constructor() {
        this.client = createClient();
        this.client.on('error', err => console.log('Redis Client Error', err.toString()));

        this.client.connect();
    }

    async isAlive() {
        return this.client.isReady;
    }

    async get(key) {
        return await this.client.get(key);
    }

    async set(key, value, timeInSec) {
        await this.client.set(key, value, { EX: timeInSec });
    }

    async del(key) {
        await this.client.del(key);
    }
}

export default RedisClient;
