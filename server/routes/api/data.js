/**
 * Developed by Engagement Lab, 2018
 * ==============
 * Route to retrieve all data
 * @class api
 * @author Johnny Richardson
 *
 * ==========
 */
const keystone = require('keystone'),
      mongoose = keystone.get('mongoose'),
      Bluebird = require('bluebird'),
      Location = keystone.list('Location');

mongoose.Promise = require('bluebird');

var buildData = (params, res) => {

    let dataObj = {};
    let promises = [];

    let locations = Location.model.find({}, 'name intro categories categoriesStr description.html opportunities url imageName')
                    .populate('opportunities', 'name description.html moneyCost actionCost commReward jobReward englishReward givesTransit givesJob type')
                    .exec();
    promises.push(locations);

    return Bluebird.all(promises.map(function (promise) {
      return promise.reflect();
    }))
    .then(results => {

        let arrResponse = [];

        results.forEach(
            result => {
                if(result.isFulfilled()) {
                    let locations = result.value();

                    _.each(locations, (l) => {
                        
                        l.categories = _.omitBy(l.categories, (value, key) => {
                            return !value;
                        });
                        l.categoriesStr = Object.keys(l.categories).join(' ');

                    });

                    arrResponse.push(locations);
                }
                else
                    console.error('Server error', result.reason());
            }
        );

        return res.status(200).json({status: 200, data: arrResponse});

    }).catch(err => {
        console.log(err);
    })

}

/*
 * Get all modules
 */
exports.get = function(req, res) {

    return buildData(req.params, res);

}