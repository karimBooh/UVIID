interface IHash {
    [socketid: string]: RTCPeerConnection
}

const userInfos = {
    pc: new Map<string, RTCPeerConnection>(),
    stream: MediaStream,

};

export default (state = userInfos, action: any) => {
    switch (action.type) {
        case "ADD_PC":
            return {
                pc: action.pc,
            };
        case "ADD_STREAM":
            return {
                stream: action.stream,
            };
        default:
            return state;
    }
};
