import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { useDispatch, useSelector } from 'react-redux';
import { farmerDetailsAction } from 'actions';
import axios from 'axios';
import Moment from "moment";

const AddFarmer = () => {

    const dispatch = useDispatch();

    const resetFarmerData = () => {
        dispatch(farmerDetailsAction({
            "encryptedCompanyCode": "",
            "firstName": "",
            "middleName": "",
            "lastName": "",
            "farmerDOB": "",
            "farmerGender": "",
            "fatherName": "",
            "approvalStatus": "",
            "address": "",
            "educationalStatus": "",
            "companyTinNo": "",
            "maritalStatus": "",
            "socialCategory": "",
            "countryName": "",
            "encryptedCountryCode": "",
            "stateName": "",
            "encryptedStateCode": "",
            "districtName": "",
            "encryptedDistrictCode": "",
            "tehsilName": "",
            "encryptedTehsilCode": "",
            "blockName": "",
            "encryptedBlockCode": "",
            "postOfficeName": "",
            "encryptedPostOfficeCode": "",
            "villageName": "",
            "encryptedVillageCode": "",
            "totalLand": "",
            "figName": "",
            "encryptedFigCode": "",
            "collectionCentre": "",
            "encryptedCollectionCentreCode": "",
            "distributionCentre": "",
            "encryptedDistributionCentreCode": "",
            "status": "Active"
        }))
    }

    const farmerDetailsReducer = useSelector((state) => state.rootReducer.farmerDetailsReducer)
    var farmerData = farmerDetailsReducer.farmerDetails;

    if (!farmerDetailsReducer.farmerDetails ||
        farmerDetailsReducer.farmerDetails.length <= 0) {
        resetFarmerData();
    }

    const farmerDetailsErrorReducer = useSelector((state) => state.rootReducer.farmerDetailsErrorReducer)
    const farmerError = farmerDetailsErrorReducer.farmerDetailsError;

    const [formHasError, setFormError] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [tehsilList, setTehsilList] = useState([])
    const [blockList, setBlockList] = useState([]);
    const [postOfficeList, setPostOfficeList] = useState([]);
    const [villageList, setVillageList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getCountries();
        getCompany();
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
                                value: country.encryptedCountryCode
                            });
                        });
                    setCountryList(countryData);
                } else {
                    setCountryList([]);
                }
            });
    }

    const getStates = async (EncryptedCountryCode) => {
        const stateRequest = {
            EncryptedCountryCode: EncryptedCountryCode
        }

        axios
            .post(process.env.REACT_APP_API_URL + '/state-list', stateRequest)
            .then(res => {

                let stateData = [];

                if (res.data.status == 200) {
                    if (res.data && res.data.data.length > 0) {
                        res.data.data.forEach(state => {
                            stateData.push({
                                key: state.stateName,
                                value: state.encryptedStateCode
                            });
                        });
                    }
                    setStateList(stateData);
                } else {
                    setStateList([]);
                }

            });
    }

    const getDistrict = async (EncryptedStateCode) => {
        const districtRequest = {
            EncryptedCountryCode: farmerData.encryptedCountryCode,
            EncryptedStateCode: EncryptedStateCode
        }
        axios
            .post(process.env.REACT_APP_API_URL + '/district-list', districtRequest)
            .then(res => {

                let districtData = [];

                if (res.data.status == 200) {
                    if (res.data && res.data.data.length > 0) {
                        res.data.data.forEach(district => {
                            districtData.push({
                                key: district.districtName,
                                value: district.encryptedDistrictCode
                            });
                        });
                    }
                    setDistrictList(districtData);
                } else {
                    setDistrictList([]);
                }

            });
    }

    const getTehsil = async (EncryptedDistrictCode) => {
        const teshilRequest = {
            EncryptedCountryCode: farmerData.encryptedCountryCode,
            EncryptedStateCode: farmerData.encryptedStateCode,
            EncryptedDistrictCode: EncryptedDistrictCode
        }
        axios
            .post(process.env.REACT_APP_API_URL + '/tehsil-list', teshilRequest)
            .then(res => {

                let tehsilData = [];

                if (res.data.status == 200) {
                    if (res.data && res.data.data.length > 0) {
                        res.data.data.forEach(tehsil => {
                            tehsilData.push({
                                key: tehsil.tehsilName,
                                value: tehsil.encryptedTehsilCode
                            });
                        });
                    }
                }
                setTehsilList(tehsilData);
            });
    }

    const getBlock = async (EncryptedTehsilCode) => {
        const blockRequest = {
            EncryptedCountryCode: farmerData.encryptedCountryCode,
            EncryptedStateCode: farmerData.encryptedStateCode,
            EncryptedDistrictCode: farmerData.encryptedDistrictCode,
            EncryptedTehsilCode: EncryptedTehsilCode
        }

        axios
            .post(process.env.REACT_APP_API_URL + '/block-list', blockRequest)
            .then(res => {

                let blockData = [];

                if (res.data.status == 200) {
                    if (res.data && res.data.data.length > 0) {
                        res.data.data.forEach(block => {
                            blockData.push({
                                key: block.blockName,
                                value: block.encryptedBlockCode
                            });
                        });
                    }
                    setBlockList(blockData);
                }
            });
    }

    const getPostOffice = async (EncryptedBlockCode) => {
        const postOfficeRequest = {
            EncryptedCountryCode: farmerData.encryptedCountryCode,
            EncryptedStateCode: farmerData.encryptedStateCode,
            EncryptedDistrictCode: farmerData.encryptedDistrictCode,
            EncryptedTehsilCode: farmerData.encryptedTehsilCode,
            EncryptedBlockCode: EncryptedBlockCode
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/post-office-list', postOfficeRequest)
        let postOfficeData = [];

        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(postOffice => {
                    postOfficeData.push({
                        key: postOffice.postOfficeName,
                        value: postOffice.encryptedPostOfficeCode
                    });
                });
            }
            setPostOfficeList(postOfficeData);
        }
    }

    const getVillage = async (EncryptedPostOfficeCode) => {
        let villageData = [];
        const villageRequest = {
            EncryptedCountryCode: farmerData.encryptedCountryCode,
            EncryptedStateCode: farmerData.encryptedStateCode,
            EncryptedDistrictCode: farmerData.encryptedDistrictCode,
            EncryptedTehsilCode: farmerData.encryptedTehsilCode,
            EncryptedBlockCode: farmerData.encryptedBlockCode,
            EncryptedPostOfficeCode: EncryptedPostOfficeCode
        }

        let villageResponse = await axios.post(process.env.REACT_APP_API_URL + '/village-list', villageRequest);

        if (villageResponse.data.status == 200) {
            if (villageResponse.data && villageResponse.data.data.length > 0) {
                villageResponse.data.data.forEach(village => {
                    villageData.push({
                        key: village.villageName,
                        value: village.encryptedVillageCode
                    })
                })
            }
            setVillageList(villageData);
        }

    }

    const getCompany = async () => {
        let companyData = [];
        const companyRequest = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
        }

        let companyResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-client-companies', companyRequest, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });

        if (companyResponse.data.status == 200) {
            if (companyResponse.data && companyResponse.data.data.length > 0) {
                companyResponse.data.data.forEach(company => {
                    companyData.push({
                        key: company.companyName,
                        value: company.encryptedCompanyCode
                    })
                })
            }
            setCompanyList(companyData)
        }

    }

    const handleFieldChange = e => {
        dispatch(farmerDetailsAction({
            ...farmerData,
            [e.target.name]: e.target.value
        }));

        if (e.target.name == "encryptedCountryCode") {
            if (e.target.value == '') {
                setStateList([]);
                setDistrictList([]);
            }
            else
                getStates(e.target.value);
        }

        if (e.target.name == "encryptedStateCode") {
            if (e.target.value == '')
                setDistrictList([]);
            else
                getDistrict(e.target.value);
        }

        if (e.target.name == "encryptedDistrictCode") {
            if (e.target.value == '')
                setTehsilList([]);
            else
                getTehsil(e.target.value)
        }

        if (e.target.name == "encryptedTehsilCode") {
            if (e.target.value == '')
                setBlockList([]);
            else
                getBlock(e.target.value);
        }

        if (e.target.name == "encryptedBlockCode") {
            if (e.target.value == '')
                setPostOfficeList([]);
            else
                getPostOffice(e.target.value);
        }

        if (e.target.name == "encryptedPostOfficeCode") {
            if (e.target.value == '')
                setVillageList([]);
            else
                getVillage(e.target.value);
        }

        if (e.target.name == 'farmerPic') {
            dispatch(farmerDetailsAction({
                ...farmerData,
                farmerPic: e.target.files[0],
                farmerPicURL: URL.createObjectURL(e.target.files[0])
            }));
            $("#imgCompanyLogo").show();
        }
    };

    return (
        <>
            {isLoading ? (
                <Spinner
                    className="position-absolute start-50 loader-color"
                    animation="border"
                />
            ) : null}

            {farmerData &&

                <Form noValidate validated={formHasError} className="details-form" onSubmit={e => { handleSubmit(e) }} id='AddFarmersDetailForm'>
                    <Row className="g-3 mb-3">
                        <FalconComponentCard>
                            <FalconComponentCard.Body language="jsx">
                                <Row>
                                    <Col sm={6} lg={4}>
                                        <Form.Label>Company</Form.Label>{companyList.length > 1 ?
                                            <>
                                                <Form.Select id="txtCompany" name="encryptedCompanyCode" onChange={handleFieldChange}>
                                                    <option value=''>Select company</option>
                                                    {companyList.map((option, index) => (
                                                        <option key={index} value={option.value}>{option.key}</option>
                                                    ))}
                                                </Form.Select>
                                            </> :
                                            <>
                                                <Form.Select id="txtCompany" name="encryptedCompanyCode" onChange={handleFieldChange} disabled>                                                    
                                                    {companyList.map((option, index) => (
                                                        <option key={index} value={option.value}>{option.key}</option>
                                                    ))}
                                                </Form.Select>
                                            </>}

                                    </Col>
                                </Row>
                            </FalconComponentCard.Body>
                        </FalconComponentCard>
                    </Row>
                    <Row className="g-3 mb-3">
                        <Col sm={4} lg={3}>
                            <FalconComponentCard>
                                <FalconComponentCard.Header title="Farmer Information" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="me-3 ms-3">
                                            <Row className="mb-3">
                                                <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                    <Form.Label column sm={4}>
                                                        Farmer Code
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control id="txtFarmerCode" name="farmerCode" placeholder="Farmer Code" value={farmerData.farmerCode} disabled />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                    <Form.Label column sm={4}>
                                                        First Name
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control id="txtFirstName" name="firstName" className="mb-1" maxLength={30} onChange={handleFieldChange} value={farmerData.firstName} placeholder="First Name" />
                                                        {Object.keys(farmerError.firstNameErr).map((key) => {
                                                            return <span className="error-message">{farmerError.firstNameErr[key]}</span>
                                                        })}
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                    <Form.Label column sm={4}>
                                                        Middle Name
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control id="txtMiddleName" name="middleName" className="mb-1" maxLength={30} onChange={handleFieldChange} value={farmerData.middleName} placeholder="Middle Name" />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                    <Form.Label column sm={4}>
                                                        Last Name
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control id="txtLastName" name="lastName" className="mb-1" maxLength={30} onChange={handleFieldChange} value={farmerData.lastName} placeholder="Last Name" />
                                                        {Object.keys(farmerError.lastNameErr).map((key) => {
                                                            return <span className="error-message">{farmerError.lastNameErr[key]}</span>
                                                        })}
                                                    </Col>
                                                </Form.Group>
                                            </Row>
                                        </Col>
                                    </Row>
                                </FalconComponentCard.Body>
                            </FalconComponentCard>
                        </Col>

                        <Col sm={4} lg={3}>
                            <FalconComponentCard>
                                <FalconComponentCard.Header title="Information" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="me-3 ms-3">
                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Farmer DOB
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control type='date' id="dtFarmerDOB" name="farmerDOB" value={farmerData.farmerDOB ? Moment(farmerData.farmerDOB).format("YYYY-MM-DD") : ""} onChange={handleFieldChange} />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Farmer Gender
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtGender" name="farmerGender" onChange={handleFieldChange} value={farmerData.farmerGender}>
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Father Name
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtFatherName" name="fatherName" maxLength={45} onChange={handleFieldChange} value={farmerData.fatherName} className="mb-1" placeholder="Father Name" />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </FalconComponentCard.Body>
                            </FalconComponentCard>
                        </Col>

                        <Col sm={4} lg={3}>
                            <FalconComponentCard>
                                <FalconComponentCard.Header title="Status" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="me-3 ms-3">
                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Approval Status
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtApprovalStatus" name="approvalStatus" onChange={handleFieldChange} value={farmerData.approvalStatus}>
                                                        <option value="Approved">Approved</option>
                                                        <option value="Draft">Draft</option>
                                                        <option value="Send for Verification">Send for Verification</option>
                                                        <option value="Suspended">Suspended</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Active Status
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtStatus" name="status" onChange={handleFieldChange} value={farmerData.status}>
                                                        <option value="Active">Active</option>
                                                        <option value="Suspended">Suspended</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Address
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control as="textarea" id='txtAddress' maxLength={50} name='address' onChange={handleFieldChange} value={farmerData.address} />
                                                    {Object.keys(farmerError.addressErr).map((key) => {
                                                        return <span className="error-message">{farmerError.addressErr[key]}</span>
                                                    })}
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </FalconComponentCard.Body>
                            </FalconComponentCard>
                        </Col>

                        <Col sm={4} lg={3}>
                            <FalconComponentCard>
                                <FalconComponentCard.Header title="Photo" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="me-3 ms-3">
                                            <Row className="mb-3">
                                                {
                                                    farmerData && farmerData.farmerPicURL ? (
                                                        <img src={farmerData.farmerPicURL} alt='Farmer'></img>
                                                    ) : null
                                                }
                                                <Form.Control type="file" id='logoFile' name='farmerPic' onChange={handleFieldChange} />
                                            </Row>
                                        </Col>
                                    </Row>
                                </FalconComponentCard.Body>
                            </FalconComponentCard>
                        </Col>
                    </Row>

                    <Row className="g-3 mb-3">
                        <FalconComponentCard>
                            <FalconComponentCard.Header title="Other Information" light={false} />
                            <FalconComponentCard.Body language="jsx">
                                <Row>
                                    <Col sm={6} lg={4}>
                                        <Form.Group as={Row} className="mb-2">
                                            <Form.Label column sm={4}>
                                                Educational Status
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Select id="txtEducationalStatus" name='educationalStatus' onChange={handleFieldChange} value={farmerData.educationalStatus}>
                                                    <option value=''>Select Education</option>
                                                    <option value='Primary School'>Primary School</option>
                                                    <option value='High School'>High School</option>
                                                    <option value='Inter'>Inter</option>
                                                    <option value='Graduate'>Graduate</option>
                                                    <option value='Post Graduate'>Post Graduate</option>
                                                    <option value='Illiterate'>Illiterate</option>
                                                    <option value='Doctrate'>Doctrate</option>
                                                </Form.Select>
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6} lg={4}>
                                        <Form.Group as={Row} className="mb-2">
                                            <Form.Label column sm={4}>
                                                Marital Status
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Select id="txtMaritalStatus" name="maritalStatus" onChange={handleFieldChange} value={farmerData.maritalStatus}>
                                                    <option value="">Select Marital Status</option>
                                                    <option value="Married">Married</option>
                                                    <option value="Unmarried">Unmarried</option>
                                                    <option value="Divorced">Divorced</option>
                                                </Form.Select>
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6} lg={4}>
                                        <Form.Group as={Row} className="mb-2">
                                            <Form.Label column sm={4}>
                                                Social Category
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Select id="txtSocialCategory" name="socialCategory" onChange={handleFieldChange} value={farmerData.socialCategory}>
                                                    <option value=''>Select Category</option>
                                                    <option value='SC'>SC</option>
                                                    <option value='ST'>ST</option>
                                                    <option value='OBC'>OBC</option>
                                                    <option value='General'>General</option>
                                                </Form.Select>
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                </Row>
                            </FalconComponentCard.Body>
                        </FalconComponentCard>
                    </Row>

                    <Row className="g-3 mb-3">
                        <Col sm={6} lg={4}>
                            <FalconComponentCard>
                                <FalconComponentCard.Header title="GEO Information" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="me-3 ms-3">
                                            <Row className="mb-3">
                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        Country Name
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtCountryName" name="encryptedCountryCode" onChange={handleFieldChange}>
                                                            <option value=''>Select country</option>
                                                            {countryList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        State Name
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtStateName" name="encryptedStateCode" onChange={handleFieldChange}>
                                                            <option value=''>Select state</option>
                                                            {stateList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        District Name
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtDistrictName" name="encryptedDistrictCode" onChange={handleFieldChange}>
                                                            <option value=''>Select district</option>
                                                            {districtList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        Tehsil Name
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtTehsilName" name="encryptedTehsilCode" onChange={handleFieldChange} >
                                                            <option value=''>Select tehsil</option>
                                                            {tehsilList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        Block Name
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtBlockName" name="encryptedBlockCode" onChange={handleFieldChange}>
                                                            <option value=''>Select block</option>
                                                            {blockList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        PostOffice Name
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtPostOfficeName" name="encryptedPostOfficeCode" onChange={handleFieldChange}>
                                                            <option value=''>Select PostOffice</option>
                                                            {postOfficeList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        Village Name
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtVillageName" name="encryptedVillageCode" onChange={handleFieldChange}>
                                                            <option value=''>Select Village</option>
                                                            {villageList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Col>
                                                </Form.Group>
                                            </Row>
                                        </Col>
                                    </Row>
                                </FalconComponentCard.Body>
                            </FalconComponentCard>
                        </Col>

                        <Col sm={6} lg={4}>
                            <FalconComponentCard>
                                <FalconComponentCard.Header title="Operational Information" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="me-3 ms-3">
                                            <Row className="mb-3">

                                                <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                    <Form.Label column sm={4}>
                                                        Total Land
                                                    </Form.Label>
                                                    <Col sm={4}>
                                                        <Form.Control id="txtTotalLand" name="totalLand" onChange={handleFieldChange} value={farmerData.totalLand} className="mb-1" placeholder="Total Land" />
                                                    </Col>
                                                    <Col sm={4}>
                                                        <Form.Control id="txtHectare" name="" className="mb-1" placeholder="Hectare" />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        FIG Name
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtFIGName" name="encryptedFigCode" onChange={handleFieldChange}>
                                                            <option value=''>Select FIG</option>
                                                        </Form.Select>
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        FPO
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control id="txtFPO" name="FPO" className="mb-1" placeholder="FPO" />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        FPC
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control id="txtFPC" name="FPC" className="mb-1" placeholder="FPC" />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        Collection Centre
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control id="txtCollectionCentre" name="collectionCentre" className="mb-1" placeholder="Collection Centre" onChange={handleFieldChange} />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        Distribution Centre
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control id="txtDistributionCentre" name="distributionCentre" className="mb-1" placeholder="Distribution Centre" onChange={handleFieldChange} />
                                                    </Col>
                                                </Form.Group>
                                            </Row>
                                        </Col>
                                    </Row>
                                </FalconComponentCard.Body>
                            </FalconComponentCard>
                        </Col>
                    </Row>
                </Form>
            }

        </>
    )
}

export default AddFarmer