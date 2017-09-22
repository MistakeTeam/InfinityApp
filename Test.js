var child = require('child_process');
var executablePath = "D:\\Games\\Europa Universalis IV\\eu4.exe";

child.exec('d:', { cwd: executablePath }, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});

// child.execFile(executablePath, function(err, data, dataerr) {
//     if (err) {
//         console.error(err);
//         return;
//     }

//     console.log(data.toString());
// });


// var exec = require('child_process').exec;
// exec('tasklist', function(err, stdout, stderr) {
//     if (err) {
//         console.error(err);
//         return;
//     }

//     console.log(stdout);
// });

// const { snapshot } = require("process-list");

// snapshot('path', 'name').then(tasks => console.log(tasks))