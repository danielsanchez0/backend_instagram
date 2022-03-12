const request = require('request');
const server = require('../server');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const endpoint = 'http://localhost:3000/entry';
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGI2OTc2NmE2Y2UxYTI3MTg0YzNjYjAiLCJpYXQiOjE2MjI4NjA4Mjl9.ieGN9FLEHYuGrbGyQ_0C17kpoOriOwQVjHj4x-41oEI";

/**
 * testing API http://localhost:3000/entry (correspondiente a la primera refactorizacion)
 */
describe('entry', function () {
    /**
     * 
     * prueba con acceso autorizado a la funcionalidad entry/addlabel
     * resultado esperado: code 203
     */
    it('should return 203 response code, successful put (entry/addlabel)', function (done) {
        fetch(endpoint+'/addlabel',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": token
            },
            body:JSON.stringify({
                entryId:'60fda23025d17c1df49222cc',
                label:'prueba'
            })
        }).then(function(response){
            expect(response.status).toEqual(203);
            done();
        })       
    })

    /**
     * 
     * prueba sin acceso autorizado a la funcionalidad /entry/addlabel
     * resultado esperado: code 401
     */
    it('should return 401 response code because doesn´t exist authorization (entry/addlabel)', function (done) {
        fetch(endpoint+'/addlabel',{
            method:"put",
            body:JSON.stringify({
                entryId:'60fda23025d17c1df49222cc',
                label:'prueba'
            })
        }).then(function(response){
            expect(response.status).toEqual(401);
            done();
        })
    })

    /**
     * prueba sin todos los datos completos a la funcionalidad /entry/addstep
     * resultado esperado: code 422
     */
    it('should return 422 response code, incompleted data (entry/addstep)', function (done) {
        fetch(endpoint+'/addstep',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": token
            },
            body:JSON.stringify({
                entryId:'60fda23025d17c1df49222cc',
                text: 'texto de prueba'
            })
        }).then(function(response){
            expect(response.status).toEqual(422);
            done();
        })       
    })

    /**
     * prueba con todos los datos completos a la funcionalidad /entry/addstep
     * resultado esperado: code 203
     */
    it('should return 203 response code, put successful (entry/addstep)', function (done) {
        fetch(endpoint+'/addstep',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": token
            },
            body:JSON.stringify({
                entryId:'60fda23025d17c1df49222cc',
                text: 'texto de prueba',
                img: 'https://lumiere-a.akamaihd.net/v1/images/original_1628718691_los-simpson---star_-_3_e73a2761.jpeg?region=0,379,1300,732&width=960'
            })
        }).then(function(response){
            expect(response.status).toEqual(203);
            done();
        })       
    })

    /**
     * prueba sin los permisos requeridos a /entry/addstep
     * resultado esperado: code 401
     */
    it('should return 401 response code because doesn´t exist authorization (entry/addstep)', function (done) {
        fetch(endpoint+'/addstep',{
            method:"put",
            body:JSON.stringify({
                entryId:'60fda23025d17c1df49222cc',
                text: 'texto de prueba',
                img: 'https://lumiere-a.akamaihd.net/v1/images/original_1628718691_los-simpson---star_-_3_e73a2761.jpeg?region=0,379,1300,732&width=960'
            })
        }).then(function(response){
            expect(response.status).toEqual(401);
            done();
        })       
    })
});