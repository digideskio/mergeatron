/**
 * The Hipchat integration plugin
 * @module Hipchat
 */
"use strict";

var HipchatApi = require('hipchatter');

/**
 * @class Hipchat
 * @param config {Object} The plugins configs
 * @param mergeatron {Mergeatron} An instance of the main Mergeatron object
 * @constructor
 */
var Hipchat = function(config, mergeatron) {
	this.config = config;
	this.mergeatron = mergeatron;
	this.api = new HipchatApi(this.config.token);
};

/**
 * Translates a github user to a hipchat user
 *
 * @method getUser
 * @param githubUser {String}
 * @return {String}
 */
Hipchat.prototype.getUser = function(githubUser) {
	if (this.config.github_to_hipchat_users && this.config.github_to_hipchat_users[githubUser]) {
		return this.config.github_to_hipchat_users[githubUser];
	}
	return githubUser;
};

/**
 * Post a message to hipchat
 *
 * @method sendUserMessage
 * @param user {String}
 * @param msg {String}
 */
Hipchat.prototype.sendUserMessage = function(user, msg) {
	this.api.send_private_message('@' + user, {
		message_format: 'text',
		message: msg
	}, function (err) {
		if (err) {
			this.mergeatron.log.error(err);
		}
	});
};


exports.init = function(config, mergeatron) {
	var hipchat = new Hipchat(config, mergeatron);

	mergeatron.on('build.started', function(job, pull, build_url) {
		var user = hipchat.getUser(pull.user.login);
		var msg = 'Pull #' + pull.number + ' (' + pull.title + ') Started! - ' + build_url;
		hipchat.sendUserMessage(user, msg);
	});

	mergeatron.on('build.succeeded', function(job, pull, build_url) {
		var user = hipchat.getUser(pull.user.login);
		var msg = 'Pull #' + pull.number + ' (' + pull.title + ') Succeeded! - ' + build_url;
		hipchat.sendUserMessage(user, msg);
	});

	mergeatron.on('build.failed', function(job, pull, build_url) {
		var user = hipchat.getUser(pull.user.login);
		var msg = 'Pull #' + pull.number + ' (' + pull.title + ') Failed! - ' + build_url;
		hipchat.sendUserMessage(user, msg);
	});

	mergeatron.on('build.aborted', function(job, pull, build_url) {
		var user = hipchat.getUser(pull.user.login);
		var msg = 'Pull #' + pull.number + ' (' + pull.title + ') Aborted! - ' + build_url;
		hipchat.sendUserMessage(user, msg);
	});
};
