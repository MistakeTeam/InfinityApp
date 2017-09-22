/**
 * DownloadWorker
 *
 * Class that handles a single download.
 */
const EventEmitter = require('events');
const fs = require('fs');

class DownloadWorker extends EventEmitter
{
    /**
	 * Set the options and default params.
     * @param options
     */
	constructor(options)
	{
		super();
		this.options = options;
		this.retries = 0;
		this.status = "PENDING";
		this.totalSize = 0;
		this.downloadedSize = 0
	}

    /**
	 * Set the current download status.
     * @param stat
     */
	setStatus(stat)
	{
		this.status = stat
	}

    /**
	 * Get the current download status.
     * @returns {string|*}
     */
	getStatus()
	{
		return this.status
	}

    /**
	 * Get the current progress.
     * @returns {{filename: (*|string|string|string)}}
     */
	getProgress()
	{
		let progress = { filename: this.options.origin };
			progress.totalSize = this.totalSize;
			progress.downloadedSize = this.downloadedSize;
			progress.percentage = (100 * this.downloadedSize / this.totalSize).toFixed(0);
			progress.mbDownloaded = (this.downloadedSize / 1048576).toFixed(2);
			progress.mbTotal = (this.totalSize / 1048576).toFixed(2);

		return progress
	}

    /**
	 * Begin the HTTP GET request.
     */
	run()
	{
		let file = fs.createWriteStream(this.options.destination + '.tmp');

		let request = require('http').get(this.options.origin, response =>
		{
			this.setStatus('IN_PROGRESS');

			this.totalSize = this.totalSize === 0 ?
				parseInt(response.headers['content-length']) : this.totalSize;

			response.pipe(file);

			response.on('data', chunk => {
				this.downloadedSize += chunk.length;
			});

			file.on('finish', () => {
				file.close(() => {
                    if(response.headers['content-md5']) {
                        return require('md5-file')(this.options.destination + '.tmp', (err, hash) =>
						{
							if(err) {
								// couldn't verify md5. wtf?
								return this.fail('File missing?');
							}

							if(hash!==response.headers['content-md5']) {
                                return this.fail('File was corrupted. Try again later.');
							}

                            fs.rename(this.options.destination + '.tmp', this.options.destination, () =>
                            {
                                this.setStatus('FINISHED');
                                this.emit('end');
                            })
						})
                    }

					fs.rename(this.options.destination + '.tmp', this.options.destination, () =>
					{
						this.setStatus('FINISHED');
						this.emit('end');
					})
				})
			});
		/**
		 * On error, delete the temporal file.
		 */
		}).on('error', (err) => {
		    file.close(() => {
				this.fail(err.message);
            })
		});
        /**
		 * Set a timeout of 30 seconds.
		 * After tht it will fail.
         */
		request.setTimeout(30000, () =>
		{
		    file.close(()  =>
			{
                fs.unlink(this.options.destination + '.tmp', () =>
				{
                    this.setStatus('FAILED');
                    return this.emit(
                        'error', 'Timeout!'
                    )
                })
            })
        })
	}

    /**
	 * Check if the file to download
	 * is already downloaded.
     */
	start()
	{
		fs.stat(this.options.destination, (err) =>
		{
			if(err === null) {
				this.setStatus('FINISHED');
				this.emit('end')
			} else {
				this.run()
			}
		})
	}

	fail(message) {
        fs.unlink(this.options.destination + '.tmp', () =>
        {
            if(this.retries < this.options.retries)
            {
                setTimeout(() => {
                    this.retries++;
                    this.start()
                }, 1750)
            } else {
                this.setStatus('FAILED');
                return this.emit(
                    'error', message
                )
            }
        })
	}
}

module.exports = DownloadWorker;