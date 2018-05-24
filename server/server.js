const
    express = require('express'),
    path = require('path')

const
    app = express(),
    server = require('http').Server(app)
    db = require('./db')

app.use(express.static(path.join(__dirname, '..', '/client')))
require('./sockets')(server,db)

server.listen(8083) 
