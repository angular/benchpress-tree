var benchpress = require('benchpress');
var runner = new benchpress.Runner([
  benchpress.SeleniumWebDriverAdapter.PROTRACTOR_BINDINGS
]);

describe('deep tree baseline', function() {
  it('should be fast!', function(done) {
    //Tells protractor this isn't an Angular 1 application
    browser.ignoreSynchronization = true;
    //Load the benchmark, with a tree depth of 9
    browser.get('http://localhost:8080/tree.html?depth=9');
    /**
     * Tell benchpress to click the buttons to destroy and re-create the tree for each sample. 
     * Benchpress will log the collected metrics after each sample is collected, and will stop
     * sampling as soon as the calculated regression slope for last 20 samples is stable.
     **/
    runner.sample({
      id: 'table',
      execute: function() {
        $('#baselineDestroyDom').click();
        $('#baselineCreateDom').click();
      }
    }).then(done, done.fail);
  });
});
