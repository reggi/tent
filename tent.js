import { parse as urlParse } from "url"
import { join as pathJoin } from 'path'
import Gisty from 'gisty'
import osTmpDir from 'os-tmpdir'
import JSFiddleApi from 'jsfiddle-api'
import Promise from 'bluebird'

Promise.promisifyAll(JSFiddleApi)

const FROM_GIST = 'FROM_GIST'
const FROM_FILE = 'FROM_FILE'

class Tent {
  buildLocation, downloadLocation
  constructor({outDir = './', temp = false}){
    this.cwd = process.cwd()
    this.tempOutDir = pathJoin(osTmpDir(), 'tent')
    this.defaultOutDir = pathJoin(this.cwd, outDir)
    this.outDir = (temp) ? this.tempOutDir : this.defaultOutDir
    this.downloadDir = pathJoin(this.tempOutDir, 'downloads')
  }
  parseComments(tentFileComments) {

  }
  getTentComments(fileComments) {

  }
  getComments(fileContent) {

  }
  async buildPackageFromGist() {

  }
  async buildPackageFromFile() {

  }
  async buildPackageFromData({}) {

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

    let data = {
      mainFileContent,
      mainFilePath,
      downloadUrl // gist, github, jsbin
    }

    // > one file : https://gist.github.com/reggi/91d576d29c76521e7a4f57d2f25e20a9#file-left-pad-js
    // > all gist : https://gist.github.com/reggi/91d576d29c76521e7a4f57d2f25e20a9
    // (check gist for multiple files)

  }
  async buildFromGist(gistUrl) {
    this.build = FROM_GIST
    let gistData = this.getGistFromUrl(gistUrl)

  }
  async buildFromFile(filePath) {
    this.build = FROM_FILE
    let fileContent = await this.getFileContents(filePath)

  }
  async downloadFile({path, url}) {
    let file = {path, url}
    return downloadFiles([file])
  }
  async downloadFiles(files) {
    return new Promise((resolve, reject) => {
      let d = new Download({mode: '755'})
      each(files, file => {
        d.get(file.url, file.path)
      })
      d.run((err, val) => {
        if (err) return reject(err)
        return resolve(val)
      })
    })
  }
  async getFileContents(filePath) {
    return await fs.readFileAsync(filePath, 'utf8')
  }
  getComments(fileContent) {
    let pattern = /(\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$)/gm
    let comments = fileContent.match(pattern)
    return comments.map(comment => comment.replace(/\/\*|\*\//g, ''))
  }
  parseNpmModuleSytax (str) {
    let pattern = /^(.+?)(?:\@(.+?))?(?:\/(.+?))?(?:\[(.+?)\])?$/
    let matches = str.match(pattern)
    let results = {
      'module': matches[1] || false,
      'version': matches[2] || false,
      'path': matches[3] || false,
      'method': matches[4] || false
    }
    return results
  }
  parseGistUrl(gistUrl) {
    let parsedUrl = urlParse(gistUrl)
    if (parsedUrl.host !== 'gist.github.com') {
      throw new Error('parsing gist url: host is not github gist')
    }
    let pieces = parsedUrl.path.split('/')
    let username = pieces[1]
    let id = pieces[2]
    return {username, id}
  }
  async getGistFromData({username, id}) {
    let gist = new Gisty({ username })
    let gistAsync = Promise.promisify(gist.fetch.bind(gist))
    return await this.gistAsync(id)
  }
  async getGistFromUrl(url) {
    let {username, id} = this.parseGistUrl(url)
    return await this.getGistFromData({username, id})
  }
  async getJsbinJavascript (id) {
    let data = await axios.get(`https://jsbin.com/api/${id}`)
    return data.javascript
  }
  async getJsfiddleJavascript (id) {
    let data = await JSFiddleApi.getFiddle(id)
    return data.js
  }
}
