const request = require('request');
const server = require('../server');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const endpoint = 'http://localhost:3000/auth';

/**
 * testing API http://localhost:3000/auth (correspondiente a la segunda refactorizacion)
 */
describe('auth', function () {
    /**
     *
     * prueba de registro con los datos incompletos(sin email)
     * resultado esperado: code 422
     */
    it('should return 203 response code, data incompleted(auth/signup)', function (done) {
        fetch(endpoint+'/signup',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:"usuario de prueba",
                password:"123456",
                pic:''
            })
        }).then(function(response){
            expect(response.status).toEqual(422);
            done();
        })       
    })

    /**
     *
     * prueba de registro con un correo ya registrado
     * resultado esperado: code 422
     */
    it('should return 423 response code, email already exist (auth/signup)', function (done) {
        fetch(endpoint+'/signup',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:"oscar buritica",
                email:"oscar0494@hotmail.com",
                password:"123456",
                pic:''
            })
        }).then(function(response){
            expect(response.status).toEqual(423);
            done();
        })       
    })

});