import * as React from "react";
import {Button, Col, Row} from "antd";
import {CameraFilled, AudioFilled} from '@ant-design/icons';
import socket from './../Socket'
import {RouteComponentProps} from "react-router";
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {IHash} from "../IHash";
import store from "../redux/store";
import {AudioOutlined, PhoneOutlined} from "@ant-design/icons/lib";

type param = {
    id: string
}

type roomProps = RouteComponentProps<param> & {
    pc: any;
}

class Room extends React.Component<roomProps> {

    state = {videoSrc: "", constraint  : {video: true, audio: true}};

    componentDidMount(): void {
        if (navigator.getUserMedia) {
            navigator.getUserMedia(this.state.constraint, this.handleVideo, this.videoError);
        }

    }

    handleVideo = (stream: MediaStream) => {
        socket.setStream(stream);
        socket.connect(this.props.match.params.id);

        // @ts-ignore
        document.getElementById("local").srcObject = stream;
        this.setState({videoSrc: stream});
        // Update the state, triggering the component to re-render with the correct stream
    }

    videoError = () => {
    };

    componentWillUnmount(): void {
        socket.disconnect()
    }

    render() {
        return (
            <div>
                <h1 id={'room'} className={"Middle-layout"} hidden={true}> Already 5 user in this room</h1>
                        <video id={"local"} autoPlay={true}/>

                    {
                        [...this.props.pc.pc.keys()].map(value => {
                            if (value != socket.getSocketId())
                                return <video id={value} autoPlay={true}/>
                        })
                    }
                <div className={"center-back"}>
                    <Button shape={"circle"} className={"xl-button"} icon={<PhoneOutlined />} onClick={()=> {this.props.history.push('/')}}/>
                    <Button shape={"circle"} className={"xl-button"} icon={<AudioOutlined />}/>
                </div>
            </div>
        )
    }
}

// @ts-ignore
const mapStateToProps = ({pc}) => {
    return {pc}
}

export default connect(mapStateToProps)(withRouter(Room))


