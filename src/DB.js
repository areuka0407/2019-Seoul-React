const {MongoClient} = require('mongodb');
const assert = require('assert');


module.exports = class DB {
    static url = "mongodb://localhost:27017";
    static dbName = "biff2019";
    static ai_collection = "increment_counter";

    static async __getConnection(){
        return new Promise(res => {
            MongoClient.connect(
                DB.url, 
                {
                    useUnifiedTopology: true,
                    useNewUrlParser: true
                }, 
                (err, client) => {
                    assert.equal(null, err);
        
                    res([
                        client.db(DB.dbName), 
                        client
                    ]);
                }
            );
        });
    }

    static async find(colName, condition = {}){
        const [db, client] = await DB.__getConnection();
        const collection = db.collection(colName);

        return await new Promise(res => {
            collection.find(condition).toArray((err, result) => {
                assert.equal(err, null);
                client.close();
                res(result);
            });
        });
    }

    static async insert(colName, document){
        const [db, client] = await DB.__getConnection();
        const collection = db.collection(colName);

        const ai = DB.find(DB.ai_collection, {name: colName});
        
        const insert = new Promise(res => {
            collection.insertOne({idx: ai.value + 1, ...document}, (err, result) => {
                assert.equal(err, null);
                assert.equal(result.result.n, 1);
                res(result);
            });
        });

        const updateAI = DB.update(
            DB.ai_collection, 
            {value: ai.value + 1}, 
            {name: colName}
        )
        const [result] = await Promise.all([insert, updateAI]);
        client.close();

        return result;
    }

    static async update(colName, document = {}, condition = {}){
        const [db, client] = await DB.__getConnection();
        const collection = db.collection(colName);
        
        return await new Promise(res => {
            collection.updateOne(condition, {$set: document}, (err, result) => {
                assert.equal(err, null);
                assert.equal(1, result.result.n)
                client.close();
                res(result);
            });
        });
    }

    static async delete(colName, condition = {}){
        const [db, client] = await DB.__getConnection();
        const collection = db.collection(colName);

        return await new Promise(res => {
            collection.deleteOne(condition, (err, result) => {
                assert.equal(err, null);
                assert.equal(result.result.n, 1);
                client.close();
                res(result);
            });
        });
    }
}