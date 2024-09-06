import pkg from 'mongodb';

const { MongoClient } = pkg;

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}/`;

class DBClient {
  constructor() {
    this.db = null;
    this.init();
  }

  async init() {
    try {
      const client = await MongoClient.connect(url, { useUnifiedTopology: true });
      this.db = client.db(database);

      const userCollections = await this.db.listCollections({ name: 'users' }).toArray();
      if (userCollections.length === 0) {
        await this.db.createCollection('users');
        console.log('Created "users" collection');
      }

      const fileCollections = await this.db.listCollections({ name: 'files' }).toArray();
      if (fileCollections.length === 0) {
        await this.db.createCollection('files');
        console.log('Created "files" collection');
      }
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async getUser(query) {
    console.log('QUERY IN DB.JS', query);
    const user = await this.db.collection('users').findOne(query);
    console.log('GET USER IN DB.JS', user);
    return user;
  }

  async insertUser(query) {
    const user = await this.db.collection('user').insertOne(query);
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
