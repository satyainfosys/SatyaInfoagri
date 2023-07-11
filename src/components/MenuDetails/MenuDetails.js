import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import TabPage from 'components/common/TabPage';
import { Spinner, Modal, Button, Col, Form, Row } from 'react-bootstrap';
import { formChangedAction, menuDetailAction, menuDetailsErrorAction, treeViewAction } from 'actions';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const tabArray = ['Add Menu'];

export const MenuDetails = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [formHasError, setFormError] = useState();

  const fetchMenuTree = async () => {
    let token = localStorage.getItem('Token');

    const encryptedModuleCode = {
      encryptedModuleCode: localStorage.getItem("EncryptedResponseModuleCode") ? localStorage.getItem("EncryptedResponseModuleCode") : ''
    }

    setIsLoading(true);
    await axios
      .post(process.env.REACT_APP_API_URL + '/get-security-menu-tree-master-list', encryptedModuleCode, {
        headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
      })
      .then(res => {
        setIsLoading(false);
        if (res.data.status == 200) {
          dispatch(treeViewAction(res.data.data));
        }
      });
  };

  useEffect(() => {
    fetchMenuTree();
    $("#btnNew").hide();
    $("#btnSave").show();
    localStorage.removeItem("ParentId")
  }, []);

  const menuDetailsReducer = useSelector((state) => state.rootReducer.menuDetailsReducer)
  var menuData = menuDetailsReducer.menuDetails;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  let isFormChanged = Object.values(formChangedData).some(value => value === true);

  $('[data-rr-ui-event-key*="Add Menu"]').off('click').on('click', function () {
    fetchMenuTree();
    $("#btnSave").show();
    $("#btnNew").hide();
  })

  const exitModule = () => {
    $('#btnExit').attr('isExit', 'true');
    if (isFormChanged) {
      setModalShow(true)
    } else {
      window.location.href = '/dashboard';
    }
  }

  const menuDetailValidation = () => {
    let menuNameErr = {};
    let isValid = true;

    if (!menuData.menuItemName) {
      menuNameErr.empty = "Enter menu name";
      isValid = false;
      setFormError(true);
    }

    if (!isValid) {
      var errorObject = {
        menuNameErr
      }
      dispatch(menuDetailsErrorAction(errorObject));
    }
    return isValid;
  }

  const addMenuDetails = () => {
    if (menuDetailAction()) {
      const requestData = {
        parentId: localStorage.getItem("ParentId") ? localStorage.getItem("ParentId") : 0,
        menuItemName: menuData.menuItemName,
        menuLevel: menuData.menuLevel ? parseInt(menuData.menuLevel) : 0,
        menuItemIcon: menuData.menuItemIcon ? menuData.menuItemIcon : "",
        menuItemPageURL: menuData.menuItemPageURL ? menuData.menuItemPageURL : "",
        description: menuData.description ? menuData.description : "",
        controls: menuData.controls ? menuData.controls : "",
        commandKeys: menuData.commandKeys ? menuData.commandKeys : "",
        addUser: localStorage.getItem("LoginUserName")
      }

      const keys = ['description', 'addUser']
      for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
        requestData[key] = requestData[key] ? requestData[key].toUpperCase() : '';
      }

      setIsLoading(true);
      axios.post(process.env.REACT_APP_API_URL + '/add-menu-tree-item', requestData, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
      })
        .then(res => {
          if (res.data.status == 200) {
            setModalShow(false);
            setIsLoading(false);
            setTimeout(function () {
              dispatch(menuDetailAction({
                ...menuData,
                encryptedTreeId: res.data.data.encryptedTreeId
              }))
            }, 50);
            localStorage.removeItem("ParentId")
            toast.success(res.data.message, {
              theme: 'colored',
              autoClose: 10000
            })
            $('[data-rr-ui-event-key*="Add Menu"]').trigger('click');
          } else {
            setIsLoading(false);
            toast.error(res.data.message, {
              theme: 'colored',
              autoClose: 10000
            });
          }
        })
    }
  }

  const updateMenuDetails = async () => {
    if (menuDetailValidation()) {
      const requestData = {
        encryptedTreeId: menuData.encryptedTreeId,
        parentId: menuData.parentId,
        menuItemName: menuData.menuItemName,
        menuLevel: menuData.menuLevel ? parseInt(menuData.menuLevel) : 0,
        menuItemIcon: menuData.menuItemIcon ? menuData.menuItemIcon : "",
        menuItemPageURL: menuData.menuItemPageURL ? menuData.menuItemPageURL : "",
        description: menuData.description ? menuData.description : "",
        controls: menuData.controls ? menuData.controls : "",
        commandKeys: menuData.commandKeys ? menuData.commandKeys : "",
        modifyUser: localStorage.getItem("LoginUserName")
      }

      const keys = ['description', 'modifyUser']
      for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
        requestData[key] = requestData[key] ? requestData[key].toUpperCase() : '';
      }

      if (formChangedData.menuDetailUpdate) {
        setIsLoading(true);
        await axios.post(process.env.REACT_APP_API_URL + '/update-menu-tree-item', requestData, {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
          .then(res => {
            setIsLoading(false);
            if (res.data.status == 200) {
              toast.success(res.data.message, {
                theme: 'colored',
                autoClose: 10000
              })
              $('[data-rr-ui-event-key*="Add Menu"]').trigger('click');
            } else {
              setIsLoading(false);
              toast.error(res.data.message, {
                theme: 'colored',
                autoClose: 10000
              });
            }
          })
      }
    }
  }

  const discardChanges = () => {
    $('#btnDiscard').attr('isDiscard', 'true');
    if ($('#btnExit').attr('isExit') == 'true') {
      window.location.href = '/dashboard';
    }
    setModalShow(false);
  }

  return (
    <>
      {isLoading ? (
        <Spinner
          className="position-absolute start-50 loader-color"
          animation="border"
        />
      ) : null}

      {modalShow &&
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Do you want to save changes?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={menuData.encryptedTreeId ? updateMenuDetails : addMenuDetails}>Save</Button>
            <Button variant="danger" id="btnDiscard" onClick={() => discardChanges()}>Discard</Button>
          </Modal.Footer>
        </Modal>
      }

      <TabPage
        tabArray={tabArray}
        module='AddMenu'
        saveDetails={menuData.encryptedTreeId ? updateMenuDetails : addMenuDetails}
        exitModule={exitModule}
      />
    </>
  )
}

export default MenuDetails;