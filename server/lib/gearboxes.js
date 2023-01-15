const numbro = require("numbro"),
    lsbl = require('log-symbols'),
    moment = require("moment"),
    fs = require('fs'),
    chalk = require('chalk');

Array.prototype.indexOf = function(val) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === val) return i;
    }

    return -1;
}

Array.prototype.remove = function(val) {
    const index = this.indexOf(val);

    if (index > -1) {
        this.splice(index, 1);
    }
}

module.exports = {
    //- Logger 
    log(type, msg) {
        if (type === "info") return console.log(chalk.yellowBright(`[${moment(new Date().getTime()).format("LTS")}] ${lsbl.info} ${msg}`));
        if (type === "warn") return console.log(chalk.redBright(`[${moment(new Date().getTime()).format("LTS")}] ${lsbl.warning} ${msg}`));
        if (type === "error") return console.log(chalk.red(`[${moment(new Date().getTime()).format("LTS")}] ${lsbl.error} ${msg}`));
        if (type === "errorobj") return console.log(chalk.red(`[${moment(new Date().getTime()).format("LTS")}] ${lsbl.info} ${msg}`));
        if (type === "success") return console.log(chalk.greenBright(`[${moment(new Date().getTime()).format("LTS")}] ${lsbl.success} ${msg}`));
        if (type === "normal") return console.log(`[${moment(new Date().getTime()).format("LTS")}] ${msg}`);
    },

    //- Remove Element from array
    arrayRemoveEle(array, removeValue) {
        return array.remove(removeValue)
    },

    //- RGB To Hex
    rgbToHex(r, g, b) {
        return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')
    },

    //- Randomizer
    randomize(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    //- Randomizer Discriminador
    randomizeDiscriminador() {
        var discrim = Math.floor(Math.random() * (9999 - 0000 + 1) + 0000);

        if (discrim.toString().length < 4) {
            return new Number(`0${discrim}`);
        } else {
            return discrim;
        }
    },

    //- Randomizer ID
    randomizeID() {
        var id = Math.floor(Math.random() * (999999999999999999 - 000000000000000000 + 1) + 000000000000000000);

        if (id.toString().length < 18) {
            return new Number(`0${id}`);
        } else {
            return id;
        }
    },

    //- Array randomizer
    random(length) {
        return Math.floor(Math.random() * length);
    },

    //- Number shorter
    /**
     * 
     * @param {String} numstring 
     * @param {Boolean} strict 
     */
    miliarize(numstring, strict) {
        if (typeof numstring == "number") {
            numstring = numstring.toString();
        };
        if (numstring.length < 4) return numstring;
        //-- -- -- -- --
        let stashe = numstring.replace(/\B(?=(\d{3})+(?!\d))/g, ".").toString();
        // Gibe precision pls
        if (strict) {
            let stash = stashe.split(".")
            switch (stash.length) {
                case 1:
                    return stash;
                case 2:
                    if (stash[1] != "000") break;
                    return stash[0] + "K";
                case 3:
                    if (stash[2] != "000") break;
                    return stash[0] + "." + stash[1][0] + stash[1][1] + "Mi";
                case 4:
                    if (stash[3] != "000") break;
                    return stash[0] + "." + stash[1][0] + stash[1][1] + "Bi";
            }
            return stashe;
        };
        // Precision is not a concern
        stash = stashe.split(".")
        switch (stash.length) {
            case 1:
                return stash.join(" ");
            case 2:
                if (stash[0].length <= 1) break;
                return stash[0] + "K";
            case 3:
                return stash[0] + "Mi";
            case 4:
                return stash[0] + "Bi";
        }
        return stashe;
    },

    //- Wait on Secs
    async wait(time) {
        time = typeof time == 'number' ? time : 1000;
        return new Promise(resolve => {
            setTimeout(() => {
                    resolve(true);
                },
                time * 1000 || 1000);
        });
    },

    //- Abbreviate Number
    abbrNum(num) {
        num = Math.round(num);
        nums = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000];
        if (num < 1000) return num
        if (nums.includes(num)) return numbro(num)
            .format("0a");
        if (num > 100000) return numbro(num)
            .format('1a')
        return numbro(num)
            .format("0a");
    },

    //- Shuffle
    shuffle(array) {
        console.warn("Deprecation warning: This is a Legacy Function")
        var currentIndex = array.length,
            temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    //- Capitalize
    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    //- Get Dirs
    getDirs(rootDir, cb) {
        fs.readdir(rootDir, function(err, files) {
            let dirs = [];
            for (let i = 0; i < files.length; ++i) {
                let file = files[i];
                if (file[0] !== '.') {
                    let filePath = rootDir + '/' + file;
                    fs.stat(filePath, function(err, stat) {
                        if (stat.isDirectory()) {
                            dirs.push(this.file);
                        }
                        if (files.length === (this.index + 1)) {
                            return cb(dirs);
                        }
                    }.bind({
                        index: i,
                        file: file
                    }));
                }
            }
        });
    }
}