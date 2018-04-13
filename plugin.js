"use strict";

const auth = require("basic-auth"),
	{HttpError} = require("serviceberry"),
	bcrypt = require("bcryptjs");

class BasicAuth {
	constructor (realm, charset = "UTF-8") {
		Object.assign(this, {realm, charset});
	}

	async use (request, response) {
		request.credentials = auth(request.incomingMessage);

		if (!request.credentials) {
			throw this.unauthorized("Please provide valid credentials.");
		}

		return this.validate(request);
	}

	async validate (request) {
		const hash = await this.getHash(request.credentials.name),
			valid = await bcrypt.compare(request.credentials.pass, hash);

		if (!valid) {
			throw this.unauthorized("Invalid credentials. Please try again.");
		}
	}

	async getHash (username) {
		throw new Error("serviceberry-basic-auth plugin exports an " +
			"abstract class (BasicAuth). Consumers of the plugin must extend" +
			"this class and at least implement getHash(username) method.");
	}

	unauthorized (message) {
		return new HttpError(message, "Unauthorized", {
			"WWW-Authenticate": `Basic realm="${this.realm}", charset="${this.charset}"`
		});
	}
}

module.exports = BasicAuth;
