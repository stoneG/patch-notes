const dateFormat = require('dateformat')
const fs = require('fs-extra')

const PATCH_NOTES_JSON_DIR = './patch-notes/json'
const PATCH_NOTES_HTML_DIR = './patch-notes/html'

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

function getDefaultPatchNotes(version) {
  if (version.startsWith(v)) {
    version = version.slice(1)
  }
  return {
    appName: version.findIndex('b') === -1 ? 'NZXT CAM' : 'NZXT CAM Beta',
    version,
    releaseDate: dateFormat(new Date(), 'mmmm d, yyyy'),
    features: [],
    adjustments: [],
    fixes: [],
  }
}

module.exports = {
    PATCH_NOTES_JSON_DIR,
    PATCH_NOTES_HTML_DIR,
    readPatchNotes,
    getDefaultPatchNotes,
}