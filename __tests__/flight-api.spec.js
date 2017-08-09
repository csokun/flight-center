const app = require('../app');
const supertest = require('supertest')(app);
const expect = require('chai').expect;

/**
 * These are shakeout tests it doesn't perform assertion
 * on each and every details response structure the Flight API return
 * unless it is necessary.
 */
describe('Flight API Wrapper', () => {

    describe('GET /airlines', () => {
        
        it('should return list of airlines', (done) => {
            supertest.get('/airlines')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body).to.have.length.above(1);
                    done();
                });
        });

    });

    describe('GET /airports', () => {
        
        it('should return list of airports matched search queries', (done) => {
            supertest.get('/airports?q=Melbourne')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body[0].cityName).to.equal("Melbourne");
                    done();
                });
        });

        it('should return error status if query string is missing', (done) => {
            supertest.get('/airports')
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body.message).to.equal("query must contain at least two letters");
                    done();
                });
        });

    });

    describe('GET /search', () => {

        it('should return all flight schedules from all airlines that matched search criteria', (done) => {
            let payload = {
                from: 'SYD',
                to: 'JFK',
                date: '2018-09-02'
             };

             supertest.get(`/search?from=${payload.from}&to=${payload.to}&date=${payload.date}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    
                    expect(res.body).to.have.length.above(1);
                    done();
                });
        });

    });

});
