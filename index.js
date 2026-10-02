const path = require('path');
const { spawn } = require('child_process');

const child = spawn(process.execPath, [path.join(__dirname, 'lib', 'client.js')], {
    stdio: 'inherit'
});

child.on('exit', (code) => {
    process.exit(code ?? 0);
});