import osTmpDir from 'os-tmpdir'
import { join as pathJoin } from 'path'
import fs from 'fs'
import Promise from 'bluebird'
import assert from 'assert'
import {
  getFileContents,
  installNpmModules,
  parseNpmModuleSytax,
  parseJsbinUrl,
  parseGistUrl,
  getComments,
  parseCommentSyntax,
  parseCommentsSyntax,
  resolveValues,
  buildPackageJson,
  processFoundation,
  getMiddleware,
  Tent
} from '../src/index'
import chai from "chai"
import chaiAsPromised from "chai-as-promised"

Promise.promisifyAll(fs)

// buildPackage
// buildModule
// parseNpmModuleSytax
// parseJsbinUrl
// parseGistUrl
// getComments
// parseCommentSyntax
// parseCommentsSyntax
// resolveValues
// buildPackageJson
// processFoundation
// getMiddleware

chai.should()
chai.use(chaiAsPromised)

describe('getFileContents', () => it('should work', async () => {
  let fileName = pathJoin(__dirname, './tent.spec.js')
  let fileOne = await getFileContents(fileName)
  let fileTwo = await fs.readFileAsync(fileName, 'utf8')
  assert.deepEqual(fileOne, fileTwo)
}))

// describe('installNpmModules', () => it('should work', async () => {
//   let tmpDir = osTmpDir()
//   let checkDir = pathJoin(tmpDir, 'node_modules')
//   await installNpmModules(['lodash'], tmpDir)
//   dir = await fs.readdirAsync(checkDir)
//   console.log(dir) // doesn't work offline :(
//   // pathJoin(checkDir, 'lodash')
// }))

describe('parseNpmModuleSytax', () => it('should work', () => {
  assert.deepEqual(parseNpmModuleSytax('lodash'), {"module":"lodash","version":false,"path":false,"method":false})
  assert.deepEqual(parseNpmModuleSytax('lodash@4.11.1'), {"module":"lodash","version":"4.11.1","path":false,"method":false})
  assert.deepEqual(parseNpmModuleSytax('lodash/file'), {"module":"lodash","version":false,"path":"file","method":false})
  assert.deepEqual(parseNpmModuleSytax('lodash[uniq]'), {"module":"lodash","version":false,"path":false,"method":"uniq"})
  assert.deepEqual(parseNpmModuleSytax('lodash@4.11.1/file'), {"module":"lodash","version":"4.11.1","path":"file","method":false})
  assert.deepEqual(parseNpmModuleSytax('lodash@4.11.1[uniq]'), {"module":"lodash","version":"4.11.1","path":false,"method":"uniq"})
  assert.deepEqual(parseNpmModuleSytax('lodash/file[uniq]'), {"module":"lodash","version":false,"path":"file","method":"uniq"})
  assert.deepEqual(parseNpmModuleSytax('lodash@4.11.1/file[uniq]'), {"module":"lodash","version":"4.11.1","path":"file","method":"uniq"})
}))

describe('parseJsbinUrl', () => it('should work', () => {
  assert.deepEqual(parseJsbinUrl('https://jsbin.com/api/wanegavisa'), {"id": "wanegavisa"})
  assert.deepEqual(parseJsbinUrl('https://output.jsbin.com/wanegavisa'), {"id": "wanegavisa"})
  assert.deepEqual(parseJsbinUrl('https://jsbin.com/api/wanegavisa'), {"id": "wanegavisa"})
}))

describe('parseGistUrl', ()  => it('should work', () => {
  assert.deepEqual(parseGistUrl('https://gist.github.com/reggi/91d576d29c76521e7a4f57d2f25e20a9'), {"username": "reggi", "id": "91d576d29c76521e7a4f57d2f25e20a9", "anchor": false})
  assert.deepEqual(parseGistUrl('https://gist.github.com/reggi/91d576d29c76521e7a4f57d2f25e20a9#file-left-pad-js'), {"username": "reggi", "id": "91d576d29c76521e7a4f57d2f25e20a9", "anchor": "file-left-pad-js"})
}))

describe('getComments', () => it('should work', () => {
  assert.deepEqual(getComments('alpha /* beta */ gamma'), ['beta'])
  assert.deepEqual(getComments('alpha /* /* beta */ */ gamma'), ['/* beta'])
  assert.deepEqual(getComments('alpha /* beta */ gamma // delta'), ['beta', 'delta'])
  assert.deepEqual(getComments('alpha // alpha // beta'), ['alpha // beta'])
  assert.deepEqual(getComments('alpha // beta'), ['beta'])
  assert.deepEqual(getComments('alpha beta'), [])
  assert.deepEqual(getComments(''), [])
}))

