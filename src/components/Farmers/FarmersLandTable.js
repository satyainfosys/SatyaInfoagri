import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { farmerLandDetailsAction } from 'actions';
import { toast } from 'react-toastify';
import axios from 'axios';

export const FarmersLandTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [locationRowData, setLocationRowData] = useState([{ id: 1, latitude: "", longitude: "" }]);

  const columnsArray = [
    'Add',
    'Khasra No',
    'Land Mark',
    'Ownership',
    'Usage',
    'Org/Inorg',
    'Cultivated Land',
    'Active Status',
    'Action'
  ];

  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [unitList, setUnitList] = useState([])

  const emptyRow = {
    id: rowData.length + 1,
    encryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode") ? localStorage.getItem("EncryptedFarmerCode") : '',
    encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode") ? localStorage.getItem("EncryptedCompanyCode") : '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode") ? localStorage.getItem("EncryptedClientCode") : '',    
    khasraNo: '',
    landMark: '',
    ownerShip: '',
    usage: '',
    croppingType: '',
    landArea: '',
    activeStatus: '',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }

  const farmerLandDetailsReducer = useSelector((state) => state.rootReducer.farmerLandDetailsReducer)
  let farmerLandDetailsData = farmerLandDetailsReducer.farmerLandDetails

  const farmerDetailsErrorReducer = useSelector((state) => state.rootReducer.farmerDetailsErrorReducer)
  const farmerError = farmerDetailsErrorReducer.farmerDetailsError;

  useEffect(() => {
    getUnitList();
    setRowDataValue(farmerLandDetailsReducer, farmerLandDetailsData);
  }, [farmerLandDetailsData, farmerLandDetailsReducer]);

  const setRowDataValue = (farmerLandDetailsReducer, farmerLandDetailsData) => {
    setRowData(farmerLandDetailsReducer.farmerLandDetails.length > 0 ? farmerLandDetailsData : []);
  };

  const validateFarmerLandDetailsForm = () => {

    let isValid = true;

    if (farmerLandDetailsData && farmerLandDetailsData.length > 0) {
      farmerLandDetailsData.forEach((row, index) => {
        if (!row.khasraNo || !row.ownerShip || !row.croppingType || !row.landArea) {
          isValid = false;
          setFormError(true);
        }

      });
    }
    return isValid;
  }

  const handleAddRow = () => {
    let isValid = validateFarmerLandDetailsForm();
    if (isValid) {
      farmerLandDetailsData.push(emptyRow);
      dispatch(farmerLandDetailsAction(farmerLandDetailsData))
    }
  };

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var farmerLandDetails = [...rowData];
    farmerLandDetails[index][name] = value;
    farmerLandDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerLandDetailsAction(farmerLandDetails))
    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);
  }

  const ModalPreview = (encryptedFarmerLandCode) => {
    setModalShow(true);
    setParamsData({ encryptedFarmerLandCode });
  }

  const deleteFarmerLandDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = farmerLandDetailsReducer.farmerLandDetails.findIndex(x => x.encryptedFarmerLandCode == paramsData.encryptedFarmerLandCode);
    farmerLandDetailsReducer.farmerLandDetails.splice(objectIndex, 1)

    var deleteFarmerLandCode = localStorage.getItem("DeleteFarmerLandCodes");

    var deleteFarmerLandDetail = deleteFarmerLandCode ? deleteFarmerLandCode + "," + paramsData.encryptedFarmerLandCode : paramsData.encryptedFarmerLandCode;

    localStorage.setItem("DeleteFarmerLandCodes", deleteFarmerLandDetail);

    toast.success("Land details deleted successfully", {
      theme: 'colored'
    });

    dispatch(farmerLandDetailsAction(farmerLandDetailsData));

    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);

    setModalShow(false);
  }

  const localModalPreview = () => {
    setShowLocationModal(true);
  }

  const addLocationRow = () => {
    setLocationRowData([...locationRowData, { id: locationRowData.length + 1, latitude: "", longitude: "" }]);
  };

  const getUnitList = async () => {
    let response = await axios.get(process.env.REACT_APP_API_URL + '/unit-list')
    let unitListData = [];

    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        response.data.data.forEach(units => {
          unitListData.push({
            key: units.unitName,
            value: units.unitCode
          })
        })
      }
      setUnitList(unitListData);
    }
  }

  return (
    <>
      {modalShow && paramsData &&
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
            <h4>Are you sure, you want to delete this family member?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteFarmerLandDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }
      {showLocationModal &&
        <Modal
          show={showLocationModal}
          onHide={() => setShowLocationModal(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Location Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Table>
                <thead>
                  <tr>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>
                      <Button onClick={addLocationRow}>+</Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locationRowData.map((row, index) => (
                    <tr key={index}>
                      <td key={index}>
                        <Form.Control
                          type="text"
                          id="txtLatitude"
                          name="latitude"
                          // value={row.latitude}
                          // onChange={(e) => handleFieldChange(e, index)}
                          placeholder="Latitude"
                          className="form-control"
                        />
                      </td>
                      <td key={index}>
                        <Form.Control
                          type="text"
                          id="txtLongitude"
                          name="longitude"
                          // value={row.longitude}
                          // onChange={(e) => handleFieldChange(e, index)}
                          placeholder="Longitude"
                          className="form-control"
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setShowLocationModal(false)}>Cancel</Button>
            <Button variant="danger">Save</Button>
          </Modal.Footer>
        </Modal>
      }
      <Row>
        <div style={{ display: 'flex', justifyContent: 'left' }}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Unit<span className="text-danger">*</span></Form.Label><br />
            <Form.Select
              type="text"
              id="txtUnit"
              className="form-control"
            >
              <option value=''>Select Unit</option>
              {unitList.map((option, index) => (
                <option key={index} value={option.value}>{option.key}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            id="btnAddFarmersLandTable"
            className="mb-2"
            onClick={handleAddRow}
          >
            Add Land Details
          </Button>
        </div>
      </Row>
      <Form
        noValidate
        validated={formHasError}
        className="details-form"
        id="AddFarmersLiveStockTableDetailsForm"
      >
        {
          farmerLandDetailsData && farmerLandDetailsData.length > 0 &&
          <Table striped responsive id="TableList" className="no-pb">
            <thead>
              <tr>
                {columnsArray.map((column, index) => (
                  <th className="text-left" key={index}>
                    {column}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody id="tbody" className="details-form">
              {rowData.map((farmerLandDetailsData, index) => (
                <tr key={index}>
                  <td key={index}>
                    <Button style={{ fontSize: '10px' }}
                      onClick={() => { localModalPreview() }} >
                      Add Location
                    </Button>
                  </td>
                  <td key={index}>
                    <Form.Control
                      type="text"
                      id="txtKhasraNo"
                      name="khasraNo"
                      value={farmerLandDetailsData.khasraNo}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Khasra No"
                      className="form-control"
                      required
                    />
                  </td>
                  <td key={index}>
                    <Form.Control
                      type="text"
                      id="txtLandMark"
                      name="landMark"
                      value={farmerLandDetailsData.landMark}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Land Mark"
                      className="form-control"
                    />
                  </td>

                  <td key={index}>
                    <Form.Select
                      type="text"
                      id="txtOwnerShip"
                      name="ownerShip"
                      className="form-control"
                      value={farmerLandDetailsData.ownerShip}
                      onChange={(e) => handleFieldChange(e, index)}
                      required
                    >
                      <option value=''>Select</option>
                      <option value='Owned'>Owned</option>
                      <option value='Leased'>Leased</option>
                    </Form.Select>
                  </td>

                  <td key={index}>
                    <Form.Select
                      type="text"
                      id="txtUsage"
                      name="usage"
                      className="form-control"
                      value={farmerLandDetailsData.usage}
                      onChange={(e) => handleFieldChange(e, index)}
                    >
                      <option value=''>Select</option>
                      <option value='Irrigated'>Irrigated</option>
                      <option value='Unirrigated'>Unirrigated</option>
                    </Form.Select>
                  </td>

                  <td key={index}>
                    <Form.Select
                      type="text"
                      id="txtCroppingType"
                      name="croppingType"
                      value={farmerLandDetailsData.croppingType}
                      onChange={(e) => handleFieldChange(e, index)}
                      className="form-control"
                      required
                    >
                      <option value=''>Select</option>
                      <option value="Organic">Organic</option>
                      <option value="Inorganic">Inorganic</option>
                    </Form.Select>
                  </td>

                  <td key={index}>
                    <Form.Control
                      type="num"
                      id="txtLandArea"
                      name="landArea"
                      value={farmerLandDetailsData.landArea}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Cultivated Land"
                      required
                    />
                  </td>
                  <td key={index}>
                    <Form.Select
                      id="txtStatus"
                      name="activeStatus"
                      className="form-control"
                      value={farmerLandDetailsData.activeStatus}
                      onChange={(e) => handleFieldChange(e, index)}
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </Form.Select>
                  </td>

                  <td>
                    <i className="fa fa-trash" onClick={() => { ModalPreview(farmerLandDetailsData.encryptedFarmerLandCode) }} />
                  </td>
                </tr>
              ))
              }

            </tbody>
          </Table>
        }
      </Form>
    </>
  );
};

export default FarmersLandTable;
