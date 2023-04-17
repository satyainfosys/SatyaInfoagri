import React from 'react';
import { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { clientDetailsAction } from '../../actions/index';

export const ClientDetails = () => {

  const dispatch = useDispatch();

  const resetClientData = () => {
    dispatch(clientDetailsAction({
      "address1": "",
      "address2": "",
      "address3": "",
      "billCountryCode": "",
      "billStateCode": "",
      "billingAddress1": "",
      "billingAddress2": "",
      "billingAddress3": "",
      "billingCountry": "",
      "billingPinCode": "",
      "billingState": "",
      "contactNo": "",
      "contactPerson": "",
      "country": "",
      "state": "",
      "countryCode": "",
      "stateCode": "",
      "customerName": "",
      "encryptedBillCountryCode": "",
      "encryptedBillStateCode": "",
      "encryptedClientCode": "",
      "encryptedCountryCode": "",
      "encryptedStateCode": "",
      "fullAddress": "",
      "gstNumber": "",
      "noOfComapnies": 1,
      "noOfUsers": 1,
      "panNumber": "",
      "pinCode": "",
      "status": "Active",
      "role": ""
    }));
  }

  const clientDetailsReducer = useSelector((state) => state.rootReducer.clientDetailsReducer)
  var clientData = clientDetailsReducer.clientDetails;

  if (!clientDetailsReducer.clientDetails ||
    clientDetailsReducer.clientDetails.length <= 0) {
    resetClientData();
  }

  const clientDetailsErrorReducer = useSelector((state) => state.rootReducer.clientDetailsErrorReducer)
  const clientError = clientDetailsErrorReducer.clientDetailsError;

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [billingStateList, setBillingStateList] = useState([]);

  const [formHasError, setFormError] = useState(false);

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

  const getStates = async (countryCode, isBillingCountry) => {
    const userData = {
      CountryCode: countryCode
    }

    axios
      .post(process.env.REACT_APP_API_URL + '/state-list', userData)
      .then(res => {

        let stateData = [];

        if (res.data.status == 200) {
          if (res.data && res.data.data.length > 0) {
            res.data.data.forEach(state => {
              stateData.push({
                key: state.stateName,
                value: state.stateCode
              });
            });
          }
        }

        if (isBillingCountry)
          setBillingStateList(stateData);
        else
          setStateList(stateData);
      });
  }

  if (clientData.stateCode &&
    !$('#txtState').val()) {
    getStates(clientData.countryCode);
  }

  if (clientData.billStateCode &&
    !$('#txtBillingState').val()) {
    getStates(clientData.billCountryCode, true)
  }

  if (clientData.status && $('#txtStatus').val()) {
    $('#txtStatus option:contains(' + clientData.status + ')').prop('selected', true);
  }

  if (clientData.role && $('#txtRole').val()) {
    $('#txtRole option:contains(' + clientData.role + ')').prop('selected', true);
  }

  const handleFieldChange = e => {
    dispatch(clientDetailsAction({
      ...clientData,
      [e.target.name]: e.target.value
    }));

    if (e.target.name == "countryCode") {
      if (e.target.value == '')
        setStateList([]);
      else
        getStates(e.target.value);
    }

    if (e.target.name == "billCountryCode") {
      if (e.target.value == '')
        setBillingStateList([]);
      else
        getStates(e.target.value, true);
    }
  };

  return (
    <>
      {clientData &&

        <Form noValidate validated={formHasError} className="details-form" onSubmit={e => { handleSubmit(e) }} id='AddClientDetailsForm'>
          <Row>
            <Col className="me-3 ms-3">
              <Row className="mb-3">
                <Form.Label>Customer Name<span className="text-danger">*</span></Form.Label>
                <Form.Control id="txtCustomerName" name="customerName" maxLength={50} value={clientData.customerName} onChange={handleFieldChange} placeholder="Customer Name" required />
                {Object.keys(clientError.customerNameErr).map((key) => {
                  return <span className="error-message">{clientError.customerNameErr[key]}</span>
                })}
              </Row>
              <Row className="mb-3">
                <Form.Label>Customer Address<span className="text-danger">*</span></Form.Label>
                <Form.Control id="txtCustomerAddress" name="address1" maxLength={50} value={clientData.address1} onChange={handleFieldChange} className="mb-1" placeholder="Address" required />
                {Object.keys(clientError.clientAddressErr).map((key) => {
                  return <span className="error-message">{clientError.clientAddressErr[key]}</span>
                })}
                <Form.Control id="txtCustomerAddress2" name="address2" maxLength={50} value={clientData.address2} onChange={handleFieldChange} className="mb-1" placeholder="Address 2" />
                <Form.Control id="txtCustomerAddress3" name="address3" maxLength={50} value={clientData.address3} onChange={handleFieldChange} className="mb-1" placeholder="Address 3" />
              </Row>
              <Row className="mb-3">
                <Form.Label>Pincode</Form.Label>
                <Form.Control id="txtPincode" name="pinCode" maxLength={10} value={clientData.pinCode} onChange={handleFieldChange} placeholder="Pincode" />
              </Row>
              <Row className="mb-3">
                <Form.Label>Country<span className="text-danger">*</span></Form.Label>
                <Form.Select id="txtCountry" name="countryCode" value={clientData.countryCode} onChange={handleFieldChange} required>
                  <option value=''>Select country</option>
                  {countryList.map((option, index) => (
                    <option key={index} value={option.value}>{option.key}</option>
                  ))}
                </Form.Select>
                {Object.keys(clientError.countryErr).map((key) => {
                  return <span className="error-message">{clientError.countryErr[key]}</span>
                })}
              </Row>
              <Row className="mb-3">
                <Form.Label>State<span className="text-danger">*</span></Form.Label>
                <Form.Select id="txtState" name="stateCode" value={clientData.stateCode} onChange={handleFieldChange} required>
                  <option value=''>Select state</option>
                  {stateList.map((option, index) => (
                    <option key={index} value={option.value}>{option.key}</option>
                  ))}
                </Form.Select>
                {Object.keys(clientError.stateErr).map((key) => {
                  return <span className="error-message">{clientError.stateErr[key]}</span>
                })}
              </Row>
            </Col>

            <Col className="me-3 ms-3">
              <Row className="mb-3">
                <Form.Label>Billing Address<span className="text-danger">*</span></Form.Label>
                <Form.Control id="txtBillingAddress" name="billingAddress1" maxLength={50} value={clientData.billingAddress1} onChange={handleFieldChange} className="mb-1" placeholder="Billing Address" required />
                {Object.keys(clientError.billingAddressErr).map((key) => {
                  return <span className="error-message">{clientError.billingAddressErr[key]}</span>
                })}
                <Form.Control id="txtBillingAddress2" name="billingAddress2" maxLength={50} value={clientData.billingAddress2} onChange={handleFieldChange} className="mb-1" placeholder="Billing Address 2" />
                <Form.Control id="txtBillingAddress3" name="billingAddress3" maxLength={50} value={clientData.billingAddress3} onChange={handleFieldChange} className="mb-1" placeholder="Billing Address 3" />
              </Row>
              <Row className="mb-3">
                <Form.Label>Pincode</Form.Label>
                <Form.Control id="txtBillingPincode" name="billingPinCode" maxLength={10} value={clientData.billingPinCode} onChange={handleFieldChange} placeholder="Pincode" />
              </Row>
              <Row className="mb-3">
                <Form.Label>Country<span className="text-danger">*</span></Form.Label>
                <Form.Select id="txtBillingCountry" name="billCountryCode" value={clientData.billCountryCode} onChange={handleFieldChange} required>
                  <option value=''>Select country</option>
                  {countryList.map((option, index) => (
                    <option key={index} value={option.value}>{option.key}</option>
                  ))}
                </Form.Select>
                {Object.keys(clientError.billingCountryErr).map((key) => {
                  return <span className="error-message">{clientError.billingCountryErr[key]}</span>
                })}
              </Row>
              <Row className="mb-3">
                <Form.Label>State<span className="text-danger">*</span></Form.Label>
                <Form.Select id="txtBillingState" name="billStateCode" value={clientData.billStateCode} onChange={handleFieldChange} required>
                  <option value=''>Select state</option>
                  {billingStateList.map((option, index) => (
                    <option key={index} value={option.value}>{option.key}</option>
                  ))}
                </Form.Select>
                {Object.keys(clientError.billingStateErr).map((key) => {
                  return <span className="error-message">{clientError.billingStateErr[key]}</span>
                })}
              </Row>
            </Col>

            <Col className="me-3 ms-3">
              <Row className="mb-3">
                <Form.Label>PAN No.<span className="text-danger">*</span></Form.Label>
                <Form.Control id="txtPAN" name="panNumber" maxLength={20} value={clientData.panNumber} onChange={handleFieldChange} placeholder="PAN No." required />
                {Object.keys(clientError.panNoErr).map((key) => {
                  return <span className="error-message">{clientError.panNoErr[key]}</span>
                })}
              </Row>
              <Row className="mb-3">
                <Form.Label>GST No.<span className="text-danger">*</span></Form.Label>
                <Form.Control id="txtGST" name="gstNumber" maxLength={20} value={clientData.gstNumber} onChange={handleFieldChange} placeholder="GST No." required />
                {Object.keys(clientError.gstNoErr).map((key) => {
                  return <span className="error-message">{clientError.gstNoErr[key]}</span>
                })}
              </Row>
              <Row className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select id="txtRole" name="role" value={clientData.role} onChange={handleFieldChange}>
                  <option value="">Select Role</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Client">Client</option>
                </Form.Select>
                {Object.keys(clientError.roleErr).map((key) => {
                  return <span className="error-message">{clientError.roleErr[key]}</span>
                })}
              </Row>
              <Row className="mb-3">
                <Form.Label>Status<span className="text-danger">*</span></Form.Label>
                <Form.Select id="txtStatus" name="status" value={clientData.status} onChange={handleFieldChange}>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </Form.Select>
              </Row>
              <Row className="mb-3">
                <Form.Label>No. of Companies</Form.Label>
                <Form.Control type='number' min={1} id="numNoOfCompanies" max={9999} value={clientData.noOfComapnies} name="noOfComapnies" onChange={handleFieldChange} placeholder="No. of Companies" required />
                {Object.keys(clientError.noOfCompaniesErr).map((key) => {
                  return <span className="error-message">{clientError.noOfCompaniesErr[key]}</span>
                })}
              </Row>
              <Row className="mb-3">
                <Form.Label>No. of Users</Form.Label>
                <Form.Control type='number' min={1} id="numNoOfUsers" max={9999} value={clientData.noOfUsers} name="noOfUsers" onChange={handleFieldChange} placeholder="No. of Users" required />
                {Object.keys(clientError.noOfUsersErr).map((key) => {
                  return <span className="error-message">{clientError.noOfUsersErr[key]}</span>
                })}
              </Row>
            </Col>
          </Row>
        </Form>
      }
    </>
  )
}

export default ClientDetails;