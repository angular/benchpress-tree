# Benchpress Tree Benchmark

Reference implementation of a deep tree baseline benchmark with benchpress, adapted from the tree
benchmark baseline in the [Angular repository](https://github.com/angular/angular).

Full documentation found at https://github.com/angular/angular/blob/master/modules/benchpress/README.js.md

## Run It

```
$ npm install .
$ ./node_modules/.bin/webdriver-manager update #Installs chromedriver and selenium standalone
$ ./node_modules/.bin/protractor protractor.conf.js #runs benchmark spec and logs output
```

## See The Code

 * Benchmark code: [public/tree.html](public/tree.html), [public/tree.js](public/tree.js)
 * Benchmark spec: [tree_benchmark.spec.js](tree_benchmark.spec.js)
 * Protractor config: [protractor.conf.js](protractor.conf.js)
