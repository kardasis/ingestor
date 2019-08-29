#!/usr/bin/env node
"use strict";

var _nodeHtmlParser = require("node-html-parser");

var _dropcss = _interopRequireDefault(require("dropcss"));

var _utils = require("./utils");

var _pretty = _interopRequireDefault(require("pretty"));

var _PrettyCSS = _interopRequireDefault(require("PrettyCSS"));

var _yargs = _interopRequireDefault(require("yargs"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var generateVueFile = function generateVueFile(html, css, name) {
  var result = '';
  result += '<template>\n';
  result += (0, _pretty["default"])(html) + '\n';
  result += '</template>\n\n';
  result += '<script>\n';
  result += 'export default {\n';
  result += '  name: \'' + name + '\'\n';
  result += '}\n';
  result += '</script>\n\n';
  result += '<style scoped lang="scss">\n';
  result += _PrettyCSS["default"].parse(css) + '\n';
  result += '</style>\n';
  return result.replace(/\t/g, '  ');
};

var removePrefixes = function removePrefixes(css) {
  console.log({
    css: css
  });
  css = css.replace(/{([^\n])/g, '{\n$1');
  css = css.replace(/}([^\n])/g, '}\n$1');
  css = css.replace(/([^\n])}/g, '$1\n}');
  var lines = css.split('\n');
  var cleanLines = lines.filter(function (l) {
    return !l.includes('-webkit') && !l.includes('-ms');
  });
  console.log(cleanLines.join('\n'));
  return cleanLines.join('\n');
};

var cleanColors = function cleanColors(css) {
  var hslaRegex = /hsla\(.*?\)/;
  var hslaMatches = css.match(hslaRegex);

  while (hslaMatches) {
    var match = hslaMatches[0];
    var paramString = match.split('(')[1].split(')')[0];
    var params = paramString.replace(/%/g, '').split(', ').map(parseFloat);
    params[0] = params[0] / 360.0;
    params[1] = params[1] / 100;
    params[2] = params[2] / 100;

    var rgba = _utils.hlsa2rgba.apply(void 0, _toConsumableArray(params));

    var rgbaString = 'rgba(' + rgba.join(' ,') + ')';
    css = css.replace(match, rgbaString); // find the next match

    hslaMatches = css.match(hslaRegex);
  }

  return css;
};

var ingest = function ingest(_ref) {
  var html = _ref.html,
      selector = _ref.selector,
      css = _ref.css,
      name = _ref.name,
      options = _ref.options;
  var rootNode = (0, _nodeHtmlParser.parse)(html).querySelector(selector);

  if (options.omitSelectors) {
    (0, _utils.pruneNode)(rootNode, options.omitSelectors);
  }

  var dirtyCss = (0, _dropcss["default"])({
    css: css,
    html: rootNode.toString()
  });
  dirtyCss = removePrefixes(dirtyCss.css);
  var cleanCss = cleanColors(dirtyCss);
  return generateVueFile(rootNode.toString(), cleanCss, name);
}; // eslint-disable-next-line no-unused-expressions


_yargs["default"].scriptName('ingestor').usage('$0 <cmd> [args]').command('* <name> <htmlPath> <htmlSelector> <cssPath> [omitSelectors..]', 'ingest!!!', function (yargs) {
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
  });
}, function (argv) {
  _fs["default"].readFile(argv.cssPath, 'utf8', function (err, css) {
    if (err) {
      console.error(err);
      return;
    }

    _fs["default"].readFile(argv.htmlPath, 'utf8', function (err, html) {
      if (err) {
        console.error(err);
        return;
      }

      var options = {
        omitSelectors: argv.omitSelectors
      };
      var result = ingest({
        html: html,
        selector: argv.htmlSelector,
        name: argv.name,
        css: css,
        options: options
      });

      _fs["default"].writeFile(argv.name + '.vue', result, 'utf8', function (err) {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    });
  });
}).help().argv;