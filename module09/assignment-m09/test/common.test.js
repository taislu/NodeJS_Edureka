let chai = require('chai');
let chaiHttp  = require('chai-http');
let expect = chai.expect;
chai.use(chaiHttp);

const testUserName = "test_user1"

describe('Testing API Endpoints on http://localhost:3800', () => {

    it('GET / : should return status 200', (done)=>{
        chai
            .request('http://localhost:3800')
            .get('/')
            .then( (res) =>{
                expect(res).to.have.status(200)
                done() //go to next
            })
            .catch((err)=>{ throw(err) })
    })

    it('POST /addUser : should insert user into mongodb', (done)=>{
        chai
            .request('http://localhost:3800')
            .post('/addUser')
            .send({
                name: testUserName,
                city: "Los Angeles",
                job: "tester"
            })
            .then( (res)=>{
                expect(res).to.have.status(200)
                done()
            })
            .catch((err)=>{ throw(err) })
    })

    it('POST /addUser without body : should return 400 bad request', (done)=>{
        chai
            .request('http://localhost:3800')
            .post('/addUser')
            .send({ })
            .then( (res)=>{
                expect(res).to.have.status(400)
                done()
            })
            .catch((err)=>{ throw(err) })
    })

    it('GET /getUser/name : should retrieve user from mongodb', (done)=>{
        chai
            .request('http://localhost:3800')
            .get('/getUser/' + testUserName)
            .then( (res) =>{
                expect(res).to.have.status(200)
                done() //go to next
            })
            .catch((err)=>{ throw(err) })
    })

    it('GET /getUser/invalidName : should return 404 not found', (done)=>{
        chai
            .request('http://localhost:3800')
            .get('/getUser/who')
            .then( (res) =>{
                expect(res).to.have.status(404)
                done() 
            })
            .catch((err)=>{ throw(err) })
    })

    it('PUT /updateUser : should update user in mongodb', (done)=>{
        chai
            .request('http://localhost:3800')
            .put('/updateUser')
            .send({
                name: testUserName,
                city: "Seattle",
                job: "tester"
            })
            .then( (res)=>{
                expect(res).to.have.status(200)
                done()
            })
            .catch((err)=>{ throw(err) })
    })

    it('PUT /updateUser without body : should return 400 bad request', (done)=>{
        chai
            .request('http://localhost:3800')
            .put('/updateUser')
            .send({})
            .then( (res)=>{
                expect(res).to.have.status(400)
                done()
            })
            .catch((err)=>{ throw(err) })
    })

    it('DELETE /deleteUser/name : should delete user from mongodb', (done)=>{
        chai
            .request('http://localhost:3800')
            .delete('/deleteUser/' + testUserName)
            .then( (res) =>{
                expect(res).to.have.status(200)
                done() 
            })
            .catch((err)=>{ throw(err) })
    })

    it('DELETE /deleteUser/invalidName : should return 404 not found', (done)=>{
        chai
            .request('http://localhost:3800')
            .delete('/deleteUser/who')
            .then( (res) =>{
                expect(res).to.have.status(404)
                done() 
            })
            .catch((err)=>{ throw(err) })
    })

})