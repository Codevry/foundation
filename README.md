# Foundation
> Proxy service to add rate-limits in front of your existing APIs

Foundation service is useful to add authentication in the form of rate-limiting to your existing end points.
It is very helpful in the context when you have existing public facing APIs on which you have to add some limits based on user.
You can create any number of users, control rate-limits assigned individually & revoke or reset anytime you wish.

### Features

* Host on your own server
* REST APIs for interaction
* Admin user for all sensitive operations
* Create unlimited users
* Provide a limit based on a certain period
  * hourly
  * daily
  * weekly
  * monthly
  * yearly
  * custom
    * provide a custom time in seconds when the limit will reset
    * if you wish to provide one-time use limits with infinite time, use this with a huge number
    * once the one-time limit is exhausted, either give more quota (upcoming) or create a new key for them.
* Change limits for each user anytime
* Reset their current limit
* Delete a key anytime to revoke it
* Routes `Secure` & `Open` can work on any method GET, PUT, POST, DELETE etc.

### Upcoming Features
* Add more quota of requests to existing limits
  * Useful when a user has consumed their quota in a given period & you need to provide a few extras

### Installation

#### Docker Compose
* Clone the project
* Setup .env file as mentioned in the [ENV.docker.md](ENV.docker.md) file
* Start the service using `docker-compose up`
* Default credentials (admin token) will be printed in logs inside the app container

#### Building From Source

##### Pre-Requisites

* Clone the project
* Redis database (logs of all rate limits & keys)
* Bun runtime installed (https://bun.com/)
* Setup .env file as mentioned in [the ENV.md](ENV.md) file

##### Getting Started
* Install dependencies by `bun install --frozen-lockfile --production`
* Start the server `bun start`
* On starting the server, default admin details will be printed on the console
* Use the `token` for all API operations

### APIs

* OpenAPI file provided in [openapi.yaml](openapi.yaml)
* You can copy/paste it on [Swagger Editor](https://editor.swagger.io/) for the GUI view

