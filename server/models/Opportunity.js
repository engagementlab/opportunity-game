/**
 * Opportunity Game
 * 
 * Location Opportunity Model
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
var Opportunity = new keystone.List('Opportunity', 
	{
		label: 'Opportunities',
		singular: 'Opportunity'
	});

/**
 * Model Fields
 * @main Opportunity
 */
Opportunity.add({
  	name: { type: String, default: "Opportunity Name", label: "Name", required: true, initial: true },
  	description: { type: Types.Markdown, label: "Description", initial: true, required: true },
    type: { type: Types.Select, label: "Type", options: "Community, Job, English", required: true, initial: true },

    location: {
        type: Types.Relationship,
        ref: 'Location',
        label: 'Location',
        note: 'The Location(s) this opportunity is for.',
        many: true,
        required: true,
        initial: true
    },
    moneyCost: { type: Number, default: 1, label: "Money Cost", required: true, initial: true },
    actionCost: { type: Number, default: 1, label: "Action Cost", required: true, initial: true },
  },

  "Benefits", {
    commReward: { type: Number, default: 1, label: "Community Reward", required: true, initial: true },
    jobReward: { type: Number, default: 1, label: "Job Reward", required: true, initial: true },
    englishReward: { type: Number, default: 1, label: "English Reward", required: true, initial: true },
    achievement:
    {
        "Transit": {type: Types.Boolean},
        "Job": {type: Types.Boolean}
    }
  },
  
  {    
    createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
  }
);
Opportunity.schema.add({givesTransit: mongoose.Schema.Types.Boolean});
Opportunity.schema.add({givesJob: mongoose.Schema.Types.Boolean});

/**
 * Hooks
 * =============
 */
Opportunity.schema.pre('save', function(next) {

    if(this.achievement["Transit"])
      this.givesTransit = true;
    else
      this.givesTransit = false;

    if(this.achievement["Job"])
      this.givesJob = true;
    else
      this.givesJob = false;

    next();

});

/**
 * Model Registration
 */
Opportunity.defaultSort = '-createdAt';
Opportunity.defaultColumns = 'name, location, type';
Opportunity.register();