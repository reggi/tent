'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = npm;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spawn = _child_process2.default.spawn;

var flatten = function flatten(arr) {
  return arr.reduce(function (a, b) {
    return a.concat(b);
  }, []);
};
// let spawnArgs = ['cwd', 'env', 'stdio', 'detached', 'uid', 'gid', 'shell']

function npm(args) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new _promise2.default(function (resolve, reject) {
    // get deps
    if (typeof args === 'string') args = args.split(/\s+/g);
    var deps = options.deps || [];
    if (options.deps) delete options.deps;
    // get command
    var command = options.command || options.cmd || 'npm';
    if (options.command) delete options.command;
    if (options.cmd) delete options.cmd;
    // get args
    args = flatten([args]).concat(deps);
    // run the script
    var proc = spawn(command, args, options);
    var error = '';
    if (proc.stderr) proc.stderr.on('data', function (data) {
      return error += data.toString();
    });
    proc.once('exit', function (code) {
      if (code === 0) {
        resolve(null);
      } else {
        var msg = error || 'exit code ' + code;
        reject(new Error(msg));
      }
    });
  });
}

// npm('install --save', {deps: ['lodash']})
// npm(['install', '--save'], {deps: ['lodash']})
// npm('npm run build')

// let cwd
// npm('install', {cwd})
// npm('run example', {cwd})
// npm('run', ['example'], {cwd})
// npm(['install', 'lodash'], {cwd})
// npm('install', ['lodash'], {cwd})
// npm(['run', 'example'], {cwd})
// npm('install', {'deps': ['lodash']}, {cwd})
// npm('install', {'deps': ['lodash']}, {cwd})
//
//
// npm('install', {deps: ['lodash'], cwd, stdio: 'inherit'})