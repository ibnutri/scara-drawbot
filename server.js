'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');

const server = new Hapi.Server({
        connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});
server.connection({ port: 3000 });
var io = require('socket.io')(server.listener);
io.on('connection', function (socket) {

    console.log('New connection!');

    
});
server.register(Inert, () => {});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
});


// server.route({
//     method: 'GET',
//     path: '/{name}',
//     handler: function (request, reply) {
//         reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
//     }
// });
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});