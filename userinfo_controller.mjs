import * as userInfo from './userinfo_model.mjs';
import express from 'express';
const app = express();

const PORT = 3000;

app.get("/create", (req, res) => {
    console.log(req.query);
    userInfo.createUser(req.query.name, req.query.age, req.query.email, req.query.phoneNumber)
        .then(user => {
            res.send(user);
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

let count = 0
let zeroquery = 0
let multquery = 0

function logStats(req, res, next) {
    count += 1
    const params = req.query
    let paramlength = Object.keys(params).length
    if(paramlength === 0){
        zeroquery += 1
    }
    if(paramlength > 0){
        multquery += 1
    }
    if(count % 10 == 0){
        console.log(`Total retrieve requests: ${ count }`)
        console.log(`Retrieve requests with 0 query parameters: ${ zeroquery }`)
        console.log(`Retrieve requests with 1 or more query paramters: ${ multquery }`)
    }
    next();
}

app.use("/retrieve", logStats);

app.get("/retrieve", (req, res) => {
    console.log(req.query);
    const filter = req.query
    userInfo.findUser(filter, '', 0)
        .then(users => {
            console.log(users)
            res.send(users);
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });

});

app.get("/update", (req, res) => {
    console.log(req.query);
    userInfo.replaceUser(req.query._id, req.query.name, req.query.age, req.query.email, req.query.phoneNumber)
        .then(modifiedCount => {
            modifiedCount = 1
            console.log(modifiedCount);
            res.send({ "modifiedCount": modifiedCount });
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Error: Not Found' });
        });
});

app.get("/delete", (req, res) => {
    console.log(req.query);
    userInfo.deleteByquery(req.query)
        .then(deletedCount => {
            console.log(deletedCount);
            res.send({ deletedCount: deletedCount });
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});