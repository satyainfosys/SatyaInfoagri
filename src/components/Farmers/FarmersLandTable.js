import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Row, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { farmerLandDetailsAction, farmerDetailsAction, formChangedAction } from 'actions';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import 'leaflet/dist/leaflet.css';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const FarmersLandTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  let [locationRowData, setLocationRowData] = useState([]);
  const [reducerIndex, setReducerIndex] = useState();
  const [modalError, setModalError] = useState(false);
  const [landCode, setLandCode] = useState(false);

  const columnsArray = [
    'S.No',
    'Khasra No',
    'Land Mark',
    'Ownership',
    'Usage',
    'Org/Inorg',
    'Cultivated Land',
    'Active Status',
    'Location',
    'Map',
    'Action'
  ];

  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [unitList, setUnitList] = useState([])
  const [unitError, setUnitError] = useState('');
  const [unitCode, setUnitCode] = useState('');
  const [locationErr, setLocationErr] = useState({})
  const [showMapModal, setShowMapModal] = useState(false);
  const [locationCoordinates, setLocationCoordinates] = useState([]);

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

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  useEffect(() => {
    if (unitList.length <= 0) {
      getUnitList();
    }

    if (farmerLandDetailsReducer.farmerLandDetails.length > 0) {
      setRowData(farmerLandDetailsData);
      setUnitCode(farmerLandDetailsData[0].unitCode);
    }
    else {
      setUnitCode('');
    }

    if (localStorage.getItem("EncryptedFarmerCode")) {
      setLocationRowData([]);
    }

    const sumOfLandArea = farmerLandDetailsData.reduce((acc, obj) => {
      const landArea = obj.landArea !== "" ? parseFloat(obj.landArea) : 0;
      return acc + landArea;
    }, 0);

    dispatch(farmerDetailsAction({
      ...farmerData,
      totalLand: sumOfLandArea
    }))

    // if (sumOfLandArea > 0 && localStorage.getItem("EncryptedFarmerCode")) {
    //   dispatch(formChangedAction({
    //     ...formChangedData,
    //     farmerUpdate: true
    //   }))
    // } else if (sumOfLandArea > 0) {
    //   dispatch(formChangedAction({
    //     ...formChangedData,
    //     farmerAdd: true
    //   }))
    // }
  }, [farmerLandDetailsData, farmerLandDetailsReducer]);

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
      // unitError.empty = "Select unit";
      toast.error("Select unit", {
        theme: 'colored',
        autoClose: 10000
      });
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
        dispatch(farmerLandDetailsAction(farmerLandDetailsData));

        if (farmerLandDetailsData[i].encryptedFarmerLandCode) {
          dispatch(formChangedAction({
            ...formChangedData,
            landDetailUpdate: true
          }))
        } else {
          dispatch(formChangedAction({
            ...formChangedData,
            landDetailUpdate: true
          }))
        }
      }
    }

    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedKey = selectedOption.dataset.key || selectedOption.label;
    dispatch(farmerDetailsAction({
      ...farmerData,
      unitName: selectedKey != "Select Unit" ? selectedKey : ""
    }))

    if (localStorage.getItem("EncryptedFarmerCode")) {
      dispatch(formChangedAction({
        ...formChangedData,
        landDetailUpdate: true
      }))
    }
  }

  const handleAddRow = () => {
    if (validateUnit()) {
      let isValid = validateFarmerLandDetailsForm();
      if (isValid) {
        farmerLandDetailsData.unshift(emptyRow);
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

    if (farmerLandDetails[index].encryptedFarmerLandCode && localStorage.getItem("EncryptedFarmerCode")) {
      dispatch(formChangedAction({
        ...formChangedData,
        landDetailUpdate: true,
        farmerUpdate: true
      }))
    } else if (!farmerLandDetails[index].encryptedFarmerLandCode && localStorage.getItem("EncryptedFarmerCode")) {
      dispatch(formChangedAction({
        ...formChangedData,
        landDetailAdd: true,
        farmerUpdate: true
      }))
    } else {
      dispatch(formChangedAction({
        ...formChangedData,
        landDetailAdd: true,
      }))
    }
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

    if (paramsData.encryptedFarmerLandCode) {
      var deleteFarmerLandDetail = deleteFarmerLandCode ? deleteFarmerLandCode + "," + paramsData.encryptedFarmerLandCode : paramsData.encryptedFarmerLandCode;
      localStorage.setItem("DeleteFarmerLandCodes", deleteFarmerLandDetail);
    }

    toast.success("Land details deleted successfully", {
      theme: 'colored'
    });

    dispatch(farmerLandDetailsAction(farmerLandDetailsData));

    dispatch(formChangedAction({
      ...formChangedData,
      landDetailDelete: true
    }))

    setModalShow(false);
  }

  const locationModalPreview = (indexNo, encryptedFarmerLandCode) => {
    setShowLocationModal(true);
    setReducerIndex(indexNo);
    setModalError(false);
    setLandCode(encryptedFarmerLandCode)

    setLocationRowData([]);

    var locationData = [];

    if (farmerLandDetailsData && farmerLandDetailsData[indexNo].farmerGeofancingLand) {
      farmerLandDetailsData[indexNo].farmerGeofancingLand.map(landGeoDetail => {
        locationData.push(landGeoDetail);
      })

      setLocationRowData(locationData);

    } else {
      setLocationRowData([...locationRowData, { id: locationRowData.length + 1, latitude: "", longitude: "" }]);
    }
  }

  const addLocationRow = () => {
    if (validateLocationModal()) {
      setLocationRowData([{ id: locationRowData.length + 1, latitude: "", longitude: "" }, ...locationRowData]);
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
        setUnitList(unitListData);
      }
    }
    else {
      setUnitList([]);
    }
  }

  const handleLocationFieldChange = (e, index) => {
    const { name, value } = e.target;
    var locationDetails = [...locationRowData];
    locationDetails[index] = { ...locationDetails[index], [name]: value };

    setLocationRowData(locationDetails);

    if (landCode) {
      dispatch(formChangedAction({
        ...formChangedData,
        landDetailUpdate: true
      }))
    }
  }

  const onLocationSave = () => {
    if (validateLocationModal()) {
      farmerLandDetailsData[reducerIndex].farmerGeofancingLand = locationRowData;
      dispatch(farmerLandDetailsAction(farmerLandDetailsData));
      setShowLocationModal(false);
      setLocationRowData([]);
      setLocationErr({});

      if (localStorage.getItem("DeleteFarmerLandGeoDetailCodes")) {
        dispatch(formChangedAction({
          ...formChangedData,
          landGeoDetailDelete: true
        }))
      }
    }
  }

  const validateLocationModal = () => {
    let locationErr = {};
    let isLocationFormValid = true;

    const seenPairs = {};

    if (locationRowData && locationRowData.length > 0) {
      locationRowData.forEach((row, index) => {
        if (!row.latitude || !row.longitude) {
          isLocationFormValid = false;
          setModalError(true);
        }

        if ((row.latitude && row.longitude)) {
          if (!(parseFloat(row.latitude) >= -90 && parseFloat(row.latitude) <= 90) || !(parseFloat(row.longitude) > -180 && parseFloat(row.longitude) <= 180)) {
            locationErr.invalidEntry = "Latitude should be between -90 to 90 and logitude from -180 to 180";
            isLocationFormValid = false;
            setModalError(true);
          }
          else {
            const pair = row;
            const pairString = `${pair.latitude},${pair.longitude}`;
            if (seenPairs[pairString]) {
              locationErr.invalid = "Same Latitude and Longitude pair is already added";
              isLocationFormValid = false;
            } else {
              seenPairs[pairString] = true;
            }
          }
        }

        if (!row.latitude && row.longitude) {
          if (!(parseFloat(row.longitude) > -180 && parseFloat(row.longitude) <= 180)) {
            locationErr.invalidEntry = "Longitude should be between -180 to 180";
          }
        }

        if (row.latitude && !row.longitude) {
          if (!(parseFloat(row.latitude) > -90 && parseFloat(row.latitude) <= 90)) {
            locationErr.invalidEntry = "Latitude should be between -90 to 90";
          }
        }
      })
    }

    if (isLocationFormValid) {
      setModalError(false)
      setLocationErr({})
    }

    if (!isLocationFormValid) {
      setLocationErr(locationErr)
    }

    return isLocationFormValid;
  }

  const deleteLocationDetails = (index, item) => {
    if (reducerIndex < 0 && index < 0)
      return false;

    if (farmerLandDetailsData[reducerIndex].farmerGeofancingLand && farmerLandDetailsData[reducerIndex].farmerGeofancingLand.length > 0) {

      var deleteFarmerLandGeoDetailCode = localStorage.getItem("DeleteFarmerLandGeoDetailCodes")

      if (item.encryptedFarmerLandGeoCode) {
        var deleteFarmerLandGeoDetail = deleteFarmerLandGeoDetailCode ? deleteFarmerLandGeoDetailCode + "," + item.encryptedFarmerLandGeoCode : item.encryptedFarmerLandGeoCode;
        localStorage.setItem("DeleteFarmerLandGeoDetailCodes", deleteFarmerLandGeoDetail);
      }
      locationRowData.splice(index, 1);
    }
    else {
      locationRowData.splice(index, 1);
    }

    toast.success("Location details deleted successfully", {
      theme: 'colored'
    });
    setLocationErr({});
  }

  const showOnMap = (index) => {
    if (farmerLandDetailsData[index].farmerGeofancingLand && farmerLandDetailsData[index].farmerGeofancingLand.length > 0) {
      const coordinatesArray = farmerLandDetailsData[index].farmerGeofancingLand.map(obj => [parseFloat(obj.latitude), parseFloat(obj.longitude)]);
      setLocationCoordinates(coordinatesArray);
      setShowMapModal(true);
    }
  }

  const locationCancelClick = () => {
    setLocationErr({});
    setLocationRowData([]);
    setShowLocationModal(false);
    localStorage.removeItem("DeleteFarmerLandGeoDetailCodes")
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
            <h4>Are you sure, you want to delete this land detail?</h4>
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
          onHide={() => locationCancelClick()}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Google Location Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="max-five-rows">
            <Form
              noValidate
              validated={modalError}
              className="details-form"
            >
              {Object.keys(locationErr).map((key) => {
                return <span className="error-message">{locationErr[key]}</span>
              })}
              {
                locationRowData && locationRowData.length > 0 &&
                <Table striped bordered responsive className="text-nowrap tab-page-table">
                  <thead className='custom-bg-200'>
                    <tr>
                      <th>S.No</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationRowData.map((row, index) => (
                      <tr key={index}>
                        <td>
                          {index + 1}
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            id="txtLatitude"
                            name="latitude"
                            value={row.latitude}
                            onChange={(e) => handleLocationFieldChange(e, index)}
                            placeholder="Latitude"
                            className="form-control"
                            maxLength={12}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;

                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required={true}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            id="txtLongitude"
                            name="longitude"
                            value={row.longitude}
                            onChange={(e) => handleLocationFieldChange(e, index)}
                            placeholder="Longitude"
                            className="form-control"
                            maxLength={12}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;

                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required={true}
                          />
                        </td>
                        <td>
                        <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => deleteLocationDetails(index, row)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              }

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => locationCancelClick()}>Cancel</Button>
            <Button variant="success" onClick={() => onLocationSave()}>Save</Button>
            <Button onClick={addLocationRow}>Add More</Button>
          </Modal.Footer>
        </Modal>
      }
      {
        showMapModal &&
        <Modal
          show={showMapModal}
          onHide={() => { setShowMapModal(false) }}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Map</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <MapContainer
                center={locationCoordinates[0] ? locationCoordinates[0] : [28.6139, 77.2090]}
                zoom={19}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot; target=&quot;_blank&quot; rel=&quot;noopener noreferrer&quot;>OpenStreetMap</a> contributors"
                  maxZoom={100}
                />
                <Polygon positions={locationCoordinates} />
              </MapContainer>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => { setShowMapModal(false) }}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      }

      <Card className="h-100 mb-2">
        <FalconCardHeader
          title="Land Details"
          titleTag="h6"
          className="py-2"
          light
          endEl={
            <Flex>
              <Form.Select
                size="sm"
                type="text"
                id="txtUnit"
                className="me-2"
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
              <Button
                variant="primary"
                size="sm"
                className="btn-reveal"
                type="button"
                onClick={handleAddRow}
              >
                <i className="fa-solid fa-plus" />
              </Button>
            </Flex>
          }
        />
        {
              farmerLandDetailsData && farmerLandDetailsData.length > 0 &&
        <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
          <Form
            noValidate
            validated={formHasError || (farmerError.landDetailErr.invalidLandDetail)}
            className="details-form"
            id="AddFarmersLiveStockTableDetailsForm"
          >
              <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                <thead className='custom-bg-200'>
                  <tr>
                    {columnsArray.map((column, index) => (
                      <th className="text-left" key={index}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody id="tbody" className="details-form">
                  {rowData.map((farmerLandDetailsData, index) => (
                    <tr key={index}>
                      <td>
                        {index + 1}
                      </td>
                      <td key={index} width="155px">
                        <EnlargableTextbox
                          id="txtKhasraNo"
                          name="khasraNo"
                          value={farmerLandDetailsData.khasraNo}
                          onChange={(e) => handleFieldChange(e, index)}
                          placeholder="Khasra No"
                          className="form-control"
                          required={true}
                          maxLength={10}
                        />
                      </td>
                      <td key={index} width="155px">
                        <EnlargableTextbox
                          id="txtLandMark"
                          name="landMark"
                          value={farmerLandDetailsData.landMark}
                          onChange={(e) => handleFieldChange(e, index)}
                          placeholder="Land Mark"
                          className="form-control"
                          maxLength={100}
                        />
                      </td>

                      <td key={index} width="155px">
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

                      <td key={index} width="155px">
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

                      <td key={index} width="155px">
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

                      <td key={index} width="60px">
                        <EnlargableTextbox
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
                          maxLength={6}
                          required={true}
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
                          variant="success"
                          onClick={() => { locationModalPreview(index, farmerLandDetailsData.encryptedFarmerLandCode) }} >
                          Google Location
                        </Button>
                      </td>

                      <td key={index}>
                        <Button style={{ fontSize: '10px' }}
                          variant="info"
                          onClick={() => { showOnMap(index) }}
                          disabled={farmerLandDetailsData && farmerLandDetailsData.farmerGeofancingLand && farmerLandDetailsData.farmerGeofancingLand.length > 0 ? false : true}
                        >
                          Show On Map
                        </Button>
                      </td>

                      <td>
                      <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(farmerLandDetailsData.encryptedFarmerLandCode) }} />
                      </td>
                    </tr>
                  ))
                  }

                </tbody>
              </Table>
          </Form>
        </Card.Body>
        }
      </Card>
    </>
  );
};

export default FarmersLandTable;
