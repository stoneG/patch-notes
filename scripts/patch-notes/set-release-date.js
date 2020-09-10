const package = require('../../package.json')
const semverUtils = require('semver-utils')
const fs = require('fs-extra')
const dateFormat = require('dateformat')
const { PATCH_NOTES_JSON_DIR, readPatchNotes, getDefaultPatchNotes } = require('./utils')

/**
 * --beta: boolean
 * --stable: boolean
 */
const argv = require('minimist')(process.argv)

/**
 * Update patch notes file release date.
 * @param {string} filename
 * @param {PatchNotes} defaultPatchNotes 
 * 
 * interface PatchNotes {
 *   appName: string
 *   version: string
 *   releaseDate: string
 *   features: string[]
 *   adjustments: string[]
 *   fixes: string[]
 * }
 */
async function updatePatchNotesReleaseDate(fileName, defaultPatchNotes) {
  const patchNotes = await readPatchNotes(`${PATCH_NOTES_JSON_DIR}/${fileName}.json`, defaultPatchNotes)
  patchNotes.releaseDate = dateFormat(new Date(), 'mmmm d, yyyy')
  fs.writeJson(`${PATCH_NOTES_JSON_DIR}/${fileName}.json`, patchNotes)
    .then(() => console.log(`Updated ${fileName}.json release date to ${patchNotes.releaseDate}`))
    .catch(err => console.error(err))
}

;(async function() {
  const { major, minor, patch } = semverUtils.parse(package.version)

  const versions = []
  if (argv.stable) {
    versions.push(semverUtils.stringify({ major, minor, patch }))
  }
  if (argv.beta) {
    versions.push(semverUtils.stringify({ major, minor, patch, release: 'b' }))
  }

  versions.forEach(v => {
    const defaultPatchNotes = getDefaultPatchNotes(v)
    updatePatchNotesReleaseDate(v, defaultPatchNotes)
  })
})()