var webdriver = require('selenium-webdriver');
const By = webdriver.By, 
			Until = webdriver.until;

// Input capabilities
var capabilities = {

 'build': 'QA',
 'project': 'Civic Idea',
 'browserName' : 'Safari',
 'browser_version' : '9.1',
 'os' : 'OS X',
 'os_version' : 'El Capitan',
 'resolution' : '1024x768',
 'browserstack.user' : 'engagementlab1',
 'browserstack.key' : 'pJV2uWgdpzSUHkRmpCiX'
}

var driver = new webdriver.Builder().
  usingServer('http://hub-cloud.browserstack.com/wd/hub').
  withCapabilities(capabilities).
  build();

driver.get('https://qa.civicidea.org').then(function(){
	driver.findElement(By.xpath('//a[contains(text(), "Databasic.io")]')).click().then(function(){

		driver.wait(Until.elementLocated(By.id('databasic.io')), 10000, 'Could not locate the child element within the time specified').then(function(){
			driver.findElement(By.id('databasic.io')).then(function(text) {

			driver.findElement(By.xpath("//a[@href='/about']")).click().then(function(){
			    driver.getTitle().then(function(title) {
			      console.log(title);
			      driver.quit();
			    });
			  });
			});

		});
	});

});