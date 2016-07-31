import pg from 'pg';
const pool = new pg.Pool({
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: (process.env.PG_PORT || 5432),
    max: (process.env.PG_MAX_CONNECTIONS || 10),
    idleTimeoutMillis: (process.env.PG_TIMEOUT || 5000),
});

function query(sql, args, cb) {
    pool.connect(function(err, client, done) {
        if(err) {
            console.error('error fetching client from pool');
            return cb(err, false);
        }
        console.log(sql, args);
        client.query(sql, args, function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
                console.error('error running query');
                return cb(err, false);
            }

            return cb(false, result);
        });
    });

}

export function create(tableName, tableClass) {
    return function createObject(object, cb) {
        const [sql, args] = prepareCreateQuery(tableName, object);
        query(sql, args, (err, data) => {
            if (err) {
                return cb(err)
            }
            let out = prepareRows(data).map( row => new tableClass(row));
            cb(false, out);
        });
    }
}

function prepareRows(data) {
    let out =[];
    let keys = data.fields.map( key => key.name);
    for (let rowIndex in data.rows) {
        let row = data.rows[rowIndex];
        var obj = {};

        for (let keyIndex in keys) {
            let key = keys[keyIndex];
            obj[key] = row[key];
        }
        out.push(obj);
    }
    return out;
}

function prepareCreateQuery(tableName, object) {
    const objectKeys = [];

    for (const key in object) {
        if (!object.hasOwnProperty(key)) {
            console.log(`'${key}' !object.hasOwnProperty(key)`);
            continue;
        } else if (typeof object[key] === 'undefined') {
            console.log(`${key} is undefined`);
            continue;
        }

        objectKeys.push({
            key: String(key),
            value: object[key]
        });
    }

    let columnCount = 0;
    const escapedValues = [];
    const keys = [];
    const values = [];

    for (const i in objectKeys) {
        let pair = objectKeys[i];
        columnCount++;
        escapedValues.push("$"+columnCount);
        keys.push(pair.key);
        values.push(pair.value);
    }

    const unSafeColumnNames = keys.map( key => `"${key}"`).join(', ');
    const sql = `INSERT INTO "${tableName}" (${unSafeColumnNames}) VALUES (${escapedValues}) RETURNING *;`;

    return [sql, values];
}