describe('parseCommentSyntax', () => it('should work', () => {
  assert.deepEqual(parseCommentSyntax('tent my-build@1.0.0'), {"build": "my-build@1.0.0"})
  assert.deepEqual(parseCommentSyntax('tent build my-build@1.0.0'), {'build': 'my-build@1.0.0'})
  assert.deepEqual(parseCommentSyntax('tent from my-foundation@1.0.0'), {'foundation': 'my-foundation@1.0.0'})
  assert.deepEqual(parseCommentSyntax('tent foundation my-foundation@1.0.0'), {'foundation': 'my-foundation@1.0.0'})
  assert.deepEqual(parseCommentSyntax('tent my-build@1.0.0 my-foundation@1.0.0'), {"build": "my-build@1.0.0", 'foundation': 'my-foundation@1.0.0'})
  assert.deepEqual(parseCommentSyntax('tent my-build@1.0.0 from {"example": "argument"}'), {"build": "my-build@1.0.0", 'foundation': "{\"example\": \"argument\"}"})
  assert.deepEqual(parseCommentSyntax('tent my-build@1.0.0 from ["example"]'), {"build": "my-build@1.0.0", 'foundation': "[\"example\"]"})
}))

describe('parseCommentsSyntax', () => it('should work', () => {
  assert.deepEqual(parseCommentsSyntax(['tent build my-build@1.0.0', 'tent from my-foundation@1.0.0']), {'build': 'my-build@1.0.0', 'foundation': 'my-foundation@1.0.0'})
  assert.deepEqual(parseCommentsSyntax(['tent build build-one@1.0.0', 'tent from my-foundation@1.0.0', 'tent build build-two@1.0.0']), {'build': 'build-two@1.0.0', 'foundation': 'my-foundation@1.0.0'})
  assert.deepEqual(parseCommentsSyntax(['tent build build-one@1.0.0', 'tent build build-two@1.0.0 from my-foundation@1.0.0']), {'build': 'build-two@1.0.0', 'foundation': 'my-foundation@1.0.0'})
}))

describe('resolveValues', () => it('should work', () => {
  assert.deepEqual(resolveValues({'build': 'my-build@1.0.0'}), {'build': 'my-build@1.0.0'})
  assert.deepEqual(resolveValues({'build': '["my-build@1.0.0"]'}), {'build': ['my-build@1.0.0']})
  assert.deepEqual(resolveValues({'build': '{"my-build@1.0.0": "argument"}'}), {'build': {"my-build@1.0.0": "argument"}})
}))

describe('processFoundation', () => it('should work', () => {
  assert.deepEqual(processFoundation('found@1.0.0'), [{"original":"found@1.0.0","module":"found","version":"1.0.0","path":false,"method":false,"download":"found@1.0.0","arguments":null}])
  assert.deepEqual(processFoundation('found'), [{"original":"found","module":"found","version":false,"path":false,"method":false,"download":"found","arguments":null}])
  assert.deepEqual(processFoundation('found/path'), [{"original":"found/path","module":"found","version":false,"path":"path","method":false,"download":"found","arguments":null}])
  assert.deepEqual(processFoundation('found[uniq]'), [{"original":"found[uniq]","module":"found","version":false,"path":false,"method":"uniq","download":"found","arguments":null}])
  assert.deepEqual(processFoundation(['found@1.0.0']), [{"original":"found@1.0.0","module":"found","version":"1.0.0","path":false,"method":false,"download":"found@1.0.0","arguments":null}])
  assert.deepEqual(processFoundation({'found@1.0.0': 'meow'}), [{"original":"found@1.0.0","module":"found","version":"1.0.0","path":false,"method":false,"download":"found@1.0.0","arguments":"meow"}])
  assert.deepEqual(processFoundation({'found@1.0.0/path': 'meow'}), [{"original":"found@1.0.0/path","module":"found","version":"1.0.0","path":"path","method":false,"download":"found@1.0.0","arguments":"meow"}])
  assert.deepEqual(processFoundation({'found@1.0.18/path[uniq]': 'ruff'}), [{"original":"found@1.0.18/path[uniq]","module":"found","version":"1.0.18","path":"path","method":"uniq","download":"found@1.0.18","arguments":"ruff"}])
  assert.deepEqual(processFoundation({'found@1.0.0/path': 'meow', 'found@1.0.18/path[uniq]': 'ruff'}), [{"original":"found@1.0.0/path","module":"found","version":"1.0.0","path":"path","method":false,"download":"found@1.0.0","arguments":"meow"},{"original":"found@1.0.18/path[uniq]","module":"found","version":"1.0.18","path":"path","method":"uniq","download":"found@1.0.18","arguments":"ruff"}])
}))

// let file = `// tent build example@1.0.0 from {"tent-example-middleware@1.0.0":["key", "value"]}`
// let file = `// tent build example@1.0.0 from tent-thomas-reggi@1.0.3`
//
// let file = `
//   // tent build example@1.0.0 from tent-thomas-reggi@1.0.2
//   import _ from 'lodash@3.0.0'
//   import Promise from 'bluebird'
// `
// new Tent({temp: true}).buildPackage(file)
//   .then(console.log)
//   .catch(console.error.bind(console))
//
// let one = (name) => (access) => ({name})
// let two = (version) => (access) => ({version})
// let three = require('../packages/tent-example-middleware/index.js')
//
// buildPackageJson([one('one'), two('2')]).should.eventually.deep.equal({'name':'one', 'version':'2'})
// buildPackageJson([one('one'), two('2'), three('key', 'value')]).should.eventually.deep.equal({'name':'one', 'version':'2', 'key': 'value'})
