#!/usr/bin/env node

import { parse } from 'node-html-parser'
import drop from 'dropcss'
import { hlsa2rgba, pruneNode } from './utils'
import pretty from 'pretty'
import prettyCSS from 'PrettyCSS'
import yargs from 'yargs'
import fs from 'fs'

const generateVueFile = (html, css, name) => {
  let result = ''
  result += '<template>\n'
  result += pretty(html) + '\n'
  result += '</template>\n\n'
  result += '<script>\n'
  result += 'export default {\n'
  result += '  name: \'' + name + '\'\n'
  result += '}\n'
  result += '</script>\n\n'
  result += '<style scoped lang="scss">\n'
  result += prettyCSS.parse(css) + '\n'
  result += '</style>\n'
  return result
}

const removePrefixes = (css) => {
  const lines = css.split('\n')
  const cleanLines = lines.filter(l => !l.includes('-webkit') && !l.includes('--ms'))
  return cleanLines.join('\n')
}

const cleanColors = (css) => {
  const hslaRegex = /hsla\(.*?\)/
  let hslaMatches = css.match(hslaRegex)
  while (hslaMatches) {
    const match = hslaMatches[0]
    const paramString = match.split('(')[1].split(')')[0]
    const params = paramString.replace(/%/g, '').split(', ').map(parseFloat)
    params[0] = params[0] / 360.0
    params[1] = params[1] / 100
    params[2] = params[2] / 100
    const rgba = hlsa2rgba(...params)
    const rgbaString = 'rgba(' + rgba.join(' ,') + ')'
    css = css.replace(match, rgbaString)

    // find the next match
    hslaMatches = css.match(hslaRegex)
  }
  return css
}

const ingest = function ({ html, selector, css, name, options }) {
  const rootNode = parse(html).querySelector(selector)
  console.log({ rootNode })
  if (options.omitSelectors) {
    pruneNode(rootNode, options.omitSelectors)
  }
  let dirtyCss = drop({ css, html: rootNode.toString() })
  dirtyCss = removePrefixes(dirtyCss.css)
  const cleanCss = cleanColors(dirtyCss)
  return generateVueFile(rootNode.toString(), cleanCss, name)
}

// eslint-disable-next-line no-unused-expressions
yargs.scriptName('ingestor')
  .usage('$0 <cmd> [args]')
  .command('* <name> <htmlPath> <htmlSelector> <cssPath> [omitSelectors..]', 'ingest!!!',
    (yargs) => {
      yargs.positional('name', {
        type: 'string',
        describe: 'the name of the component to build'
      }).positional('htmlPath', {
        type: 'string',
        describe: 'path to the html file'
      }).positional('htmlSelector', {
        type: 'string',
        describe: 'selector of tag extract from html '
      }).positional('cssPath', {
        type: 'string',
        describe: 'glob to css'
      }).positional('omitSelectors', {
        type: 'string',
        describe: 'selectors to be prunded before gathering css'
      })
    }, function (argv) {
      fs.readFile(argv.cssPath, 'utf8', (err, css) => {
        if (err) {
          console.error(err)
          return
        }
        fs.readFile(argv.htmlPath, 'utf8', (err, html) => {
          if (err) {
            console.error(err)
            return
          }
          const options = {
            omitSelectors: argv.omitSelectors
          }
          const result = ingest({
            html,
            selector: argv.htmlSelector,
            name: argv.name,
            css,
            options
          })
          fs.writeFile(argv.name + '.vue', result, 'utf8', (err) => {
            if (err) throw err
            console.log('The file has been saved!')
          })
        })
      })
    }).help().argv
