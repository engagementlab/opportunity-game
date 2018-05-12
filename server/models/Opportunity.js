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
Opportunity.add(
    {
        name: { type: String, default: "Opportunity Name", label: "Name", required: true, initial: true },
        description: { type: Types.Markdown, label: "Description", initial: true, required: true },

        location: {
            type: Types.Relationship,
            ref: 'Location',
            label: 'Location',
            note: 'The Location(s) this opportunity is for.',
            many: true,
            required: true,
            initial: true
        }
    },
    "Costs", {

        moneyCost: { type: Number, default: 0, label: "Money Cost" },
        actionCost: { type: Number, default: 0, label: "Action Cost" },

        commCost: { type: Number, default: 0, label: "Community Cost" },
        jobCost: { type: Number, default: 0, label: "Job Cost" },
        englishCost: { type: Number, default: 0, label: "English Cost" }

    },
    "Benefits", {
        locationUnlocks: {
            type: Types.Relationship,
            ref: 'Location',
            label: 'Unlocks Location(s)',
            filters: {
              unlockedAtStart: false
            },
            note: 'The Location(s) this opportunity unlocks.',
            many: true
        },
        
        moneyReward: { type: Number, default: 0, label: "Money Reward" },
        actionReward: { type: Number, default: 0, label: "Action Reward" },

        commReward: { type: Number, default: 0, label: "Community Reward" },
        jobReward: { type: Number, default: 0, label: "Job Reward" },
        englishReward: { type: Number, default: 0, label: "English Reward" },
        
        achievement:
        {
            "Transit": {type: Types.Boolean},
            "Job": {type: Types.Boolean}
        },
      	rewardFlavor: { type: String, label: "Reward Flavor for delayed reward(s)" },
        triggerAmt: { type: Number, default: 0, label: "Trigger After Actions", note: 'Number of actions to wait before benefit.' },
        effect: {
            type: Types.Relationship,
            ref: 'Event',
            label: 'Duration Effect (Life and/or Opportunity Event)',
            note: 'The event to show as duration effect (after x actions or rounds).',
            many: false
        },
        effectTrigger: { type: Types.Select, options: 'actions, end of round', note: 'What triggers duration effect event?' },
        effectWait: { type: Number, default: 0, label: "Actions to Wait", dependsOn: { effectTrigger: 'actions' }, note: 'Number of actions to wait before event.' },
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