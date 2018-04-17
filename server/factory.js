/*!
 * Engagement Lab Site Framework
 * Developed by Engagement Lab, 2016
 * ==============
*/

 /**
 * Initialize an instance of KeystoneJS and mounts it to the pre-defined ExpressJS app.
 *
 * ### Examples:
 *
 *    siteFactory( { name: siteName, config: configData, app: appInstance, keystone: siteInst.keystone } );
 *
 * @class Sites
 * @name sites/factory
 * @param {Object} params The needed site config and Keystone, Express app, and Mongoose instance refs.
 * @param {Function} callback 
 * @return {Object} keystone.app Keystone's Express app reference
 * @see http://www.keystonejs.com/docs/configuration/
 */
 var SiteFactory = (function(params, callback) { 

	// Global dependencies
	var compression = require('compression'),
			FrameworkMiddleware = require('./middleware');

	var siteConfig = params.config, 
			moduleRoot =  require.resolve(__dirname).replace('app.js', ''),
			appInst = params.app,
			appServer = params.server;

	var logger = require('winston');
	var keystoneInst = require('keystone');

	logger.info('Initializing ' + colors.cyan.underline(siteConfig.name).underline);

	// Init the keystone instance when it is opened
	keystoneInst.init({

		'brand': siteConfig.name,
		'module root': moduleRoot,
		'model prefix': (siteConfig.db_prefix !== undefined) ? siteConfig.db_prefix : null,
		'mongo': 'mongodb://localhost/' + siteConfig.database,

		'frame guard': false,
		'auto update': true,
		'session': true,
		'auth': true,
		'user model': 'User',

		// // Setup SASS and Handlebars
		'sass': [moduleRoot + 'public'],
		'static': [moduleRoot + 'public'],
		'views': moduleRoot + 'templates/views',

		'locals': {

			_: require('underscore'),
			env: process.env.NODE_ENV,
			utils: keystoneInst.utils,
			editable: keystoneInst.content.editable

		},

		// prefix all built-in tags with 'keystone_'
		'cloudinary prefix': 'keystone',

		// prefix each image public_id with [{prefix}]/{list.path}/{field.path}/
		'cloudinary folders': true,

		'cloudinary secure': true

	});


	// appInst.use(express.static(__dirname  + '/../public'));
	// appInst.use('./public');


	// appInst.set('views', './templates/views/');
	// appInst.engine('hbs', hbsInstance.engine);
	// appInst.set('view engine', 'hbs');

	// Load this site's models
	// keystoneInst.import(__dirname  + '/../models');

	// keystoneInst.initDatabaseConfig();
	// Used only for production, otherwise sessions are stored in-memory
	if (process.env.NODE_ENV === 'production') {

		keystoneInst.set('session store', 'connect-mongostore');
		keystoneInst.set('session store options', {
			"db": {
				"name": siteConfig.database,
				"servers": [
					{ "host": "127.0.0.1", "port": 27017 }
				]
			}
		});

	}


	keystoneInst.import('models');
	keystoneInst.set('wysiwyg additional buttons', 'blockquote');
	
	// Load this site's routes
	keystoneInst.set('routes', require(moduleRoot + 'routes'));
	// appInst.use(require(moduleRoot + 'routes'));

	// Configure Admin UI
	keystoneInst.set('nav', siteConfig.admin_nav);
	if(siteConfig.admin_nav !== undefined)
		keystoneInst.set('nav', siteConfig.admin_nav);

	var middleware = new FrameworkMiddleware();
	
	if(siteConfig.allowed_domains !== undefined)
		keystoneInst.pre('routes', middleware.urlWhitelist(siteConfig.allowed_domains));
	else
		keystoneInst.set('cors allow origin', true);
	
	keystoneInst.start();


	// appInst.use(compression());	
	// appInst.use('/keystone', keystoneInst.Admin.Server.createStaticRouter(keystoneInst));

	// appInst.use(keystoneInst.get('session options').cookieParser);

	// appInst.use(keystoneInst.expressSession);
	// appInst.use(keystoneInst.session.persist);
	// appInst.use(require('connect-flash')());

	// appInst.use('/keystone', keystoneInst.Admin.Server.createDynamicRouter(keystoneInst));


	// keystoneInst.openDatabaseConnection(function () {
	// 	if(callback)
	// 		callback();

	// 	logger.info('> Site ' + colors.rainbow(siteConfig.name) + ' mounted'.italic + ' at ' + process.env.port);

	// });
		
});

module.exports = SiteFactory;