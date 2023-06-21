import { distributionCentreDetailsAction, formChangedAction } from 'actions';
import React, { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import $ from "jquery";

export const AddDistributionCentre = () => {

    const [formHasError, setFormError] = useState(false);
    const dispatch = useDispatch();

    const resetDistributionDetailsData = () => {
        dispatch(distributionCentreDetailsAction({
            "encryptedCompanyCode": "",
            "distributionCentreCode": "",
            "distributionName": "",
            "distributionShortName": "",
            "countryCode": "",
            "countryName": "",
            "stateCode": "",
            "stateName": "",
            "address": "",
            "coldStorage": "",
            "processingUnit": "",
            "status": "Active",
        }))
    }

    const distributionCentreDetailsReducer = useSelector((state) => state.rootReducer.distributionCentreDetailsReducer)
    var distirbutionCentreData = distributionCentreDetailsReducer.distributionCentreDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const distributionCentreDetailsErrorReducer = useSelector((state) => state.rootReducer.distributionCentreDetailsErrorReducer)
    const distributionError = distributionCentreDetailsErrorReducer.distributionCentreDetailsError;

    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);

    useEffect(() => {
        getCountries();
    }, []);

    if (!distributionCentreDetailsReducer.distributionCentreDetails ||
        Object.keys(distributionCentreDetailsReducer.distributionCentreDetails).length <= 0) {
        resetDistributionDetailsData();
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

    if (distirbutionCentreData.stateCode &&
        !$('#txtStateName').val()) {
        getStates(distirbutionCentreData.countryCode);
    }

    const handleFieldChange = e => {
        if (e.target.name == "countryCode") {
            dispatch(distributionCentreDetailsAction({
                ...distirbutionCentreData,
                countryCode: e.target.value
            }))

            e.target.value && getStates(e.target.value);
        } else {
            dispatch(distributionCentreDetailsAction({
                ...distirbutionCentreData,
                [e.target.name]: e.target.value
            }))
        }

        if (distirbutionCentreData.encryptedDistributionCentreCode) {
            dispatch(formChangedAction({
                ...formChangedData,
                distirbutionCentreUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                distirbutionCentreAdd: true
            }))
        }
    }

    return (
        <>
            {
                distirbutionCentreData &&

                <Form noValidate validated={formHasError} className="details-form" id='AddDistributionDetails'>
                    <Row>
                        <Col className="me-3 ms-3" md="7">
                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Distribution Name
                                </Form.Label>
                                <Col sm="2">
                                    <Form.Control id="txtDistributionCentreCode" name="distributionCentreCode" placeholder="Code" value={distirbutionCentreData.distributionCentreCode} disabled />
                                </Col>
                                <Col sm="7">
                                    <Form.Control id="txtDistributionCentreName" name="distributionName" maxLength={50} onChange={handleFieldChange} value={distirbutionCentreData.distributionName} placeholder="Distribution Centre Name" />
                                    {Object.keys(distributionError.distributionNameErr).map((key) => {
                                        return <span className="error-message">{distributionError.distributionNameErr[key]}</span>
                                    })}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Address
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control id="txtAddress" as='textarea' name="address" maxLength={250} onChange={handleFieldChange} value={distirbutionCentreData.address} placeholder="Distribution Address" rows="4" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Country
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtCountry" name="countryCode" value={distirbutionCentreData.countryCode} onChange={handleFieldChange} required>
                                        <option value=''>Select Country</option>
                                        {countryList.map((option, index) => (
                                            <option key={index} value={option.value}>{option.key}</option>
                                        ))}
                                    </Form.Select>
                                    {Object.keys(distributionError.countryErr).map((key) => {
                                        return <span className="error-message">{distributionError.countryErr[key]}</span>
                                    })}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    State
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtStateName" name="stateCode" onChange={handleFieldChange} value={distirbutionCentreData.stateCode} >
                                        <option value="">Select State</option>
                                        {stateList.map((option, index) => (
                                            <option key={index} value={option.value}>{option.key}</option>
                                        ))}
                                    </Form.Select>
                                    {Object.keys(distributionError.stateErr).map((key) => {
                                        return <span className="error-message">{distributionError.stateErr[key]}</span>
                                    })}
                                </Col>
                            </Form.Group>
                        </Col>

                        <Col className="me-3 ms-3" md="4">
                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Short Name
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control id="txtDistributionCentreShortName" name="distributionShortName" maxLength={20} onChange={handleFieldChange} value={distirbutionCentreData.distributionShortName} placeholder="Short Name" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Cold Storage
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtColdStorage" name="coldStorage" onChange={handleFieldChange} value={distirbutionCentreData.coldStorage} >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Processing Unit
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtProcessingUnit" name="processingUnit" onChange={handleFieldChange} value={distirbutionCentreData.processingUnit} >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Status
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtStatus" name="status" onChange={handleFieldChange} value={distirbutionCentreData.status} >
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

export default AddDistributionCentre