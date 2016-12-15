import React from 'react';
import Header from '../../components/Header';
import './CoreLayout.scss';
import '../../styles/core.scss';

export const CoreLayout = ({ children }) => (
  <div className='container text-center'>
    <Header />
    {React.Children.toArray(children).map(
        (item, index) => (<div key={index} className='core-layout__viewport'>{item}</div>)
      )}
  </div>
);

CoreLayout.propTypes = {
    children: React.PropTypes.element.isRequired
};

export default CoreLayout;
