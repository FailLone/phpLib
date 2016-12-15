import React, {Component, PropTypes} from 'react';
import Graph from '../components/Graph';
import Toolbar from '../components/Toolbar';
import Chart from '../components/Chart';
import Pie from '../components/Pie';
import {mapValues} from 'lodash';
import lazyCache from 'react-lazy-cache';


class Neck extends Component {
    constructor(props) {
        super(props);
        this.initData = (data) => {
            let ret = {};
            ret.graph = mapValues(data, o => ({
                group: o.ral_log ? o.ral_log.group : {},
                count: o.ral_count_max
            }));
            return ret;
        };
    }
    // shouldComponentUpdate() {
    //     return false;
    // }
    componentWillMount() {
        this.cache = lazyCache(this, {
            data: {
                params: ['data'],
                fn: this.initData
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        this.cache.componentWillReceiveProps(nextProps);
    }
    render() {
        return (
          <div>
            <Toolbar />
            <Graph
              data={this.cache.data.graph}
            />
            <Pie
              data={this.cache.data.graph}
            />
            <Chart />
          </div>
        );
    }
}

Neck.propTypes = {

};

Neck.defaultProps = {
    data: window._INITDATA_
};

export default Neck;
