/*jshint node:true */
/* Copyright 2014, Connectify. */

/* This returns something of the form:
 * { local: { host: '0.0.0.0', port: 33167 },
 *   public: { host: '72.94.85.38', port: 33167, family: 'IPv4' },
 *   type: 'Full Cone NAT'
 * }
 */

var WhatsMyIP = module.exports;

var dgram = require('dgram');
var stun = require('vs-stun');

var NodeStunTest = {};

NodeStunTest.newStunRequest = function(cbFnc, stunHost, stunPort, localPort) {
    console.log('Connecting to ' + stunHost + ':' + stunPort);

    var socket = dgram.createSocket('udp4');
    var server = {host: stunHost, port: stunPort};
    var retransmission = {count: 2, timeout: 3000};

    var callback = function callback (error, value) {
        if (!error) {
            var stunResponse = value;
            console.log(stunResponse);
            server.openedState = false;
            socket.close();
            if (typeof(stunResponse.public) !== 'undefined' &&
                typeof(stunResponse.public.host) !== 'undefined')
            {
                console.log('Received STUN packet from '+server.host+':'+server.port);
                cbFnc(null, stunResponse);
            } else {
                var errmsg = 'Did not receive public IP address';
                cbFnc(errmsg, null);
            }
        } else {
            console.log('Error binding to '+server.host+':'+server.port+':', error);
            if (server.openedState === true) {
                server.openedState = false;
            }
            cbFnc(error, null);
        }
    };

    socket.bind(localPort, function() {
        stun.resolve(socket, server, callback, retransmission);
        server.openedState = true;
    });
};

WhatsMyIP.findIP = function(cb) {
    //TODO: fallback to either freeice or our own list!
    NodeStunTest.newStunRequest(cb, 'stun.l.google.com', 19302);
};

WhatsMyIP.findIPAndPort = function(cb, port) {
    //TODO: fallback to either freeice or our own list!
    NodeStunTest.newStunRequest(cb, 'stun.l.google.com', 19302, port);
};
