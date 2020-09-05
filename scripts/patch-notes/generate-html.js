const fs = require('fs-extra');

const React = require('react');

const ReactDOMServer = require('react-dom/server');

const {
  PATCH_NOTES_JSON_DIR,
  PATCH_NOTES_HTML_DIR,
  readPatchNotes
} = require('./utils');
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
  const {
    patchNotes
  } = props; // for blog permalink address

  const versionParts = patchNotes.version.split('.');

  if (versionParts[2].endsWith('-b')) {
    versionParts[2] = versionParts[2] + 'eta';
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, patchNotes.appName, " ", patchNotes.version), /*#__PURE__*/React.createElement("p", null, "Released ", patchNotes.releaseDate), /*#__PURE__*/React.createElement("h2", null, "Features:"), /*#__PURE__*/React.createElement("ul", null, patchNotes.features.length > 0 ? patchNotes.features.map(feature => /*#__PURE__*/React.createElement("li", {
    key: feature
  }, feature)) : /*#__PURE__*/React.createElement("li", null, "No new features.")), /*#__PURE__*/React.createElement("h2", null, "Adjustments:"), /*#__PURE__*/React.createElement("ul", null, patchNotes.adjustments.length > 0 ? patchNotes.adjustments.map(adjustment => /*#__PURE__*/React.createElement("li", {
    key: adjustment
  }, adjustment)) : /*#__PURE__*/React.createElement("li", null, "No new adjustments.")), /*#__PURE__*/React.createElement("h2", null, "Bug Fixes:"), /*#__PURE__*/React.createElement("ul", null, patchNotes.fixes.length > 0 ? patchNotes.fixes.map(fix => /*#__PURE__*/React.createElement("li", {
    key: fix
  }, fix)) : /*#__PURE__*/React.createElement("li", null, "No new fixes.")), /*#__PURE__*/React.createElement("p", null, "Please read the complete dev blog ", /*#__PURE__*/React.createElement("a", {
    href: `https://blog.nzxt.com/nzxt-cam-${versionParts[0]}-${versionParts[1]}-${versionParts[2]}-released/`
  }, "here")));
}

;

(async function () {
  const filenames = await fs.readdir(PATCH_NOTES_JSON_DIR);

  for (const filename of filenames) {
    if (filename.startsWith('unreleased') || !filename.endsWith('.json')) {
      console.log('Skipping', filename);
      continue;
    }

    const patchNotes = await readPatchNotes(`${PATCH_NOTES_JSON_DIR}/${filename}`);
    const patchNotesHtml = ReactDOMServer.renderToStaticMarkup( /*#__PURE__*/React.createElement(PatchNotes, {
      patchNotes: patchNotes
    }));
    fs.writeFile(`${PATCH_NOTES_HTML_DIR}/${filename}.html`, patchNotesHtml).then(() => console.log(`Generated ${filename}.html`)).catch(err => console.error(err));
  }
})();