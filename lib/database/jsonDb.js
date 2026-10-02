const fs = require('fs-extra');
const path = require('path');

// Root database directory: <rootDir>/database
const DB_DIR = path.resolve(__dirname, '../../database');

function ensureDbDir() {
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirpSync(DB_DIR);
    }
}
ensureDbDir();

function resolveDefault(def) {
    if (typeof def === 'function') {
        return def();
    }
    return def;
}

function matchesFilter(item, filter) {
    if (!filter || Object.keys(filter).length === 0) return true;

    for (const key of Object.keys(filter)) {
        const expected = filter[key];
        const actual = item[key];

        if (expected !== null && typeof expected === 'object' && !Array.isArray(expected)) {
            // Check for operator expressions
            if (expected.$in && Array.isArray(expected.$in)) {
                if (!expected.$in.includes(actual)) return false;
                continue;
            }
            if (expected.$ne !== undefined) {
                if (actual === expected.$ne) return false;
                continue;
            }
            if (expected.$gt !== undefined) {
                if (!(actual > expected.$gt)) return false;
                continue;
            }
            if (expected.$gte !== undefined) {
                if (!(actual >= expected.$gte)) return false;
                continue;
            }
            if (expected.$lt !== undefined) {
                if (!(actual < expected.$lt)) return false;
                continue;
            }
            if (expected.$lte !== undefined) {
                if (!(actual <= expected.$lte)) return false;
                continue;
            }
            if (expected.$regex) {
                const reg = new RegExp(expected.$regex, expected.$options || '');
                if (!reg.test(String(actual))) return false;
                continue;
            }

            // Handle when expected is a document or object with id or _id
            if (expected.id !== undefined && actual !== expected.id) {
                return false;
            } else if (expected.id !== undefined) {
                continue;
            }
            if (expected._id !== undefined && actual !== expected._id) {
                return false;
            } else if (expected._id !== undefined) {
                continue;
            }
        }

        // Standard comparison with loose equality fallback for string/number match
        if (actual !== expected && String(actual) !== String(expected)) {
            return false;
        }
    }

    return true;
}

class Query {
    constructor(jsonModel, filter = {}) {
        this._model = jsonModel;
        this._filter = { ...filter };
        this._currentField = null;
        this._sortCriteria = null;
        this._limitCount = null;
        this._skipCount = 0;
    }

    where(field) {
        this._currentField = field;
        return this;
    }

    in(values) {
        if (this._currentField) {
            this._filter[this._currentField] = {
                $in: Array.isArray(values) ? values : [values]
            };
        }
        return this;
    }

    equals(val) {
        if (this._currentField) {
            this._filter[this._currentField] = val;
        }
        return this;
    }

    sort(criteria) {
        this._sortCriteria = criteria;
        return this;
    }

    limit(num) {
        this._limitCount = parseInt(num, 10);
        return this;
    }

    skip(num) {
        this._skipCount = parseInt(num, 10);
        return this;
    }

    async exec() {
        let results = this._model.data.filter(item => matchesFilter(item, this._filter));

        if (this._sortCriteria) {
            let field = null;
            let order = 1;

            if (Array.isArray(this._sortCriteria)) {
                // e.g. [['xp', 'descending']] or [['wallet', -1]]
                const pair = this._sortCriteria[0];
                if (Array.isArray(pair)) {
                    field = pair[0];
                    const dir = String(pair[1]).toLowerCase();
                    order = (dir === 'desc' || dir === 'descending' || pair[1] === -1) ? -1 : 1;
                }
            } else if (typeof this._sortCriteria === 'object') {
                const keys = Object.keys(this._sortCriteria);
                if (keys.length > 0) {
                    field = keys[0];
                    const val = this._sortCriteria[field];
                    order = (val === -1 || String(val).toLowerCase() === 'desc' || String(val).toLowerCase() === 'descending') ? -1 : 1;
                }
            } else if (typeof this._sortCriteria === 'string') {
                if (this._sortCriteria.startsWith('-')) {
                    field = this._sortCriteria.substring(1);
                    order = -1;
                } else {
                    field = this._sortCriteria;
                    order = 1;
                }
            }

            if (field) {
                results.sort((a, b) => {
                    const valA = a[field] !== undefined ? a[field] : 0;
                    const valB = b[field] !== undefined ? b[field] : 0;
                    if (valA < valB) return -1 * order;
                    if (valA > valB) return 1 * order;
                    return 0;
                });
            }
        }

        if (this._skipCount > 0) {
            results = results.slice(this._skipCount);
        }

        if (this._limitCount !== null && this._limitCount >= 0) {
            results = results.slice(0, this._limitCount);
        }

        return results.map(item => new JsonDocument(this._model, item));
    }

