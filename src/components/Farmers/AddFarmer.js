import React, { useState, useEffect } from 'react';
import { Col, Form, Row, InputGroup } from 'react-bootstrap';
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

    const distributionCentreListReducer = useSelector((state) => state.rootReducer.distributionCentreListReducer)
    const distributionList = distributionCentreListReducer.distributionCentreList

    const [formHasError, setFormError] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [tehsilList, setTehsilList] = useState([])
    const [blockList, setBlockList] = useState([]);
    const [postOfficeList, setPostOfficeList] = useState([]);
    const [villageList, setVillageList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [collectionCentreList, setCollectionCentreList] = useState([]);
    const [figMasterList, setFigMasterList] = useState([]);

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
                if (res.data.status == 200) {
                    let stateData = [];
                    if (res.data && res.data.data.length > 0)
                        res.data.data.forEach(state => {
                            stateData.push({
                                key: state.stateName,
                                value: state.encryptedStateCode
                            });
                        });
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

                if (res.data.status == 200) {
                    let districtData = [];
                    if (res.data && res.data.data.length > 0)
                        res.data.data.forEach(district => {
                            districtData.push({
                                key: district.districtName,
                                value: district.encryptedDistrictCode
                            });
                        });
                    setDistrictList(districtData);
                } else {
                    setDistrictList([])
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
                if (res.data.status == 200) {
                    let tehsilData = [];
                    if (res.data && res.data.data.length > 0) {
                        res.data.data.forEach(tehsil => {
                            tehsilData.push({
                                key: tehsil.tehsilName,
                                value: tehsil.encryptedTehsilCode
                            });
                        });
                    }
                    setTehsilList(tehsilData);
                } else {
                    setTehsilList([]);
                }
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
                if (res.data.status == 200) {
                    let blockData = [];
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
        const villageRequest = {
            EncryptedCountryCode: farmerData.encryptedCountryCode,
            EncryptedStateCode: farmerData.encryptedStateCode,
            EncryptedDistrictCode: farmerData.encryptedDistrictCode,
            EncryptedTehsilCode: farmerData.encryptedTehsilCode,
            EncryptedBlockCode: farmerData.encryptedBlockCode,
            EncryptedPostOfficeCode: EncryptedPostOfficeCode
        }

        let villageResponse = await axios.post(process.env.REACT_APP_API_URL + '/village-list', villageRequest);
        let villageData = [];
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

    const getCollectionCentre = async (EncryptedDistributionCentreCode) => {
        const requestData = {
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
            EncryptedDistributionCode: EncryptedDistributionCentreCode
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-collection-centre-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        let collectionCentreData = [];
        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(collectionCentre => {
                    collectionCentreData.push({
                        key: collectionCentre.collectionCentreName,
                        value: collectionCentre.encryptedCollectionCentreCode
                    })
                })
            }
            setCollectionCentreList(collectionCentreData);
        }
    }

    const getFigMaster = async (encryptedCompanyCode) => {
        const request = {
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
            EncryptedCollectionCentreCode: encryptedCompanyCode
        }

        let figMasterResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-fig-master-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        let figMasterData = [];
        if (figMasterResponse.data.status == 200) {
            if (figMasterResponse.data && figMasterResponse.data.data.length > 0) {
                figMasterResponse.data.data.forEach(figMaster => {
                    figMasterData.push({
                        key: figMaster.figName,
                        value: figMaster.encryptedFigCode
                    })
                })
            }
            setFigMasterList(figMasterData)
        }
    }

    const handleFieldChange = (e) => {
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
        }

        if (e.target.name == 'encryptedDistributionCentreCode') {
            if (e.target.value == '') {
                setCollectionCentreList([]);
            }
            else {
                getCollectionCentre(e.target.value)
            }
        }

        if (e.target.name == 'encryptedCollectionCentreCode') {
            if (e.target.value == '')
                setFigMasterList([])
            else
                getFigMaster(e.target.value)
        }
    };

    const removeProfilePic = () => {
        $('#profilepic').val(null);
        dispatch(farmerDetailsAction({
            ...farmerData,
            farmerPic: "",
            farmerPicURL: "",
            removeProfilePhoto: true
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

            {farmerData &&

                <Form noValidate validated={formHasError} className="details-form" onSubmit={e => { handleSubmit(e) }} id='AddFarmersDetailForm'>
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
                                                        First Name<span className="text-danger">*</span>
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
                                                        Last Name<span className="text-danger">*</span>
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
                                                    Farmer DOB<span className="text-danger">*</span>
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control type='date' id="dtFarmerDOB" name="farmerDOB" value={farmerData.farmerDOB ? Moment(farmerData.farmerDOB).format("YYYY-MM-DD") : ""} onChange={handleFieldChange} />
                                                    {Object.keys(farmerError.farmerDobErr).map((key) => {
                                                        return <span className="error-message">{farmerError.farmerDobErr[key]}</span>
                                                    })}
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Farmer Gender<span className="text-danger">*</span>
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtGender" name="farmerGender" onChange={handleFieldChange} value={farmerData.farmerGender}>
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                    </Form.Select>
                                                    {Object.keys(farmerError.farmerGenderErr).map((key) => {
                                                        return <span className="error-message">{farmerError.farmerGenderErr[key]}</span>
                                                    })}
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Father Name<span className="text-danger">*</span>
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtFatherName" name="fatherName" maxLength={45} onChange={handleFieldChange} value={farmerData.fatherName} className="mb-1" placeholder="Father Name" />
                                                    {Object.keys(farmerError.farmerFatherNameErr).map((key) => {
                                                        return <span className="error-message">{farmerError.farmerFatherNameErr[key]}</span>
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
                                <FalconComponentCard.Header title="Status" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="me-3 ms-3">
                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Approval Status<span className="text-danger">*</span>
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtApprovalStatus" name="approvalStatus" onChange={handleFieldChange} value={farmerData.approvalStatus}>
                                                        <option value="Draft">Draft</option>
                                                        <option value="Approved">Approved</option>
                                                        <option value="Send for Verification">Send for Verification</option>
                                                        <option value="Suspended">Suspended</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Active Status<span className="text-danger">*</span>
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
                                                    Address<span className="text-danger">*</span>
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
                                                <InputGroup className="mb-1">
                                                    <Form.Control type="file" id='profilepic' name='farmerPic' onChange={handleFieldChange} />
                                                    {farmerData && farmerData.farmerPicURL ? (
                                                        <InputGroup.Text>
                                                            <i className="fa fa-trash"
                                                                onClick={() => { removeProfilePic() }}
                                                            />
                                                        </InputGroup.Text>
                                                    ) : null
                                                    }
                                                </InputGroup>
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
                                                Marital Status<span className="text-danger">*</span>
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Select id="txtMaritalStatus" name="maritalStatus" onChange={handleFieldChange} value={farmerData.maritalStatus}>
                                                    <option value="">Select Marital Status</option>
                                                    <option value="Married">Married</option>
                                                    <option value="Unmarried">Unmarried</option>
                                                    <option value="Divorced">Divorced</option>
                                                </Form.Select>
                                                {Object.keys(farmerError.maritalStatusErr).map((key) => {
                                                    return <span className="error-message">{farmerError.maritalStatusErr[key]}</span>
                                                })}
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6} lg={4}>
                                        <Form.Group as={Row} className="mb-2">
                                            <Form.Label column sm={4}>
                                                Social Category<span className="text-danger">*</span>
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Select id="txtSocialCategory" name="socialCategory" onChange={handleFieldChange} value={farmerData.socialCategory}>
                                                    <option value=''>Select Category</option>
                                                    <option value='SC'>SC</option>
                                                    <option value='ST'>ST</option>
                                                    <option value='OBC'>OBC</option>
                                                    <option value='General'>General</option>
                                                </Form.Select>
                                                {Object.keys(farmerError.socailCategoryErr).map((key) => {
                                                    return <span className="error-message">{farmerError.socailCategoryErr[key]}</span>
                                                })}
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
                                                        Country Name<span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtCountryName" name="encryptedCountryCode" defaultValue={farmerData.countryCode} onChange={handleFieldChange}>
                                                            <option value=''>Select country</option>
                                                            {countryList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                        {Object.keys(farmerError.countyrErr).map((key) => {
                                                            return <span className="error-message">{farmerError.countyrErr[key]}</span>
                                                        })}
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        State Name<span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtStateName" name="encryptedStateCode" defaultValue={farmerData.stateCode} onChange={handleFieldChange}>
                                                            <option value=''>Select state</option>
                                                            {stateList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                        {Object.keys(farmerError.stateErr).map((key) => {
                                                            return <span className="error-message">{farmerError.stateErr[key]}</span>
                                                        })}
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        District Name<span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtDistrictName" name="encryptedDistrictCode" defaultValue={farmerData.districtCode} onChange={handleFieldChange}>
                                                            <option value=''>Select district</option>
                                                            {districtList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                        {Object.keys(farmerError.districtErr).map((key) => {
                                                            return <span className="error-message">{farmerError.districtErr[key]}</span>
                                                        })}
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        Tehsil Name<span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtTehsilName" name="encryptedTehsilCode" defaultValue={farmerData.tehsilCode} onChange={handleFieldChange} >
                                                            <option value=''>Select tehsil</option>
                                                            {tehsilList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                        {Object.keys(farmerError.tehsilErr).map((key) => {
                                                            return <span className="error-message">{farmerError.tehsilErr[key]}</span>
                                                        })}
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        Block Name<span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtBlockName" name="encryptedBlockCode" defaultValue={farmerData.blockCode} onChange={handleFieldChange}>
                                                            <option value=''>Select block</option>
                                                            {blockList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                        {Object.keys(farmerError.blockErr).map((key) => {
                                                            return <span className="error-message">{farmerError.blockErr[key]}</span>
                                                        })}
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        PostOffice Name<span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtPostOfficeName" name="encryptedPostOfficeCode" defaultValue={farmerData.postOfficeCode} onChange={handleFieldChange}>
                                                            <option value=''>Select PostOffice</option>
                                                            {postOfficeList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                        {Object.keys(farmerError.postOfficeErr).map((key) => {
                                                            return <span className="error-message">{farmerError.postOfficeErr[key]}</span>
                                                        })}
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        Village Name<span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtVillageName" name="encryptedVillageCode" defaultValue={farmerData.villageCode} onChange={handleFieldChange}>
                                                            <option value=''>Select Village</option>
                                                            {villageList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))}
                                                        </Form.Select>
                                                        {Object.keys(farmerError.villageErr).map((key) => {
                                                            return <span className="error-message">{farmerError.villageErr[key]}</span>
                                                        })}
                                                    </Col>
                                                </Form.Group>
                                            </Row>
                                        </Col>
                                    </Row>
                                </FalconComponentCard.Body>
                            </FalconComponentCard>
                        </Col>

                        <Col sm={6} lg={5}>
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
                                                        <Form.Control id="txtTotalLand" name="totalLand" onChange={handleFieldChange} value={farmerData.totalLand} className="mb-1" placeholder="Total Land" disabled />
                                                    </Col>
                                                    <Col sm={4}>
                                                        <Form.Control id="txtHectare" name="" className="mb-1" placeholder="Hectare" value="HECTARE" disabled />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        FPC/FPO
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Control id="txtFPCFPO" name="FPC/FPO" className="mb-1" value={localStorage.getItem("CompanyName")} placeholder="FPC/FPO" disabled />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        Distribution Centre<span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtDistributionCentre" name="encryptedDistributionCentreCode" onChange={handleFieldChange}>
                                                            <option value=''>Select Distribution Centre</option>
                                                            {distributionList &&
                                                                distributionList.map((option, index) => (
                                                                    <option key={index} value={option.value}>{option.key}</option>
                                                                ))
                                                            }
                                                        </Form.Select>
                                                        {Object.keys(farmerError.ditributionErr).map((key) => {
                                                            return <span className="error-message">{farmerError.ditributionErr[key]}</span>
                                                        })}
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        Collection Centre<span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtCollectionCentre" name="encryptedCollectionCentreCode" onChange={handleFieldChange}>
                                                            <option value=''>Select Collection Centre</option>
                                                            {collectionCentreList &&
                                                                collectionCentreList.map((option, index) => (
                                                                    <option key={index} value={option.value}>{option.key}</option>
                                                                ))
                                                            }
                                                        </Form.Select>
                                                        {Object.keys(farmerError.collectionErr).map((key) => {
                                                            return <span className="error-message">{farmerError.collectionErr[key]}</span>
                                                        })}
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="mb-2">
                                                    <Form.Label column sm={4}>
                                                        FIG Name
                                                    </Form.Label>
                                                    <Col sm={8}>
                                                        <Form.Select id="txtFIGName" name="encryptedFigCode" onChange={handleFieldChange}>
                                                            <option value=''>Select FIG</option>
                                                            {figMasterList &&

                                                                figMasterList.map((option, index) => (
                                                                    <option key={index} value={option.value}>{option.key}</option>
                                                                ))
                                                            }
                                                        </Form.Select>
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