import { collectionCentreDetailsAction, formChangedAction } from 'actions';
import React, { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

export const AddCollectionCentre = () => {
    const [formHasError, setFormError] = useState(false);
    const dispatch = useDispatch();
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);

    const resetCollectionCentreDetailsData = () => {
        dispatch(collectionCentreDetailsAction({
            "encryptedCompanyCode": '',
            "collectionCentreCode": '',
            "collectionCentreName": '',
            "collectionCentreShortName": '',
            "countryCode": '',
            "countryName": '',
            "stateCode": '',
            "stateName": '',
            "address": '',
            "distributionCentreCode": '',
            "collectionCentreType": '',
            "status": 'Active'
        }))
    }

    const collectionCentreDetailsReducer = useSelector((state) => state.rootReducer.collectionCentreDetailsReducer)
    var collectionCentreData = collectionCentreDetailsReducer.collectionCentreDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const distributionCentreListReducer = useSelector((state) => state.rootReducer.distributionCentreListReducer)
    const distributionList = distributionCentreListReducer.distributionCentreList

    const collectionCentreDetailsErrorReducer = useSelector((state) => state.rootReducer.collectionCentreDetailsErrorReducer)
    const collectionCentreErr = collectionCentreDetailsErrorReducer.collectionCentreDetailsError

    useEffect(() => {
        getCountries();
    }, []);

    if (!collectionCentreDetailsReducer.collectionCentreDetails ||
        Object.keys(collectionCentreDetailsReducer.collectionCentreDetails).length <= 0) {
        resetCollectionCentreDetailsData();
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

    if (collectionCentreData.stateCode &&
        !$('#txtStateName').val()) {
        getStates(collectionCentreData.countryCode);
    }

    const handleFieldChange = e => {
        if (e.target.name == "countryCode") {
            dispatch(collectionCentreDetailsAction({
                ...collectionCentreData,
                countryCode: e.target.value
            }))

            e.target.value && getStates(e.target.value)
        } else {
            dispatch(collectionCentreDetailsAction({
                ...collectionCentreData,
                [e.target.name]: e.target.value
            }))
        }

        if (collectionCentreData.encryptedCollectionCentreCode) {
            dispatch(formChangedAction({
                ...formChangedData,
                collectionCentreUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                collectionCentreAdd: true
            }))
        }
    }

    return (
        <>
            {
                collectionCentreData &&
                <Form noValidate validated={formHasError} className="details-form" id='AddCollectionCentreDetails'>
                    <Row>
                        <Col className="me-3 ms-3" md="7">
                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Collection Centre Name
                                </Form.Label>
                                <Col sm="2">
                                    <Form.Control id="txtCollectionCentreCode" name="collectionCentreCode" placeholder="Collection Centre Code" value={collectionCentreData.collectionCentreCode} disabled />
                                </Col>
                                <Col sm="7">
                                    <Form.Control id="txtCollectionCentreName" name="collectionCentreName" placeholder="Collection Centre Name" onChange={handleFieldChange} value={collectionCentreData.collectionCentreName} />
                                    {Object.keys(collectionCentreErr.collectionCentreNameErr).map((key) => {
                                        return <span className="error-message">{collectionCentreErr.collectionCentreNameErr[key]}</span>
                                    })}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Address
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control id="txtAddress" as='textarea' name="address" placeholder="Address" rows={3} onChange={handleFieldChange} value={collectionCentreData.address} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Country Name
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtCountry" name="countryCode" onChange={handleFieldChange} value={collectionCentreData.countryCode} >
                                        <option value="">Select Country</option>
                                        {countryList.map((option, index) => (
                                            <option key={index} value={option.value}>{option.key}</option>
                                        ))}
                                    </Form.Select>
                                    {Object.keys(collectionCentreErr.countryErr).map((key) => {
                                        return <span className="error-message">{collectionCentreErr.countryErr[key]}</span>
                                    })}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    State Name
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtStateName" name="stateCode" onChange={handleFieldChange} value={collectionCentreData.stateCode} >
                                        <option value="">Select State</option>
                                        {stateList.map((option, index) => (
                                            <option key={index} value={option.value}>{option.key}</option>
                                        ))}
                                    </Form.Select>
                                    {Object.keys(collectionCentreErr.stateErr).map((key) => {
                                        return <span className="error-message">{collectionCentreErr.stateErr[key]}</span>
                                    })}
                                </Col>
                            </Form.Group>
                        </Col>

                        <Col className="me-3 ms-3" md="4">
                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Short Name
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control id="txtCollectionCentreShortName" name="collectionCentreShortName" placeholder="Collection Centre Short Name" onChange={handleFieldChange} value={collectionCentreData.collectionCentreShortName} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Distribution Centre
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtDistributionCentre" name="distributionCentreCode" onChange={handleFieldChange} value={collectionCentreData.distributionCentreCode} >
                                        <option value=''>Select Distribution</option>
                                        {distributionList &&
                                            distributionList.map((option, index) => (
                                                <option key={index} value={option.value}>{option.key}</option>
                                            ))
                                        }
                                    </Form.Select>
                                    {Object.keys(collectionCentreErr.distributionCentreErr).map((key) => {
                                        return <span className="error-message">{collectionCentreErr.distributionCentreErr[key]}</span>
                                    })}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Collection Centre Type
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtCollectionCentreType" name="collectionCentreType" onChange={handleFieldChange} value={collectionCentreData.collectionCentreType} >
                                        <option value=''>Select</option>
                                        <option value="Owned">Owned</option>
                                        <option value="Franchise">Franchise</option>
                                    </Form.Select>
                                    {Object.keys(collectionCentreErr.collectionCentreTypeErr).map((key) => {
                                        return <span className="error-message">{collectionCentreErr.collectionCentreTypeErr[key]}</span>
                                    })}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    Status
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select id="txtStatus" name="status" onChange={handleFieldChange} value={collectionCentreData.status} >
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

export default AddCollectionCentre