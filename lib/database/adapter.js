const mongoose = require('mongoose');
const { JsonModel } = require('./jsonDb');

function isMongoConnected() {
    return !!global.isMongodb;
}

function createModel(name, schemaDefinition, fileName) {
    const mongooseSchema = new mongoose.Schema(schemaDefinition);
    let mongooseModel;
    try {
        mongooseModel = mongoose.models[name] || mongoose.model(name, mongooseSchema);
    } catch {
        mongooseModel = mongoose.model(name, mongooseSchema);
    }

    const jsonModel = new JsonModel(name, schemaDefinition, fileName);

    const ModelProxy = new Proxy(function() {}, {
        construct(target, args) {
            if (isMongoConnected()) {
                return new mongooseModel(...args);
            }
            return jsonModel.createDocument(...args);
        },
        get(target, prop, receiver) {
            if (prop === 'schema') return mongooseSchema;
            if (prop === 'mongooseModel') return mongooseModel;
            if (prop === 'jsonModel') return jsonModel;

            const activeModel = isMongoConnected() ? mongooseModel : jsonModel;
            const val = activeModel[prop];
            if (typeof val === 'function') {
                return val.bind(activeModel);
            }
            return val;
        },
        set(target, prop, value) {
            const activeModel = isMongoConnected() ? mongooseModel : jsonModel;
            activeModel[prop] = value;
            return true;
        }
    });

    return ModelProxy;
}

module.exports = {
    createModel,
    isMongoConnected
};
