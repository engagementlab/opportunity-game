/**
 * Event Game
 * 
 * Life and Duration Event Model
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone'),
    mongoose = require('mongoose');
var Types = keystone.Field.Types;

/**
 * service model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Event = new keystone.List('Event', 
	{
		label: 'Events',
		singular: 'Event'
	});

/**
 * Model Fields
 * @main Event
 */
Event.add({
  	name: { type: String, default: "Event Name", label: "Name", required: true, initial: true },
  	flavor: { type: Types.Text, label: "Flavor Text", initial: true, required: true },

    moneyCost: { type: Number, default: 1, label: "Money Cost", required: true, initial: true },
    actionCost: { type: Number, default: 1, label: "Action Cost", required: true, initial: true },
    
    createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
  }
);

/**
 * Model Registration
 */
Event.defaultSort = '-createdAt';
Event.defaultColumns = 'name, moneyCost, actionCost';
Event.register();