"use strict";

const EventEmitter = require('events');
const DownloadWorker = require('./DownloadWorker');

/**
 * Download one or multiple files from the internet.
 */
class Download extends EventEmitter {
    /**
     * Empty downloads.
     */
	constructor() {
		super();
		this.downloads = []
	}

    /**
     * Add a file to be downloaded.
     * @param options
     */
	add(options) 
	{
		options.retries = options.retries || 5;

		options.destination += options.alias ?
			options.alias : options.origin.split('/').pop();

		let Worker = new DownloadWorker(options);

		//remote(options.origin, (err, o) =>
		//{
		//	Worker.totalSize = o

			this.downloads.push(
				Worker
			)
		//})
	}

    /**
     * Get all downloads.
     * @returns {Array}
     */
	getAll() {
		return this.downloads;
	}

    /**
     * Get all downloads in progress.
     * @returns {Array}
     */
	getInProgress() {
		let res = [];

		for (let i = 0; i < this.downloads.length; i++) {
			if(this.downloads[i].getStatus() === "IN_PROGRESS")
				res.push(this.downloads[i])
		}

		return res
	}

    /**
     * Get failed downloads.
     * @returns {Array}
     */
	getFailed()
	{
		let res = [];

		for (let i = 0; i < this.downloads.length; i++)
		{
			if(this.downloads[i].getStatus() === "FAILED")
				res.push(this.downloads[i])
		}

		return res
	}

    /**
     * Get finished downloads.
     * @returns {Array}
     */
	getFinished()
	{
		let res = [];

		for (let i = 0; i < this.downloads.length; i++)
		{
			if(this.downloads[i].getStatus() === "FINISHED")
				res.push(this.downloads[i])
		}

		return res
	}

    /**
     * Get size data.
     * @returns {{totalSize: number, downloadedSize: number}}
     */
	getSizeData()
	{
		let counter = 0;

		let counterDownloaded = 0;

		for (let i = 0; i < this.downloads.length; i++)
		{
			let progress = this.downloads[i].getProgress();

			counter+=progress.totalSize;

			if(this.downloads[i].getStatus('IN_PROGRESS')) {
				counterDownloaded+=progress.downloadedSize
			} else {
				counterDownloaded+=progress.totalSize
			}
		}

		return {
			totalSize: counter,
			downloadedSize: counterDownloaded
		}
	}

    /**
     * Start a download by index.
     * @param index
     */
	startSingle(index)
	{
		this.downloads[index].start();
		this.addListeners(this.downloads[index])
	}

    /**
     * Start all downloads.
     */
	start() 
	{
		for (let i = 0; i < this.downloads.length; i++)
		{
			if(this.downloads[i].getStatus() === 'PENDING')
			{
				this.startSingle(i)
			}
		}
	}

    /**
     * Global download progress.
     * @returns {{percentage: string, mbTotal: string, mbDownloaded: string}}
     */
	getProgress()
	{
		let totalPointsNeeded = this.downloads.length*100;
		let totalPoints = 0;

		for (let i = 0; i < this.downloads.length; i++)
		{
			switch(this.downloads[i].getStatus())
			{
				case "IN_PROGRESS":
					let progress = this.downloads[i].getProgress();
					totalPoints += parseInt(progress.percentage);
					break;

				case "FINISHED":
					totalPoints += 100;
					break;
			}
		}

		let sizeData = this.getSizeData();

		return {
			percentage: (totalPoints / totalPointsNeeded * 100).toFixed(2),
			mbTotal: (sizeData.totalSize / 1048576).toFixed(2),
			mbDownloaded: (sizeData.downloadedSize / 1048576).toFixed(2)
		}

	}

    /**
	 * Events.
     * @param DownloadWorker
     */
	addListeners(DownloadWorker)
	{
		DownloadWorker.on('start', () => 
		{
			console.log('Downloading', DownloadWorker.options.origin)
		});

		DownloadWorker.on('end', () => 
		{
			console.log('Finished', DownloadWorker.options.origin);

			if(DownloadWorker.options.multiPartId) {
				this.emit('multiPartEnd', DownloadWorker.options.multiPartId)
			}

			let finished = this.getFinished();
			let failed = this.getFailed();

			if(failed.length > 0) {
				if((failed.length + finished.length) === this.downloads.length) {
					return this.emit('end', { finished: finished, failed: failed })
				}				
			} else {
				if(finished.length === this.downloads.length) {
					return this.emit('end')
				}
			}
		});

		DownloadWorker.on('error', (message) => 
		{
			console.log('Error with', DownloadWorker.options.origin, message);

			let failed = this.getFailed();
			let finished = this.getFinished();

			if(DownloadWorker.options.multiPartId) {
				this.emit('multiPartEnd', DownloadWorker.options.multiPartId)
			}

			if((failed.length + finished.length) === this.downloads.length) {
				return this.emit('end', { finished: finished, failed: failed })
			}
		})
	}
}

module.exports = Download;