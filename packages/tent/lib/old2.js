'use strict';

var _objectDestructuringEmpty2 = require('babel-runtime/helpers/objectDestructuringEmpty');

var _objectDestructuringEmpty3 = _interopRequireDefault(_objectDestructuringEmpty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _url = require('url');

var _path = require('path');

var _gisty = require('gisty');

var _gisty2 = _interopRequireDefault(_gisty);

var _osTmpdir = require('os-tmpdir');

var _osTmpdir2 = _interopRequireDefault(_osTmpdir);

var _jsfiddleApi = require('jsfiddle-api');

var _jsfiddleApi2 = _interopRequireDefault(_jsfiddleApi);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_jsfiddleApi2.default);

var FROM_GIST = 'FROM_GIST';
var FROM_FILE = 'FROM_FILE';

var Tent = function () {
  function Tent(_ref) {
    var _ref$outDir = _ref.outDir;
    var outDir = _ref$outDir === undefined ? './' : _ref$outDir;
    var _ref$temp = _ref.temp;
    var temp = _ref$temp === undefined ? false : _ref$temp;
    (0, _classCallCheck3.default)(this, Tent);

    this.cwd = process.cwd();
    this.tempOutDir = (0, _path.join)((0, _osTmpdir2.default)(), 'tent');
    this.defaultOutDir = (0, _path.join)(this.cwd, outDir);
    this.outDir = temp ? this.tempOutDir : this.defaultOutDir;
    this.downloadDir = (0, _path.join)(this.tempOutDir, 'downloads');
  }

  (0, _createClass3.default)(Tent, [{
    key: 'parseComments',
    value: function parseComments(tentFileComments) {}
  }, {
    key: 'getTentComments',
    value: function getTentComments(fileComments) {}
  }, {
    key: 'getComments',
    value: function getComments(fileContent) {}
  }, {
    key: 'buildPackageFromGist',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function buildPackageFromGist() {
        return ref.apply(this, arguments);
      }

      return buildPackageFromGist;
    }()
  }, {
    key: 'buildPackageFromFile',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function buildPackageFromFile() {
        return ref.apply(this, arguments);
      }

      return buildPackageFromFile;
    }()
  }, {
    key: 'buildPackageFromData',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref2) {
        var data;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                (0, _objectDestructuringEmpty3.default)(_ref2);


                // the idea is the within here we provide access to everything plugins would
                // need to build the file their own way, in my case I'd like to create a plugin
                // * that scans a file for deps, can account for local deps, and scan recursivley
                // * create a test within a file and run it during build process
                // if a plugin has access to the root or main file contens it's possible for them
                // to parse recursivley the entire module, the only time this doesnt work is
                // if it's a gist in which we need to provide access to the filePath and main here
                // but also download all of the files in the gist so they can still scan the
                // module ethe same way, we're passing in the gistUrl so that someone could
                // use it in their package.json if they so choose.

                data = {
                  mainFileContent: mainFileContent,
                  mainFilePath: mainFilePath,
                  downloadUrl: downloadUrl // gist, github, jsbin
                };

                // > one file : https://gist.github.com/reggi/91d576d29c76521e7a4f57d2f25e20a9#file-left-pad-js
                // > all gist : https://gist.github.com/reggi/91d576d29c76521e7a4f57d2f25e20a9
                // (check gist for multiple files)

              case 2:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function buildPackageFromData(_x) {
        return ref.apply(this, arguments);
      }

      return buildPackageFromData;
    }()
  }, {
    key: 'buildFromGist',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(gistUrl) {
        var gistData;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.build = FROM_GIST;
                gistData = this.getGistFromUrl(gistUrl);

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function buildFromGist(_x2) {
        return ref.apply(this, arguments);
      }

      return buildFromGist;
    }()
  }, {
    key: 'buildFromFile',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(filePath) {
        var fileContent;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.build = FROM_FILE;
                _context5.next = 3;
                return this.getFileContents(filePath);

              case 3:
                fileContent = _context5.sent;

              case 4:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function buildFromFile(_x3) {
        return ref.apply(this, arguments);
      }

      return buildFromFile;
    }()
  }, {
    key: 'downloadFile',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(_ref3) {
        var path = _ref3.path;
        var url = _ref3.url;
        var file;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                file = { path: path, url: url };
                return _context6.abrupt('return', downloadFiles([file]));

              case 2:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function downloadFile(_x4) {
        return ref.apply(this, arguments);
      }

      return downloadFile;
    }()
  }, {
    key: 'downloadFiles',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(files) {
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt('return', new _bluebird2.default(function (resolve, reject) {
                  var d = new Download({ mode: '755' });
                  each(files, function (file) {
                    d.get(file.url, file.path);
                  });
                  d.run(function (err, val) {
                    if (err) return reject(err);
                    return resolve(val);
                  });
                }));

              case 1:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function downloadFiles(_x5) {
        return ref.apply(this, arguments);
      }

      return downloadFiles;
    }()
  }, {
    key: 'getFileContents',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(filePath) {
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return fs.readFileAsync(filePath, 'utf8');

              case 2:
                return _context8.abrupt('return', _context8.sent);

              case 3:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getFileContents(_x6) {
        return ref.apply(this, arguments);
      }

      return getFileContents;
    }()
  }, {
    key: 'getComments',
    value: function getComments(fileContent) {
      var pattern = /(\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$)/gm;
      var comments = fileContent.match(pattern);
      return comments.map(function (comment) {
        return comment.replace(/\/\*|\*\//g, '');
      });
    }
  }, {
    key: 'parseNpmModuleSytax',
    value: function parseNpmModuleSytax(str) {
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
  }, {
    key: 'parseGistUrl',
    value: function parseGistUrl(gistUrl) {
      var parsedUrl = (0, _url.parse)(gistUrl);
      if (parsedUrl.host !== 'gist.github.com') {
        throw new Error('parsing gist url: host is not github gist');
      }
      var pieces = parsedUrl.path.split('/');
      var username = pieces[1];
      var id = pieces[2];
      return { username: username, id: id };
    }
  }, {
    key: 'getGistFromData',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(_ref4) {
        var username = _ref4.username;
        var id = _ref4.id;
        var gist, gistAsync;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                gist = new _gisty2.default({ username: username });
                gistAsync = _bluebird2.default.promisify(gist.fetch.bind(gist));
                _context9.next = 4;
                return this.gistAsync(id);

              case 4:
                return _context9.abrupt('return', _context9.sent);

              case 5:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getGistFromData(_x7) {
        return ref.apply(this, arguments);
      }

      return getGistFromData;
    }()
  }, {
    key: 'getGistFromUrl',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(url) {
        var _parseGistUrl, username, id;

        return _regenerator2.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _parseGistUrl = this.parseGistUrl(url);
                username = _parseGistUrl.username;
                id = _parseGistUrl.id;
                _context10.next = 5;
                return this.getGistFromData({ username: username, id: id });

              case 5:
                return _context10.abrupt('return', _context10.sent);

              case 6:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getGistFromUrl(_x8) {
        return ref.apply(this, arguments);
      }

      return getGistFromUrl;
    }()
  }, {
    key: 'getJsbinJavascript',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(id) {
        var data;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return axios.get('https://jsbin.com/api/' + id);

              case 2:
                data = _context11.sent;
                return _context11.abrupt('return', data.javascript);

              case 4:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function getJsbinJavascript(_x9) {
        return ref.apply(this, arguments);
      }

      return getJsbinJavascript;
    }()
  }, {
    key: 'getJsfiddleJavascript',
    value: function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(id) {
        var data;
        return _regenerator2.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return _jsfiddleApi2.default.getFiddle(id);

              case 2:
                data = _context12.sent;
                return _context12.abrupt('return', data.js);

              case 4:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getJsfiddleJavascript(_x10) {
        return ref.apply(this, arguments);
      }

      return getJsfiddleJavascript;
    }()
  }]);
  return Tent;
}();