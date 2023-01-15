"use strict";

const fs = require("fs");
const userHome = require("os").homedir();
const mkdirp = require("mkdirp");

const configuration = {
	createUserConfig(userConfigPath) {
		mkdirp(userConfigPath, err => {
			if (err) {
				console.error(err);
			}
		});
	},

	createIfNotExist(path) {
		try {
			const pathInfo = fs.statSync(path);
			if (!pathInfo.isDirectory()) {
				this.createUserConfig(path);
			}
		} catch (error) {
			this.createUserConfig(path);
		}
	},

	/**
	 * Obtenha o local da pasta de configuração
	 *
	 * @returns {string} A localização da pasta da configuração
	 */
	getUserConfig() {
		let userConfigPath = null;

		/** Plataforma Windows */
		if (process.platform === "win32") {
			userConfigPath = `${userHome}/.config/Infinity`;
		}

		/** Plataformas Linux - Padrão XDG */
		if (process.platform === "linux") {
			userConfigPath = `${userHome}/.config/Infinity`;
		}

		/** Localização da configuração do Mac os */
		if (process.platform === "darwin") {
			userConfigPath = `${userHome}/Library/Preferences/Infinity`;
		}

		/** Plataforma não suportada */
		if (userConfigPath === null) {
			throw `Não foi possível definir o caminho de configuração para este sistema operacional: ${
				process.platform
			}`;
		}

		this.createIfNotExist(userConfigPath);

		return userConfigPath;
	},

	/**
	 * Obtenha o caminho de configuração
	 *
	 * @argument {string} fileName
	 * @returns {string} O local do arquivo da configuração
	 */
	getPath(fileName) {
		return `${this.getUserConfig()}/${fileName}`;
	},

	/**
	 * Assegure-se de que a configuração existe
	 *
	 * @returns {Boolean} Verdadeiro se o arquivo existir
	 */
	containsConfig(fileName) {
		return fs.existsSync(`${this.getPath(fileName)}`);
	}
};

module.exports = configuration;
