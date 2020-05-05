'use strict';

const express = require('express');
const cache = require('express-redis-cache')();
const fetch = require('node-fetch');
const validator = require('./validator')
const { validationResult } = require('express-validator');

const router = express.Router();

// when uri is api/ping
router.get('/ping', ((req, res) => {

    // it changes the status code to 200 and shows the json object to the user
    res.status(200).json({
        'sucess': true
    });

}));

// when uri is /posts this gets run
router.get('/posts', cache.route(), validator.queryValidate, (req,res) => {

    const errors = validationResult(req);
    console.log('Lets see if it runs ');
    if (!errors.isEmpty()) {
        return res.status(400).json({ "errors": errors.array()[0].msg });
      }
   
    //setting up a dictionary to store the data from API calls
    let dict = {};
    let posts;

    //stores the query after posts?
    const { query } = req;
    const { tags } = query;
    const { sortBy } = query;
    const { direction } = query;


    console.log(query);

    // splitting the tags from queries after each comma to fetch individual data and storing in tags variable
    const tagsArr = tags.split(',');
    let tagsLength = tagsArr.length;

    // try catch block to catch errors if thrown
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

// function cache(req, res, next){

//     const { query } = req.query;

//     client.get(query, (err, data) => {
//         if(err) throw err;

//         if(data != null){
//             res.send(setResponse(query, data));
//         }
//         else{
//             next();
//         }
//     })

// }


/**
* Sorts out the dictionary and returns it in array
* @param (string, dictionary, string) sortby - sort by what values(id by default), dict - dictonary that needs to be sorted, direction - do they want it asc or desc( asc by default)
* 
*/
function groupBy(dict, sortBy = 'id', direction = 'asc' ) {

    let posts = [];
    for(let key in dict){
        posts.push(dict[key]);
    }
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