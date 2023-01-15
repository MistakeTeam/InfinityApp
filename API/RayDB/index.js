"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _fs = require("fs");
const _path = require("path");
const collection_1 = require("./collection");
const util_1 = require("./util");
class RayDB {
    constructor(path) {
        this.dir = _path.resolve(path);
        let cfPath = _path.resolve(`${this.dir}/.index.json`);
        if (!_fs.existsSync(this.dir)) {
            _fs.mkdirSync(this.dir);
            _fs.chmodSync(this.dir, '777');
            if (!_fs.existsSync(cfPath)) {
                _fs.writeFileSync(cfPath, JSON.stringify({
                    collections: [],
                }));
            }
        }
        this.indexdb = JSON.parse(_fs.readFileSync(cfPath).toString());
    }
    CreateCollection(name) {
        return new Promise((resolve, reject) => {
            let dirPath = _path.resolve(`${this.dir}/${name}`);
            if (!_fs.existsSync(dirPath)) {
                _fs.mkdirSync(dirPath);
                _fs.chmodSync(dirPath, '777');
            }
            let ID = util_1.createID(32), info = {
                id: ID,
                name: name,
                path: dirPath,
            }, cdb = this.indexdb.collections.find(i => i.path == dirPath);
            if (cdb == undefined) {
                this.indexdb.collections.push(info);
                this.SaveDB();
            }
            else {
                info = {
                    id: cdb.id,
                    name: String(cdb.name),
                    path: String(cdb.path),
                };
            }
            let collection = new collection_1.default(info.name, info.path);
            collection.info = info;
            resolve(collection);
        });
    }
    SaveDB() {
        _fs.writeFileSync(_path.resolve(`${this.dir}/.index.json`), JSON.stringify(this.indexdb));
    }
}
exports.default = RayDB;
