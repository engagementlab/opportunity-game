/**
 * Opportunity Game
 * 
 * Game Config Model
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * index model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var GameConfig = new keystone.List('GameConfig', 
	{
		label: 'Game Config',
		singular: 'Game Config',
		nodelete: true,
		nocreate: true
	});

/**
 * Model Fields
 * @main GameConfig
 */
GameConfig.add({
	name: { type: String, default: "Game Config", hidden: true, required: true, initial: true },
  startingMoney: { type: Number, required: true, initial: true },
  startingActions: { type: Number, required: true, initial: true },
  wellnessGoal: { type: Number, required: true, initial: true },

	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
});

/**
 * Model Registration
 */
GameConfig.defaultSort = '-createdAt';
GameConfig.defaultColumns = 'name';
GameConfig.register();