/*


state = {
        startDisabled: false,
        callDisabled: true,
        hangUpDisabled: true,
        servers: null,
        pc1: null,
        pc2: null,
        localStream: null
    };

    localVideoRef = React.createRef<HTMLVideoElement>();
    remoteVideoRef = React.createRef<HTMLVideoElement>();

    /*    componentDidMount() {

            navigator.mediaDevices.getUserMedia({video: true, audio: true},).then((stream) => {
                let video = document.querySelector("video");
                if (video) {
                    video.srcObject = stream;
                    video.onloadedmetadata = function (e) {
                        if (video)
                            video.play();
                    };
                }
            }).catch((error) => {
                console.log(error)
            })
        }

start = () => {
    this.setState({
        startDisabled: true
    });
    navigator.mediaDevices
        .getUserMedia({
            audio: true,
            video: true
        })
        .then(this.gotStream)
        .catch(e => alert("getUserMedia() error:" + e.name));
};

gotStream = (stream: MediaStream) => {
    if (this.localVideoRef.current)
        this.localVideoRef.current.srcObject = stream;
    this.setState({
        callDisabled: false,
        localStream: stream
    });
};

call = () => {
    this.setState({
        callDisabled: true,
        hangUpDisabled: false
    });
    let {localStream} = this.state;

    let servers = undefined,
        pc1 = new RTCPeerConnection(servers),
        pc2 = new RTCPeerConnection(servers);

    pc1.onicecandidate = e => this.onIceCandidate(pc1, e);
    pc1.oniceconnectionstatechange = e => console.log(pc1, e);

    pc2.onicecandidate = e => this.onIceCandidate(pc2, e);
    pc2.oniceconnectionstatechange = e => console.log(pc2, e);
    pc2.ontrack = this.gotRemoteStream;

    localStream
        .getTracks()
        .forEach(track => pc1.addTrack(track, localStream));


    pc1
        .createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        })
        .then(this.onCreateOfferSuccess, error =>
            console.error(
                "Failed to create session description",
                error.toString()
            )
        );

    this.setState({
        servers,
        pc1,state = {
        startDisabled: false,
        callDisabled: true,
        hangUpDisabled: true,
        servers: null,
        pc1: null,
        pc2: null,
        localStream: null
    };

    localVideoRef = React.createRef<HTMLVideoElement>();
    remoteVideoRef = React.createRef<HTMLVideoElement>();

    /*    componentDidMount() {

            navigator.mediaDevices.getUserMedia({video: true, audio: true},).then((stream) => {
                let video = document.querySelector("video");
                if (video) {
                    video.srcObject = stream;
                    video.onloadedmetadata = function (e) {
                        if (video)
                            video.play();
                    };
                }
            }).catch((error) => {
                console.log(error)
            })
        }

    start = () => {
        this.setState({
            startDisabled: true
        });
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true
            })
            .then(this.gotStream)
            .catch(e => alert("getUserMedia() error:" + e.name));
    };

    gotStream = (stream: MediaStream) => {
        if (this.localVideoRef.current)
            this.localVideoRef.current.srcObject = stream;
        this.setState({
            callDisabled: false,
            localStream: stream
        });
    };

    call = () => {
        this.setState({
            callDisabled: true,
            hangUpDisabled: false
        });
        let {localStream} = this.state;

        let servers = undefined,
            pc1 = new RTCPeerConnection(servers),
            pc2 = new RTCPeerConnection(servers);

        pc1.onicecandidate = e => this.onIceCandidate(pc1, e);
        pc1.oniceconnectionstatechange = e => console.log(pc1, e);

        pc2.onicecandidate = e => this.onIceCandidate(pc2, e);
        pc2.oniceconnectionstatechange = e => console.log(pc2, e);
        pc2.ontrack = this.gotRemoteStream;

        localStream
            .getTracks()
            .forEach(track => pc1.addTrack(track, localStream));


        pc1
            .createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            })
            .then(this.onCreateOfferSuccess, error =>
                console.error(
                    "Failed to create session description",
                    error.toString()
                )
            );

        this.setState({
            servers,
            pc1,
            pc2,
            localStream
        });
    };

    onCreateOfferSuccess = (desc: any) => {
        let {pc1, pc2} = this.state;

        pc1
            .setLocalDescription(desc)
            .then(
                () =>
                    console.log("pc1 setLocalDescription complete createOffer"),
                (error: any) =>
                    console.error(
                        "pc1 Failed to set session description in createOffer",
                        error.toString()
                    )
            );

        pc2.setRemoteDescription(desc).then(
            () => {
                console.log("pc2 setRemoteDescription complete createOffer");
                pc2
                    .createAnswer()
                    .then(this.onCreateAnswerSuccess, (error: any) =>
                        console.error(
                            "pc2 Failed to set session description in createAnswer",
                            error.toString()
                        )
                    );
            },
            (error: any) =>
                console.error(
                    "pc2 Failed to set session description in createOffer",
                    error.toString()
                )
        );
    };

    onCreateAnswerSuccess = (desc: RTCSessionDescriptionInit) => {
        let {pc1, pc2} = this.state;

        pc1
            .setRemoteDescription(desc)
            .then(
                () =>
                    console.log(
                        "pc1 setRemoteDescription complete createAnswer"
                    ),
                (error: any) =>
                    console.error(
                        "pc1 Failed to set session description in onCreateAnswer",
                        error.toString()
                    )
            );

        pc2
            .setLocalDescription(desc)
            .then(
                () =>
                    console.log(
                        "pc2 setLocalDescription complete createAnswer"
                    ),
                (error: any) =>
                    console.error(
                        "pc2 Failed to set session description in onCreateAnswer",
                        error.toString()
                    )
            );
    };

    onIceCandidate = (pc: RTCPeerConnection, event: RTCPeerConnectionIceEvent) => {
        let {pc1, pc2} = this.state;

        let otherPc = pc === pc1 ? pc2 : pc1;

        otherPc
            .addIceCandidate(event.candidate)
            .then(
                () => console.log("addIceCandidate success"),
                (error: any) =>
                    console.error(
                        "failed to add ICE Candidate",
                        error.toString()
                    )
            );
    };

    hangUp = () => {
        let {pc1, pc2} = this.state;

        pc1.close();
        pc2.close();

        this.setState({
            pc1: null,
            pc2: null,
            hangUpDisabled: true,
            callDisabled: false
        });
    };
        pc2,
        localStream
    });
};

onCreateOfferSuccess = (desc: any) => {
    let {pc1, pc2} = this.state;

    pc1
        .setLocalDescription(desc)
        .then(
            () =>
                console.log("pc1 setLocalDescription complete createOffer"),
            (error: any) =>
                console.error(
                    "pc1 Failed to set session description in createOffer",
                    error.toString()
                )
        );

    pc2.setRemoteDescription(desc).then(
        () => {
            console.log("pc2 setRemoteDescription complete createOffer");
            pc2
                .createAnswer()
                .then(this.onCreateAnswerSuccess, (error: any) =>
                    console.error(
                        "pc2 Failed to set session description in createAnswer",
                        error.toString()
                    )
                );
        },
        (error: any) =>
            console.error(
                "pc2 Failed to set session description in createOffer",
                error.toString()
            )
    );
};

onCreateAnswerSuccess = (desc: RTCSessionDescriptionInit) => {
    let {pc1, pc2} = this.state;

    pc1
        .setRemoteDescription(desc)
        .then(
            () =>
                console.log(
                    "pc1 setRemoteDescription complete createAnswer"
                ),
            (error: any) =>
                console.error(
                    "pc1 Failed to set session description in onCreateAnswer",
                    error.toString()
                )
        );

    pc2
        .setLocalDescription(desc)
        .then(
            () =>
                console.log(
                    "pc2 setLocalDescription complete createAnswer"
                ),
            (error: any) =>
                console.error(
                    "pc2 Failed to set session description in onCreateAnswer",
                    error.toString()
                )
        );
};

onIceCandidate = (pc: RTCPeerConnection, event: RTCPeerConnectionIceEvent) => {
    let {pc1, pc2} = this.state;

    let otherPc = pc === pc1 ? pc2 : pc1;

    otherPc
        .addIceCandidate(event.candidate)
        .then(
            () => console.log("addIceCandidate success"),
            (error: any) =>
                console.error(
                    "failed to add ICE Candidate",
                    error.toString()
                )
        );
};

hangUp = () => {
    let {pc1, pc2} = this.state;

    pc1.close();
    pc2.close();

    this.setState({
        pc1: null,
        pc2: null,
        hangUpDisabled: true,
        callDisabled: false
    });
};


    render() {
        const {startDisabled, callDisabled, hangUpDisabled} = this.state;

        return (
            <div>
                <video
                    ref={this.localVideoRef}
                    autoPlay
                    muted
                    style={{width: "240px", height: "180px"}}
                />
                <video
                    ref={this.remoteVideoRef}
                    autoPlay
                    style={{width: "240px", height: "180px"}}
                />

                <div>
                    <button onClick={this.start} disabled={startDisabled}>
                        Start
                    </button>
                    <button onClick={this.call} disabled={callDisabled}>
                        Call
                    </button>
                    <button onClick={this.hangUp} disabled={hangUpDisabled}>
                        Hang Up
                    </button>
                </div>
            </div>
        )
 */
