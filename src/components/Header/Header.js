import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import { Link } from 'react-router';
import './Header.scss';
import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
          current: this.getCurrentRoute()
        }
    }
    getCurrentRoute() {
      let href = location.href;
      let arr = href.split('\/');
      return arr[arr.length - 1];
    }
    handleClick(e) {
      this.setState({
        current: e.key,
      });
    }
    render() {
        return (
          <Menu onClick={(e) => this.handleClick(e)}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="config">
              <Link to='config'><Icon type="setting" />配置</Link>
            </Menu.Item>
            <Menu.Item key="interfaceManage">
              <Link to='interfaceManage'><Icon type="appstore" />接口调用</Link>
            </Menu.Item>
          </Menu>
        );
    }
}

Header.propTypes = {

};

export default Header;
