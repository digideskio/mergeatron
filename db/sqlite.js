"use strict";

var Sqlite = function(config) {
	var sqlite3 = require('sqlite3').verbose();
	this.connection = new sqlite3.Database('local/' + config.database + '.db');
};

// pull methods
Sqlite.prototype.findPull = function(pull_number, pull_repo, callback) {
	this.connection.all('SELECT pulls.*, jobs.status, jobs.id as job_id, jobs.head as jobs_head FROM pulls LEFT JOIN jobs ON pulls.number = jobs.pull_number WHERE pulls.number = ? AND pulls.repo = ?', [ pull_number, pull_repo ], function (err, result){
		var response;
		if (result.length) {
			response = result[0];
			response.files = JSON.parse(response.files);
			response.jobs = [];
			result.forEach(function(row) {
				response.jobs.push({
					id: row.job_id,
					status: row.status,
					head: row.head
				});
			});
		}
		callback(err, response);
	});
};

Sqlite.prototype.updatePull = function(pull_number, pull_repo, update_columns) {
	var setters = [];
	var data = [];

	if (update_columns.files && typeof update_columns.files !== 'string'){
		update_columns.files = JSON.stringify(update_columns.files);
	}
	for (var i in update_columns) {
		setters.push(i + ' = ?');
		data.push(update_columns[i]);
	}
	data.push(pull_number);
	data.push(pull_repo);
	this.connection.run('UPDATE pulls SET ' + setters.join(', ') + ' WHERE number = ? AND repo = ?', data);
};

Sqlite.prototype.insertPull = function(pull, callback) {
	this.connection.run('INSERT INTO pulls (number, repo, created_at, updated_at, head, files) VALUES (?,?,?,?,?,?)', [
		pull.number,
		pull.repo,
		pull.created_at,
		pull.updated_at,
		pull.head.sha,
		JSON.stringify(pull.files)
	], callback);
};

Sqlite.prototype.findPullsByJobStatus = function(statuses, callback) {
	this.connection.all('SELECT pulls.*, jobs.status, jobs.id as job_id, jobs.head as job_head FROM pulls LEFT JOIN jobs ON pulls.number = jobs.pull_number WHERE jobs.status IN (?) ORDER BY pulls.id ASC', [ statuses ], function (err, result){
		if (!result.length){
			return;
		}

		var new_result = [],
			new_row,
			cur_pull;

		result.forEach(function(row) {
			if(cur_pull != row.number){
				if(new_row){
					new_result.push(new_row);
				}
				new_row = row;
				new_row.jobs = [];
				cur_pull = row.number;
			}

			new_row.jobs.push({
				id: row.job_id,
				status: row.status,
				head: row.job_head
			});
		});

		new_result.push(new_row);

		new_result.forEach(function(row){
			callback(err, row);
		});
	});
};

// job methods
Sqlite.prototype.insertJob = function(pull, job, callback) {
	var data = [job.id, job.status, job.head, pull.number];
	this.connection.run('INSERT INTO jobs (id, status, head, pull_number) VALUES (?,?,?,?)', data, callback);
};

Sqlite.prototype.updateJobStatus = function(job_id, status) {
	this.connection.run('UPDATE jobs SET status = ? WHERE id = ?', [ status, job_id ]);
};

// inline status methods
Sqlite.prototype.insertLineStatus = function(/* pull_number, filename, line_number */) {
	// todo: implement
};
	
module.exports = Sqlite;
