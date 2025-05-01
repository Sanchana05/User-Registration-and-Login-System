const mongoose = require("mongoose");

const dbConnect = async () => {
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(`Database connected: ${connect.connections[0].host}, ${connect.connections[0].name}`);
    }catch (err) {
        console.log(err);
        process.exit(1);
    }    
};

module.exports = dbConnect;