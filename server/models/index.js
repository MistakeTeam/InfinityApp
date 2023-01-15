const mongoose = require('mongoose');
const Promise = require("bluebird");

module.exports.connect = (uri) => {
    mongoose.connect(uri, { useNewUrlParser: true });

    Promise.promisifyAll(mongoose);
    mongoose.Promise = Promise;

    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error: ${err}`);
        process.exit(1);
    });

    require('./user');
};
