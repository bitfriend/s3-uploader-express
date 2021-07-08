const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const app = require('../server');

chai.use(chaiHttp);
chai.should();

describe('FILE UPLOAD', () => {
  // Test to upload image to S3
  it('should upload image to S3', (done) => {
    const fileContent = fs.readFileSync('./tests/river.jpg');
    chai.request(app)
      .post('/upload')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', fileContent, 'river.jpg')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        expect(res.body.large).to.be.a('string');
        expect(res.body.medium).to.be.a('string');
        expect(res.body.thumb).to.be.a('string');
        done();
      });
  }).timeout(1000000); // change timeout from 2s to 1000s
});
