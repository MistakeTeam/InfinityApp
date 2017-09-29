var fs = require('fs');

function doesFolderExist(path) {
    return fs.existsSync(path);
};

console.log(doesFolderExist('./config/options.json'));
if (!doesFolderExist('./config/options.json')) {
    var aaaa = fs.writeFile('./config/options.json', '{}', { enconding: 'utf-8', flag: 'w' }, function(err) {});
    console.log(aaaa);
}