    async countDocuments() {
        const results = this._model.data.filter(item => matchesFilter(item, this._filter));
        return results.length;
    }

    then(resolve, reject) {
        return this.exec().then(resolve, reject);
    }

    catch(reject) {
        return this.exec().catch(reject);
    }
}

class JsonDocument {
    constructor(model, data = {}) {
        Object.defineProperty(this, '_model', {
            value: model,
            writable: true,
            enumerable: false,
            configurable: true
        });

        const defaults = model.getDefaults();
        const merged = { ...defaults, ...data };

        if (!merged._id) {
            merged._id = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
        }

        Object.assign(this, merged);
    }

    async save() {
        return this._model.saveDocument(this);
    }

    async delete() {
        return this._model.deleteDocument(this);
    }

    async deleteOne() {
        return this.delete();
    }

    async remove() {
        return this.delete();
    }

    toJSON() {
        const copy = {};
        for (const key of Object.keys(this)) {
            if (key !== '_model') {
                copy[key] = this[key];
            }
        }
        return copy;
    }
}

class JsonModel {
    constructor(name, schemaDefinition = {}, fileName) {
        this.name = name;
        this.schemaDefinition = schemaDefinition;
        this.fileName = fileName || `${name.toLowerCase()}.json`;
        this.filePath = path.join(DB_DIR, this.fileName);
        this.data = [];
        this.collection = {
            drop: async () => {
                this.data = [];
                this.persist();
                return true;
            }
        };

        ensureDbDir();
        this.loadData();
    }

    getDefaults() {
        const defaults = {};
        for (const key of Object.keys(this.schemaDefinition)) {
            const field = this.schemaDefinition[key];
            if (field && typeof field === 'object' && field.default !== undefined) {
                defaults[key] = resolveDefault(field.default);
            }
        }
        return defaults;
    }

    loadData() {
        try {
            ensureDbDir();
            if (fs.existsSync(this.filePath)) {
                const content = fs.readFileSync(this.filePath, 'utf8').trim();
                this.data = content ? JSON.parse(content) : [];
                if (!Array.isArray(this.data)) {
                    this.data = [];
                }
            } else {
                this.data = [];
                this.persist();
            }
        } catch (e) {
            console.error(`[LocalDB] Error loading ${this.fileName}:`, e.message);
            this.data = [];
        }
    }

    persist() {
        try {
            ensureDbDir();
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
        } catch (e) {
            console.error(`[LocalDB] Error saving ${this.fileName}:`, e.message);
        }
    }

    createDocument(data = {}) {
        return new JsonDocument(this, data);
    }

