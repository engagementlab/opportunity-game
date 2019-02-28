/**
 * Portland of Opportunity backend
 * Developed by Engagement Lab, 2018
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
	
_ = require('lodash');
 
const bootstrap = require('@engagementlab/el-bootstrapper'), 
      express = require('express');
 
let app = express();
bootstrap.start(
    // Path to config
    './config.json', 
    // Express
    app,
    // The root of this app on disk, needed for keystonejs
    __dirname + '/', 
    // Any additional config vars you want for keystonejs instance
    // See: https://keystonejs.com/documentation/configuration/
    {
        'name': 'Portland of Opportunity CMS'
    },
    () => {
        // any logic to run after app is mounted
        // you need at least:
        app.listen(process.env.PORT);
    }
);