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
    
    type: { type: Types.Select, options: 'life, effect', note: 'What type of event is this?', initial: true, required: true },
  	flavor: { type: Types.Text, label: "Flavor Text", initial: true, required: true },

    moneyCost: { type: Number, default: 1, label: "Money Cost", required: true, initial: true },
    actionCost: { type: Number, default: 1, label: "Action Cost", required: true, initial: true },

    commReward: { type: Number, default: 0, label: "Community Reward", initial: true },
    jobReward: { type: Number, default: 0, label: "Job Reward", initial: true },
    englishReward: { type: Number, default: 0, label: "English Reward", initial: true },

    moneyReward: { type: Number, default: 0, label: "Money Reward" },
    actionReward: { type: Number, default: 0, label: "Action Reward" },

    
    createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
  }
);

/**
 * Model Registration
 */
Event.defaultSort = '-createdAt';
Event.defaultColumns = 'name, type, moneyCost, actionCost';
Event.register();