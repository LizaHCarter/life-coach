'use strict';

var Mongo = require('mongodb');

function Goal(o, userId){
  this.name = o.name;
  this.due = new Date(o.due);
  this.tags = o.tags.split(',');
  this.userId = userId;
}

Object.defineProperty(Goal, 'collection', {
  get: function(){return global.mongodb.collection('goals');}
});

Goal.create = function(o, userId, cb){
  var goal = new Goal(o, userId);
  Goal.collection.save(goal, cb);
};

Goal.findAllByUserId = function(userId,cb){
  Goal.collection.find({userId:userId}).toArray(cb);
};

Goal.findById = function(id, userId, cb){
  var _id = Mongo.ObjectID(id);
  Goal.collection.findOne({_id:_id, userId:userId}, function(err, goal){
    cb(err, goal);
  });
};

module.exports = Goal;

