serviceberry-basic-auth
=======================

Basic HTTP Authentication plugin for [Serviceberry](https://serviceberry.js.org).

Install
-------

```shell-script
npm install serviceberry-basic-auth
```

Usage
-----

This plugin exports an abstract class `BasicAuth` for extending by your
authorization class that know how to fetch your password hashes. To use this
plugin extend `BasicAuth` and implement at least `getHash(username)`. The resulting
hash is expected to be a `bcrypt` hash. `getHash` can be an `async` function
explicitly or it can return promise or synchronously return the `hash`.

```js
const BasicAuth = require("serviceberry-basic-auth");

class Auth extends BasicAuth {
	getHash (username) {
		return data.getHash(username); // can also return a promise or use async/await
	}
}

trunk.use(new Auth("Secret Realm"));
```

BasicAuth
---------
Abstract class

### constructor(realm[, charset])

  - **realm** *string*

    Identifies the protection space to the client when the server asks
	for credentials. Sets `this.realm`. Realm can contain curly brackets
	which delimit placeholder names which correlate to path parameters.
	For example `{tenant}'s realm` would result in `bob's realm` when the
	value of the value of the path parameter `tenant` is `bob`.

    From [RFC 7617](https://tools.ietf.org/html/rfc7617#section-2)

	> ...a free-form string that can only be compared for equality
	> with other realms on that server.

  - **charset**

    The character set that the server expects the client to use when sending
	the credentials. Defaults to `UTF-8`. Sets `this.charset`.

### getHash(username)

**You must extend this class and at least implement this method.**

Called by the `validate` method for fetching a `bcrypt` password hash for
`request.credentials.name`. Can be an `async` function. It should return or
resolve to a `bcrypt` hash string or throw an error.

  - **username** *string*

    The username sent as part of the request credentials. `request.credentials.name`.

### use(request, response)

The handler method. This is the method called by Serviceberry. Sets `request.credentials`.
This is an `async` function.

  - **request** *object*

    Serviceberry [`request`](https://serviceberry.js.org/docs/request.html) object.

  - **response** *object*

    Serviceberry [`response`](https://serviceberry.js.org/docs/response.html) object.

### validate(request)

Called by the `use` method to validate `request.credentials`. This is an `async`
function and should return or resolve to a boolean value or throw an error.

  - **request** *object*

    Serviceberry [`request`](https://serviceberry.js.org/docs/request.html) object.
