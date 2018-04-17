/**
 * APP NAME
 * Developed by Engagement Lab, 2017
 * ==============
 * App boot logic
 *
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

// Load .env vars
if(process.env.NODE_ENV !== 'test')
	require('dotenv').load();

const SiteFactory = require('./factory'),
		 express = require('express');

_ = require('underscore'),
colors = require('colors');

// Return server object
serverStart = function() {

	return express();

};

// Any custom app initialization logic should go here
appStart = function(app) {

};

module.exports = function() {

	// let expressApp = serverStart();

	// expressApp.listen(process.env.PORT || 3000, () => {

		require('fs').readFile('./config.json', {encoding: 'utf8'}, function (err, data) {
		  
		  if (err) throw err;
		  var configData = 	JSON.parse(data);

			new SiteFactory({ 

				config: configData

			});

		});

	// });

}();