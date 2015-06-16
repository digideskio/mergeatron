"use strict";

var MongoDB = function(config) {
	var mongojs = require('mongojs');
	this.connection = mongojs(config.connectionString, config.collections);
};

// pull methods
MongoDB.prototype.findPull = function(pull_number, pull_repo, callback) {
	this.connection.pulls.findOne({ number: pull_number, repo: pull_repo }, callback);
};

MongoDB.prototype.updatePull = function(pull_number, pull_repo, update_columns) {
	this.connection.pulls.update({ number: pull_number, repo: pull_repo }, { $set: update_columns });
};

MongoDB.prototype.insertPull = function(pull, callback) {
	this.connection.pulls.insert({
		number: pull.number,
		repo: pull.repo,
		created_at: pull.created_at,
		updated_at: pull.updated_at,
		head: pull.head.sha,
		files: pull.files
	}, callback);
};

MongoDB.prototype.findPullsByJobStatus = function(statuses, callback) {
	this.connection.pulls.find({ 'jobs.status': { $in: statuses }}).forEach(callback);
};

// job methods
MongoDB.prototype.insertJob = function(pull, job) {
	if (typeof pull.jobs == 'undefined') {
		pull.jobs = [];
	}

	pull.jobs.push(job);

	this.updatePull(pull.number, pull.repo, { jobs: pull.jobs});
};

MongoDB.prototype.updateJobStatus = function(job_id, status) {
	this.connection.pulls.update({ 'jobs.id': job_id }, { $set: { 'jobs.$.status': status }});
};

// inline status methods
MongoDB.prototype.insertLineStatus = function(pull, filename, line_number) {
	this.connection.pulls.update({ _id: pull.number, 'files.filename': filename }, { $push: { 'files.$.reported': line_number } });
};

module.exports = MongoDB;