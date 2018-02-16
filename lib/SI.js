'use static';

var si = require("systeminformation");

var list_info;

function generator_list(cb) {
    var output = '';

    get_batteryinfo()
        .then(battery => {
            output += battery + '\r';
            return output
        })
        .then(get_graphicsinfo)
        .then(video => {
            output += video + '\r'
            return output
        })
        .then(get_system)
        .then(system => {
            output += system + '\r'
            return output
        })
        .then(get_mem)
        .then(mem => {
            output += mem + '\r'
            return output
        })
        .then(get_osinfo)
        .then(osinfo => {
            output += osinfo + '\r'
            return output
        })
        .then(get_cpu)
        .then(cpu => {
            output += cpu + '\r'
            return output
        })
        .then(output => {
            return cb(output);
        })
}

function get_cpu() {
    return new Promise((resolve, reject) => {
        // get main info cpu
        si.cpu(function (res, err) {
            if (err) {
                reject(err)
            }

            var cpuinfo = new Array();
            cpuinfo['manufacturer'] = res.manufacturer;
            cpuinfo['brand'] = res.brand;
            cpuinfo['speed_coree'] = res.speed;
            cpuinfo['cores_count'] = res.cores;

            list_info = '--- CPU info ---\n';
            Object.keys(cpuinfo).forEach(function (key) {
                list_info += key + ': ' + cpuinfo[key] + '\n';
            });
            resolve(list_info)
        })
    })
}

function get_osinfo() {
    return new Promise((resolve, reject) => {
        // get main info OS
        si.osInfo(function (res, err) {
            if (err) {
                reject(err)
            }

            var osinfo = new Array();
            osinfo['platform'] = res.platform;
            osinfo['distro'] = res.distro;
            osinfo['release'] = res.release;
            osinfo['codename'] = (process.platform === 'darwin' ? '-' : res.codename);
            osinfo['kernel'] = res.kernel;
            osinfo['arch'] = res.arch;
            osinfo['hostname'] = res.hostname;
            osinfo['logofile'] = res.logofile;

            list_info = '--- OS info ---\n';
            Object.keys(osinfo).forEach(function (key) {
                list_info += key + ': ' + osinfo[key] + '\n';
            });
            resolve(list_info)
        })
    })
}

function get_mem() {
    return new Promise((resolve, reject) => {
        // get main info memory
        si.mem(function (res, err) {
            if (err) {
                reject(err)
            }

            var meminfo = new Array();
            meminfo['total_memory'] = formatBytes(res.total);
            meminfo['swaptotal'] = formatBytes(res.swaptotal);

            list_info = '--- Memory info ---\n';
            Object.keys(meminfo).forEach(function (key) {
                list_info += key + ': ' + meminfo[key] + '\n';
            });
            resolve(list_info)
        })
    })
}

function get_system() {
    return new Promise((resolve, reject) => {
        // get main info device
        si.system(function (res, err) {
            if (err) {
                reject(err)
            }

            var systeminfo = new Array();
            systeminfo['manufacturer'] = res.manufacturer;
            systeminfo['model'] = res.model;
            systeminfo['serial'] = (res.serial === 'XXXXXXXXXXXXXXXX' ? 'This is hackintosh.' : res.serial);
            systeminfo['uuid'] = res.uuid;

            list_info = '--- System info ---\n';
            Object.keys(systeminfo).forEach(function (key) {
                list_info += key + ': ' + systeminfo[key] + '\n';
            });
            resolve(list_info)
        });
    })
}

function get_batteryinfo() {
    return new Promise((resolve, reject) => {
        // get main info battery
        si.battery(function (res, err) {
            if (err) {
                reject(err)
            }
            var batteryinfo = new Array();

            if (res.hasbattery) {
                batteryinfo['hasbattery'] = res.hasbattery;
                batteryinfo['maxcapacity'] = res.maxcapacity;
            } else {
                batteryinfo['hasbattery'] = 'Device has no battery';
            }

            list_info = '--- Battery info ---\n';
            Object.keys(batteryinfo).forEach(function (key) {
                list_info += key + ': ' + batteryinfo[key] + '\n';
            });
            resolve(list_info)
        })
    })
}


function get_graphicsinfo() {
    return new Promise((resolve, reject) => {
        si.graphics(function (res, err) {
            if (err) {
                reject(reject)
            }

            var graphicsinfo = new Array();

            graphicsinfo['model'] = res.controllers[0].model;
            graphicsinfo['vendor'] = res.controllers[0].vendor;
            graphicsinfo['videoram'] = res.controllers[0].vram + ' MB';
            graphicsinfo['display_model'] = (res.displays[0].model === 'Display' ? 'This is laptop' : res.displays[0].model);
            graphicsinfo['display_connection'] = (res.displays[0].connection === '' ? 'This is laptop' : res.displays[0].connection);
            graphicsinfo['resolutionx'] = res.displays[0].resolutionx;
            graphicsinfo['resolutiony'] = res.displays[0].resolutiony;
            // graphicsinfo['depth'] = res.displays[0].depth;


            list_info = '--- Graphics info ---\n';
            Object.keys(graphicsinfo).forEach(function (key) {
                list_info += key + ': ' + graphicsinfo[key] + '\n';
            });
            resolve(list_info)
        })
    })
}

function formatBytes(bytes, decimals) {
    if (bytes == 0) return '0 Byte';
    var k = 1000;
    var dm = decimals + 1 || 3;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = generator_list;