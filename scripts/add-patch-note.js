const exec = require('./exec')
const package = require('../package.json')
const semverUtils = require('semver-utils')

/**
 * --type: 'feature'|'adjustment'|'fix'|null
 * --patchNote: string
 */
const argv = require('minimist')(process.argv)

;(async function addPatchNote() {
  if (!argv.type) {
    console.warn('No patch note type, skipping...')
  }

  

  // const { major, minor, patch } = semverUtils.parse(package.version)
  // const newVersionString = semverUtils.stringify({ major, minor, patch, release: argv.prerelease })

  // console.log(`Updating version: ${newVersionString}`)
  // try {
  //   await exec('npm', ['version', newVersionString, '--no-git-tag-version', '--force'])
  // } catch (err) {
  //   console.error(err)
  // }
})()