function hue2rgb (p, q, t) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

export const hlsa2rgba = (h, s, l, a) => {
  let r, g, b
  if (s === 0) {
    r = g = b = l * 255 // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q
    r = Math.round(255 * hue2rgb(p, q, h + 1 / 3))
    g = Math.round(255 * hue2rgb(p, q, h))
    b = Math.round(255 * hue2rgb(p, q, h - 1 / 3))
  }

  return [r, g, b, a]
}

// Prunes matching nodes IN PLACE according to the selctors provided
export const pruneNode = (root, selectors) => {
  for (let selector of selectors) {
    const nodesToPrune = root.querySelectorAll(selector)
    for (let node of nodesToPrune) {
      const prunedChildren = node.parentNode.childNodes.filter(n => n !== node)
      console.log({ node })
      node.parentNode.childNodes = prunedChildren
    }
  }
}
