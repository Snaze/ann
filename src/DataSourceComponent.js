import { Component } from 'react';
import PropTypes from 'prop-types';

class DataSourceComponent extends Component {
    constructor(props) {
        super(props);

        this._callback = (e) => this._dataSourceUpdated(e);
        this.state = {
            dataSource: props.dataSource
        };
        // this._propsModifiedSinceUpdate = [];
        // this._regexToIgnore = [];
        // this._propsToAccept = [];
        this._debug = false;
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //
    //     if (this._propsToAccept.length === 0) {
    //         this._propsModifiedSinceUpdate = [];
    //         this.log("shouldComponentUpdate = true");
    //         return true;
    //     }
    //
    //     if (this._propsToAccept.length > 0) {
    //         let theIntersection = _.intersection(this._propsToAccept, this._propsModifiedSinceUpdate);
    //         this._propsModifiedSinceUpdate = [];
    //         let toRet = theIntersection.length > 0;
    //         this.log("shouldComponentUpdate = " + toRet);
    //         return toRet;
    //     }
    //
    //     this._propsModifiedSinceUpdate = [];
    //     this.log("shouldComponentUpdate = true");
    //     return true;
    // }

    _dataSourceUpdated(e) {

        // this._propsModifiedSinceUpdate.push(e.source);
        if (typeof(e.forceUpdate) !== "undefined" && e.forceUpdate) {
            this.forceUpdate();
        } else {
            this.setState({
                dataSource: e.object
            });

            this.log("_dataSourceUpdated from " + e.source);
        }
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
        if (this.dataSource) {
            this.dataSource.addOnChangeCallback(this._callback);
        }
    }

    componentWillUnmount() {
        if (this.dataSource) {
            this.dataSource.removeOnChangeCallback(this._callback);
        }
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