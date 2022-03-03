const server = require('../server');

var serverInstance;

beforeEach(function (done) {
    serverInstance = server.run(done);
});

afterEach(function (done) {
    serverInstance.close(done);
});