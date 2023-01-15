"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _fs = require("fs");
const _path = require("path");
const util_1 = require("./util");
class branch {
	constructor(_name, dirPath) {
		this.dir = dirPath;
		let cfPath = _path.resolve(`${this.dir}/.index.json`);
		if (!_fs.existsSync(cfPath)) {
			_fs.writeFileSync(
				cfPath,
				JSON.stringify({
					branches: [],
					files: []
				})
			);
		}
		this.branchdb = JSON.parse(_fs.readFileSync(cfPath).toString());
	}
	AddFile(path) {
		_path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
		if (!_fs.statSync(path).isFile()) {
			console.error("'" + path + "' não representa ser um arquivo");
			return;
		}
		let cdb = this.branchdb.files.find(i => i.path == path);
		if (cdb != undefined) {
			return;
		}
		if (
			!util_1.filterToFormats(
				_path
					.parse(path)
					.ext.replace(".", "")
					.toLocaleLowerCase()
			)
		) {
			console.error(
				`'${_path
					.parse(path)
					.ext.replace(".", "")
					.toLocaleLowerCase()}' não é um formato de arquivo suportado.`
			);
			return;
		}
		let ID = util_1.createID(32);
		this.branchdb.files.push({
			id: ID,
			path: _path.resolve(path),
			name: _path.parse(path).name
		});
	}
	AddFolder(path) {
		_path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
		if (!_fs.statSync(path).isDirectory()) {
			console.error("'" + path + "' não representa ser uma pasta");
			return;
		}
		let cdb = this.branchdb.branches.find(i => i.path == path);
		if (cdb != undefined) {
			return;
		}
		let dirs = [],
			files = _fs.readdirSync(path);
		for (let i = 0; i < files.length; ++i) {
			let file = files[i],
				stat = _fs.statSync(`${path}/${file}`);
			if (stat.isFile()) {
				dirs.push(_path.resolve(`${path}/${file}`));
			}
		}
		if (dirs.length <= 0) {
			console.error("Essa pasta não contém arquivos (" + path + ")");
			return;
		}
		let ID = util_1.createID(32),
			info = {
				id: ID,
				name: _path.parse(path).name,
				path: path
			};
		this.branchdb.branches.push(info);
		this.SaveDB();
		let Branch = new branch(info.name, info.path);
		Branch.info = info;
		for (let i = 0; i < dirs.length; ++i) {
			let dir = dirs[i];
			Branch.AddFile(dir);
		}
		Branch.SaveDB();
	}
	CreateBranch(name) {
		let dirPath = _path.resolve(`${this.dir}/${name}`);
		if (!_fs.existsSync(dirPath)) {
			_fs.mkdirSync(dirPath);
			_fs.chmodSync(dirPath, "777");
		}
		let ID = util_1.createID(32),
			info = {
				id: ID,
				name: name,
				path: dirPath
			};
		this.branchdb.branches.push(info);
		this.SaveDB();
		let Branch = new branch(info.name, info.path);
		Branch.info = info;
		return Branch;
	}
	getBranch(name) {
		let cdb = this.branchdb.branches.find(i => i.id == name);
		if (cdb == undefined) {
			cdb = this.branchdb.branches.find(i => i.name == name);
		}
		if (cdb == undefined) {
			return;
		}
		let info = {
			id: cdb.id,
			name: String(cdb.name),
			path: String(cdb.path)
		};
		let Branch = new branch(info.name, info.path);
		Branch.info = info;
		return Branch;
	}
	getFile(path) {
		_path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
		let cdb = this.branchdb.files.find(i => i.id == path);
		if (cdb == undefined) {
			cdb = this.branchdb.files.find(i => i.path == path);
		}
		if (cdb == undefined) {
			return;
		}
		return {
			path: cdb.path,
			name: cdb.name,
			id: cdb.id
		};
	}
	getFiles() {
		if (this.branchdb.files.length <= 0) {
			console.error(`Não existe arquivos neste 'Branch'.`);
			return;
		}
		let files = [];
		this.branchdb.files.map((file, index) => {
			files.push({
				path: file.path,
				name: file.name,
				id: file.id
			});
		});
		return files;
	}
	getFolder(path) {
		_path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
		let cdb = this.branchdb.branches.find(i => i.id == path);
		if (cdb == undefined) {
			cdb = this.branchdb.branches.find(i => i.path == path);
		}
		if (cdb == undefined) {
			console.error(`'${_path.parse(path).name}' não existe.`);
			return;
		}
		return this.getBranch(String(cdb.name));
	}
	findFile(path) {
		_path.isAbsolute(path) ? (path = _path.resolve(path)) : null;
		if (this.getFile(path)) {
			return this.getFile(path);
		}
		for (let i = 0; i < this.branchdb.branches.length; i++) {
			let _branch = this.branchdb.branches[i],
				Branch = new branch(_branch.name, _branch.path);
			Branch.info = branch;
			if (Branch.getFile(path)) {
				return Branch.getFile(path);
			}
		}
	}
	update() {
		let dirs = [],
			files = _fs.readdirSync(this.dir);
		for (let i = 0; i < files.length; ++i) {
			let subpath = files[i],
				stat = _fs.statSync(`${this.dir}/${subpath}`);
			if (stat.isDirectory()) {
				dirs.push(_path.resolve(`${this.dir}/${subpath}`));
			} else if (
				stat.isFile() &&
				util_1.filterToFormats(
					_path
						.parse(`${this.dir}/${subpath}`)
						.ext.replace(".", "")
						.toLocaleLowerCase()
				)
			) {
				dirs.push(_path.resolve(`${this.dir}/${subpath}`));
			}
		}
		if (dirs.length <= 0) {
			console.error("Essa pasta não contém arquivos (" + this.dir + ")");
			return;
		}
		for (let i = 0; i < dirs.length; ++i) {
			let dir = dirs[i];
			if (_fs.statSync(dir).isDirectory()) {
				this.AddFolder(dir);
			} else if (_fs.statSync(dir).isFile()) {
				this.AddFile(dir);
			}
		}
	}
	SaveDB() {
		_fs.writeFileSync(
			_path.resolve(`${this.dir}/.index.json`),
			JSON.stringify(this.branchdb)
		);
	}
}
exports.default = branch;
