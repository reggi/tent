'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tent = exports.buildModule = exports.buildPackage = exports.installNpmModules = exports.getFileContents = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var getFileContents = exports.getFileContents = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(filePath) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _fsExtra2.default.readFileAsync(filePath, 'utf8');

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getFileContents(_x) {
    return ref.apply(this, arguments);
  };
}();

var installNpmModules = exports.installNpmModules = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(modules, path) {
    var pkg;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            pkg = {
              "description": "Cache for Tent",
              "repository": {
                "type": "git",
                "url": "git://github.com/username/repository.git"
              },
              "private": true,
              "readme": ""
            };
            _context2.next = 3;
            return _fsExtra2.default.ensureDirAsync(path);

          case 3:
            _context2.next = 5;
            return _fsExtra2.default.writeFileAsync((0, _path.join)(path, 'package.json'), JSON.stringify(pkg));

          case 5:
            _context2.next = 7;
            return npmInstallAsync(modules, { stdio: 'inherit', cwd: path });

          case 7:
            return _context2.abrupt('return', true);

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function installNpmModules(_x2, _x3) {
    return ref.apply(this, arguments);
  };
}();

var _buildPackage = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(file, tmp) {
    var results;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            results = {};

            results.tmp = tmp;
            results.file = file;
            results.comments = getComments(file);
            results.syntax = parseCommentsSyntax(results.comments);
            results.values = resolveValues(results.syntax);
            results.build = results.values.build ? parseNpmModuleSytax(results.values.build) : false;
            results.foundation = processFoundation(results.values.foundation);
            results.installModules = results.foundation.map(function (item) {
              return item.download;
            });
            _context3.next = 11;
            return installNpmModules(results.installModules, tmp);

          case 11:
            results.middleware = getMiddleware(results.foundation, tmp);
            _context3.next = 14;
            return buildPackageJson(results.middleware, results);

          case 14:
            results.pkg = _context3.sent;
            return _context3.abrupt('return', results);

          case 16:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function _buildPackage(_x5, _x6) {
    return ref.apply(this, arguments);
  };
}();

