import React, { useContext, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Nav, Navbar, Row, Col } from 'react-bootstrap';
import { navbarBreakPoint, topNavbarBreakpoint } from 'config';
import AppContext from 'context/Context';
import Flex from 'components/common/Flex';
import Logo from 'components/common/Logo';
import NavbarVerticalMenu from './NavbarVerticalMenu';
import ToggleButton from './ToggleButton';
import routes from 'routes/routes';
import { capitalize, getMenuTree, isLoggedIn } from 'helpers/utils';
import $ from 'jquery';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NavbarVertical = () => {
  const {
    config: {
      navbarPosition,
      navbarStyle,
      isNavbarVerticalCollapsed,
      showBurgerMenu
    }
  } = useContext(AppContext);

  const HTMLClassList = document.getElementsByTagName('html')[0].classList;
  const navigate = useNavigate();

  const shortcutKeyReducer = useSelector((state) => state.rootReducer.shortcutKeyReducer)
  var shortcutKeyData = shortcutKeyReducer.shortcutKeyList;

  useEffect(() => {
    isLoggedIn();
    let menuTreeItemCount = $('.navbar-vertical-content .navbar-nav .nav-item').length;
    if (menuTreeItemCount <= 1) {
      getMenuTree();
    }
    getShortCutKeys();
    setTimeout(function () {

      var pageUrl = window.location.href.split("/").length > 2 ? "/" + window.location.href.split("/")[3] : "";

      $('li a.nav-link').each(function (i, obj) {
        var menuLink = $(this).attr('href');

        if (pageUrl == menuLink) {
          var parentContainerId = $(this).attr('data-parent-container-id');

          if ($('#' + parentContainerId).hasClass('dropdown-indicator') &&
            $('#' + parentContainerId).hasClass('collapsed')) {
            var childMenuContainerId = $('#' + parentContainerId).attr('data-children-container-id');
            $('#' + parentContainerId).removeClass('collapsed');
            $('#' + parentContainerId).attr('aria-expanded', 'true');
            $('#' + childMenuContainerId).addClass('show');

            var parentParentContainerId = $('#' + parentContainerId).attr('data-parent-container-id');

            if ($('#' + parentParentContainerId).hasClass('dropdown-indicator') &&
              $('#' + parentParentContainerId).hasClass('collapsed')) {
              var childChildMenuContainerId = $('#' + parentParentContainerId).attr('data-children-container-id');
              $('#' + parentParentContainerId).removeClass('collapsed');
              $('#' + parentParentContainerId).attr('aria-expanded', 'true');
              $('#' + childChildMenuContainerId).addClass('show');
            }
          }

          if (!$(this).hasClass('dropdown-indicator')) {
            $('li a.nav-link').removeClass("active");
            setTimeout(() => {
              $(this).addClass("active");
            }, 100);
          }
        }
      });
    }, 1000);

    if (isNavbarVerticalCollapsed) {
      HTMLClassList.add('navbar-vertical-collapsed');
    } else {
      HTMLClassList.remove('navbar-vertical-collapsed');
    }
    return () => {
      HTMLClassList.remove('navbar-vertical-collapsed-hover');
    };
  }, [isNavbarVerticalCollapsed, HTMLClassList]);

  $('body').off('click').on('click', 'li a.nav-link', function () {
    var childMenuContainerId = $(this).attr('data-children-container-id');

    if ($(this).hasClass('dropdown-indicator') && $(this).hasClass('collapsed')) {
      $(this).removeClass('collapsed');
      $(this).attr('aria-expanded', 'true');
      $('#' + childMenuContainerId).addClass('show');
    }
    else if ($(this).hasClass('dropdown-indicator') && !$(this).hasClass('collapsed')) {
      $(this).addClass('collapsed');
      $(this).attr('aria-expanded', 'false');
      $('#' + childMenuContainerId).removeClass('show');
    }

    if (!$(this).hasClass('dropdown-indicator')) {
      $('.dropdown-indicator').addClass("collapsed");
      $('.dropdown-indicator').attr('aria-expanded', 'false');
      $('ul').removeClass("show");
      $('li a.nav-link').removeClass("active");
      $(this).addClass("active");
    }
  })

  //Control mouseEnter event
  let time = null;
  const handleMouseEnter = () => {
    if (isNavbarVerticalCollapsed) {
      time = setTimeout(() => {
        HTMLClassList.add('navbar-vertical-collapsed-hover');
      }, 100);
    }
  };
  const handleMouseLeave = () => {
    clearTimeout(time);
    HTMLClassList.remove('navbar-vertical-collapsed-hover');
  };

  const NavbarLabel = ({ label }) => (
    <Nav.Item as="li">
      <Row className="mt-3 mb-2 navbar-vertical-label-wrapper">
        <Col xs="auto" className="navbar-vertical-label navbar-vertical-label">
          {label}
        </Col>
        <Col className="ps-0">
          <hr className="mb-0 navbar-vertical-divider"></hr>
        </Col>
      </Row>
    </Nav.Item>
  );

  if (shortcutKeyData && shortcutKeyData.length > 0) {
    $(document).off('keydown').on('keydown', (e) => onKeyDown(e, shortcutKeyData));
  }

  const getShortCutKeys = async () => {
    let token = localStorage.getItem('Token');
    let response = await axios.get(process.env.REACT_APP_API_URL + '/get-key-combination-list',
      { headers: { "Authorization": `Bearer ${JSON.parse(token).value}` } })
    if (response.data.status == 200) {
      if (response.data.data && response.data.data.length > 0) {
        setShortKeys(response.data.data)
      }
    }
  }

  const setShortKeys = (shortCutData) => {
    $(document).off('keydown').on('keydown', (e) => onKeyDown(e, shortCutData));
  }

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

  return (
    <Navbar
      expand={navbarBreakPoint}
      className={classNames('navbar-vertical', {
        [`navbar-${navbarStyle}`]: navbarStyle !== 'transparent'
      })}
      variant="light"
    >
      <Flex alignItems="center">
        <ToggleButton />
        <Logo at="navbar-vertical" width={40} />
      </Flex>
      <Navbar.Collapse
        in={showBurgerMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundImage:
            navbarStyle === 'vibrant'
              ? `linear-gradient(-45deg, rgba(0, 160, 255, 0.86), #0048a2),url()`
              : 'none'
        }}
      >
        <div className="navbar-vertical-content scrollbar">
          <Nav className="flex-column" as="ul">
            {routes.map(route => (
              <Fragment key={route.label}>
                {!route.labelDisable && (
                  <NavbarLabel label={capitalize(route.label)} />
                )}
                <NavbarVerticalMenu routes={route.children} />
              </Fragment>
            ))}
          </Nav>

          <>
            {navbarPosition === 'combo' && (
              <div className={`d-${topNavbarBreakpoint}-none`}>
                <div className="navbar-vertical-divider">
                  <hr className="navbar-vertical-hr my-2" />
                </div>
              </div>
            )}
          </>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

NavbarVertical.propTypes = {
  label: PropTypes.string
};

export default NavbarVertical;