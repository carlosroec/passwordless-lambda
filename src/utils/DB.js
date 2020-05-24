const mongoose = require("mongoose");
let isConnected;

module.exports = class DB {
    static async connect() {
        if (isConnected) {
            console.log("=> Using existing database connection");
    
            return Promise.resolve();
        }
    
        console.log("=> Using new database connection");
    
        return mongoose.connect(process.env.DB).then(db => {
            isConnected = db.connections[0].readyState;
        });
    }
}
