"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = __importDefault(require("socket.io"));
var Socket = /** @class */ (function () {
    function Socket(server) {
        var _this = this;
        this.connection = function () {
            console.log('socket test');
            _this.io.on('connection', function (socket) {
                _this.socket = socket;
                console.log('a user connected');
                _this.connectedUser++;
                _this.socket.on('subscribe', function (data) {
                    //subscribe/join a room
                    if (_this.socket.adapter.rooms[data.room] && _this.socket.adapter.rooms[data.room].length > 4) {
                        console.log('hello');
                        _this.io.sockets.to(data.socketId).emit('to much in a room');
                    }
                    else {
                        _this.socket.join(data.room);
                        console.log(data.socketId);
                        //Inform other members in the room of new user's arrival
                        if (_this.socket.adapter.rooms[data.room].length > 1) {
                            console.log(_this.socket.adapter.rooms[data.room]);
                            _this.io.sockets.to(data.room).emit('new user', { socketId: data.socketId });
                        }
                    }
                });
                _this.socket.on('newUserStart', function (data) {
                    _this.io.sockets.to(data.to).emit('newUserStart', { sender: data.sender });
                });
                _this.socket.on('sdp', function (data) {
                    console.log('salut ' + data.sender, '->', data.to);
                    console.log(_this.socket.adapter.rooms);
                    _this.io.sockets.to(data.to).emit('sdp', { description: data.description, sender: data.sender });
                });
                _this.socket.on('ice candidates', function (data) {
                    _this.io.sockets.to(data.to).emit('ice candidates', { candidate: data.candidate, sender: data.sender });
                });
                _this.socket.on('chat', function (data) {
                    _this.io.sockets.to(data.room).emit('chat', { sender: data.sender, msg: data.msg });
                });
                _this.socket.on('disconnect', function () {
                    console.log('user disconnect');
                });
            });
        };
        this.io = socket_io_1.default(server);
        this.socket = null;
        this.connection();
        this.connectedUser = 0;
    }
    return Socket;
}());
var instance;
function createInstance(server) {
    if (instance == null) {
        instance = new Socket(server);
    }
    return instance;
}
exports.createInstance = createInstance;
function getInstance() {
    if (instance != null) {
        return instance;
    }
    throw new Error();
}
exports.getInstance = getInstance;
