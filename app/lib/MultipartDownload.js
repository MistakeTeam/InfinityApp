/**
 * MultipartDownload
 *
 * Manages multi part downloads, with a
 * defined format (like Datan.cab).
 */
const Download = require('./Download');

class MultipartDownload extends Download
{
    /**
     * Set the options and multiPartEnd.
     * @param options
     */
	constructor(options)
	{
	    // Call the parent Download constructor
		super();

		this.queue = options.queue;
		this.offset = options.offset;
		this.max = options.max;
		this.origin = options.origin;
		this.destination = options.destination;

		this.batches = options.max / options.queue;

		this.on('multiPartEnd', multiPartId =>
		{
			if(this.batchIsDone())
			{
				if(this.offset <= this.max && this.getFailed().length < this.queue)
					this.downloadNextBatch();
				else {
					this.onEnd(this.getFailed().length)
				}
			}
		})
	}

    /**
     * Checks if batch is done.
     * @returns {boolean}
     */
	batchIsDone()
	{
		let difference = this.max-this.offset;

		let batchLength = (
			difference < this.queue ? difference + 1 : this.queue
		);

		let downloadCount = 0;

		for (let i = this.offset; i < (this.offset + batchLength); i++)
		{
			if(["FINISHED", "FAILED"].indexOf(this.downloads[i-1].getStatus()) > -1)
				downloadCount++
		}

		if(downloadCount===batchLength)
		{
			this.offset += batchLength;
			return true
		}
		return false
	}

    /**
     * Registers the downloads according
     * to a numeric wildcard format.
     */
	registerDownloads()
	{
		for (let i = 1; i <= this.max; i++)
		{
			this.add({
				origin: this.origin.replace('%', i),
				destination: this.destination,
				multiPartId: i
			})
		}
	}

    /**
     * Begins the sequence.
     * @param onEnd
     * @returns {Promise}
     */
	start(onEnd)
	{
		if(!this.onEnd) this.onEnd = onEnd;

		return new Promise((resolve, reject) =>
		{
            const fs = require('fs');

            fs.readdir('temp/TSOCabArchives', (err, files) =>
            {
                files.forEach(file =>
                {
                    if(file.indexOf('.tmp') > -1) {
                        fs.unlinkSync('temp/TSOCabArchives/' + file)
                    }
                });

                this.registerDownloads();
                this.downloadNextBatch();

                return resolve()
            });
		})
	}

    /**
     * Downloads next batch of files.
     */
	downloadNextBatch()
	{
		let difference = this.max - this.offset;

		let batchLength = (
			difference < this.queue ? difference + 1 : this.queue
		);

		for (let i = this.offset; i < (this.offset + batchLength); i++) {
			this.startSingle(i-1)
		}
	}
}

module.exports = MultipartDownload;