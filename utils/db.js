import { MongoClient } from "mongodb";

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'file_manager';
const url = `mongodb://${host}:${port}`;

class DBClient {
    constructor() {
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        this.client.connect()
            .then(() => {
                this.db = this.client.db(database);
                console.log("Connected to MongoDB");
                
                // Create collections if they don't exist
                this.db.createCollection("users").catch(err => {
                    if (err.codeName !== 'NamespaceExists') {
                        console.error("Failed to create 'users' collection", err);
                    }
                });
                this.db.createCollection("files").catch(err => {
                    if (err.codeName !== 'NamespaceExists') {
                        console.error("Failed to create 'files' collection", err);
                    }
                });
            })
            .catch(err => {
                console.error("Failed to connect to MongoDB", err);
            });
    }

    /**
     * @returns {Promise<boolean>} true when the connection to MongoDB is a success otherwise, false
     */
    async isAlive() {
        try {
            await this.client.db("admin").command({ ping: 1 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * @returns {Promise<number>} the number of documents in the collection users
     */
    async nbUsers() {
        if (!this.db) {
            return 0;
        }
        return this.db.collection('users').countDocuments();
    }

    /**
     * @returns {Promise<number>} the number of documents in the collection files
     */
    async nbFiles() {
        if (!this.db) {
            return 0;
        }
        return this.db.collection('files').countDocuments();
    }
}

const dbClient = new DBClient();
export default dbClient;
