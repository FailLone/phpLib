import React, {Component, PropTypes} from 'react';
import { Table, Card, Icon } from 'antd';
import IBDecorate from 'immutability';
import Dimensions from 'react-dimensions';


const columns = [
  { title: '模块名', dataIndex: 'name', key: 'name' },
  { title: '调用次数', dataIndex: 'times', key: 'times' }
];

@IBDecorate
class GroupList extends Component {
  constructor(props) {
    super(props);
    this.handleClick = () => {
      this.setState({
        fold: !this.getState('fold')
      });
    };
  }
  state = {
    fold: true
  };
  render() {
    return (
      <Card
        bordered={false}
        style={{ height: this.getState('fold') ? 'auto' : '80px' }}
        extra={<Icon onClick={this.handleClick} type={this.getState('fold') ? 'folder-open' : 'folder'} className='smaller' />}
        className={'animated ' + (this.getState('fold') ? 'slideLessRight' : 'slideLessLeft')}
      >
        <span className='graph-title'><Icon className='smaller' type='bars' />{'按模块Group'}</span>
        <Table
          size='middle'
          columns={columns}
          dataSource={this.props.data}
          className='table'
          style={{marginTop: '30px'}}
          pagination={false}
        />
      </Card>
    );
  }
}

GroupList.propTypes = {

};

export default Dimensions({
  containerStyle: {
    width: '98%',
    height: 'auto',
    marginLeft: '1%',
    marginRight: '1%'
  },
  elementResize: false
})(GroupList);
