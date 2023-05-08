import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { farmerLandDetailsAction, farmerDetailsAction } from 'actions';
import { toast } from 'react-toastify';
import axios from 'axios';

export const FarmersLandTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [locationRowData, setLocationRowData] = useState([{ id: 1, latitude: "", longitude: "" }]);
  const [reducerIndex, setReducerIndex] = useState();
  const [modalError, setModalError] = useState(false);

  const columnsArray = [
    'Khasra No',
    'Land Mark',
    'Ownership',
    'Usage',
    'Org/Inorg',
    'Cultivated Land',
    'Active Status',
    'Location',
    'Action'
  ];

  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [unitList, setUnitList] = useState([])
  const [unitError, setUnitError] = useState('');
  const [unitCode, setUnitCode] = useState('');

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
    modifyUser: localStorage.getItem("LoginUserName"),
    unitCode: unitCode
  }

  const farmerLandDetailsReducer = useSelector((state) => state.rootReducer.farmerLandDetailsReducer)
  let farmerLandDetailsData = farmerLandDetailsReducer.farmerLandDetails

  const farmerDetailsErrorReducer = useSelector((state) => state.rootReducer.farmerDetailsErrorReducer)
  const farmerError = farmerDetailsErrorReducer.farmerDetailsError;

  const farmerDetailsReducer = useSelector((state) => state.rootReducer.farmerDetailsReducer)
  var farmerData = farmerDetailsReducer.farmerDetails;

  useEffect(() => {
    getUnitList();
    setRowDataValue(farmerLandDetailsReducer, farmerLandDetailsData);
    if (localStorage.getItem("EncryptedFarmerCode")) {
      setLocationRowData([]);
    }
    if (farmerLandDetailsData && farmerLandDetailsData.length > 0) {
      setUnitCode(farmerLandDetailsData[0].unitCode);
    }

    const sumOfLandArea = farmerLandDetailsData.reduce((acc, obj) => {
      return acc + parseFloat(obj.landArea);
    }, 0);

    dispatch(farmerDetailsAction({
      ...farmerData,
      totalLand: sumOfLandArea
    }))
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

    if (isValid) {
      setFormError(false)
    }

    return isValid;
  }

  const validateUnit = () => {
    let unitError = {}
    let isUnitValid = true;

    if (!unitCode) {
      unitError.empty = "Select unit";
      isUnitValid = false;
    }

    setUnitError(unitError);
    return isUnitValid;
  }

  const handleUnitChange = (e) => {
    setUnitCode(e.target.value)
    if (farmerLandDetailsData && farmerLandDetailsData.length > 0) {
      for (let i = 0; i < farmerLandDetailsData.length; i++) {
        farmerLandDetailsData[i].unitCode = e.target.value;
        dispatch(farmerLandDetailsAction(farmerLandDetailsData))
      }
    }

    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedKey = selectedOption.dataset.key || selectedOption.label;
    dispatch(farmerDetailsAction({
      ...farmerData,
      unitName: selectedKey
    }))
    
    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);
  }

  const handleAddRow = () => {
    if (validateUnit()) {
      let isValid = validateFarmerLandDetailsForm();
      if (isValid) {
        farmerLandDetailsData.push(emptyRow);
        dispatch(farmerLandDetailsAction(farmerLandDetailsData))
      }
    };
  }

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

    if (deleteFarmerLandDetail) {
      localStorage.setItem("DeleteFarmerLandCodes", deleteFarmerLandDetail);
    }

    toast.success("Land details deleted successfully", {
      theme: 'colored'
    });

    dispatch(farmerLandDetailsAction(farmerLandDetailsData));

    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);

    setModalShow(false);
  }

  const locationModalPreview = (indexNo) => {
    setShowLocationModal(true);
    setReducerIndex(indexNo)

    if (farmerLandDetailsData && farmerLandDetailsData[indexNo].farmerGeofancingLand) {
      farmerLandDetailsData[indexNo].farmerGeofancingLand.map(landGeoDetail => {
        locationRowData.push(landGeoDetail);
      })
    }
  }

  const addLocationRow = () => {
    if (validateLocationModal()) {
      setLocationRowData([...locationRowData, { id: locationRowData.length + 1, latitude: "", longitude: "" }]);
    }
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

  const handleLocationFieldChange = (e, index) => {
    const { name, value } = e.target;
    var locationDetails = [...locationRowData]
    locationDetails[index][name] = value;
    locationDetails = Object.keys(locationRowData).map(key => {
      return locationRowData[key];
    })
    setLocationRowData(locationDetails);
  }

  const onLocationSave = (index) => {
    if (validateLocationModal()) {
      farmerLandDetailsData[index].farmerGeofancingLand = locationRowData;
      dispatch(farmerLandDetailsAction(farmerLandDetailsData));
      setShowLocationModal(false);
      setLocationRowData([]);

      if ($("#btnSave").attr('disabled'))
        $("#btnSave").attr('disabled', false);
    }
  }

  const validateLocationModal = () => {
    let isLocationFormValid = true;

    if (locationRowData && locationRowData.length > 0) {
      locationRowData.forEach((row, index) => {
        if (!row.latitude || !row.longitude) {
          isLocationFormValid = false;
          setModalError(true);
        }
      })
    }

    if (isLocationFormValid) {
      setModalError(false)
    }

    return isLocationFormValid;
  }

  const deleteLocationDetails = (index, item) => {
    if (reducerIndex < 0 && index < 0)
      return false;

    farmerLandDetailsData[reducerIndex].farmerGeofancingLand.splice(index, 1);

    var deleteFarmerLandGeoDetailCode = localStorage.getItem("DeleteFarmerLandGeoDetailCodes")

    var deleteFarmerLandGeoDetail = deleteFarmerLandGeoDetailCode ? deleteFarmerLandGeoDetailCode + "," + item.encryptedFarmerLandGeoCode : item.encryptedFarmerLandGeoCode;

    if (deleteFarmerLandGeoDetail) {
      localStorage.setItem("DeleteFarmerLandGeoDetailCodes", deleteFarmerLandGeoDetail);
    }

    toast.success("Location details deleted successfully", {
      theme: 'colored'
    });

    dispatch(farmerLandDetailsAction(farmerLandDetailsData));

    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);

    setShowLocationModal(false);
  }

  const hasLocationData = locationRowData.some((location) => {
    return location.latitude !== '' && location.longitude !== '';
  });

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
          onHide={() => { setShowLocationModal(false), setLocationRowData([]) }}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Google Location Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              noValidate
              validated={modalError}
              className="details-form"
            >
              <Table>
                <thead>
                  <tr>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Actions</th>
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
                          value={row.latitude}
                          onChange={(e) => handleLocationFieldChange(e, index)}
                          placeholder="Latitude"
                          className="form-control"
                          // onKeyPress={(e) => {
                          //   const keyCode = e.which || e.keyCode;
                          //   const keyValue = String.fromCharCode(keyCode);
                          //   const validRegex = /^-?([0-8]?[0-9]\.[0-9]{1,6}|90\.[0]{1,6})$/;
                          //   if (!validRegex.test(e.target.value + keyValue)) {
                          //     e.preventDefault();
                          //   }
                          // }}
                          required
                        />
                      </td>
                      <td key={index}>
                        <Form.Control
                          type="text"
                          id="txtLongitude"
                          name="longitude"
                          value={row.longitude}
                          onChange={(e) => handleLocationFieldChange(e, index)}
                          placeholder="Longitude"
                          className="form-control"
                          required
                        />
                      </td>
                      <td>
                        <i className="fa fa-trash fa-lg" onClick={() => deleteLocationDetails(index, row)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => { setShowLocationModal(false), setLocationRowData([]) }}>Cancel</Button>
            <Button variant="info" disabled={!hasLocationData}>
              Show On Map
            </Button>
            <Button variant="success" onClick={() => onLocationSave(reducerIndex)}>Save</Button>
            <Button onClick={addLocationRow}>Add More</Button>
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
              onChange={handleUnitChange}
              name='unitCode'
              value={unitCode}
            >
              <option value=''>Select Unit</option>
              {unitList.map((option, index) => (
                <option key={index} value={option.value}>{option.key}</option>
              ))}
            </Form.Select>
            {Object.keys(unitError).map((key) => {
              return <span className="error-message">{unitError[key]}</span>
            })}
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
        validated={formHasError || (farmerError.landDetailErr.invalidLandDetail)}
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
                      onKeyPress={(e) => {
                        const regex = /[0-9]|\./;
                        const key = String.fromCharCode(e.charCode);
                        if (!regex.test(key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={5}
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

                  <td key={index}>
                    <Button style={{ fontSize: '10px' }}
                      onClick={() => { locationModalPreview(index) }} >
                      Google Location
                    </Button>
                  </td>

                  <td>
                    <i className="fa fa-trash fa-2x" onClick={() => { ModalPreview(farmerLandDetailsData.encryptedFarmerLandCode) }} />
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
