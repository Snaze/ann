import React, { Component } from 'react';
import DataSourceComponent from "../DataSourceComponent";
import PropTypes from 'prop-types';
import {default as DummyModel} from "../model/Dummy";

class Dummy extends DataSourceComponent {

    constructor(props) {
        super(props);

    }

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