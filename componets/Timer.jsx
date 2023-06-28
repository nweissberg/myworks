import React, { Component } from 'react';
import { ProgressBar } from 'primereact/progressbar';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeLeft: 0,
            running:false,
            didStart:false
        };
    }

    componentDidMount() {
        if(this.props.autoStart) this.startTimer();
    }

    

    componentWillUnmount() {
        this.stopTimer();
    }

    startTimer = () => {
        this.setState({didStart:true,timeLeft:100})
        this.props.onStart?.();
        this.timer = setInterval(() => {
            if (this.state.timeLeft === 0) {
                this.props.onEnd?.();
                this.stopTimer();
            } else if(this.state.running){
                this.setState(() => {
                    var _timeLeft = this.state.timeLeft - (100/this.props.time)
                    if(_timeLeft < 0) _timeLeft = 0
                    return({timeLeft: _timeLeft,})
                });
            }
        }, 1000);
    };

    stopTimer = () => {
        this.setState({didStart:false})
        clearInterval(this.timer);
        this.props.onStop?.();
    };

    reset = () => {
        this.setState({ timeLeft: 100, running:false });
    };
    
    pause = () =>{
        this.setState({running:false})
    }

    play = () => {
        if(this.state.didStart == false) this.startTimer();
        this.setState({running:true})
    }

    render() {
        return (
            <div>
                <ProgressBar color="#9F85" value={this.state.timeLeft} showValue={false} style={{height:"10px", marginBottom:"-10px"}} />
            </div>
        );
    }
}

export default Timer;