var _buildModule = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(file, tmp) {
    var results, pkg, build;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _buildPackage(file, tmp);

          case 2:
            results = _context4.sent;
            pkg = results.pkg;
            build = results.build;

            if (!build) {
              _context4.next = 11;
              break;
            }

            results.modulePath = (0, _path.join)(tmp, build.module);
            _context4.next = 9;
            return _fsExtra2.default.ensureDirAsync(results.modulePath);

          case 9:
            _context4.next = 11;
            return _fsExtra2.default.writeFileAsync((0, _path.join)(results.modulePath, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

          case 11:
            return _context4.abrupt('return', results);

          case 12:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function _buildModule(_x7, _x8) {
    return ref.apply(this, arguments);
  };
}();

exports.parseNpmModuleSytax = parseNpmModuleSytax;
exports.parseJsbinUrl = parseJsbinUrl;
exports.parseGistUrl = parseGistUrl;
exports.getComments = getComments;
exports.parseCommentSyntax = parseCommentSyntax;
exports.parseCommentsSyntax = parseCommentsSyntax;
exports.resolveValues = resolveValues;
exports.buildPackageJson = buildPackageJson;
exports.processFoundation = processFoundation;
exports.getMiddleware = getMiddleware;

var _path = require('path');

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _url = require('url');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _spawnNpmInstall = require('spawn-npm-install');

var _spawnNpmInstall2 = _interopRequireDefault(_spawnNpmInstall);

var _osTmpdir = require('os-tmpdir');

var _osTmpdir2 = _interopRequireDefault(_osTmpdir);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var npmInstallAsync = _bluebird2.default.promisify(_spawnNpmInstall2.default);
_bluebird2.default.promisifyAll(_fsExtra2.default);

function parseNpmModuleSytax(str) {
  var pattern = /^(.+?)(?:\@(.+?))?(?:\/(.+?))?(?:\[(.+?)\])?$/;
  var matches = str.match(pattern);
  var results = {
    'module': matches[1] || false,
    'version': matches[2] || false,
    'path': matches[3] || false,
    'method': matches[4] || false
  };
  return results;
}

function parseJsbinUrl(jsbinUrl) {
  var parsedUrl = (0, _url.parse)(jsbinUrl);
  var validHosts = ['jsbin.com', 'output.jsbin.com'];
  if (!(0, _lodash.includes)(validHosts, parsedUrl.host)) {
    throw new Error('parsing jsbin url: host is not jsbin');
  }
  var pieces = parsedUrl.path.split('/');
  var id = pieces[1] === 'api' ? pieces[2] : pieces[1];
  return { id: id };
}

function parseGistUrl(gistUrl) {
  var parsedUrl = (0, _url.parse)(gistUrl);
  var validHosts = ['gist.github.com'];
  if (!(0, _lodash.includes)(validHosts, parsedUrl.host)) {
    throw new Error('parsing gist url: host is not github gist');
  }
  var pieces = parsedUrl.path.split('/');
  var username = pieces[1];
  var id = pieces[2];
  var anchor = parsedUrl.hash ? parsedUrl.hash.replace(/^#/, '') : false;
  return { username: username, id: id, anchor: anchor };
}

function getComments(fileContent) {
  var pattern = /(\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$)/gm;
  var comments = fileContent.match(pattern);
  if (comments) comments = comments.map(function (comment) {
    return comment.trim().replace(/^\/\*|\*\/$|^\/\//g, '').trim();
  });
  return comments || [];
}

function parseCommentSyntax(comment) {
  var rootSyntax = ['tent', 'npm'];
  var buildSyntax = ['\\sbuild\\s', '\\s'];
  var fromSyntax = ['\\sfrom\\s', '\\sfoundation\\s'];
  var dualSyntax = ['\\sfrom\\s', '\\s'];
  var introSyntax = [].concat(fromSyntax, buildSyntax);
  var rootSyntaxPattern = rootSyntax.map(function (a) {
    return '' + a;
  }).join('|');
  var introSyntaxPattern = introSyntax.map(function (a) {
    return '' + a;
  }).join('|');
  var dualSyntaxPattern = dualSyntax.map(function (a) {
    return '' + a;
  }).join('|');
  var firstPattern = new RegExp('^' + rootSyntaxPattern);
  var secondPattern = new RegExp('^(' + rootSyntaxPattern + ')(' + introSyntaxPattern + ')(.+)');
  var thirdPattern = new RegExp('(' + dualSyntaxPattern + '(?=.*[\\[{]|[^\\]}]+$))');
  var isValid = comment.match(firstPattern);
  if (!isValid) return false;
  var matches = void 0;
  matches = comment.match(secondPattern);
  var key = void 0;
  var build = void 0;
  var foundation = void 0;
  if (matches[2].replace(/\s+/, '') === '') key = 'build';
  if (!key) key = matches[2].trim();
  if (key == 'from') key = 'foundation';
  var value = matches[3];
  matches = (0, _lodash.difference)(value.split(thirdPattern), [undefined, '']);
  if (key == 'build') build = matches[0];
  if (key == 'build' && matches[2]) foundation = matches[2];
  if (key == 'foundation') foundation = matches[0];
  var results = {};
  if (build) results.build = build;
  if (foundation) results.foundation = foundation;
  return results;
}

function parseCommentsSyntax(comments) {
  var data = comments.map(function (comment) {
    return parseCommentSyntax(comment);
  }).filter(function (comment) {
    return comment;
  });
  return _lodash.extend.apply(null, data);
}

function resolveValues(data) {
  return (0, _lodash.mapValues)(data, function (item) {
    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    };
  });
}

function buildPackageJson(middleware) {
  var access = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var x = require('../packages/tent-babel-deps').default;
  middleware.push(x());
  return _bluebird2.default.reduce(middleware, function (pkg, func) {
    return _bluebird2.default.resolve(func(access)).then(function (newPkgProps) {
      var newState = (0, _deepAssign2.default)({}, pkg, newPkgProps);
      access.package = newState;
      return newState;
    });
  }, {});
}

function processFoundation(foundation) {
  if ((0, _lodash.isPlainObject)(foundation)) {
    return (0, _lodash.chain)(foundation).mapValues(function (value, key) {
      var parsed = parseNpmModuleSytax(key);
      return _extends({
        'original': key
      }, parsed, {
        'download': (0, _lodash.without)([parsed.module, parsed.version], false).join('@'),
        'arguments': value
      });
    }).values().value();
  } else if ((0, _lodash.isArray)(foundation)) {
    return (0, _lodash.chain)(foundation).map(function (value) {
      var parsed = parseNpmModuleSytax(value);
      return _extends({
        'original': value
      }, parsed, {
        'download': (0, _lodash.without)([parsed.module, parsed.version], false).join('@'),
        'arguments': null
      });
    }).values().value();
  } else {
    var parsed = parseNpmModuleSytax(foundation);
    return [_extends({
      'original': foundation
    }, parsed, {
      'download': (0, _lodash.without)([parsed.module, parsed.version], false).join('@'),
      'arguments': null
    })];
  }
}

function getMiddleware(modules, path) {
  var middleware = (0, _lodash.map)(modules, function (mod) {
    var modulePath = mod.path ? mod.path : '';
    var moduleDownloadPath = (0, _path.join)(path, 'node_modules', mod.module, modulePath);
    var arg = !(0, _lodash.isArray)(mod.arguments) ? [mod.arguments] : mod.arguments;
    var val = void 0;
    if (mod.method) {
      val = require(moduleDownloadPath)[mod.method];
    } else {
      val = require(moduleDownloadPath);
      if (val.default) val = val.default;
    }
    if ((0, _lodash.isFunction)(val)) return val.apply(null, arg);
    return val;
  });
  middleware = (0, _lodash.flattenDeep)(middleware);
  return middleware;
}

exports.buildPackage = _buildPackage;
exports.buildModule = _buildModule;


var execAsync = _bluebird2.default.promisifyAll(_child_process.exec);

// const tentprebuild = `npm run tentprebuild &> /dev/null || :`
// const tentpostbuild = `npm run tentpostbuild &> /dev/null || :`

var Tent = exports.Tent = function () {
  function Tent(_ref) {
    var _ref$outDir = _ref.outDir;
    var outDir = _ref$outDir === undefined ? './' : _ref$outDir;
    var _ref$temp = _ref.temp;
    var temp = _ref$temp === undefined ? true : _ref$temp;

    _classCallCheck(this, Tent);

    this.cwd = process.cwd();
    this.tempOutDir = (0, _path.join)((0, _osTmpdir2.default)(), 'npm-tent');
    this.defaultOutDir = (0, _path.join)(this.cwd, outDir);
    this.outDir = temp ? this.tempOutDir : this.defaultOutDir;
    this.downloadDir = (0, _path.join)(this.tempOutDir, 'downloads');
  }

  _createClass(Tent, [{
    key: 'finish',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                console.log(this.tempOutDir);
                // await fs.removeAsync(this.tempOutDir)

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function finish() {
        return ref.apply(this, arguments);
      }

      return finish;
    }()
  }, {
    key: 'buildPackage',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(file) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return _buildPackage(file, this.outDir);

              case 2:
                return _context6.abrupt('return', _context6.sent);

              case 3:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function buildPackage(_x9) {
        return ref.apply(this, arguments);
      }

      return buildPackage;
    }()
  }, {
    key: 'buildModule',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(file) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return _buildModule(file, this.outDir);

              case 2:
                return _context7.abrupt('return', _context7.sent);

              case 3:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function buildModule(_x10) {
        return ref.apply(this, arguments);
      }

      return buildModule;
    }()
  }, {
    key: 'runBuildModule',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(action) {
        var cd;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                cd = 'cd ' + this.outDir;
                _context8.next = 3;
                return this.buildModule();

              case 3:
                if (!action) {
                  _context8.next = 6;
                  break;
                }

                _context8.next = 6;
                return execAsync([cd, action]);

              case 6:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function runBuildModule(_x11) {
        return ref.apply(this, arguments);
      }

      return runBuildModule;
    }()
  }, {
    key: 'execAction',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(act) {
        var action;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                action = {};

                action.tentpreinstall = 'npm run tentpreinstall &> /dev/null || :';
                action.tentpostinstall = 'npm run tentpostinstall &> /dev/null || :';
                action.tentprepublish = 'npm run tentprepublish &> /dev/null || :';
                action.tentpostpublish = 'npm run tentpostpublish &> /dev/null || :';
                action.npminstall = 'npm install';
                action.npmpublish = 'npm publish';
                action.install = [action.tentpreinstall, action.npminstall, action.tentpostinstall].join(' && ');
                action.publish = [action.tentprepublish, action.npmpublish, action.tentpostpublish].join(' && ');
                action.installpublish = [action.install, action.publish].join(' && ');
                _context9.next = 12;
                return execAsync([cd, action[act]]);

              case 12:
                return _context9.abrupt('return', _context9.sent);

              case 13:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function execAction(_x12) {
        return ref.apply(this, arguments);
      }

      return execAction;
    }()
  }]);

  return Tent;
}();