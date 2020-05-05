const { query } = require('express-validator');

exports.queryValidate = [
    query('tags', 'Tags parameter is required')
        .not()
        .isEmpty(),
    query('sortBy')
        .custom( value => {
            if(value){
                if(value !== 'id' && value !== 'likes' && value !== 'popularity' && value !== 'reads'){
                    throw new Error('sortBy parameter is invalid');
                }
            }
            return true;
        }),
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