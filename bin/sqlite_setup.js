"use strict";

var config = require('../config').config.db,
	filename = 'local/' + config.database + '.db',
	connection;

if ( config.type !== 'sqlite' ) {
	console.log('Please set your config type to "sqlite" first and then execute this script again!');
	process.exit(1);
}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(filename);

db.serialize(function() {
	db.run('CREATE TABLE `pulls` ( `id` INTEGER PRIMARY KEY, `number` INT NOT NULL , `repo` VARCHAR( 128 ) NOT NULL, `created_at` VARCHAR( 20 ) NOT NULL , `updated_at`  VARCHAR( 20 ) NOT NULL , `head` VARCHAR( 40 ) NOT NULL , `files` LONGTEXT NOT NULL);');
	db.run('CREATE TABLE `jobs` ( `id` VARCHAR( 255 ) PRIMARY KEY , `pull_number` INT NOT NULL , `status` VARCHAR( 20 ) NOT NULL , `head` VARCHAR( 40 ) NOT NULL);');
	db.run('CREATE INDEX `jobs_pull_number` ON `jobs` (`pull_number` ASC);');
	db.run('CREATE INDEX `jobs_status` ON `jobs` (`status` ASC);');
});

db.close();
console.log('success!');
