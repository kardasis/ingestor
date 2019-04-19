import { hlsa2rgba, pruneNode } from '../utils'
import { parse } from 'node-html-parser'

describe('hlsa2rgba', () => {
  it('returns the correct value', () => {
    const rgba = hlsa2rgba(208.8118811881188 / 360, 0.8211, 0.5176, 0.4)
    expect(rgba).toEqual([31, 136, 233, 0.4])
  })
})


describe('pruneNode', () => {
  it('returns the correct value', () => {
    const html = '<div class="top"><a class="link" /><div class="art"><p class="inner">hi</p></div></div>'
    const root = parse(html)
    const res = pruneNode(root, ['.top .link'])
    expect(root.toString()).toEqual('<div class="top"><div class="art"><p class="inner">hi</p></div></div>')
  })
})
