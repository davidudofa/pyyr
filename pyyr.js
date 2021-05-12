const express = require('express')

const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

const app = express()
const port = 3000

var allowedOrigins = ['http://localhost:8200', 'http://localhost:3000', 'http://localhost:8100'];

app.use(cors({
    credentials: true,
    origin: function(origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}))

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', (req, res) => {
    //console.log(req.body);
    fs.readFile('models/users.json', (err, data) => {
        if (err) throw err;
        let users = JSON.parse(data);
        //console.log(users);
        users.push(req.body);
        //console.log(users);
        fs.writeFileSync('models/users.json', JSON.stringify(users));
        res.json({
            status: 200,
            message: "successful"
        })
    });

})

app.post('/login', (req, res) => {
    //console.log(req.body);
    var loginuser = {};
    var userfound = false;
    fs.readFile('models/users.json', (err, data) => {
        if (err) throw err;
        let users = JSON.parse(data);
        //console.log(users);
        users.forEach(function(item, index) {
            if (item.walletid == req.body.walletid && item.passcode == req.body.passcode) {
                loginuser = item;
                userfound = true;

            }
        })

        if (userfound) {
            //console.log(loginuser);
            res.json({
                status: 200,
                message: "successful",
                data: loginuser
            })
        } else {
            res.status(400).json({ message: "Wallet ID does not exist" });
        }

    });
});

app.get('/walletdetails', (req, res) => {
    //console.log(req.query);
    var userwallets = [];
    if (req.query.walletid) {
        fs.readFile('models/wallets.json', (err, data) => {
            if (err) throw err;
            let wallets = JSON.parse(data);
            wallets.forEach(function(item, index) {
                if (item.walletid == req.query.walletid) {
                    item.date = new Date(item.date);
                    userwallets.push(item);
                }
            })

            console.log(userwallets);
            console.log("/////////////");

            if (userwallets.length > 0) {
                userwallets = userwallets.sort((a, b) => b.date - a.date);

                console.log(userwallets);
                res.json({
                    status: 200,
                    message: "successful",
                    data: userwallets
                })
            } else {
                res.status(400).json({ message: "User wallet is empty" });
            }

        });
    } else {
        res.status(400).json({ message: "Invalid Wallet ID." });
    }

})

app.post('/updatewallet', (req, res) => {
    //console.log(req.body);
    var userwallets = [];
    fs.readFile('models/wallets.json', (err, data) => {
        if (err) throw err;
        let wallets = JSON.parse(data);
        ////console.log(wallets);
        wallets.push(req.body);
        //console.log(wallets);
        fs.writeFileSync('models/wallets.json', JSON.stringify(wallets));
        wallets.forEach(function(item, index) {
            if (item.walletid == req.query.walletid) {
                item.date = new Date(item.date);
                userwallets.push(item);
            }
        })

        if (userwallets.length > 0) {
            userwallets = userwallets.sort((a, b) => b.date - a.date);
            //console.log(userwallets);
            res.json({
                status: 200,
                message: "successful",
                data: userwallets
            })
        } else {
            res.status(400).json({ message: "User wallet is empty" });
        }
    });

})

app.get('/validateWallet', (res, req) => {
    var walletdetails = {};
    var userfound = false;
    fs.readFile('models/users.json', (err, data) => {
        if (err) throw err;
        let users = JSON.parse(data);
        //console.log(users);
        users.forEach(function(item, index) {
            if (item.walletid == req.query.walletid) {
                walletdetails = item;
                userfound = true;

            }
        })

        if (userfound) {
            //console.log(loginuser);
            walletdetails.passcode = null;
            res.json({
                status: 200,
                message: "successful",
                data: walletdetails
            })
        } else {
            res.status(400).json({ message: "Wallet ID does not exist" });
        }

    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})