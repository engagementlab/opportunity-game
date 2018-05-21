/**
 * Opportunity Game
 * 
 * Character Model
 * @module character
 * @class character
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * character model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Character = new keystone.List('Character', 
	{
		label: 'Character',
		plural: 'Characters'
	});

/**
 * Model Fields
 * @main Character
 */
Character.add({
	name: { type: String, default: "Character Name", required: true, initial: true },
	bio: { type: Types.Text, label: "Bio", initial: true, required: true }
});

/**
 * Model Registration
 */
Character.defaultSort = '-createdAt';
Character.defaultColumns = 'name, filter1, filter2, filter3';
Character.register();
