# Ingestor
A small utility to extract html and css from webflow export and create a Vue.js component.

## First run
`yarn`
or
`npm install`
to install packages


## Usage
Run the yarn script with arguments
```
  name                  the name of the component to build                      [string]
  htmlPath              path to the html file                                   [string]
  htmlSelector          selector of tag extract from html                       [string]
  cssPath               glob to css                                             [string]
  omitSelectors         list of selectors to omit                               [string]
```

Example:
``` bash
yarn ingest MyComponent ./test/webflow-sample/index.html .top-container ./test/webflow-sample/css/kc-playdates-2.webflow.css .filter-btn-container
```
This will output a file in the current directory called `{name}.vue`.  That component will contain the contents of the first tag with the class `top-container`, but will omit the tags with class `filter-btn-container` from it.  The intention is that those would be separate components.

## Tests
To run test suite:
`yarn run test`
