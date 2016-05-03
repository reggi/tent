import child_process from 'child_process'

const spawn = child_process.spawn

let flatten = (arr) => arr.reduce((a, b) => {return a.concat(b)}, [])
// let spawnArgs = ['cwd', 'env', 'stdio', 'detached', 'uid', 'gid', 'shell']

export default function npm (args, options = {}) {
  return new Promise((resolve, reject) => {
    // get deps
    if (typeof args === 'string') args = args.split(/\s+/g)
    let deps = options.deps || []
    if (options.deps) delete options.deps
    // get command
    let command = options.command || options.cmd || 'npm'
    if (options.command) delete options.command
    if (options.cmd) delete options.cmd
    // get args
    args = flatten([args]).concat(deps)
    // run the script
    let proc = spawn(command, args, options)
    let error = ''
    if (proc.stderr) proc.stderr.on('data', (data) => error += data.toString())
    proc.once('exit', (code) => {
      if (code === 0) {
        resolve(null)
      } else {
        var msg = error || 'exit code ' + code
        reject(new Error(msg))
      }
    })
  })
}
