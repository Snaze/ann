import React from 'react';
import DataSourceComponent from "../DataSourceComponent";

class Dummy extends DataSourceComponent {

    // componentDidMount() {
    //     super.componentDidMount();
    // }
    //
    // componentWillUnmount() {
    //     super.componentWillUnmount();
    // }
    //
    // componentWillReceiveProps(nextProps) {
    //     super.componentWillReceiveProps(nextProps);
    //
    // }

    render() {
        return (<div>Tick Number: {this.dataSource._tickNumber}</div>);
    }

}

export default Dummy;