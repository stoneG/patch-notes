const exec = require('./exec')
const package = require('../package.json')
const semverUtils = require('semver-utils')
const fs = require('fs-extra')

/**
 * --baseRef: string Base branch name
 * --type: 'feat' | 'adj' | 'fix' | undefined
 * --context: 'beta'
 * --note: string
 */
const argv = require('minimist')(process.argv)

const PATCH_NOTES_JSON_DIR = './patch-notes/json'

/**
 * Read a JSON file as an object
 * @param {string} pathToFile 
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
async function readPatchNotes(pathToFile, defaultPatchNotes = {}) {
  try {
    return await fs.readJson(pathToFile)
  } catch {
    return defaultPatchNotes
  }
}

/**
 * Returns an updated patch notes object with a new patch note added.
 * @param {PatchNote} patchNote 
 * @param {PatchNotes} patchNotes 
 * 
 * interface PatchNote {
 *   type: string
 *   note: string
 * }
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
function addPatchNote(patchNote, patchNotes) {
  switch (patchNote.type) {
    case 'feat':
      patchNotes.features.push(patchNote.note)
      return patchNotes
    case 'adj':
      patchNotes.adjustments.push(patchNote.note)
      return patchNotes
    case 'fix':
      patchNotes.fixes.push(patchNote.note)
      return patchNotes
    default:
      console.warn(`Patch note type (${patchNotes.type}) is not supported.`)
  }
}

async function updatePatchNotes(fileName, defaultPatchNotes) {
  const patchNotes = addPatchNote(
    {
      type: argv.type,
      note: argv.note,
    },
    await readPatchNotes(`${PATCH_NOTES_JSON_DIR}/${fileName}.json`, defaultPatchNotes)
  )
  fs.writeJson(`${PATCH_NOTES_JSON_DIR}/${fileName}.json`, patchNotes)
    .then(() => console.log(`Updated ${fileName}.json with ${argv.type}: ${argv.note}`))
    .catch(err => console.err(err))
}

;(async function addPatchNote() {
  if (!argv.type || argv.type === 'n/a') {
    console.log(`Got patch note type (${argv.type}), skipping...`)
    return
  }

  const { major, minor, patch } = semverUtils.parse(package.version)
  const version = semverUtils.stringify({ major, minor, patch })
  const betaVersion = semverUtils.stringify({ major, minor, patch, release: 'b' })

  const defaultPatchNotes = {
    appName: 'NZXT CAM',
    version,
    releaseDate: 'n/a',
    features: [],
    adjustments: [],
    fixes: [],
  }
  const defaultBetaPatchNotes = {
    appName: 'NZXT CAM Beta',
    version: betaVersion,
    releaseDate: 'n/a',
    features: [],
    adjustments: [],
    fixes: [],
  }

  if (argv.baseRef.startsWith('release-candidate')) {
    if (argv.context != 'beta') {
      updatePatchNotes(version, defaultPatchNotes)
    }
    updatePatchNotes(betaVersion, defaultBetaPatchNotes)
  } else {
    if (argv.context != 'beta') {
      updatePatchNotes('unreleased', defaultBetaPatchNotes)
    }
    updatePatchNotes('unreleased-beta', defaultBetaPatchNotes)
  }
})()