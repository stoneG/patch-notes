const execa = require('execa')

module.exports = function exec(...args) {
  const e = execa(...args)
  e.stdout.pipe(process.stdout)
  e.stderr.pipe(process.stderr)
  return e
}
