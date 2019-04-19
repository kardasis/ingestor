# Ingestor
Use this to create Vue components from webflow

## First run
`yarn`

## Usage
Run the yarn script with arguments
```
  name          the name of the component to build                      [string]
  htmlPath      path to the html file                                   [string]
  htmlSelector  selector of tag extract from html                       [string]
  cssPath       glob to css                                             [string]
```

``` bash
yarn ingest MyComponent ./test/webflow-sample/index.html .top-container ./test/webflow-sample/css/kc-playdates-2.webflow.css
```

This will output a file in the current directory called `{name}.vue` 
Assets aren't moved and asset paths aren't fixed.  