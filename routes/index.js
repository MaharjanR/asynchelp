'use strict';

const express = require('express');
const cache = require('express-redis-cache')({ expire: 30 });
const fetch = require('node-fetch');
const validator = require('./validator')
const { validationResult } = require('express-validator');

const router = express.Router();

// returns status 200 and object
router.get('/ping', ((req, res) => {

    // it changes the status code to 200 and shows the json object to the user
    res.status(200).json({
        'sucess': true
    });

}));

// first middleware to save caching the url, second middleware to validate the query
router.get('/posts', cache.route(), validator.queryValidate, (req,res) => {

    // stores the validation errors
    const errors = validationResult(req);

    // if there is errors, display the errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ "errors": errors.array()[0].msg });
    }
   
    // setting up a dictionary to store the data from API calls
    let dict = {};
    let posts;

    //stores the query after posts?
    const { query } = req;
    const { tags } = query;
    const { sortBy } = query;
    const { direction } = query;

    // splitting the tags from queries and store in variable
    const tagsArr = tags.split(',');
    let tagsLength = tagsArr.length;

    try{
        // loops through each tags to make an individual api calls
        tagsArr.forEach(async (element) => {
            // stores the data from api and turns it into json
            let data = await fetch(`https://hatchways.io/api/assessment/blog/posts?tag=${element}`);    
            let dataJson = await data.json();
            // loops through the data post from and storing it in dictonary
            dataJson.posts.forEach(el => {
                dict[el.id] = el;
            });

            tagsLength--;

            // runs once all the api call is made
            if(tagsLength == 0){
                if( sortBy && direction){
                    posts = groupBy(dict, sortBy, direction);
                }
                else if(sortBy){
                    posts = groupBy(dict, sortBy);
                }
                else if(direction){
                    posts = groupBy(dict, 'id', direction);
                }
                else{
                    posts = groupBy(dict);
                }
                res.status(200).json({posts});
            }
        });
    }
    catch(err){
        console.log(err);
    }
})


/**
* Sorts out the dictionary and returns it in array
* @param (string, dictionary, string) sortby - sort by what values(id by default), dict - dictonary that needs to be sorted, direction - do they want it asc or desc( asc by default)
* 
*/
function groupBy(dict, sortBy = 'id', direction = 'asc' ) {

    // stores all the data into an array
    let posts = [];
    for(let key in dict){
        posts.push(dict[key]);
    }
    // sort out the datas
    if(direction == 'desc'){
        const sortPosts = posts.sort( (a,b) => b[sortBy] - a[sortBy]);
        return sortPosts;
    }
    else{
        const sortPosts = posts.sort( (a,b) => a[sortBy] - b[sortBy]);
        return sortPosts;
    }
}

module.exports = router;