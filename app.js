const express = require('express');
const jwt = require('jsonwebtoken');
const os = require('os')
const port = 5000;
const verifyToken = require('./middleware/auth')
const url = require('url');
const {v4 : uuidv4} = require('uuid')

const app = express();

app.get("/stats", (req, res) => {

    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;
    const stats = [
        {
            cpu: os.cpus(),
        },
        {
            free_mem: os.freemem(),
        },
        {
            network_interface: os.networkInterfaces(),
        },
        {
            platform: os.platform(),
        },
        {
            total_mem: os.totalmem(),
        },
        {
            load_avg: os.loadavg(),
        },
        {
            uptime: os.uptime(),
        },

    ];
    if (query.module === 'cpus') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(os.cpus()));

    } else if (query.module === 'networkInterfaces') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(os.networkInterfaces()));
    }
    else if (query.module === 'platform') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(os.platform()));
    }
    else if (query.module === 'totalmem') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(os.totalmem()));
    }
    else if (query.module === 'freemem') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(os.freemem()));
    }
    else if (query.module === 'loadavg') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(os.loadavg()));
    }
    else if (query.module === 'uptime') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(os.uptime()));
    } else {
        res.json(stats);
    }
});

app.post('/post', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
});

app.post('/login', (req, res) => {
    // Mock user
    const user = {
        id: uuidv4(),
        username: 'test',
        email: 'test@gmail.com'
    }

    jwt.sign({ user }, 'secretkey', { expiresIn: '60s' }, (err, token) => {
        res.json({
            token
        });
    });
});



app.listen(port, () => console.log(`==> http://localhost:${port}`));