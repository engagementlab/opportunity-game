var assert = require('assert'),
    fs = require('fs');

var webdriver = require('selenium-webdriver'),
    test = require('selenium-webdriver/testing');
const By = webdriver.By, 
      Until = webdriver.until;

var assert = require('assert'),
    webdriver = require('selenium-webdriver'),
    conf_file = './conf.js',
    parallel = require('mocha.parallel'),
    Promise = require('bluebird');

var capabilities = require(conf_file).capabilities;
var buildDriver = function(caps) {
    return new Promise(function(resolve, reject) {
        var driver = new webdriver.Builder().
        usingServer('https://hub-cloud.browserstack.com/wd/hub').
        withCapabilities(caps).
        build();
        resolve(driver);
    });
};

parallel('browserstack tests', function() {
    var driver, bsLocal;

    capabilities.forEach(function(caps) {

        it(caps.browserName + ': Load homepage, scroll down a bit, go to About', function(done) {
            buildDriver(caps).then(function(driver) {
                driver.get('https://qa.civicidea.org').then(function() {
                    driver.findElement(By.xpath('//a[contains(text(), "Databasic.io")]')).click().then(function() {

                        driver.wait(Until.elementLocated(By.id('databasic.io')), 10000, 'Could not locate the child element within the time specified').then(function() {
                            driver.findElement(By.id('databasic.io')).then(function(text) {

                                driver.findElement(By.xpath("//a[@href='/about']")).click().then(function() {
                                    driver.getTitle().then(function(title) {
                                        console.log(title);
                                        driver.quit().then(function() {
                                          done();
                                        });
                                    });
                                });
                            });

                        });
                    });
                });
            });

        });

    });
});