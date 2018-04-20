/**
 * Opportunity Game
 * 
 * Location Model
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
var Location = new keystone.List('Location', 
	{
		label: 'Location',
		plural: 'Locations'
	});

/**
 * Model Fields
 * @main Location
 */
Location.add({
	name: { type: String, default: "Location Page", hidden: true, required: true, initial: true },
	intro: { type: Types.Markdown, label: "Intro Text",  initial: true, required: true },
	description: { type: Types.Textarea, label: "Description",  initial: true, required: true },
	imageName: { type: String, required: true, initial: true, note: "Image to use in background." },
  url: { type: String, required: true, initial: true, note: "URL shown for this location (e.g. /location/xyz)." },
	category:
        {
            "Community": {type: Types.Boolean},
            "Job": {type: Types.Boolean},
            "English": {type: Types.Boolean},
            "Health and Help": {type: Types.Boolean},
        },
  opportunities: {
      type: Types.Relationship,
      ref: 'Opportunity',
      label: 'Opportunities',
      note: 'The opportunities for this location.',
      many: true
  },

	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
});

/**
 * Model Registration
 */
Location.defaultSort = '-createdAt';
Location.defaultColumns = 'name';
Location.register();