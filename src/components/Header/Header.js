import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import './Header.scss';
import IBDecorate from 'immutability';
import { Input } from 'antd';

const Search = Input.Search;

@IBDecorate()
class Header extends Component {
    constructor(props) {
        super(props);
        this.handleMouseEnter = () => {
            this.setState({
                search: true
            });
            findDOMNode(this.input).getElementsByClassName('ant-input')[0].focus();
            this.initClassName = false;
        };
        this.handleBlur = () => {
            this.setState({
                search: false
            });
        };
        this.initClassName = 'hidden';
    }
    componentDidUpdate() {
        this.initClassName = 'hidden';
    }
    state = {
        search: false
    };
    render() {
        return (
          <aside className='header' style={{height: '1700px'}}>
            <div className='flexslider'>
              <ul className='slides'>
                <li className='img'>
                  <div className='title'>
                    <div className={'text animated ' + (this.getState('search') ? 'flipOutX' : 'fadeInUp')}>
                      <div className='slider-text'>
                        <h2 onMouseEnter={this.handleMouseEnter}>{'Stay hungry. Stay foolish.'}</h2>
                      </div>
                    </div>
                    <div className={'search animated ' + (this.getState('search') ? 'flipInX' : this.initClassName ? this.initClassName : 'fadeOutUp')}>
                      <div className='slider-text'>
                        <Search placeholder='Search' ref={(c) => { this.input = c; }} onBlur={this.handleBlur} />
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        );
    }
}

Header.propTypes = {

};

export default Header;
