/**
 * Developed by Engagement Lab, 2018
 * ==============
 * Route to retrieve character and goal data
 * @class api
 * @author Johnny Richardson
 *
 * ==========
 */
const keystone = global.keystone,
      mongoose = keystone.get('mongoose'),
      Bluebird = require('bluebird'),
      Character = keystone.list('Character'),
      Goal = keystone.list('Goal');

mongoose.Promise = require('bluebird');

var buildData = (params, res) => {

    let character = Character.model.find({}).exec();
    let goal = Goal.model.find({}).exec();
    
    Bluebird.props({
      characters: character,
      goals: goal
    })
    .then(results => {
        return res.status(200).json({status: 200, data: results});

    }).catch(err => {
        console.log(err);
    })

}

/*
 * Get all data
 */
exports.get = function(req, res) {

    return buildData(req.params, res);

}