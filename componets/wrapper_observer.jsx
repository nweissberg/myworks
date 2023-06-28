import React, { Component } from 'react';

class IntersectionObserverWrapper extends Component {
    constructor(props) {
        super(props);
        this.inView = props.inView;
        this.observer = null;
    }

    componentDidMount() {
        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Inside View Window: ', this.ref.current);
                    this.inView?.();
                }
            });
        });
        this.observer.observe(this.ref.current);
    }

    componentWillUnmount() {
        try {
            this.observer?.unobserve(this.ref.current);
        } catch (error) {
            console.log(error.message)
        }
    }

    render() {
        return (
            <div ref={this.ref}>
                {this.props.children}
            </div>
        );
    }
}

export default IntersectionObserverWrapper;
