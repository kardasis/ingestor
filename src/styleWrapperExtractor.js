#!/usr/bin/env node

import { parse } from 'node-html-parser'
import drop from 'dropcss'
import { hlsa2rgba, pruneNode } from './utils'
import pretty from 'pretty'
import prettyCSS from 'PrettyCSS'
import yargs from 'yargs'
import fs from 'fs'

const { parseComponent } = require('vue-sfc-parser')

const extract = function ({ vueFile, css }) {
  const res = parseComponent(vueFile)
  console.log(res.template.content)
}

// eslint-disable-next-line no-unused-expressions
yargs.scriptName('extractFromStyleWrapper')
  .usage('$0 <cmd> [args]')
  .command('* <pathToComponent> <pathToCss>', 'extractAway!!!',
    (yargs) => {
      yargs.positional('pathToComponent', {
        type: 'string',
        describe: 'the path to the vue component that you are extracting for'
      }).positional('pathToCss', {
        type: 'string',
        describe: 'path to the css that we are extracting'
      })
    }, function (argv) {
      fs.readFile(argv.pathToComponent, 'utf8', (err, vueFile) => {
        if (err) {
          console.error(err)
          return
        }
        fs.readFile(argv.pathToCss, 'utf8', (err, css) => {
          if (err) {
            console.error(err)
            return
          }
          const result = extract({
            css,
            vueFile
          })
          console.log(result)
          // fs.writeFile(argv.name + '.vue', result, 'utf8', (err) => {
          //   if (err) throw err
          //   console.log('The file has been saved!')
          // })
        })
      })
    }).help().argv
