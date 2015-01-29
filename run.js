var spawn = require('child_process').spawn;

function run () {
  var zbie = spawn('node', ['./zombiebot.js']);

  zbie.stdout.on('data', function (data) {
    process.stdout.write('>: ' + data);
  });

  zbie.stderr.on('data', function (data) {
    process.stdout.write('x: ' + data);
  });

  zbie.on('close', function (code) {
    console.log('x: child process exited with code ' + code);
    console.log('o: re-starting soon.');
    setTimeout(run, 10000)
  });
}

run();