import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { formChangedAction } from 'actions';
import { useSelector, useDispatch } from 'react-redux';

const TreeviewListItem = ({
  item,
  openedItems,
  setOpenedItems,
  selectedItems,
  setSelectedItems,
  selection,
  menuTreeItemClick
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(openedItems.indexOf(item.id) !== -1);
  const [children, setChildren] = useState([]);
  const [firstChildren, setFirstChildren] = useState([]);
  const [childrenOpen, setChildrenOpen] = useState(false);
  const checkRef = useRef();

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  const getChildrens = item => {
    function flatInnter(item) {
      let flat = [];
      item.map(child => {
        if (child.children) {
          flat = [...flat, child.id, ...flatInnter(child.children)];
        } else {
          flat = [...flat, child.id];
        }
      });

      return flat;
    }
    if (item.children) {
      return flatInnter(item.children);
    } else {
      return [];
    }
  };

  const isChildrenOpen = () => {
    return openedItems.some(item => firstChildren.indexOf(item) !== -1);
  };

  const handleOnExiting = () => {
    setOpenedItems(openedItems.filter(openedItem => openedItem !== item.id));
  };
  const handleEntering = () => {
    setOpenedItems([...openedItems, item.id]);
  };

  const handleSingleCheckboxChange = e => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, item.id]);
      dispatch(formChangedAction({
        ...formChangedData,
        moduleDetailAdd: true
      }));
    } else {
      setSelectedItems(
        selectedItems.filter(selectedItem => selectedItem !== item.id)
      );
      dispatch(formChangedAction({
        ...formChangedData,
        moduleDetailDelete: true
      }));
    }
  };

  const handleParentCheckboxChange = e => {
    const filteredItems = selectedItems.filter(
      selectedItem => children.indexOf(selectedItem) === -1
    );
    if (e.target.checked) {
      setSelectedItems([...filteredItems, item.id, ...children]);
      dispatch(formChangedAction({
        ...formChangedData,
        moduleDetailAdd: true
      }));
    } else {
      setSelectedItems(filteredItems);
      dispatch(formChangedAction({
        ...formChangedData,
        moduleDetailDelete: true
      }));
    }
  };

  useEffect(() => {
    setChildren(getChildrens(item));
    if (item.children) {
      setFirstChildren(item.children.map(child => child.id));
    }
  }, []);

  useEffect(() => {
    setChildrenOpen(isChildrenOpen());
  }, [children, openedItems]);

  useEffect(() => {
    const childrenSelected = selectedItems.some(
      selectedItem => children.indexOf(selectedItem) !== -1
    );
    const allChildrenSelected = children.every(
      child => selectedItems.indexOf(child) !== -1
    );
    if (childrenSelected && checkRef.current) {
      checkRef.current.indeterminate = true;
      if (selectedItems.indexOf(item.id) === -1) {
        setSelectedItems([...selectedItems, item.id]);
      }
    }
    if (!childrenSelected && checkRef.current) {
      checkRef.current.indeterminate = false;
      if (selectedItems.indexOf(item.id) != -1) {
        const filteredItems = selectedItems.filter(element => element !== item.id);
        setSelectedItems(filteredItems);
      }
    }
    if (allChildrenSelected && checkRef.current) {
      checkRef.current.indeterminate = false;
      checkRef.current.checked = true;
    }
    if (!allChildrenSelected && checkRef.current) {
      checkRef.current.checked = false;
    }
  }, [selectedItems, checkRef.current]);

  return (
    <li className="treeview-list-item">
      {Object.prototype.hasOwnProperty.call(item, 'children') && item.children.length > 0 ? (
        <>
          <div className="toggle-container">
            {selection && (
              <input
                type="checkbox"
                className="form-check-input"
                onChange={handleParentCheckboxChange}
                ref={checkRef}
              />
            )}
            {
              menuTreeItemClick ?
                <a
                  className={classNames('collapse-toggle', {
                    collapsed: open || item.expanded
                  })}
                  href="javascript:void(0);"
                  onClick={() => {
                    setOpen(!open);
                    menuTreeItemClick(item);
                  }}
                >
                  <p
                    className={classNames('treeview-text', { 'ms-2': !selection })}
                  >
                    {item.name}
                  </p>
                </a>
                :
                <a
                  className={classNames('collapse-toggle', {
                    collapsed: open || item.expanded
                  })}
                  href="javascript:void(0);"
                  onClick={() => {
                    setOpen(!open)
                  }}
                >
                  <p
                    className={classNames('treeview-text', { 'ms-2': !selection })}
                  >
                    {item.name}
                  </p>
                </a>
            }
          </div>
          <Collapse
            in={open}
            onExiting={handleOnExiting}
            onEntering={handleEntering}
          >
            <ul
              className={classNames('treeview-list', {
                'collapse-hidden': !open,
                'collapse-show treeview-border': open,
                'treeview-border-transparent': childrenOpen
              })}
            >
              {item.children.map((nestedItem, index) => (
                <TreeviewListItem
                  key={index}
                  item={nestedItem}
                  index={index}
                  openedItems={openedItems}
                  setOpenedItems={setOpenedItems}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  selection={selection}
                  menuTreeItemClick={menuTreeItemClick}
                />
              ))}
            </ul>
          </Collapse>
        </>
      ) : (
        <div className="treeview-item">
          {selection && (
            <input
              type="checkbox"
              className="form-check-input"
              onChange={handleSingleCheckboxChange}
              checked={selectedItems.indexOf(item.id) !== -1}
            />
          )}
          <a href="javascript:void(0);" className="flex-1">
            {
              menuTreeItemClick ?
                <p className="treeview-text" onClick={() => menuTreeItemClick(item)}>
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={classNames('me-2', item.iconClass)}
                  />
                  {item.name}
                </p>
                :
                <p className="treeview-text" >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={classNames('me-2', item.iconClass)}
                  />
                  {item.name}
                </p>
            }
          </a>
        </div>
      )}
    </li>
  );
};

const Treeview = ({
  data,
  selection,
  expanded = [],
  selectedItems = [],
  setSelectedItems,
  menuTreeItemClick
}) => {
  const [openedItems, setOpenedItems] = useState(expanded);

  return (
    <ul className="treeview treeview-select">
      {data.map((treeviewItem, index) => (
        <TreeviewListItem
          key={index}
          item={treeviewItem}
          openedItems={openedItems}
          setOpenedItems={setOpenedItems}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          selection={selection}
          menuTreeItemClick={menuTreeItemClick}
        />
      ))}
    </ul>
  );
};

TreeviewListItem.propTypes = {
  item: PropTypes.object,
  openedItems: PropTypes.array,
  setOpenedItems: PropTypes.func,
  selectedItems: PropTypes.array,
  setSelectedItems: PropTypes.func,
  selection: PropTypes.bool,
  menuTreeItemClick: PropTypes.func
};

Treeview.propTypes = {
  data: PropTypes.array.isRequired,
  selection: PropTypes.bool, // If true selection is enabled.
  expanded: PropTypes.array, // Default expanded children ids.
  selectedItems: PropTypes.array, // Selected item ids..
  setSelectedItems: PropTypes.func,// Setter to select items
  menuTreeItemClick: PropTypes.func
};

export default Treeview;
