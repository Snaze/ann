import { Component } from 'react';
import PropTypes from 'prop-types';

class DataSourceComponent extends Component {
    constructor(props) {
        super(props);

        this._callback = (e) => this._dataSourceUpdated(e);
        this.state = {
            dataSource: props.dataSource
        };
        this._regexToIgnore = [];
        this._debug = false;
    }

    _dataSourceUpdated(e) {
        // Is this wise to put here?
        // TODO: Refactor this in componentShouldUpdate method
        for (let i = 0; i < this._regexToIgnore.length; i++) {
            if (this._regexToIgnore[i].test(e.source)) {
                this.log("Canceling update");
                return;
            }
        }

        this.setState({
            dataSource: e.object
        });

        this.log("_dataSourceUpdated from " + e.source);
    }

    log(toLog) {
        if (this.debug) {
            console.log(toLog);
        }
    }

    get debug() {
        return this._debug;
    }

    set debug(value) {
        this._debug = value;
    }

    get dataSource() {
        return this.state.dataSource;
    }

    get regexToIgnore() {
        return this._regexToIgnore;
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

            if (this.props.dataSource !== null) {
                this.props.dataSource.removeOnChangeCallback(this._callback);
            }

            if (nextProps.dataSource !== null) {
                nextProps.dataSource.addOnChangeCallback(this._callback);
            }

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