import React, { useState, useEffect } from 'react';
import { Col, Form, Row, Spinner, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { companyDetailsAction, clientDataAction } from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import Moment from "moment";
import { toast } from 'react-toastify';

export const Maintenance = () => {

    const dispatch = useDispatch();

    const resetCompanyData = () => {
        dispatch(companyDetailsAction({
            "companyName": "",
            "companyShortName": "",
            "companyType": "",
            "address1": "",
            "address2": "",
            "address3": "",
            "companyRegDate": "",
            "companyRegNo": "",
            "companySalesTax": "",
            "companyTinNo": "",
            "companyPan": "",
            "companyGstNo": "",
            "companyLutNo": "",
            "companyExpImp": "",
            "companyLogo": "",
            "pinCode": "",
            "state": "",
            "country": "",
            "stateCode": "",
            "countryCode": "",
            "encryptedCompanyCode": "",
            "encryptedCountryCode": "",
            "encryptedStateCode": "",
            "state": "",
            "status": "Active"
        }))
    }

    const companyDetailsReducer = useSelector((state) => state.rootReducer.companyDetailsReducer)
    var companyData = companyDetailsReducer.companyDetails;

    const clientDataReducer = useSelector((state) => state.rootReducer.clientDataReducer)
    var clientCompanyData = clientDataReducer.clientData;

    if (!companyDetailsReducer.companyDetails ||
        companyDetailsReducer.companyDetails.length <= 0) {
        resetCompanyData();
    }

    const companyDetailsErrorReducer = useSelector((state) => state.rootReducer.companyDetailsErrorReducer)
    const companyError = companyDetailsErrorReducer.companyDetailsError;

    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    const getStates = async (countryCode) => {
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
                setStateList(stateData);
            });
    }

    if (companyData.stateCode &&
        !$('#txtState').val()) {
        getStates(companyData.countryCode)
    }

    if (companyData.status && $('#txtStatus').val()) {
        $('#txtStatus option:contains(' + companyData.status + ')').prop('selected', true);
    }

    if (companyData.companyType && $('#txtCompanyType').val()) {
        $('#txtCompanyType option:contains(' + companyData.companyType + ')').prop('selected', true);
    }

    const handleFieldChange = e => {
        dispatch(companyDetailsAction({
            ...companyData,
            [e.target.name]: e.target.value
        }));

        if (e.target.name == "countryCode") {
            if (e.target.value == '')
                setStateList([]);
            else
                getStates(e.target.value);
        }

        if (e.target.name == 'companyLogo') {
            dispatch(companyDetailsAction({
                ...companyData,
                companyLogo: e.target.files[0],
                companyLogoURL: URL.createObjectURL(e.target.files[0])
            }));
            $("#imgCompanyLogo").show();
        }
    };

    const sameAsClientCompanyDataChanged = () => {
        const request = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
        }
        if ($('#clientChkBox').is(":checked")) {
            if (clientCompanyData.encryptedClientCode) {
                setCompanyData(clientCompanyData)
            }
            else {
                setIsLoading(true);
                axios.post(process.env.REACT_APP_API_URL + '/get-client', request, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                })
                    .then(res => {
                        setIsLoading(false);
                        if (res.data.status == 200) {
                            dispatch(clientDataAction(res.data.data))
                            setCompanyData(res.data.data)
                        } else {
                            toast.error(res.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                        }
                    })
            }
        } else {
            dispatch(companyDetailsAction(undefined));
            $('#AddCompanyDetailsForm').get(0).reset();
        }
    }

    const setCompanyData = (clientCompanyData) => {
        const responseData = {
            encryptedClientCode: clientCompanyData.encryptedClientCode,
            companyName: clientCompanyData.customerName,
            address1: clientCompanyData.address1,
            address2: clientCompanyData.address2 ? clientCompanyData.address2 : '',
            address3: clientCompanyData.address3 ? clientCompanyData.address3 : '',
            companyGstNo: clientCompanyData.gstNumber,
            companyPan: clientCompanyData.panNumber,
            pinCode: clientCompanyData.pinCode ? clientCompanyData.pinCode : '',
            state: clientCompanyData.state,
            encryptedStateCode: clientCompanyData.encryptedStateCode,
            country: clientCompanyData.country,
            encryptedCountryCode: clientCompanyData.encryptedCountryCode,
            status: clientCompanyData.status
        }
        if (companyData.companyLogo && companyData.companyLogo.type) {
            var companyDetailData = Object.assign(responseData, companyData)
            dispatch(companyDetailsAction(companyDetailData))
        } else {
            dispatch(companyDetailsAction(responseData))
        }
    }

    const removeLogo = () => {
        $('#logoFile').val(null);
        dispatch(companyDetailsAction({
            ...companyData,
            companyLogo: "",
            companyLogoURL: "",
            isRemoved: true
        }))
        $('#btnSave').attr('disabled', false);
    }

    return (
        <>
            {isLoading ? (
                <Spinner
                    className="position-absolute start-50 loader-color"
                    animation="border"
                />
            ) : null}
            <div>
                <Row className="justify-content-between align-items-center" id='clientChkBoxRow'>
                    <Col xs="auto">
                        <Form.Check type="checkbox" id="clientChkBox" className="mb-2">
                            <Form.Check.Input
                                type="checkbox"
                                name="Same as client"
                                onChange={sameAsClientCompanyDataChanged}
                            />
                            <Form.Check.Label className="mb-0 text-700">
                                Same as client
                            </Form.Check.Label>
                        </Form.Check>
                    </Col>
                </Row>
            </div>

            {companyData &&

                <Form noValidate validated={formHasError} className="details-form" onSubmit={e => { handleSubmit(e) }} id='AddCompanyDetailsForm'>
                    <Row>
                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Company Name<span className="text-danger">*</span></Form.Label>
                                <Form.Control id="txtCompanyName" name="companyName" maxLength={50} value={companyData.companyName} onChange={handleFieldChange} placeholder="Company Name" required />
                                {Object.keys(companyError.companyNameErr).map((key) => {
                                    return <span className="error-message">{companyError.companyNameErr[key]}</span>
                                })}
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Company Address<span className="text-danger">*</span></Form.Label>
                                <Form.Control id="txtCompanyAddress" name="address1" maxLength={30} value={companyData.address1} onChange={handleFieldChange} className="mb-1" placeholder="Address 1" required />
                                {Object.keys(companyError.addressErr).map((key) => {
                                    return <span className="error-message">{companyError.addressErr[key]}</span>
                                })}
                                <Form.Control id="txtCompanyAddress2" name="address2" maxLength={30} value={companyData.address2} onChange={handleFieldChange} className="mb-1" placeholder="Address 2" />
                                <Form.Control id="txtCompanyAddress3" name="address3" maxLength={30} value={companyData.address3} onChange={handleFieldChange} className="mb-1" placeholder="Address 3" />
                                <Form.Control id="txtPincode" name="pinCode" maxLength={10} value={companyData.pinCode} onChange={handleFieldChange} placeholder="Pincode" />
                            </Row>
                            <Row className="mb-3">
                                <Form.Select id="txtCountry" name="countryCode" value={companyData.countryCode} onChange={handleFieldChange} required>
                                    <option value=''>Select country</option>
                                    {countryList.map((option, index) => (
                                        <option key={index} value={option.value}>{option.key}</option>
                                    ))}
                                </Form.Select>
                                {Object.keys(companyError.countryErr).map((key) => {
                                    return <span className="error-message">{companyError.countryErr[key]}</span>
                                })}
                            </Row>
                            <Row className="mb-3">
                                <Form.Select id="txtState" name="stateCode" value={companyData.stateCode} onChange={handleFieldChange} required>
                                    <option value=''>Select state</option>
                                    {stateList.map((option, index) => (
                                        <option key={index} value={option.value}>{option.key}</option>
                                    ))}
                                </Form.Select>
                                {Object.keys(companyError.stateErr).map((key) => {
                                    return <span className="error-message">{companyError.stateErr[key]}</span>
                                })}
                            </Row>
                        </Col>

                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Company Shortname</Form.Label>
                                <Form.Control id="txtCompanyShortName" name="companyShortName" maxLength={20} value={companyData.companyShortName} onChange={handleFieldChange} placeholder="Company Shortname" />
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Company Credentials</Form.Label>
                                <Form.Control id="txtPanNo" name="companyPan" maxLength={30} value={companyData.companyPan} onChange={handleFieldChange} placeholder="Company PAN No" />
                                {Object.keys(companyError.panNoErr).map((key) => {
                                    return <span className="error-message">{companyError.panNoErr[key]}</span>
                                })}
                                <Form.Control id="txtGstNo" name="companyGstNo" maxLength={30} value={companyData.companyGstNo} onChange={handleFieldChange} placeholder="Company GST No" />
                                {Object.keys(companyError.gstNoErr).map((key) => {
                                    return <span className="error-message">{companyError.gstNoErr[key]}</span>
                                })}
                                <Form.Control id="txtSalesTax" name="companySalesTax" maxLength={30} value={companyData.companySalesTax} onChange={handleFieldChange} placeholder="Company sales tax" />
                                <Form.Control id="txtTinNo" name="companyTinNo" maxLength={30} value={companyData.companyTinNo} onChange={handleFieldChange} placeholder="Company TIN no" />
                                <Form.Control id="txtLutNo" name="companyLutNo" maxLength={30} value={companyData.companyLutNo} onChange={handleFieldChange} placeholder="Company LUT no" />
                                <Form.Control id="txtExpImpNo" name="companyExpImp" maxLength={30} value={companyData.companyExpImp} onChange={handleFieldChange} placeholder="Company Exp-Imp no" />
                                <Form.Control id="txtRegNo" name="companyRegNo" maxLength={30} value={companyData.companyRegNo} onChange={handleFieldChange} placeholder="Company Registration no" />
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Company Regestration Date</Form.Label>
                                <Form.Control type='date' id="dtRegDate" name="companyRegDate" value={companyData.companyRegDate ? Moment(companyData.companyRegDate).format("YYYY-MM-DD") : ""} onChange={handleFieldChange} />
                                {Object.keys(companyError.regDateErr).map((key) => {
                                    return <span className="error-message">{companyError.regDateErr[key]}</span>
                                })}
                            </Row>

                        </Col>

                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Company Type<span className="text-danger">*</span></Form.Label>
                                <Form.Select id="txtCompanyType" name="companyType" value={companyData.companyType} onChange={handleFieldChange} required>
                                    <option value=''>Select company type</option>
                                    <option value="FPO">FPO</option>
                                    <option value="FPC">FPC</option>
                                    <option value="CTF">Contract Farming</option>
                                    <option value="COP">Cooperative</option>
                                    <option value="SOC">Society</option>
                                    <option value="AML">Agri Machinary leasing</option>
                                    <option value="PUB">Public Ltd</option>
                                    <option value="LTD">Limited</option>
                                    <option value="TRS">Trust</option>
                                    <option value="GEN">General</option>
                                </Form.Select>
                                {Object.keys(companyError.companyTypeErr).map((key) => {
                                    return <span className="error-message">{companyError.companyTypeErr[key]}</span>
                                })}
                            </Row>
                        </Col>
                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Company Logo</Form.Label>
                                {companyData && companyData.companyLogoURL ? (
                                    <img src={companyData.companyLogoURL} id='imgCompanyLogo' width="60px" height="100px" />
                                ) : null}
                                <InputGroup className="mb-1">
                                    <Form.Control type="file" id='logoFile' name='companyLogo' onChange={handleFieldChange} />
                                    {companyData && companyData.companyLogoURL ? (
                                        <InputGroup.Text>
                                            <i className="fa fa-trash"
                                                onClick={() => { removeLogo() }}
                                            />
                                        </InputGroup.Text>
                                    ) : null
                                    }
                                </InputGroup>
                                {Object.keys(companyError.imageTypeErr).map((key) => {
                                    return <span className="error-message">{companyError.imageTypeErr[key]}</span>
                                })}

                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select id="txtStatus" name="status" value={companyData.status} onChange={handleFieldChange}>
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                </Form.Select>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            }
        </>
    )
}

export default Maintenance;