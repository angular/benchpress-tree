var benchpress = require('@angular/benchpress');
var runner = new benchpress.Runner([
  //use protractor as Webdriver client
  benchpress.SeleniumWebDriverAdapter.PROTRACTOR_PROVIDERS,
  //use RegressionSlopeValidator to validate samples
  {provide: benchpress.Validator, useExisting: benchpress.RegressionSlopeValidator},
  //use 10 samples to calculate slope regression
  {provide: benchpress.RegressionSlopeValidator.SAMPLE_SIZE, useValue: 20},
  //use the script metric to calculate slope regression
  {provide: benchpress.RegressionSlopeValidator.METRIC, useValue: 'scriptTime'},
  {provide: benchpress.Options.FORCE_GC, useValue: true}
]);

describe('deep tree baseline', function() {
  it('should be fast!', function(done) {
    var depth = 11;
    //Tells protractor this isn't an Angular 1 application
    browser.ignoreSynchronization = true;
    //Load the benchmark, with a tree depth of 9
    browser.get('http://localhost:8080/tree.html?depth='+depth);
    /*
     * Tell benchpress to click the buttons to destroy and re-create the tree for each sample.
     * Benchpress will log the collected metrics after each sample is collected, and will stop
     * sampling as soon as the calculated regression slope for last 20 samples is stable.
     */
    runner.sample({
      id: 'deep-tree',
      execute: function() {
        /*
         * Will call querySelector in the browser, but benchpress is smart enough to ignore injected
         * script.
         */
        $('#destroyDom').click();
        $('#createDom').click();
      },
      providers: [{
        provide: benchpress.Options.SAMPLE_DESCRIPTION,
        useValue: { depth: depth }
      }]
    }).then(done, done.fail);
  });
});
