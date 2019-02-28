/**
 * Game Goals
 * 
 * Character Goal Model
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

const keystone = global.keystone,
    mongoose = require('mongoose');
var Types = keystone.Field.Types;

/**
 * service model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Goal = new keystone.List('Goal', 
	{
		label: 'Goals',
		singular: 'Goal'
	});

/**
 * Model Fields
 * @main Goal
 */
Goal.add({

    careerRating: { type: Number, default: 1, label: "Career Matching Rank", initial: true },
    commRating: { type: Number, default: 1, label: "Community Matching Rank", initial: true },
    healthRating: { type: Number, default: 1, label: "Comfort/Health Matching Rank", initial: true },

    commGoal: { type: Number, default: 0, label: "Community Goal", initial: true },
    jobGoal: { type: Number, default: 0, label: "Job Goal", initial: true },
    englishGoal: { type: Number, default: 0, label: "English Goal", initial: true },
    wellbeingGoal: { type: Number, default: 0, label: "Wellbeing Goal", initial: true },
    
    createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
  }
);

/**
 * Model Registration
 */
Goal.defaultSort = '-createdAt';
Goal.defaultColumns = 'careerRating, commRating, healthRating, commGoal, englishGoal, jobGoal, wellbeingGoal';
Goal.register();