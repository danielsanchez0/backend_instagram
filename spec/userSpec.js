const request = require('request');
const server = require('../server');

const endpoint = 'http://localhost:3000/stats';

const options = {
	url: 'http://localhost:3000/stats',
	headers: {
		Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGI2OTc2NmE2Y2UxYTI3MTg0YzNjYjAiLCJpYXQiOjE2MjI4NjA4Mjl9.ieGN9FLEHYuGrbGyQ_0C17kpoOriOwQVjHj4x-41oEI"
	}
};

/**
 * testing API http://localhost:3000/stats (correspondiente a la nueva funcionalidad)
 */
describe('user', function () {
    /**
     * 
     * prueba con acceso autorizado a la funcionalidad.
     * resultado esperado: code 200
     */
    it('should return 200 response code, successful get', function (done) {
        request.get(options, function (error, response) {
            expect(response.statusCode).toEqual(200);
            done();
        });
    });

    /**
     * 
     * prueba sin acceso autorizado a la funcionalidad.
     * resultado esperado: code 401
     */
    it('should return 401 response code because doesn´t exist authorization', function (done) {
        request.get(endpoint, function (error, response) {
            expect(response.statusCode).toEqual(401);
            done();
        });
    });
});