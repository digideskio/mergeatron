"use strict";

var config = require('./config').config.db;

exports.init = function() {
	if (config.type === 'mongo') {
		var MongoDB = require('./db/mongo');
		return new MongoDB(config);
	} else if (config.type === 'mysql') {
		var MySQL = require('./db/mysql');
		return new MySQL(config);
	} else if (config.type === 'sqlite') {
		var Sqlite = require('./db/sqlite');
		return new Sqlite(config);
	}
};
