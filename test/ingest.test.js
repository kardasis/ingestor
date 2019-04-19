import ingest from '../ingest'
import fs from 'fs'

const cssPath = './test/webflow-sample/css/kc-playdates-2.webflow.css'
const htmlPath = './test/webflow-sample/index.html'
fs.readFile(htmlPath, 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const options = {}
  const result = ingest({
    html: data,
    selector: '.top-container',
    name: 'JazzyComponent',
    cssPath,
    options
  })
  console.log(result)
})
