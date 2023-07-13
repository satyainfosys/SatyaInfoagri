import React from 'react';
import { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const shortcutKeyReducer = useSelector((state) => state.rootReducer.shortcutKeyReducer)
  // const shortCutKeyData = shortcutKeyReducer.shortcutKeyList;

  const onKeyDown = (e, shortCutKeyData) => {
    var keyPressed = '';

    if (e.shiftKey && e.key.length === 1) {
      keyPressed = "SHIFT+" + e.key.toUpperCase();
    }
    else if (e.altKey && e.key.length === 1) {
      keyPressed = "ALT+" + e.key.toUpperCase();
    }
    else if (e.ctrlKey && e.key.length === 1) {
      keyPressed = "CTRL+" + e.key.toUpperCase();
    }

    let shortCutKey = shortCutKeyData.filter(x => x.shortCutKey == keyPressed)[0];

    if (shortCutKey && shortCutKey.route)
      navigate(shortCutKey.route);

  };

  const setShortKeys = () => {
    const shortCutKeyData = shortcutKeyReducer.shortcutKeyList;

    if (shortCutKeyData && shortCutKeyData.length > 0) {
      $(document).off('keydown').on('keydown', (e) => onKeyDown(e, shortCutKeyData));
    }
  }

  useEffect(() => {
    setShortKeys();
  }, [])



  return (
    <>
      <Row className="g-3 mb-3">
        <Col md={6} xxl={3}>
          <h4>Welcome Admin!</h4>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;