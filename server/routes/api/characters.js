/**
 * Developed by Engagement Lab, 2018
 * ==============
 * Route to retrieve character data
 * @class api
 * @author Johnny Richardson
 *
 * ==========
 */
const keystone = require('keystone'),
      mongoose = keystone.get('mongoose'),
      Bluebird = require('bluebird'),
      Character = keystone.list('Character');

mongoose.Promise = require('bluebird');

var buildData = (params, res) => {

    let character = Character.model.find({}).exec();
    
    Bluebird.props({characters: character})
    .then(results => {
        return res.status(200).json({status: 200, data: results.characters});

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