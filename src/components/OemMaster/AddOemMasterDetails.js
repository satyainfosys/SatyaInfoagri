import { formChangedAction, oemMasterDetailsAction } from 'actions';
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import $ from "jquery";

const AddOemMasterDetails = () => {

    const dispatch = useDispatch();
    const [formHasError, setFormError] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);

    const resetOemMasterDetailsData = () => {
        dispatch(oemMasterDetailsAction({
            "encryptedOemMasterCode": "",
            "oemMasterCode": "",
            "oemName": "",
            "oemShortName": "",
            "countryCode": "",
            "countryName": "",
            "stateCode": "",
            "stateName": "",
            "oemAddress": "",
            "oemPincode": "",
            "oemEmail": "",
            "oemContactPerson": "",
            "oemContactMob": "",
            "oemContactLandline": "",
            "oemWebsite": "",
            "status": "Active"
        }))
    }

    const oemMasterDetailsReducer = useSelector((state) => state.rootReducer.oemMasterDetailsReducer)
    var oemMasterData = oemMasterDetailsReducer.oemMasterDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const oemMasterDetailsErrorReducer = useSelector((state) => state.rootReducer.oemMasterDetailsErrorReducer)
    const oemMasterErr = oemMasterDetailsErrorReducer.oemMasterDetailsError;

    useEffect(() => {
        getCountries();
    }, []);

    if (!oemMasterDetailsReducer.oemMasterDetails ||
        Object.keys(oemMasterDetailsReducer.oemMasterDetails).length <= 0) {
        resetOemMasterDetailsData();
    }

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

    if (oemMasterData.stateCode &&
        !$('#txtStateName').val()) {
        getStates(oemMasterData.countryCode);
    }

    const handleFieldChange = e => {
        if (e.target.name == "countryCode") {
            dispatch(oemMasterDetailsAction({
                ...oemMasterData,
                countryCode: e.target.value,
                stateCode: null
            }))
            setStateList([]);

            e.target.value && getStates(e.target.value);
        } else {
            dispatch(oemMasterDetailsAction({
                ...oemMasterData,
                [e.target.name]: e.target.value
            }))
        }

        if (oemMasterData.encryptedOemMasterCode) {
            dispatch(formChangedAction({
                ...formChangedData,
                oemMasterDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                oemMasterDetailAdd: true
            }))
        }
    }

    return (
        <>
            {
                oemMasterData &&
                <Form noValidate validated={formHasError} className="details-form" id='AddOemMasterDetails'>
                    <Row>
                        <Col className="me-3 ms-3" md="7">
                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    OEM Name<span className="text-danger">*</span>
                                </Form.Label>
                                <Col sm="2">
                                    <Form.Control id="txtOemMasterCode" name="oemMasterCode" placeholder="Code" value={oemMasterData.oemMasterCode} disabled />
                                </Col>
                                <Col sm="7">
                                    <Form.Control id="txtOemName" name="oemName" maxLength={60} value={oemMasterData.oemName} onChange={handleFieldChange} placeholder="OEM Name" required />
                                    {Object.keys(oemMasterErr.oemNameErr).map((key) => {
                                        return <span className="error-message">{oemMasterErr.oemNameErr[key]}</span>
                                    })}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Short Name
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control id="txtOemShortName" name="oemShortName" maxLength={15} value={oemMasterData.oemShortName} onChange={handleFieldChange} placeholder="Short Name" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Address<span className="text-danger">*</span>
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control id="txtAddress" as='textarea' name="oemAddress" maxLength={100} value={oemMasterData.oemAddress} onChange={handleFieldChange} placeholder="OEM Address" rows="4" required />
                                    {Object.keys(oemMasterErr.oemAddressErr).map((key) => {
                                        return <span className="error-message">{oemMasterErr.oemAddressErr[key]}</span>
                                    })}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Pin Code
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control id="txtPinCode" name="oemPincode" maxLength={10} value={oemMasterData.oemPincode}
                                        onChange={handleFieldChange} placeholder="Pin Code"
                                        onKeyPress={(e) => {
                                            const regex = /[0-9]|\./;
                                            const key = String.fromCharCode(e.charCode);
                                            if (!regex.test(key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Country<span className="text-danger">*</span>
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtCountry" name="countryCode" value={oemMasterData.countryCode} onChange={handleFieldChange} required>
                                        <option value=''>Select Country</option>
                                        {countryList.map((option, index) => (
                                            <option key={index} value={option.value}>{option.key}</option>
                                        ))}
                                    </Form.Select>
                                    {Object.keys(oemMasterErr.countryCodeErr).map((key) => {
                                        return <span className="error-message">{oemMasterErr.countryCodeErr[key]}</span>
                                    })}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    State<span className="text-danger">*</span>
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtStateName" name="stateCode" value={oemMasterData.stateCode} onChange={handleFieldChange} >
                                        <option value="">Select State</option>
                                        {stateList.map((option, index) => (
                                            <option key={index} value={option.value}>{option.key}</option>
                                        ))}
                                    </Form.Select>
                                    {Object.keys(oemMasterErr.stateCodeErr).map((key) => {
                                        return <span className="error-message">{oemMasterErr.stateCodeErr[key]}</span>
                                    })}
                                </Col>
                            </Form.Group>
                        </Col>

                        <Col className="me-3 ms-3" md="4">
                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Contact Person
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control id="txtContactPerson" name="oemContactPerson" maxLength={25} value={oemMasterData.oemContactPerson} onChange={handleFieldChange} placeholder="Contact Person" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Email
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control id="txtEmail" name="oemEmail" maxLength={50} value={oemMasterData.oemEmail} onChange={handleFieldChange} placeholder="Email" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Mobile No
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control id="txtMobileNo" name="oemContactMob" maxLength={10} value={oemMasterData.oemContactMob} onChange={handleFieldChange} placeholder="Mobile No" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Landline No
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control id="txtLandlineNo" name="oemContactLandline" maxLength={45} value={oemMasterData.oemContactLandline} onChange={handleFieldChange} placeholder="Landline No" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Website
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control id="txtWebsite" name="oemWebsite" maxLength={20} value={oemMasterData.oemWebsite} onChange={handleFieldChange} placeholder="Website" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Status
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtStatus" name="status" value={oemMasterData.status} onChange={handleFieldChange} >
                                        <option value="Active">Active</option>
                                        <option value="Suspended">Suspended</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            }
        </>
    )
}

export default AddOemMasterDetails;