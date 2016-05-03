import assert from 'assert'
import { join as pathJoin } from 'path'
import osTmpDir from 'os-tmpdir'
import chai from 'chai'
import chaiFs from 'chai-fs'
import chaiAsPromised from 'chai-as-promised'
import fs from 'fs-extra'
import Promise from 'bluebird'
import npm from '../src/index'

Promise.promisifyAll(fs)
chai.should()
chai.use(chaiFs)
chai.use(chaiAsPromised)

let pkgOne = {
  'scripts': {
    'test-exit-zero': "echo 'Should exit with code 0' && exit 0",
    'test-exit-one': "echo 'Should exit with code 1' && exit 1"
  },
  'dependencies': {
    'lodash': '4.11.1'
  }
}

let cwd = pathJoin(osTmpDir(), 'npm-runner')

describe('npm-runner', () => {

  before(async () => {
    await fs.ensureDirAsync(cwd)
  })

  it('directory should exist', async () => {
    cwd.should.to.be.a.directory()
  })

  it('directory should run npm scripts', async () => {
    let dir = pathJoin(cwd, '/example-one')
    await fs.outputFileAsync(pathJoin(dir, '/package.json'), JSON.stringify(pkgOne, null, 2))
    await Promise.all([
      npm('run test-exit-one', {cwd: dir}).should.be.rejected,
      npm('run test-exit-zero', {cwd: dir}).should.not.be.rejected
    ])
  })

  it('directory should run npm whoami', async () => {
    let dir = pathJoin(cwd, '/example-one')
    // await fs.outputFileAsync(pathJoin(dir, '/package.json'), JSON.stringify(pkgOne, null, 2))
    await Promise.all([
      npm('whoami', {cwd: dir}).should.not.be.rejected,
    ])
  })

  it('directory should run npm install', async () => {
    let dir = pathJoin(cwd, '/example-one')
    // await fs.outputFileAsync(pathJoin(dir, '/package.json'), JSON.stringify(pkgOne, null, 2))
    await npm('install', {cwd: dir})
    pathJoin(dir, 'node_modules/lodash').should.be.a.directory()
  })

  it('directory should run npm install package', async () => {
    let dir = pathJoin(cwd, '/example-one')
    await fs.outputFileAsync(pathJoin(dir, '/package.json'), JSON.stringify(pkgOne, null, 2))
    await npm('install --save', {deps: ['underscore'], cwd: dir})
    pathJoin(dir, 'node_modules/lodash').should.be.a.directory()
    pathJoin(dir, 'node_modules/underscore').should.be.a.directory()
    let pkg = await fs.readFileAsync(pathJoin(dir, './package.json'), 'utf8').then(JSON.parse)
    assert.equal(typeof pkg.dependencies.lodash !== 'undefined', true)
    assert.equal(typeof pkg.dependencies.underscore !== 'undefined', true)
  })

  after(async () => {
    await fs.remove(cwd)
  })

})
