import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { menuDetailAction, formChangedAction, menuDetailsErrorAction } from 'actions';
import { Col, Form, Row, Button, Modal } from 'react-bootstrap';
import Treeview from 'components/common/Treeview';
import axios from 'axios';
import { toast } from 'react-toastify';
// import MenuDetails from './MenuDetails';

const AddMenuDetails = () => {
  const [formHasError, setFormError] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [menuName, setMenuName] = useState();
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const resetMenuDetail = () => {
    dispatch(menuDetailAction({
      "menuItemName": "",
      "menuLevel": "",
      "menuItemPageURL": "",
      "description": "",
      "controls": "",
      "commandKeys": ""
    }))
    dispatch(formChangedAction(undefined))
    $('#btnSave').attr('disabled', true);
  }

  const menuDetailsReducer = useSelector((state) => state.rootReducer.menuDetailsReducer)
  var menuData = menuDetailsReducer.menuDetails;

  const menuDetailsErrorReducer = useSelector((state) => state.rootReducer.menuDetailsErrorReducer)
  const menuDataError = menuDetailsErrorReducer.menuDetailsError

  const treeViewReducer = useSelector((state) => state.rootReducer.treeViewReducer)
  const treeViewData = treeViewReducer.treeViewDetails;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  useEffect(() => {
    $("#btnNew").hide();
    $("#btnSave").show();
  }, []);

  if (Object.keys(menuDetailsReducer.menuDetails).length == 0 && !menuDetailsReducer.menuDetails.encryptedTreeId) {
    resetMenuDetail();
  }

  const handleFieldChange = e => {
    dispatch(menuDetailAction({
      ...menuData,
      [e.target.name]: e.target.value
    }))

    if (menuData.encryptedTreeId) {
      dispatch(formChangedAction({
        ...formChangedData,
        menuDetailUpdate: true
      }))
    } else {
      dispatch(formChangedAction({
        ...formChangedData,
        menuDetailAdd: true
      }))
    }
  }

  const addSubMenu = () => {
    localStorage.setItem("ParentId", menuData.childId);
    resetMenuDetail();
  }

  const resetData = () => {
    resetMenuDetail();
    dispatch(menuDetailsErrorAction(undefined));
    localStorage.removeItem("ParentId");
  }

  const viewMenuDetail = async (item) => {
    const requestData = {
      EncryptedTreeId: item.encryptedTreeId
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/view-menu-tree-detail', requestData, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })

    if (response.data.status == 200) {
      setMenuName(response.data.data.menuItemName)
      dispatch(menuDetailAction(response.data.data));
    }
  }

  const deleteModalPreview = () => {
    setDeleteModalShow(true);
  }

  const deleteMenuDetails = async () => {
    if (!menuData.encryptedTreeId)
      return false;

    if (menuData.encryptedTreeId) {
      const data = {
        encryptedTreeId: menuData.encryptedTreeId,
        isChild: menuData.isChild,
        isModule: menuData.isModule,
        isUser: menuData.isUser
      }
      const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

      const deleteMenuDetailResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-menu-tree-item', { headers, data })
      if (deleteMenuDetailResponse.data.status == 200) {
        toast.success(deleteMenuDetailResponse.data.message, {
          theme: 'colored',
          autoClose: 10000
        })
        $('[data-rr-ui-event-key*="Add Menu"]').trigger('click');
        dispatch(menuDetailAction(undefined))
      } else {
        toast.error(deleteMenuDetailResponse.data.message, {
          theme: 'colored',
          autoClose: 10000
        });
      }
    }

    setDeleteModalShow(false);
  }

  return (
    <>
      {isLoading ? (
        <Spinner
          className="position-absolute start-50 loader-color"
          animation="border"
        />
      ) : null}

      {deleteModalShow &&
        <Modal
          show={deleteModalShow}
          onHide={() => setDeleteModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              (menuData.isChild || menuData.isModule || menuData.isUser) ?
                <h4>Do you want to delete this menu details
                  as this menu is linked with other modules?</h4>
                :
                <h4>Do you want to delete this menu details?</h4>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setDeleteModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteMenuDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }

      {menuData &&
        <Form noValidate validated={formHasError} className="details-form" id='AddMenuDetailsForm'>
          <Row>
            <Col className="me-3 ms-3" md="6">
              <Treeview
                data={treeViewData}
                menuTreeItemClick={viewMenuDetail}
              />
            </Col>

            <Col className="me-3 ms-3" md="5">

              <Row className="mb-2">
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                  <Col sm="3" style={{ paddingLeft: 0 }}>
                    <Button className='btn btn-info me-1' id='btnReset' onClick={() => resetData()} style={{ display: "flex", justifyContent: "left" }}>
                      <span data-fa-transform="shrink-3"></span>Reset
                    </Button>
                  </Col>

                  <Col sm="9" style={{ paddingLeft: 0 }}>
                    {
                      menuData.childId && (
                        <Button variant='link' className='btn btn-link me-1' id='btnAdd' onClick={() => addSubMenu()} style={{ display: "flex", justifyContent: "right" }}>
                          <span data-fa-transform="shrink-3"></span>
                          Add menu under {menuName}
                        </Button>
                      )
                    }
                  </Col>
                </Form.Group>
              </Row>

              <Row className="mb-1">
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                  <Form.Label column sm="3">
                    Menu Name
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control id="txtMenuName" name="menuItemName" maxLength={100} value={menuData.menuItemName} onChange={handleFieldChange} placeholder="Menu Name" />
                    {Object.keys(menuDataError.menuNameErr).map((key) => {
                      return <span className="error-message">{menuDataError.menuNameErr[key]}</span>
                    })}
                  </Col>
                </Form.Group>
              </Row>

              <Row className="mb-1">
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                  <Form.Label column sm="3">
                    Order By
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control id="txtMenuLevel" name="menuLevel" value={menuData.menuLevel}
                      onChange={handleFieldChange} placeholder="Order By"
                      onKeyPress={(e) => {
                        const regex = /[0-9]|\./;
                        const key = String.fromCharCode(e.charCode);
                        if (!regex.test(key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={2}
                    />
                  </Col>
                </Form.Group>
              </Row>

              <Row className="mb-1">
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                  <Form.Label column sm="3">
                    Description
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control id="txtDescription" as='textarea' rows={2} name="description" value={menuData.description} onChange={handleFieldChange} placeholder="Description" />
                  </Col>
                </Form.Group>
              </Row>

              <Row className="mb-1">
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                  <Form.Label column sm="3">
                    URL
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control id="txtMenuItemPageURL" name="menuItemPageURL" maxLength={255} value={menuData.menuItemPageURL} onChange={handleFieldChange} placeholder="URL" />
                  </Col>
                </Form.Group>
              </Row>

              <Row className="mb-1">
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                  <Form.Label column sm="3">
                    Icon
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control id="txtMenuIcon" name="menuItemIcon" maxLength={50} value={menuData.menuItemIcon} onChange={handleFieldChange} placeholder="Menu Icon" />
                  </Col>
                </Form.Group>
              </Row>

              <Row className="mb-1">
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                  <Form.Label column sm="3">
                    Command
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select id="txtCommandKeys" name="commandKeys" onChange={handleFieldChange} value={menuData.commandKeys} >
                      <option value="">Select</option>
                      <option value="ALT">ALT</option>
                      <option value="CTRL">CTRL</option>
                      <option value="SHIFT">SHIFT</option>
                    </Form.Select>
                    {Object.keys(menuDataError.commandKeyErr).map((key) => {
                      return <span className="error-message">{menuDataError.commandKeyErr[key]}</span>
                    })}
                  </Col>
                </Form.Group>
              </Row>

              <Row className="mb-1">
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                  <Form.Label column sm="3">
                    Key
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select id="txtControls" name="controls" value={menuData.controls} onChange={handleFieldChange} >
                      <option value="">Select</option>
                      {[...Array(26)].map((_, index) => (
                        <option key={index} value={String.fromCharCode(65 + index)}>
                          {String.fromCharCode(65 + index)}
                        </option>
                      ))}
                      {[...Array(9)].map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </Form.Select>
                    {Object.keys(menuDataError.controlKeyErr).map((key) => {
                      return <span className="error-message">{menuDataError.controlKeyErr[key]}</span>
                    })}
                  </Col>
                </Form.Group>
              </Row>
              <Row className="mb-1">
                <div style={{ display: "flex", justifyContent: "right", borderRadius: "8px" }}>
                  <Button className='btn btn-danger me-1' id='btnDeleteMenu' onClick={() => deleteModalPreview()} disabled={!menuData.encryptedTreeId}>
                    <span class="fas fa-trash me-1" data-fa-transform="shrink-3"></span>Delete
                  </Button>
                </div>
              </Row>
            </Col>
          </Row >
        </Form >
      }
    </>
  )
}

export default AddMenuDetails;