// Rename, or copy, to config.js in the same directory
exports.config = {
	db: {
		type: 'mongo',
		auth: {
			user: 'username',
			pass: 'password',
			host: 'localhost',
			port: 27017
		},
		database: 'mergeatron',
		collections: [ 'pulls' ]
	},
	log_level: 'info',
	plugin_dirs: [ './plugins/' ],
	plugins: {
		github: {
			enabled: true,
			method: 'hooks',    // 'hooks' for webhooks or 'polling' to poll the REST API
			auth: {
				type: 'basic',
				username: 'username',
				password: 'password'
			},
			user: 'user-to-watch',
			repos: [ 'repo_name' ],
			retry_whitelist: [ 'user', 'user2' ],    // optional whitelist of those able to trigger retries
			skip_file_listing: false,
			frequency: 15000,    // only necessary if method is 'polling'
			port: '8888',        // only necessary if method is 'hooks'
			// optional. If running GitHub Enterprise this is the host/port to access the REST API.
			// Can be left out if just using github.com.
			api: {
				host: 'ghe.example.com',
				port: '1234'
			}
		},
		jenkins:  {
			enabled: true,
			user: false,
			pass: false,
			protocol: 'http',
			host: 'jenkins.yoururl.com:8080',
			projects: [{
				name: 'project_name',
				repo: 'repo_name',
				token: 'token',
				rules: [ new RegExp(/.php/g) ]
			}],
			frequency: 2000
		},
		hipchat:  {
			enabled: true,
			token: 'API_TOKEN', // Hipchat User's personal API token
			github_to_hipchat_users: { // Optional user translation hash for @mentions
				mbarany: 'MichaelBarany'
			}
		},
		phpcs: {
			enabled: false,
			artifact: 'artifacts/phpcs.csv'
		},
		phpunit: {
			enabled: false,
			artifact: 'artifacts/junit.xml',
			failure_limit: 3
		}
	}
};
