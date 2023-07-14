import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { menuDetailAction, formChangedAction, menuDetailsErrorAction } from 'actions';
import { Col, Form, Row, Button } from 'react-bootstrap';
import Treeview from 'components/common/Treeview';
import axios from 'axios';

const AddMenuDetails = () => {
  const [formHasError, setFormError] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [menuName, setMenuName] = useState();

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

  return (
    <>
      {isLoading ? (
        <Spinner
          className="position-absolute start-50 loader-color"
          animation="border"
        />
      ) : null}

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
            </Col>
          </Row >
        </Form >
      }
    </>
  )
}

export default AddMenuDetails