import { includes, chain } from 'lodash'
import { parse as urlParse } from 'url'

export function parseNpmModuleSytax (str) {
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

export function parseJsbinUrl (jsbinUrl) {
  let parsedUrl = urlParse(jsbinUrl)
  let validHosts = ['jsbin.com', 'output.jsbin.com']
  if (!includes(validHosts, parsedUrl.host)) {
    throw new Error('parsing jsbin url: host is not jsbin')
  }
  let pieces = parsedUrl.path.split('/')
  let id = (pieces[1] === 'api') ? pieces[2] : pieces[1]
  return {id}
}

export function parseGistUrl (gistUrl) {
  let parsedUrl = urlParse(gistUrl)
  let validHosts = ['gist.github.com']
  if (!includes(validHosts, parsedUrl.host)) {
    throw new Error('parsing gist url: host is not github gist')
  }
  let pieces = parsedUrl.path.split('/')
  let username = pieces[1]
  let id = pieces[2]
  let anchor = (parsedUrl.hash) ? parsedUrl.hash.replace(/^#/, '') : false
  return {username, id, anchor}
}

export async function getFileContents(filePath) {
  return await fs.readFileAsync(filePath, 'utf8')
}

export function getComments(fileContent) {
  let pattern = /(\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$)/gm
  let comments = fileContent.match(pattern)
  if (comments) comments = comments.map(comment => {
    return comment
      .trim()
      .replace(/^\/\*|\*\/$|^\/\//g, '')
      .trim()
  })
  return comments || []
}

export function parseComments (comments) {
  let rootSyntax = ['tent', 'npm']
  let buildSyntax = ['\\sbuild\\s', '\\s']
  let fromSyntax = ['\\sfrom\\s', '\\sfoundation\\s']
  let dualSyntax = ['\\sfrom\\s', '\\s']
  let introSyntax = [...fromSyntax, ...buildSyntax]
  let rootSyntaxPattern = rootSyntax.map(a => `${a}`).join('|')
  let introSyntaxPattern = introSyntax.map(a => `${a}`).join('|')
  let dualSyntaxPattern = dualSyntax.map(a => `${a}`).join('|')
  let firstPattern = new RegExp(`^${rootSyntaxPattern}`)
  let secondPattern = new RegExp(`^(${rootSyntaxPattern})(${introSyntaxPattern})(.+)`)
  let thirdPattern = new RegExp(`^(\\S+)(${dualSyntaxPattern})(.+)$`)

  let result = chain(comments)
    .filter(comment => comment.match(firstPattern))
    .map(comment => {
      let matches = comment.match(secondPattern)
      let key
      if (matches[2] === '') key = 'dual'
      if (matches[2] === ' ') key = 'build'
      if (!key) key = matches[2].trim()
      if (key == 'from') key = 'foundation'
      return {[key]: matches[3]}
    })
    .map(comment => {
      if (comment.dual) {
        let matches = comment.dual.value.match(thirdPattern)
        comment.build = matches[1]
        comment.foundation = matches[3]
      }
      return comment
    })
    .value()

  console.log(result)
  return result
  // return comments
    // .filter(comment => comment.match(firstPattern))
    // .map(comment => {
      // let matches = comment.match(secondPattern)
      // console.log(comment)
      // let key = (matches[2] === '') ? 'dual' : matches[2].trim()
      // return {[key]: matches[3]}
    // })

}
