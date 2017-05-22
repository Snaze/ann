import React, {Component} from 'react';
import EntityAnimationDebug from "../EntityAnimationDebug";

class EntityAnimationTest extends Component {

    constructor(props) {
        super(props);

        this.state = {
            animating: true
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    toggleAnimate(e) {
        let self = this;
        let toSet = {
            animating: !self.state.animating
        };

        this.setState(toSet);
    }

    render() {
        return (
            <div>
                <button onClick={(e) => this.toggleAnimate(e)}>Toggle Animate</button>
                <EntityAnimationDebug animating={this.state.animating} />
            </div>
        );
    }
}

export default EntityAnimationTest;
