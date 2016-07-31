import pg from 'pg';
const pool = new pg.Pool({
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: (process.env.PG_PORT || 5432),
    max: (process.env.PG_MAX_CONNECTIONS || 10),
    idleTimeoutMillis: (process.env.PG_TIMEOUT || 5000),
});

function query(sql, args, tableClass, cb) {
    pool.connect(function(err, client, done) {
        if(err) {
            console.error('error fetching client from pool');
            return cb(err, false);
        }
        console.log(sql, args);
        client.query(sql, args, function(err, data) {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
                console.error('error running query');
                return cb(err);
            }
            let out = prepareRows(data).map(row => new tableClass(row));
            return cb(false, out);
        });
    });

}

export function create(tableClass) {
    return (obj, cb) => {
        const [sql, args] = prepareCreateQuery(obj, tableClass);
        query(sql, args, tableClass, cb);
    }
}

export function get(tableClass) {
    return (obj, cb) => {
        const [sql, args] = prepareGetQuery(obj, tableClass);
        query(sql, args, tableClass, cb);
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

// TODO: Add ability to pass an array of fields to select, instead of *
function prepareGetQuery(obj, tableClass) {
    const objectKeys = getColumnArray(obj, tableClass);

    let escapedValueCount = 0;
    const values = [];
    const sanitizedWhereClause = [];
    for (const i in objectKeys) {
        let pair = objectKeys[i];

        escapedValueCount++;
        values.push(pair.value);
        sanitizedWhereClause.push(`"${pair.key}" = $${escapedValueCount}`);
    }

    const sql = `SELECT * FROM ${tableClass._tableName} WHERE ${sanitizedWhereClause.join("AND ")};`;

    return [sql, values];
}

function prepareCreateQuery(obj, tableClass) {
    const objectKeys = getColumnArray(obj, tableClass);

    let escapedValueCount = 0;
    const escapedValues = [];
    const keys = [];
    const values = [];

    for (const i in objectKeys) {
        let pair = objectKeys[i];
        escapedValueCount++;
        escapedValues.push("$"+escapedValueCount);
        keys.push(pair.key);
        values.push(pair.value);
    }

    const unSafeColumnNames = keys.map( key => `"${key}"`).join(', ');
    const sql = `INSERT INTO "${tableClass._tableName}" (${unSafeColumnNames}) VALUES (${escapedValues}) RETURNING *;`;

    return [sql, values];
}

function getColumnArray(obj, tableClass){
    const columnNames = tableClass._columnNames;
    const objectKeys =[];
    for (const i in columnNames) {
        var key = columnNames[i];
        var value = obj[key];
        if (typeof value === 'undefined') {continue;}
        objectKeys.push({
            key: String(key),
            value: obj[key]
        });
    }
    return objectKeys;
}