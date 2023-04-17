import React, { useState, useEffect, useRef } from 'react';
import { Col, Form, Row, InputGroup } from 'react-bootstrap';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { useDispatch, useSelector } from 'react-redux';
import { farmerDetailsAction } from 'actions';
import axios from 'axios';
import Moment from "moment";
import $ from "jquery";

const AddFarmer = () => {

    const dispatch = useDispatch();

    const resetFarmerData = () => {
        dispatch(farmerDetailsAction({
            "encryptedCompanyCode": "",
            "farmerCode": "",
            "firstName": "",
            "middleName": "",
            "lastName": "",
            "farmerDOB": "",
            "farmerGender": "",
            "fatherName": "",
            "approvalStatus": "",
            "address": "",
            "educationalStatus": "",
            "maritalStatus": "",
            "socialCategory": "",
            "countryName": "",
            "encryptedCountryCode": "",
            "countryCode": "",
            "stateName": "",
            "encryptedStateCode": "",
            "stateCode": "",
            "districtName": "",
            "encryptedDistrictCode": "",
            "districtCode": "",
            "tehsilName": "",
            "encryptedTehsilCode": "",
            "tehsilCode": "",
            "blockName": "",
            "encryptedBlockCode": "",
            "blockCode": "",
            "postOfficeName": "",
            "encryptedPostOfficeCode": "",
            "postOfficeCode": "",
            "villageName": "",
            "encryptedVillageCode": "",
            "villageCode": "",
            "totalLand": "",
            "figName": "",
            "encryptedFigCode": "",
            "figCode": "",
            "collectionCentre": "",
            "encryptedCollectionCentreCode": "",
            "collectionCentreCode": "",
            "distributionCentre": "",
            "encryptedDistributionCentreCode": "",
            "distributionCentreCode": "",
            "status": "Active"
        }))

        setStateList([]);
        setDistrictList([]);
        setTehsilList([]);
        setBlockList([]);
        setPostOfficeList([]);
        setVillageList([]);
        setCollectionCentreList([]);
        setFigMasterList([]);
    }

    const farmerDetailsReducer = useSelector((state) => state.rootReducer.farmerDetailsReducer)
    var farmerData = farmerDetailsReducer.farmerDetails;

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
                                value: country.countryCode
                            });
                        });
                    setCountryList(countryData);
                } else {
                    setCountryList([]);
                }
            });
    }

    const getStates = async (countryCode) => {
        const stateRequest = {
            CountryCode: countryCode
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
                                value: state.stateCode
                            });
                        });
                    setStateList(stateData);
                } else {
                    setStateList([]);
                }
            });
    }

    const getDistrict = async (stateCode) => {
        const districtRequest = {
            countryCode: farmerData.countryCode,
            stateCode: stateCode
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
                                value: district.districtCode
                            });
                        });
                    setDistrictList(districtData);
                } else {
                    setDistrictList([])
                }
            });
    }

    const getTehsil = async (districtCode) => {
        const teshilRequest = {
            CountryCode: farmerData.countryCode,
            StateCode: farmerData.stateCode,
            DistrictCode: districtCode
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
                                value: tehsil.tehsilCode
                            });
                        });
                    }
                    setTehsilList(tehsilData);
                } else {
                    setTehsilList([]);
                }
            });
    }

    const getBlock = async (tehsilCode) => {
        const blockRequest = {
            CountryCode: farmerData.countryCode,
            StateCode: farmerData.stateCode,
            DistrictCode: farmerData.districtCode,
            TehsilCode: tehsilCode
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
                                value: block.blockCode
                            });
                        });
                    }
                    setBlockList(blockData);
                }
            });
    }

    const getPostOffice = async (blockCode) => {
        const postOfficeRequest = {
            CountryCode: farmerData.countryCode,
            StateCode: farmerData.stateCode,
            DistrictCode: farmerData.districtCode,
            TehsilCode: farmerData.tehsilCode,
            BlockCode: blockCode
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/post-office-list', postOfficeRequest)
        let postOfficeData = [];

        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(postOffice => {
                    postOfficeData.push({
                        key: postOffice.postOfficeName,
                        value: postOffice.postOfficeCode
                    });
                });
            }
            setPostOfficeList(postOfficeData);
        }
    }

    const getVillage = async (postOfficeCode) => {
        const villageRequest = {
            CountryCode: farmerData.countryCode,
            StateCode: farmerData.stateCode,
            DistrictCode: farmerData.districtCode,
            TehsilCode: farmerData.tehsilCode,
            BlockCode: farmerData.blockCode,
            PostOfficeCode: postOfficeCode
        }

        let villageResponse = await axios.post(process.env.REACT_APP_API_URL + '/village-list', villageRequest);
        let villageData = [];
        if (villageResponse.data.status == 200) {
            if (villageResponse.data && villageResponse.data.data.length > 0) {
                villageResponse.data.data.forEach(village => {
                    villageData.push({
                        key: village.villageName,
                        value: village.villageCode
                    })
                })
            }
            setVillageList(villageData);
        }

    }

    const getCollectionCentre = async (distributionCentreCode) => {
        const requestData = {
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
            DistributionCode: distributionCentreCode
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
                        value: collectionCentre.collectionCentreCode
                    })
                })
            }
            setCollectionCentreList(collectionCentreData);
        }
    }

    const getFigMaster = async (collectionCentreCode) => {
        const request = {
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
            CollectionCentreCode: collectionCentreCode
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
                        value: figMaster.figCode
                    })
                })
            }
            setFigMasterList(figMasterData)
        }
    }

    if (!farmerDetailsReducer.farmerDetails ||
        Object.keys(farmerDetailsReducer.farmerDetails).length <= 0) {
        resetFarmerData();
    }
    
    if (farmerData.stateCode &&
        !$('#txtStateName').val())
    {
        getStates(farmerData.countryCode);
    }
    
    if (farmerData.districtCode &&
        !$('#txtDistrictName').val())
    {
        getDistrict(farmerData.stateCode);
    }

    if (farmerData.tehsilCode &&
        !$('#txtTehsilName').val())
    {
        getTehsil(farmerData.districtCode);
    }

    if (farmerData.blockCode &&
        !$('#txtBlockName').val())
    {
        getBlock(farmerData.tehsilCode);
    }

    if (farmerData.postOfficeCode &&
        !$('#txtPostOfficeName').val())
    {
        getPostOffice(farmerData.blockCode);
    }

    if (farmerData.villageCode &&
        !$('#txtVillageName').val())
    {
        getVillage(farmerData.postOfficeCode);
    }

    if (farmerData.collectionCentreCode &&
        !$('#txtCollectionCentre').val())
    {
        getCollectionCentre(farmerData.distributionCentreCode);

        if(!farmerData.figCode)
        {
            getFigMaster(farmerData.collectionCentreCode);    
        }
    }

    if (farmerData.figCode &&
        !$('#txtFIGName').val())
    {
        getFigMaster(farmerData.collectionCentreCode);
    }

    const handleFieldChange = (e) => {
        if (e.target.name == "countryCode") {

            dispatch(farmerDetailsAction({
                ...farmerData,
                countryCode: e.target.value,
                stateCode: null,
                districtCode: null,
                tehsilCode: null,
                blockCode: null,
                postOfficeCode: null,
                villageCode: null
            }))
            setStateList([]);
            setDistrictList([]);
            setTehsilList([]);
            setBlockList([]);
            setPostOfficeList([]);
            setVillageList([]);
            
            e.target.value && getStates(e.target.value);
        }
        else if (e.target.name == "stateCode") {
            dispatch(farmerDetailsAction({
                ...farmerData,
                stateCode: e.target.value,
                districtCode: null,
                tehsilCode: null,
                blockCode: null,
                postOfficeCode: null,
                villageCode: null
            }))
            setDistrictList([]);
            setTehsilList([]);
            setBlockList([]);
            setPostOfficeList([]);
            setVillageList([]);
            e.target.value && getDistrict(e.target.value);
        }
        else if (e.target.name == "districtCode") {
            dispatch(farmerDetailsAction({
                ...farmerData,
                districtCode: e.target.value,
                tehsilCode: null,
                blockCode: null,
                postOfficeCode: null,
                villageCode: null
            }))
            setTehsilList([]);
            setBlockList([]);
            setPostOfficeList([]);
            setVillageList([]);
            e.target.value && getTehsil(e.target.value)
        }
        else if (e.target.name == "tehsilCode") {
            dispatch(farmerDetailsAction({
                ...farmerData,
                tehsilCode: e.target.value,
                blockCode: null,
                postOfficeCode: null,
                villageCode: null
            }))
            setBlockList([]);
            setPostOfficeList([]);
            setVillageList([]);
            e.target.value && getBlock(e.target.value);
        }
        else if (e.target.name == "blockCode") {
            dispatch(farmerDetailsAction({
                ...farmerData,
                blockCode: e.target.value,
                postOfficeCode: null,
                villageCode: null
            }))
            setPostOfficeList([]);
            setVillageList([]);
            e.target.value && getPostOffice(e.target.value);
        }
        else if (e.target.name == "postOfficeCode") {
            dispatch(farmerDetailsAction({
                ...farmerData,
                postOfficeCode: e.target.value,
                villageCode: null
            }))
            setVillageList([]);
            e.target.value && getVillage(e.target.value);
        }

        // if (e.target.name == 'farmerPic') {
        //     dispatch(farmerDetailsAction({
        //         ...farmerData,
        //         farmerPic: e.target.files[0],
        //         farmerPicURL: URL.createObjectURL(e.target.files[0])
        //     }));
        // }

        else if (e.target.name == 'distributionCentreCode') {
            dispatch(farmerDetailsAction({
                ...farmerData,
                distributionCentreCode: e.target.value,
                collectionCentreCode: null,
                figCode: null,
            }))
            setCollectionCentreList([]);
            setFigMasterList([])
            e.target.value && getCollectionCentre(e.target.value)
        }
        else if (e.target.name == 'collectionCentreCode') {
            dispatch(farmerDetailsAction({
                ...farmerData,
                collectionCentreCode: e.target.value,
                figCode: null,
            }))
            setFigMasterList([])
            e.target.value && getFigMaster(e.target.value)
        }
        else {
            dispatch(farmerDetailsAction({
                ...farmerData,
                [e.target.name]: e.target.value
            }));
        }
    };

    // const removeProfilePic = () => {
    //     $('#profilepic').val(null);
    //     dispatch(farmerDetailsAction({
    //         ...farmerData,
    //         farmerPic: "",
    //         farmerPicURL: "",
    //         removeProfilePhoto: true
    //     }))
    //     $('#btnSave').attr('disabled', false);
    // }

    return (
        <>
            {isLoading ? (
                <Spinner
                    className="position-absolute start-50 loader-color"
                    animation="border"
                />
            ) : null}

            {farmerData &&

                <Form noValidate validated={formHasError} className="details-form micro-form" onSubmit={e => { handleSubmit(e) }} id='AddFarmersDetailForm'>
                    <Row className="g-3">
                        <Col sm={4} lg={3} className="no-pd-card">
                            <FalconComponentCard>
                                <FalconComponentCard.Header title="Farmer Information" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="ms-2">
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
                                        </Col>
                                    </Row>
                                </FalconComponentCard.Body>
                            </FalconComponentCard>
                        </Col>

                        <Col sm={4} lg={3} className="no-pd-card">
                            <FalconComponentCard>
                                <FalconComponentCard.Header title="Information" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="ms-2">
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

                        <Col sm={4} lg={3} className='no-pd-card'>
                            <FalconComponentCard>
                                <FalconComponentCard.Header title="Status" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="ms-2">
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
                                                    <Form.Control as="textarea" placeholder="Address" id='txtAddress' maxLength={50} name='address' onChange={handleFieldChange} value={farmerData.address} />
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

                        <Col sm={4} lg={3} className='no-pd-card'>
                            <FalconComponentCard>
                                <FalconComponentCard.Header title="Photo" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="ms-2 no-padding">
                                            <>
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
                                            </>
                                        </Col>
                                    </Row>
                                </FalconComponentCard.Body>
                            </FalconComponentCard>
                        </Col>
                    </Row>

                    <Row className="g-3">
                        <Col sm={4} lg={12}>
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
                        </Col>
                    </Row>

                    <Row className="g-3">
                        <Col sm={6} lg={4} className='no-pd-card'>
                            <FalconComponentCard>
                                <FalconComponentCard.Header title="GEO Information" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="ms-2">
                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    Country Name<span className="text-danger">*</span>
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtCountryName" name="countryCode" value={farmerData.countryCode} onChange={handleFieldChange}>
                                                        <option value=''>Select Country</option>
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
                                                    <Form.Select id="txtStateName" name="stateCode" value={farmerData.stateCode} onChange={handleFieldChange}>
                                                        <option value=''>Select State</option>
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
                                                    <Form.Select id="txtDistrictName" name="districtCode" value={farmerData.districtCode} onChange={handleFieldChange}>
                                                        <option value=''>Select District</option>
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
                                                    <Form.Select id="txtTehsilName" name="tehsilCode" value={farmerData.tehsilCode} onChange={handleFieldChange} >
                                                        <option value=''>Select Tehsil</option>
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
                                                    <Form.Select id="txtBlockName" name="blockCode" value={farmerData.blockCode} onChange={handleFieldChange}>
                                                        <option value=''>Select Block</option>
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
                                                    Post Office Name<span className="text-danger">*</span>
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtPostOfficeName" name="postOfficeCode" value={farmerData.postOfficeCode} onChange={handleFieldChange}>
                                                        <option value=''>Select Post Office</option>
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
                                                    <Form.Select id="txtVillageName" name="villageCode" value={farmerData.villageCode} onChange={handleFieldChange}>
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
                                        </Col>
                                    </Row>
                                </FalconComponentCard.Body>
                            </FalconComponentCard>
                        </Col>

                        <Col sm={6} lg={5} className='no-pd-card'>
                            <FalconComponentCard>
                                <FalconComponentCard.Header title="Operational Information" light={false} />
                                <FalconComponentCard.Body language="jsx">
                                    <Row>
                                        <Col className="ms-2">
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
                                                    <Form.Select id="txtDistributionCentre" name="distributionCentreCode" onChange={handleFieldChange} value={farmerData.distributionCentreCode}>
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
                                                    <Form.Select id="txtCollectionCentre" name="collectionCentreCode" onChange={handleFieldChange} value={farmerData.collectionCentreCode}>
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
                                                    <Form.Select id="txtFIGName" name="figCode" onChange={handleFieldChange} value={farmerData.figCode}>
                                                        <option value=''>Select FIG</option>
                                                        {figMasterList &&

                                                            figMasterList.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.key}</option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>
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