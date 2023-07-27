import { oemMasterDetailsAction } from 'actions';
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
            "status": "Active"
        }))
    }

    const oemMasterDetailsReducer = useSelector((state) => state.rootReducer.oemMasterDetailsReducer)
    var oemMasterData = oemMasterDetailsReducer.oemMasterDetails;

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

    return (
        <>
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
                                <Form.Control id="txtOemName" name="oemName" maxLength={45} value={oemMasterData.oemName} placeholder="OEM Name" required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Address<span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control id="txtAddress" as='textarea' name="oemAddress" maxLength={100} value={oemMasterData.oemAddress} placeholder="OEM Address" rows="4" required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Country<span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm="9">
                                <Form.Select id="txtCountry" name="countryCode" value={oemMasterData.countryCode} required>
                                    <option value=''>Select Country</option>
                                    {countryList.map((option, index) => (
                                        <option key={index} value={option.value}>{option.key}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                State<span className="text-danger">*</span>
                            </Form.Label>
                            <Col sm="9">
                                <Form.Select id="txtStateName" name="stateCode" value={oemMasterData.stateCode} >
                                    <option value="">Select State</option>
                                    {stateList.map((option, index) => (
                                        <option key={index} value={option.value}>{option.key}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col className="me-3 ms-3" md="4">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Short Name
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control id="txtOemShortName" name="oemShortName" maxLength={15} value={oemMasterData.oemShortName} placeholder="Short Name" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Status
                            </Form.Label>
                            <Col sm="9">
                                <Form.Select id="txtStatus" name="status" value={oemMasterData.status} >
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default AddOemMasterDetails;