import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DataSourceComponent extends Component {
    constructor(props) {
        super(props);

        this._callback = (e) => this._dataSourceUpdated(e);
        this.state = {
            dataSource: props.dataSource
        };
    }

    _dataSourceUpdated(e) {
        this.setState({
            dataSource: e.object
        });
    }

    get dataSource() {
        return this.state.dataSource;
    }

    componentDidMount() {
        this.dataSource.addOnChangeCallback(this._callback);
    }

    componentWillUnmount() {
        let ds = this.dataSource;
        ds.removeOnChangeCallback(this._callback);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.dataSource !== nextProps.dataSource) {

            if (typeof(nextProps.dataSource) !== typeof(this.props.dataSource)) {
                throw new Error("Swapped out datasources should be of the same type");
            }

            this.props.dataSource.removeOnChangeCallback(this._callback);
            nextProps.dataSource.addOnChangeCallback(this._callback);

            this.setState({
                dataSource: nextProps.dataSource
            });
        }
    }
}

DataSourceComponent.PropTypes = {
    dataSource: PropTypes.object.isRequired
};

export default DataSourceComponent;