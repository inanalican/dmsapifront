import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';


class UserComponent extends Component {
  render() {
    const {
      title, subTitle
    } = this.props;
    return (
      <React.Fragment>
        <section className="content-header">
          <h1>
            {title}
            {' '}
            {subTitle ? <small>{subTitle}</small> : ''}
          </h1>
          </section>
      </React.Fragment>
    );
  }
}

UserComponent.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
};

UserComponent.defaultProps = {
  title: null,
  subTitle: null,
};

export default withRouter(UserComponent);