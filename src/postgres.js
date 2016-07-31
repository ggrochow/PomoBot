import pg from 'pg';

const config = {
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD || "",
    port: (process.env.PG_PORT || 5432),
    max: 10,
    idleTimeoutMillis: 30000,
};
const pool = new pg.Pool(config);

function query(sql, args) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

        client.query(sql, args, function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }
            console.log(result.rows[0].number);
            //output: 1
        });
    });

}