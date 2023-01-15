"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _fs = require("fs");
const _path = require("path");
const branch_1 = require("./branch");
const util_1 = require("./util");
class Collection {
    constructor(name, dirPath) {
        this.dir = dirPath;
        let cfPath = _path.resolve(`${this.dir}/.index.json`);
        if (!_fs.existsSync(cfPath)) {
            _fs.writeFileSync(cfPath, JSON.stringify({
                branches: [],
                files: [],
            }));
        }
        this.collectiondb = JSON.parse(_fs.readFileSync(cfPath).toString());
    }
    AddFolder(path) {
        _path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
        if (!_fs.statSync(path).isDirectory()) {
            console.error("'path' não representa ser uma pasta");
            return;
        }
        let cdb = this.collectiondb.branches.find(i => i.path == path);
        if (cdb != undefined) {
            return;
        }
        let dirs = [], paths = _fs.readdirSync(path);
        for (let i = 0; i < paths.length; ++i) {
            let subpath = paths[i], stat = _fs.statSync(`${path}/${subpath}`);
            if (stat.isDirectory()) {
                dirs.push(_path.resolve(`${path}/${subpath}`));
            }
            else if (stat.isFile() &&
                util_1.filterToFormats(_path
                    .parse(`${path}/${subpath}`)
                    .ext.replace('.', '')
                    .toLocaleLowerCase())) {
                dirs.push(_path.resolve(`${path}/${subpath}`));
            }
        }
        if (dirs.length <= 0) {
            console.error('Essa pasta não contém... nada?!');
            return;
        }
        let ID = util_1.createID(32), info = {
            id: ID,
            name: _path.parse(path).name,
            path: path,
        };
        this.collectiondb.branches.push(info);
        let branch = new branch_1.default(info.name, info.path);
        branch.info = info;
        for (let i = 0; i < dirs.length; ++i) {
            let dir = dirs[i];
            if (_fs.statSync(dir).isDirectory()) {
                branch.AddFolder(dir);
            }
            else if (_fs.statSync(dir).isFile()) {
                branch.AddFile(dir);
            }
        }
        branch.SaveDB();
        this.SaveDB();
    }
    CreateBranch(name) {
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
            };
            this.collectiondb.branches.push(info);
            this.SaveDB();
            let branch = new branch_1.default(info.name, info.path);
            branch.info = info;
            resolve(branch);
        });
    }
    getBranch(name) {
        let cdb = this.collectiondb.branches.find(i => i.id == name);
        if (cdb == undefined) {
            cdb = this.collectiondb.branches.find(i => i.name == name);
        }
        if (cdb == undefined) {
            return;
        }
        let info = {
            id: cdb.id,
            name: String(cdb.name),
            path: String(cdb.path),
        };
        let branch = new branch_1.default(info.name, info.path);
        branch.info = info;
        return branch;
    }
    getFile(path) {
        _path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
        if (!_fs.statSync(path).isFile()) {
            console.error("'path' não representa ser um arquivo");
            return;
        }
        let cdb = this.collectiondb.files.find(i => i.id == path);
        if (cdb == undefined) {
            cdb = this.collectiondb.files.find(i => i.path == path);
        }
        if (cdb == undefined) {
            return;
        }
        return {
            path: cdb.path,
            name: cdb.name,
            id: cdb.id,
        };
    }
    getFiles() {
        if (this.collectiondb.files.length <= 0) {
            console.error(`Não existe arquivos neste 'Branch'.`);
            return;
        }
        let files = [];
        this.collectiondb.files.map((file, index) => {
            files.push({
                path: file.path,
                name: file.name,
                id: file.id,
            });
        });
        return files;
    }
    getFolder(path) {
        _path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
        if (!_fs.statSync(path).isDirectory()) {
            console.error("'path' não representa ser uma pasta");
            return;
        }
        let cdb = this.collectiondb.branches.find(i => i.id == path);
        if (cdb == undefined) {
            cdb = this.collectiondb.branches.find(i => i.path == path);
        }
        if (cdb == undefined) {
            return;
        }
        return this.getBranch(String(cdb.name));
    }
    SaveDB() {
        _fs.writeFileSync(_path.resolve(`${this.dir}/.index.json`), JSON.stringify(this.collectiondb));
    }
}
exports.default = Collection;
