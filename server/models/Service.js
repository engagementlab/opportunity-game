/**
 * Opportunity Game
 * 
 * Location Service Model
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * service model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Service = new keystone.List('Service', 
	{
		label: 'Services',
		singular: 'Service'
	});

/**
 * Model Fields
 * @main Service
 */
Service.add({
	name: { type: String, default: "Service Name", label: "Name", required: true, initial: true },
	description: { type: Types.Markdown, label: "Service Description", initial: true, required: true },
  moneyCost: { type: Number, default: 1, label: "Money Cost", required: true, initial: true },
  daysCost: { type: Number, default: 1, label: "Days Cost", required: true, initial: true },

  location: {
      type: Types.Relationship,
      ref: 'Location',
      label: 'Location',
      note: 'The Location this service is for.',
      required: true,
      initial: true
  },
	
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
});

/**
 * Model Registration
 */
Service.defaultSort = '-createdAt';
Service.defaultColumns = 'name, location';
Service.register();