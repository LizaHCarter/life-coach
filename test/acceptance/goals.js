/* global describe, before, beforeEach, it */
'use strict';

process.env.PORT = 5555;
process.env.DB   = 'life-coach-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('goals', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .end(function(err, response){
        cookie = response.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /', function(){
    it('should fetch the home page', function(done){
      request(app)
      .get('/')
      .end(function(err, response){
        expect(response.status).to.equal(200);
        expect(response.text).to.include('Home');
        done();
      });
    });
  });

  describe('get /goals/new', function(){
    it('should show the new goals page', function(done){
      request(app)
      .get('/goals/new')
      .set('cookie', cookie)
      .end(function(err, response){
        expect(response.status).to.equal(200);
        expect(response.text).to.include('Name');
        expect(response.text).to.include('Due');
        expect(response.text).to.include('Tags');
        done();
      });
    });
  });

  describe('post /goals', function(){
    it('should create a new goal and redirect', function(done){
      request(app)
      .post('/goals')
      .set('cookie', cookie)
      .send('name=be+a+doctor&due=2014-08-29&tags=a%2C+b%2C+c+%2Cd')
      .end(function(err, response){
        expect(response.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /goals', function(){
    it('should show the goals page', function(done){
      request(app)
      .get('/goals')
      .set('cookie', cookie)
      .end(function(err, response){
        expect(response.status).to.equal(200);
        expect(response.text).to.include('doctor');
        expect(response.text).to.include('marathon');
        done();
      });
    });
  });
  describe('get /goals/3', function(){
    it('should show a specific goal page', function(done){
      request(app)
      .get('/goals/a00000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, response){
        expect(response.status).to.equal(200);
        expect(response.text).to.include('marathon');
        done();
      });
    });

    it('should not show a specific goal page', function(done){
      request(app)
      .get('/goals/a00000000000000000000003')
      .set('cookie', cookie)
      .end(function(err, response){
        expect(response.status).to.equal(302);
        done();
      });
    });
  });
});


