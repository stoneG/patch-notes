const fs = require('fs-extra')
const React = require('react')
const ReactDOMServer = require('react-dom/server');
const { PATCH_NOTES_JSON_DIR, PATCH_NOTES_HTML_DIR, readPatchNotes } = require('./utils')

/**
 * React component for patch notes html
 * @param {PatchNotes} patchNotes
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
function PatchNotes(props) {
  const { patchNotes } = props

  // for blog permalink address
  const versionParts = patchNotes.version.split('.')
  if (versionParts[2].endsWith('-b')) {
    versionParts[2] = versionParts[2] + 'eta'
  }

  return (
    <React.Fragment>
      <h1>{patchNotes.appName} {patchNotes.version}</h1>
      <p>Released {patchNotes.releaseDate}</p>
      <h2>Features:</h2>
      <ul>
        {patchNotes.features.length > 0 ?
          patchNotes.features.map(feature => (<li key={feature}>{feature}</li>)) :
          <li>No new features.</li>
        }
      </ul>
      <h2>Adjustments:</h2>
      <ul>
        {patchNotes.adjustments.length > 0 ?
          patchNotes.adjustments.map(adjustment => (<li key={adjustment}>{adjustment}</li>)) :
          <li>No new adjustments.</li>
        }
      </ul>
      <h2>Bug Fixes:</h2>
      <ul>
        {patchNotes.fixes.length > 0 ?
          patchNotes.fixes.map(fix => (<li key={fix}>{fix}</li>)) :
          <li>No new fixes.</li>
        }
      </ul>
      <p>
        Please read the complete dev blog <a href={`https://blog.nzxt.com/nzxt-cam-${versionParts[0]}-${versionParts[1]}-${versionParts[2]}-released/`}>here</a>
      </p>
    </React.Fragment>
  )
}

;(async function() {
  const filenames  = await fs.readdir(PATCH_NOTES_JSON_DIR)
  for (const filename of filenames) {
    if (filename.startsWith('unreleased') || !filename.endsWith('.json')) {
      console.log('Skipping', filename)
      continue
    }

    const patchNotes = await readPatchNotes(`${PATCH_NOTES_JSON_DIR}/${filename}`)
    const patchNotesHtml = ReactDOMServer.renderToStaticMarkup(<PatchNotes patchNotes={patchNotes} />)

    fs.writeFile(`${PATCH_NOTES_HTML_DIR}/${filename}.html`, patchNotesHtml)
      .then(() => console.log(`Generated ${filename}.html`))
      .catch(err => console.error(err))
  }
})()