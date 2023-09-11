import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import $ from "jquery";
import { formChangedAction, vendorMasterDetailsAction } from 'actions';

export const AddVendorMasterDetail = () => {

  const [formHasError, setFormError] = useState(false);
  const dispatch = useDispatch();
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);

  const resetVendorMasterDetails = () => {
    dispatch(vendorMasterDetailsAction({
      'encryptedVendorCode': '',
      'vendorCode': '',
      'vendorName': '',
      'vendorType': '',
      'vendorAddress': '',
      'vendorPincode': '',
      'countryCode': '',
      'stateCode': '',
      'vendorGstNo': '',
      'vendorPanNo': '',
      'vendorTinNo': '',
      'vendorWebsite': '',
      'vendorRating': '',
      'status': 'Active'
    }))
  }

  const vendorMasterDetailsReducer = useSelector((state) => state.rootReducer.vendorMasterDetailsReducer)
  var vendorMasterData = vendorMasterDetailsReducer.vendorMasterDetails;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  const vendorMasterDetailsErrorReducer = useSelector((state) => state.rootReducer.vendorMasterDetailsErrorReducer)
  const vendorMasterErr = vendorMasterDetailsErrorReducer.vendorMasterDetailsError;

  if (!vendorMasterDetailsReducer.vendorMasterDetails ||
    Object.keys(vendorMasterDetailsReducer.vendorMasterDetails).length <= 0) {
    resetVendorMasterDetails();
  }

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = async () => {
    axios
      .get(process.env.REACT_APP_API_URL + '/country-list')
      .then(res => {
        if (res.data.status == 200) {
          let countryData = [];
          if (res.data && res.data.data.length > 0)
            res.data.data.forEach(country => {
              countryData.push({
                key: country.countryName,
                value: country.countryCode
              });
            });
          setCountryList(countryData);
        }
      });
  }

  const getStates = async (countryCode) => {
    const stateRequest = {
      CountryCode: countryCode
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/state-list', stateRequest)
    let stateData = [];

    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        response.data.data.forEach(state => {
          stateData.push({
            key: state.stateName,
            value: state.stateCode
          });
        });
      }
      setStateList(stateData);
    } else {
      setStateList([]);
    }
  }

  if (vendorMasterData.stateCode &&
    !$('#txtStateName').val()) {
    getStates(vendorMasterData.countryCode);
  }

  const handleFieldChange = e => {
    if (e.target.name == 'countryCode') {
      dispatch(vendorMasterDetailsAction({
        ...vendorMasterData,
        countryCode: e.target.value,
        stateCode: null
      }))
      setStateList([]);

      e.target.value && getStates(e.target.value);
    }
    else {
      dispatch(vendorMasterDetailsAction({
        ...vendorMasterData,
        [e.target.name]: e.target.value
      }))
    }

    if (vendorMasterData.encryptedVendorCode) {
      dispatch(formChangedAction({
        ...formChangedData,
        vendorMasterDetailUpdate: true
      }))
    } else {
      dispatch(formChangedAction({
        ...formChangedData,
        vendorMasterDetailAdd: true
      }))
    }
  }

  return (
    <Form noValidate validated={formHasError} className="details-form" id='AddVendorMasterDetails'>
      <Row>
        <Col className="me-3 ms-3" md="7">
          <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
            <Form.Label column sm="3">
              Vendor Name<span className="text-danger">*</span>
            </Form.Label>
            <Col sm="2">
              <Form.Control id="txtVendorCode" name="vendorCode" value={vendorMasterData.vendorCode} placeholder="Code" disabled />
            </Col>
            <Col sm="7">
              <Form.Control id="txtVendorName" name="vendorName" value={vendorMasterData.vendorName} onChange={handleFieldChange} maxLength={45} placeholder="Vendor Name" />
              {Object.keys(vendorMasterErr.vendorNameErr).map((key) => {
                return <span className="error-message">{vendorMasterErr.vendorNameErr[key]}</span>
              })}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
            <Form.Label column sm="3">
              Type
            </Form.Label>
            <Col sm="9">
              <Form.Select id="txtVendorType" name="vendorType" value={vendorMasterData.vendorType} onChange={handleFieldChange} >
                <option value=''>Select Type</option>
                <option value='Seed Supplier'>Seed Supplier</option>
                <option value='Transporter'>Transporter</option>
                <option value='Input Supplier'>Input Supplier</option>
                <option value='Machinery Supplier'>Machinery Supplier</option>
                <option value='Seedling Supplier'>Seedling Supplier</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
            <Form.Label column sm="3">
              Address
            </Form.Label>
            <Col sm="9">
              <Form.Control id="txtAddress" as='textarea' name="vendorAddress" value={vendorMasterData.vendorAddress} onChange={handleFieldChange} maxLength={100} placeholder="Vendor Address" rows="4" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
            <Form.Label column sm="3">
              Pincode
            </Form.Label>
            <Col sm="9">
              <Form.Control id="txtVendorPincode" name="vendorPincode" value={vendorMasterData.vendorPincode} onChange={handleFieldChange} maxLength={8} placeholder="Pincode" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
            <Form.Label column sm="3">
              Country<span className="text-danger">*</span>
            </Form.Label>
            <Col sm="9">
              <Form.Select id="txtCountry" name="countryCode" value={vendorMasterData.countryCode} onChange={handleFieldChange} required>
                <option value=''>Select Country</option>
                {countryList.map((option, index) => (
                  <option key={index} value={option.value}>{option.key}</option>
                ))}
              </Form.Select>
              {Object.keys(vendorMasterErr.countryCodeErr).map((key) => {
                return <span className="error-message">{vendorMasterErr.countryCodeErr[key]}</span>
              })}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
            <Form.Label column sm="3">
              State<span className="text-danger">*</span>
            </Form.Label>
            <Col sm="9">
              <Form.Select id="txtStateName" name="stateCode" value={vendorMasterData.stateCode} onChange={handleFieldChange} >
                <option value="">Select State</option>
                {stateList.map((option, index) => (
                  <option key={index} value={option.value}>{option.key}</option>
                ))}
              </Form.Select>
              {Object.keys(vendorMasterErr.stateCodeErr).map((key) => {
                return <span className="error-message">{vendorMasterErr.stateCodeErr[key]}</span>
              })}
            </Col>
          </Form.Group>
        </Col>

        <Col className="me-3 ms-3" md="4">
          <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
            <Form.Label column sm="3">
              Gst No
            </Form.Label>
            <Col sm="9">
              <Form.Control id="txtVendorGstNo" name="vendorGstNo" value={vendorMasterData.vendorGstNo} onChange={handleFieldChange} maxLength={20} placeholder="GST No" />
              {Object.keys(vendorMasterErr.gstNoErr).map((key) => {
                return <span className="error-message">{vendorMasterErr.gstNoErr[key]}</span>
              })}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
            <Form.Label column sm="3">
              Pan No
            </Form.Label>
            <Col sm="9">
              <Form.Control id="txtVendorPanNo" name="vendorPanNo" value={vendorMasterData.vendorPanNo} onChange={handleFieldChange} maxLength={15} placeholder="PAN No" />
              {Object.keys(vendorMasterErr.panNoErr).map((key) => {
                return <span className="error-message">{vendorMasterErr.panNoErr[key]}</span>
              })}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
            <Form.Label column sm="3">
              Tin No
            </Form.Label>
            <Col sm="9">
              <Form.Control id="txtVendorTinNo" name="vendorTinNo" value={vendorMasterData.vendorTinNo} onChange={handleFieldChange} maxLength={15} placeholder="TIN No" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
            <Form.Label column sm="3">
              Website
            </Form.Label>
            <Col sm="9">
              <Form.Control id="txtVendorWebsite" name="vendorWebsite" value={vendorMasterData.vendorWebsite} onChange={handleFieldChange} maxLength={30} placeholder="Website" />
              {Object.keys(vendorMasterErr.websiteErr).map((key) => {
                return <span className="error-message">{vendorMasterErr.websiteErr[key]}</span>
              })}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
            <Form.Label column sm="3">
              Rating
            </Form.Label>
            <Col sm="9">
              <Form.Control id="txtVendorRating" name="vendorRating" value={vendorMasterData.vendorRating} onChange={handleFieldChange} maxLength={1} placeholder="Rating" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
            <Form.Label column sm="3">
              Status
            </Form.Label>
            <Col sm="9">
              <Form.Select id="txtStatus" name="status" value={vendorMasterData.status} onChange={handleFieldChange} >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </Form.Select>
            </Col>
          </Form.Group>
        </Col>
      </Row>
    </Form >
  )
}

export default AddVendorMasterDetail;