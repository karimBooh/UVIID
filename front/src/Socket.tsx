import io from 'socket.io-client'
import store from "./redux/store";

class  Socket {
    private socket : any;
    private pc =  new Map<string, RTCPeerConnection>();
    private socketId = '';
    // @ts-ignore
    private myStream : MediaStream;

    send() {
        this.socket.emit('message', 'hi');
    }

    setStream(sream : MediaStream) {
        this.myStream = sream;
    }

    getSocketId() : string {
        return this.socketId;
    }

    connect(room : string) {
        if (this.socket && this.socket.connected) {
            return ;
        }
        const port = process.env.PORT || '8080';
        this.socket = io('http://localhost:' + port);
        return new Promise(resolve => {
            this.socket.on('connect', () => {
                this.socketId = this.socket.io.engine.id;

                this.socket.emit('subscribe', {
                    room: room,
                    socketId: this.socketId
                });

                this.socket.on('to much in a room', (data: any)=>{
                    // @ts-ignore
                    document.getElementById('local').remove();
                    // @ts-ignore
                    document.getElementById('room').hidden = false;
                });

                this.socket.on('new user', (data: any)=>{
                    this.socket.emit('newUserStart', {to:data.socketId, sender:this.socketId});
                    this.init(true, data.socketId);
                });

                this.socket.on('newUserStart', (data : any)=>{
                    this.init(false, data.sender);
                });

                this.socket.on('ice candidates', async (data: any)=>{
                    if(data.candidate)
                        await this.pc.get(data.sender)?.addIceCandidate(new RTCIceCandidate(data.candidate));
                });

                this.socket.on('sdp', async (data : any)=>{
                    console.log('sdp');
                    if(data.description && data.description.type === 'offer'){
                        if (data.description)
                            await this.pc.get(data.sender)?.setRemoteDescription(new RTCSessionDescription(data.description));

                        navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: {
                                echoCancellation: true,
                                noiseSuppression: true
                            }
                        }).then(async (stream)=>{
                            this.myStream = stream;

                            stream.getTracks().forEach((track:  MediaStreamTrack)=>{
                                this.pc.get(data.sender)?.addTrack(track, stream);
                            });

                            let answer = await this.pc.get(data.sender)?.createAnswer();

                            if (answer)
                                await this.pc.get(data.sender)?.setLocalDescription(answer);

                            this.socket.emit('sdp', {description:this.pc.get(data.sender)?.localDescription, to:data.sender, sender:this.socket.io.engine.id});
                        }).catch((e : any)=>{
                            console.error(e);
                        });
                    }

                    else if(data.description && data.description.type === 'answer'){
                        await this.pc.get(data.sender)?.setRemoteDescription(new RTCSessionDescription(data.description));
                    }
                });

                resolve(this.socket);
            });
        });
    }

    init = (createOffer: boolean, partnerName: string) =>{
        this.pc.set(partnerName, new RTCPeerConnection({iceServers: [
                {
                    urls: ["stun:eu-turn4.xirsys.com"]
                },
                {
                    username: "ml0jh0qMKZKd9P_9C0UIBY2G0nSQMCFBUXGlk6IXDJf8G2uiCymg9WwbEJTMwVeiAAAAAF2__hNSaW5vbGVl",
                    credential: "4dd454a6-feee-11e9-b185-6adcafebbb45",
                    urls: [
                        "turn:eu-turn4.xirsys.com:80?transport=udp",
                        "turn:eu-turn4.xirsys.com:3478?transport=tcp"
                    ]
                }
            ]
        }));

         if(this.myStream){
            this.myStream.getTracks().forEach((track)=>{
                this.pc.get(partnerName)!.addTrack(track, this.myStream);//should trigger negotiationneeded event
            });
        }

        if(createOffer){
            this.pc.get(partnerName)!.onnegotiationneeded = async ()=>{
                let offer = await this.pc.get(partnerName)!.createOffer();
                await this.pc.get(partnerName)!.setLocalDescription(offer);
                let ordi = this.pc.get(partnerName)
                if (ordi){
                    this.socket.emit('sdp', {description:ordi.localDescription, to:partnerName, sender:this.socket.io.engine.id});
                }
            };
        }

        this.pc.get(partnerName)!.onicecandidate = ({candidate})=>{
            this.socket.emit('ice candidates', {candidate: candidate, to:partnerName, sender:this.socketId});
        };

        this.pc.get(partnerName)!.ontrack = (e)=>{
            let str = e.streams[0];
            if(document.getElementById(partnerName)){
                if (partnerName !== this.socketId)
                // @ts-ignore
                    document.getElementById(partnerName).srcObject = str;
            }
        };

        this.pc.get(partnerName)!.onconnectionstatechange = (d)=>{
            let elem = document.getElementById(partnerName);
            switch(this.pc.get(partnerName)!.iceConnectionState){
                case 'disconnected':
                case 'failed':
                    console.log("singale failed");
                    // @ts-ignore
                    if (elem)
                        elem.remove()
                    break;

                case 'closed':
                    break;
            }
        };

        this.pc.get(partnerName)!.onsignalingstatechange = (d)=>{
            switch(this.pc.get(partnerName)!.signalingState){
                case 'closed':
                    console.log("Signalling state is 'closed'");
                    break;
            }
        };
        store.dispatch({type : "ADD_PC", pc : this.pc});

    }

    disconnect() {
        this.socket.emit('disconnect');
        this.socket.close();
    }
}

const instance = new Socket();
export default instance
