import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logoutImg from 'assets/img/icons/spot-illustrations/45.png';
import { useDispatch } from 'react-redux';
import { shortcutKeyCombinationAction } from 'actions';

const LogoutContent = ({ titleTag: TitleTag }) => {

  const dispatch = useDispatch()
      
  useEffect(() => {
    localStorage.clear();
    dispatch(shortcutKeyCombinationAction([]));
  }, []);
  return (
    <>
      <img
        className="d-block mx-auto mb-4"
        src={logoutImg}
        alt="shield"
        width={100}
      />
      <TitleTag>See you again!</TitleTag>
      <p>
        Thanks for visiting khalihan. You are <br className="d-none d-sm-block" />
        now successfully signed out.
      </p>
      <Button
        as={Link}
        color="primary"
        size="sm"
        className="mt-3"
        to={`/login`}
      >
        <FontAwesomeIcon
          icon="chevron-left"
          transform="shrink-4 down-1"
          className="me-1"
        />
        Return to Login
      </Button>
    </>
  );
};

LogoutContent.propTypes = {
  layout: PropTypes.string,
  titleTag: PropTypes.string
};

LogoutContent.defaultProps = {
  layout: 'simple',
  titleTag: 'h4'
};

export default LogoutContent;
