"use strict";

const BasicAuth = require("../plugin"),
	Request = require("serviceberry/src/Request"),
	{HttpError} = require("serviceberry"),
	httpMocks = require("node-mocks-http");

describe("serviceberry-basic-auth", () => {
	var handler,
		request;

	beforeEach(() => {
		handler = new BasicAuth("realm {foo}");
		handler.getHash = jasmine.createSpy("BasicAuth.getHash")
			.and.returnValue("$2a$10$/ACGGgGwOgJmInU..tkiwu444p.Pxw552rCTv5Io2VGdnKl4QlFlG");
		request = createRequest("Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==");
	});

	it("should authenticate with the correct credentials", async () => {
		await handler.use(request);
	});

	it("should not authenticate with the wrong credentials", async () => {
		request = createRequest("Basic Ym9iOnNlY3JldA==");

		try {
			await handler.use(request);
			fail();
		} catch (error) {
			expect().nothing();
		}
	});

	it("should not authenticate without credentials", async () => {
		request = createRequest();

		try {
			await handler.use(request);
			fail();
		} catch (error) {
			expect().nothing();
		}
	});

	it("should fail if abstract method getHash is not overridden with an implementation", async () => {
		handler = new BasicAuth("realm", "UTF-8");

		try {
			await handler.use(request);
			fail();
		} catch (error) {
			expect().nothing();
		}
	});
});

function createRequest (authorization) {
	var incomingMessage = httpMocks.createRequest({
			url: "/",
			headers: {
				Authorization: authorization
			}
		}),
		request;

	incomingMessage.setEncoding = Function.prototype;
	request = new Request(incomingMessage);
	request.pathParams = {
		foo: "baz"
	};

	return request;
}
