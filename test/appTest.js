let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');

// Assertion Style
chai.should();

chai.use(chaiHttp);

describe('API testing', () => {

    describe('GET /api/ping', () => {
        it('It should test the ping', done =>{
            chai.request(server)
                .get('/api/ping')
                .end( (err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                done();
                });
        });
    });

    describe('GET /api/posts', () => {
        it('It should test the complete uri', done =>{
            chai.request(server)
                .get('/api/posts?tags=science&sortBy=likes&direction=desc')
                .end( (err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('posts');
                done();
                });
        });

        it('It should test only tags', done =>{
            chai.request(server)
                .get('/api/posts?tags=science')
                .end( (err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('posts');
                done();
                });
        });

        it('It should test error of no tags', done =>{
            chai.request(server)
                .get('/api/posts')
                .end( (err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                done();
                });
        });

        it('It should test the likes and no direction value', done =>{
            chai.request(server)
                .get('/api/posts?tags=science&sortBy=likes')
                .end( (err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('posts');
                done();
                });
        });

        it('It should give error for wrong sortBy value', done =>{
            chai.request(server)
                .get('/api/posts?tags=science&sortBy=like')
                .end( (err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                done();
                });
        });

        it('It should test the direction and no likes value', done =>{
            chai.request(server)
                .get('/api/posts?tags=science&direction=desc')
                .end( (err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('posts');
                done();
                });
        });

        it('It should give error for wrong direction value', done =>{
            chai.request(server)
                .get('/api/posts?tags=science&direction=de')
                .end( (err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                done();
                });
        });
    });
});