import * as React from "react";
import {Button, Input} from "antd";
import { withRouter } from 'react-router-dom';
import {RouteComponentProps} from "react-router";
import { v4 as uuidv4 } from 'uuid';

type PropsType = RouteComponentProps<any> & {
}

class Home extends React.Component<PropsType> {

    constructor(props : PropsType){
        super(props)

    }

    creatRoom = () =>
    {
        this.props.history.push('/room/' + uuidv4());
    };

    render() {
        return (
            <div >
                <div className={"Middle-layout"}>
                    <h1>Welcome to Uvid</h1>
                    <h3>please enter your name before joining</h3>
                    <Input placeholder="add your name"/>
                    <Button className={"enter-button"} shape={"round"}  onClick={this.creatRoom}> Join </Button>
                </div>
            </div>
        )
    }
}


export default withRouter(Home);
