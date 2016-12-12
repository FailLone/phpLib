import React from 'react';
import { IndexLink, Link } from 'react-router';
import './Header.scss';

export const Header = () => (
  <aside className='header'>
    <div className='flexslider'>
      <ul className='slides'>
        <li className='img'>
          <div className='title'>
            <div className='animate'>
              <div className='slider-text'>
                <h2>{'Stay hungry. Stay foolish.'}</h2>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </aside>
);

export default Header;
/**
 *     <IndexLink to='/' activeClassName='route--active'>
      Home
    </IndexLink>
    {' · '}
    <Link to='/counter' activeClassName='route--active'>
      Counter
    </Link>
    {' · '}
    <Link to='/zen' activeClassName='route--active'>
      Zen
    </Link>
    {' · '}
    <Link to='/elapse' activeClassName='route--active'>
      Elapse
    </Link>
    {' · '}
    <Link to='/route/88' activeClassName='route--active'>
      Route
    </Link>
    {' · '}
    <Link to='/notFound' activeClassName='route--active'>
      404
    </Link>
 */
