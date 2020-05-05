const { query } = require('express-validator');

// validates the query tags
exports.queryValidate = [
    // validates the tags query
    query('tags', 'Tags parameter is required')
        .not()
        .isEmpty(),
    // validates the sortby query
    query('sortBy')
        .custom( value => {
            if(value){
                if(value !== 'id' && value !== 'likes' && value !== 'popularity' && value !== 'reads'){
                    throw new Error('sortBy parameter is invalid');
                }
            }
            return true;
        }),
    // validates the direction query
    query('direction')
        .custom( value => {
            if(value){
                if(value !== 'asc' && value !== 'desc' ){
                    throw new Error('direction parameter is invalid');
                }
            }
            return true;
        })
];