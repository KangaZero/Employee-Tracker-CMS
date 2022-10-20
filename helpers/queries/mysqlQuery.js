const db = require("../../config/connection");
const cTable = require('console.table');


const queryDb = (...args) => new Promise((resolve, reject) => {
    db.query(...args, (err, results) => {
        if (err) {
            reject(err)
        } else {
            resolve(results)
        }
    })
});

const queryDbSimplified = async (...args) => { 
    try {
         const results = await queryDb(...args)
         // `\n` added to avoid table rendering alongside confirm inquirer prompt
         return console.table(`\n`, results)
    } catch (err) {
        return console.error(err)
    }
};

module.exports = {queryDb, queryDbSimplified};

