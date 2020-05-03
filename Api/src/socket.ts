import { Server } from 'http';
import socketIo from 'socket.io';

class Socket {
    private io: any;
    private socket: any;
    private connectedUser: number;

    constructor(server: Server) {
        this.io = socketIo(server);
        this.socket = null;
        this.connection();
        this.connectedUser = 0;
    }

    public connection = () => {
        console.log('socket test');
        this.io.on('connection', (socket: any) => {
            this.socket = socket;
            console.log('a user connected');
            this.connectedUser++;

            this.socket.on('subscribe', (data: any) => {
                //subscribe/join a room
                if (this.socket.adapter.rooms[data.room] && this.socket.adapter.rooms[data.room].length > 4) {
                    console.log('hello');
                    this.io.sockets.to(data.socketId).emit('to much in a room');
                } else {
                    this.socket.join(data.room);
                    console.log(data.socketId);
                    //Inform other members in the room of new user's arrival
                    if (this.socket.adapter.rooms[data.room].length > 1) {
                        console.log(this.socket.adapter.rooms[data.room]);
                        this.io.sockets.to(data.room).emit('new user', { socketId: data.socketId });
                    }
                }
            });

            this.socket.on('newUserStart', (data: any) => {
                this.io.sockets.to(data.to).emit('newUserStart', { sender: data.sender });
            });

            this.socket.on('sdp', (data: any) => {
                console.log('salut ' + data.sender, '->', data.to);
                console.log(this.socket.adapter.rooms)
                this.io.sockets.to(data.to).emit('sdp', { description: data.description, sender: data.sender });
            });

            this.socket.on('ice candidates', (data: any) => {
                this.io.sockets.to(data.to).emit('ice candidates', { candidate: data.candidate, sender: data.sender });
            });

            this.socket.on('chat', (data: any) => {
                this.io.sockets.to(data.room).emit('chat', { sender: data.sender, msg: data.msg });
            });

            this.socket.on('disconnect', () => {
                console.log('user disconnect');
            });
        });
    };
}

let instance: Socket;

function createInstance(server: Server): Socket {
    if (instance == null) {
        instance = new Socket(server);
    }
    return instance;
}

function getInstance(): Socket {
    if (instance != null) {
        return instance;
    }
    throw new Error();
}

export { createInstance, getInstance };
