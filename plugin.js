"use strict";

const auth = require("basic-auth"),
	{HttpError} = require("serviceberry"),
	bcrypt = require("bcryptjs"),
	placeholders = /\{([^}]+)\}/g;

class BasicAuth {
	constructor (realm, charset = "UTF-8") {
		Object.assign(this, {realm, charset});
	}

	async use (request) {
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

	async getHash () {
		throw new Error("serviceberry-basic-auth plugin exports an " +
			"abstract class (BasicAuth). Consumers of the plugin must extend" +
			"this class and at least implement the getHash(username) method.");
	}

	unauthorized (request, message) {
		return new HttpError(message, "Unauthorized", {
			"WWW-Authenticate": `Basic realm="${this.getRealm(request)}", charset="${this.charset}"`
		});
	}

	getRealm (request) {
		return this.realm.replace(placeholders, (match, placeholder) => request.getPathParam(placeholder));
	}
}

module.exports = BasicAuth;
