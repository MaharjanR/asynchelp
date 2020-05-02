'use strict';

const express = require('express');
const fetch = require("node-fetch");

const router = express.Router();

// when uri is api/ping
router.get('/ping', ((req, res) => {

    // it changes the status code to 200 and shows the json object to the user
    res.status(200).json({
        'sucess': true
    });

}));

// when uri is /posts this gets run
router.get('/posts', (req,res) => {
   
    //setting up a dictionary to store the data from API calls
    let dict = {};
    let posts;

    //stores the query after posts?
    const query = req.query;
    const tags = query.tags;
    const sortBy = query.sortBy;
    const direction = query.direction;


    // checks if there is a tags query in the uri or not
    if(tags){
        // splitting the tags from queries after each comma to fetch individual data and storing in tags variable
        const tagsArr = tags.split(',');
        let tagsLength = tagsArr.length;
        console.log(tagsLength);

        // try catch block to catch errors if thrown
        try{
            // loops through each tags to make an individual api calls
            tagsArr.forEach(async (element) => {
                // stores the data from api and turns it into json
                let data = await fetch(`https://hatchways.io/api/assessment/blog/posts?tag=${element}`);    
                let dataJson = await data.json();
                // loops through the data post from and storing it in dict array
                dataJson.posts.forEach(el => {
                    dict[el.id] = el;
                });
                tagsLength--;
                if(tagsLength == 0){
                    if( sortBy && direction){
                        if(sortBy == 'id' || sortBy == 'likes' || sortBy == 'popularity' || sortBy == 'reads'){
                            if(direction == 'asc' || direction == 'desc'){
                                posts = groupBy(dict, sortBy, direction);
                            }
                        }
                    }
                    else if(sortBy){
                        if(sortBy == 'id' || sortBy == 'likes' || sortBy == 'popularity' || sortBy == 'reads'){
                            posts = groupBy(dict, sortBy);
                        }
                        else{
                            res.status(400).json({ error: "sortBy parameter is invalid"})
                        }
                    }
                    else if(direction){
                        if(direction == 'asc' || direction == 'desc'){
                            posts = groupBy(dict, 'id', direction);
                        }
                        else{
                            res.status(400).json({ error: "direction parameter is invalid"})
                        }
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

    }

    // if no tags exist on query throw an error as it is mandatory
    else{
        res.status(400).json({ error: "Tags parameter is required" } )
    }
})


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