    async saveDocument(doc) {
        const docObj = doc.toJSON();
        let index = -1;

        // Check by _id first
        if (docObj._id) {
            index = this.data.findIndex(item => item._id === docObj._id);
        }

        // If not found and schema has unique id, check by id
        if (index === -1 && docObj.id !== undefined && this.schemaDefinition.id && this.schemaDefinition.id.unique) {
            index = this.data.findIndex(item => item.id === docObj.id);
        }

        // If compound key check (like userID and guildID)
        if (index === -1 && docObj.userID && docObj.guildID) {
            index = this.data.findIndex(item => item.userID === docObj.userID && item.guildID === docObj.guildID);
        }

        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...docObj };
        } else {
            this.data.push(docObj);
        }

        this.persist();
        return doc;
    }

    async deleteDocument(doc) {
        const docObj = doc.toJSON();
        const index = this.data.findIndex(item => (docObj._id && item._id === docObj._id) || (docObj.id && item.id === docObj.id));
        if (index !== -1) {
            this.data.splice(index, 1);
            this.persist();
        }
        return doc;
    }

    async findOne(filter = {}) {
        const item = this.data.find(entry => matchesFilter(entry, filter));
        return item ? new JsonDocument(this, item) : null;
    }

    find(filter = {}) {
        return new Query(this, filter);
    }

    async countDocuments(filter = {}) {
        return this.data.filter(entry => matchesFilter(entry, filter)).length;
    }

    async estimatedDocumentCount() {
        return this.data.length;
    }

    async updateOne(filter = {}, update = {}, options = {}) {
        let itemIndex = this.data.findIndex(entry => matchesFilter(entry, filter));

        if (itemIndex === -1) {
            if (options && options.upsert) {
                const defaults = this.getDefaults();
                const newObj = { ...defaults, ...filter };

                if (update.$set) {
                    Object.assign(newObj, update.$set);
                }
                for (const k of Object.keys(update)) {
                    if (!k.startsWith('$')) newObj[k] = update[k];
                }

                if (!newObj._id) {
                    newObj._id = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
                }

                this.data.push(newObj);
                this.persist();
                return { acknowledged: true, modifiedCount: 0, matchedCount: 0, upsertedCount: 1 };
            }
            return { acknowledged: true, modifiedCount: 0, matchedCount: 0 };
        }

        const target = this.data[itemIndex];

        if (update.$set) {
            Object.assign(target, update.$set);
        }
        if (update.$inc) {
            for (const k of Object.keys(update.$inc)) {
                target[k] = (target[k] || 0) + Number(update.$inc[k]);
            }
        }
        for (const k of Object.keys(update)) {
            if (!k.startsWith('$')) target[k] = update[k];
        }

        this.persist();
        return { acknowledged: true, modifiedCount: 1, matchedCount: 1 };
    }

    async updateMany(filter = {}, update = {}, options = {}) {
        let count = 0;
        for (const target of this.data) {
            if (matchesFilter(target, filter)) {
                if (update.$set) Object.assign(target, update.$set);
                if (update.$inc) {
                    for (const k of Object.keys(update.$inc)) {
                        target[k] = (target[k] || 0) + Number(update.$inc[k]);
                    }
                }
                for (const k of Object.keys(update)) {
                    if (!k.startsWith('$')) target[k] = update[k];
                }
                count++;
            }
        }
        if (count > 0) this.persist();
        return { acknowledged: true, modifiedCount: count, matchedCount: count };
    }

    async deleteOne(filter = {}) {
        const itemIndex = this.data.findIndex(entry => matchesFilter(entry, filter));
        if (itemIndex !== -1) {
            this.data.splice(itemIndex, 1);
            this.persist();
            return { acknowledged: true, deletedCount: 1 };
        }
        return { acknowledged: true, deletedCount: 0 };
    }

    async deleteMany(filter = {}) {
        const prevLen = this.data.length;
        this.data = this.data.filter(entry => !matchesFilter(entry, filter));
        const deletedCount = prevLen - this.data.length;
        if (deletedCount > 0) this.persist();
        return { acknowledged: true, deletedCount };
    }

    async findOneAndDelete(filter = {}) {
        const itemIndex = this.data.findIndex(entry => matchesFilter(entry, filter));
        if (itemIndex !== -1) {
            const removed = this.data.splice(itemIndex, 1)[0];
            this.persist();
            return new JsonDocument(this, removed);
        }
        return null;
    }

    async countDocuments(filter = {}) {
        if (!filter || Object.keys(filter).length === 0) {
            return this.data.length;
        }
        return this.data.filter(entry => matchesFilter(entry, filter)).length;
    }
}

module.exports = {
    DB_DIR,
    JsonModel,
    JsonDocument,
    Query
};
