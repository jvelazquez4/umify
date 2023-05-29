import { MongoClient, ServerApiVersion } from 'mongodb';

class database {
    constructor(dburl){
        this.dburl = dburl;
    }

    async connect(){
        this.client = await MongoClient.connect(this.dburl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1,
          });

          this.db = this.client.db('database');

          await this.init();
    }

    async init() {
        this.collection = this.db.collection('database');
    }

    async close() {
        this.client.close();
      }    

    async createUser(username,info, geoData,spotifyData) {
        //const res = await this.collection.insertOne({ _username: username, info, geoData, password });
        const res = await this.collection.insertOne({ _username: username, info, geoData,spotifyData});
        return res;
      }    

    async readUser(username) {
      const res = await this.collection.findOne({ _username: username });
      return res;
    }  

    async getFriends(username) {
      const res = await this.collection.findOne({ _username: username });
      return res.friends;
    }  

    async deleteUser(username) {
      const res = await this.collection.deleteOne({ _username: username });
      return res;
    }  
    
    async updateUserInfo(username,input){
      const res = await this.collection.updateOne(
        { _username: username },
        { $set: { info : input} }
      );
      return res;
    }

    async updateUserGeo(username,input){
      const res = await this.collection.updateOne(
        { _username: username },
        { $set: { geoData :input } }
      );
      return res;
    }    

    async readAllUsers() {
      const res = await this.collection.find({}).toArray();
      return res;
    }    
}

let uri; //Put your Mongodb URI here
const peopleDb = new database(uri);
await peopleDb.connect();

export{peopleDb};