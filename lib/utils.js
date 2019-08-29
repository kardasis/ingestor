"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pruneNode = exports.hlsa2rgba = void 0;

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

var hlsa2rgba = function hlsa2rgba(h, s, l, a) {
  var r, g, b;

  if (s === 0) {
    r = g = b = l * 255; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = Math.round(255 * hue2rgb(p, q, h + 1 / 3));
    g = Math.round(255 * hue2rgb(p, q, h));
    b = Math.round(255 * hue2rgb(p, q, h - 1 / 3));
  }

  return [r, g, b, a];
}; // Prunes matching nodes IN PLACE according to the selctors provided


exports.hlsa2rgba = hlsa2rgba;

var pruneNode = function pruneNode(root, selectors) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = selectors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var selector = _step.value;
      var nodesToPrune = root.querySelectorAll(selector);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop = function _loop() {
          var node = _step2.value;
          var prunedChildren = node.parentNode.childNodes.filter(function (n) {
            return n !== node;
          });
          console.log({
            node: node
          });
          node.parentNode.childNodes = prunedChildren;
        };

        for (var _iterator2 = nodesToPrune[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

exports.pruneNode = pruneNode;