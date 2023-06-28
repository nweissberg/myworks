import React, { Component } from 'react';
import { Button } from 'primereact/button';

class WebWorker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            worker: null,
        };
    }

    componentDidMount() {
        if (typeof Worker !== 'undefined') {
            const newWorker = new Worker(this.props.worker);
            newWorker.onmessage = (event) => {
                // console.log(event.data)
                this.props.onMessage?.(event.data)
            };
            this.setState({ worker: newWorker });
        } else {
            this.setState({ result: 'Web Workers are not supported in this browser.' });
        }
        this.props.onLoad?.(this)
    }
    // componentDidUpdate(data){
    //     console.log(data,this.state.worker)
    // }
    componentWillUnmount() {
        if (this.state.worker) {
            this.state.worker.terminate();
            this.setState({worker:null})
        }
    }

    update(data){
        this.state.worker.postMessage(data);
    }

    post(data,element){
        // console.log(data,element)
        if (this.state.worker) {
            this.state.worker.postMessage(data,[element]);
        }
    };

    render() {
        return (
            <div {...this.props}>
                {this.props.children}
            </div>
        );
    }
}

export default WebWorker;
