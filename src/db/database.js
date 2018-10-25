const mongoose = require('mongoose');
const config = require('../config/config.json');

module.exports = {
    connect: async function dbConnect() {
        try {
            await mongoose.connect(
                `mongodb+srv://${config.db.MONGO_ATLAS_USER}:${config.db.MONGO_ATLAS_PW}@${config.db.MONGO_ATLAS_URL}/${
                    config.db.MONGO_ATLAS_DB_NAME
                }?retryWrites=true`,
                {
                    useCreateIndex: true,
                    useNewUrlParser: true,
                }
            );

            console.log('Connected to mongodb');
        } catch (err) {
            console.error(err);
        }
    },
};
