import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Form, Row, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { commonContactDetailsListAction, commonContactDetailsAction, commonContactDetailChangedAction } from '../../actions/index';

const CommonContactDetails = () => {

    const dispatch = useDispatch();
    const [designationList, setDesignationList] = useState([]);
    const [formHasError, setFormError] = useState(false);
    const [contactNameErr, setContactNameErr] = useState({});
    const [contactTypeErr, setContactTypeErr] = useState({});
    const [contactDetailsErr, setContactDetailsErr] = useState({});

    const resetCommonContactDetailData = () => {
        commonContactDetailData = {
            contactPerson: '',
            contactType: '',
            contactDetails: '',
            originatedFrom: 'CM',
            flag: '0'
        }
    }

    useEffect(() => {
        getDesignations();
    }, []);

    const commonContactDetailListReducer = useSelector((state) => state.rootReducer.commonContactDetailsListReducer)
    const commonContactDetailList = commonContactDetailListReducer.commonContactDetailsList;

    const commonContactDetailsReducer = useSelector((state) => state.rootReducer.commonContactDetailsReducer)
    var commonContactDetailData = commonContactDetailsReducer.commonContactDetails;

    if (!commonContactDetailsReducer.commonContactDetails ||
        commonContactDetailsReducer.commonContactDetails.length <= 0) {
        resetCommonContactDetailData();
    }

    const getDesignations = async () => {

        const requestData = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
        }

        axios.post(process.env.REACT_APP_API_URL + '/designation-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
            .then(res => {
                let designationData = [];
                if (res.data.status == 200) {
                    if (res.data && res.data.data.length > 0)
                        res.data.data.forEach(designation => {
                            designationData.push({
                                key: designation.designationName,
                                value: designation.encryptedDesignationCode
                            });
                        });
                    setDesignationList(designationData);
                }
            });
    }

    const validateCommonContactDetailForm = () => {
        const contactNameErr = {};
        const contactTypeErr = {};
        const contactDetailsErr = {};

        let isValid = true;

        if (!commonContactDetailData.contactPerson) {
            contactNameErr.nameEmpty = "Enter contact person name";
            isValid = false;
            setFormError(true);
        }

        if (!commonContactDetailData.contactType) {
            contactTypeErr.contactTypeEmpty = "Select contact type";
            isValid = false;
            setFormError(true);
        }

        if (!commonContactDetailData.contactDetails) {
            contactDetailsErr.contactDetailsEmpty = "Enter contact detail";
            isValid = false;
            setFormError(true);
        }

        if (!isValid) {
            setContactNameErr(contactNameErr);
            setContactTypeErr(contactTypeErr);
            setContactDetailsErr(contactDetailsErr);
        }
        return isValid;
    }

    const clearStates = () => {
        setFormError(false);
        setContactNameErr({});
        setContactTypeErr({});
        setContactDetailsErr({});
    }

    const addCommonContactDetailInList = () => {
        if (validateCommonContactDetailForm()) {
            const contactData = {
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                encryptedCompanyCode: localStorage.getItem("EncryptedResponseCompanyCode"),
                contactPerson: commonContactDetailData.contactPerson,
                contactType: commonContactDetailData.contactType,
                contactDetails: commonContactDetailData.contactDetails,
                designationName: $("#selDesignation").find("option:selected").text(),
                encryptedDesignationCode: commonContactDetailData.encryptedDesignationCode,
                flag: commonContactDetailData.flag == "1" ? "1" : "0",
                originatedFrom: commonContactDetailData.originatedFrom,
                addUser: localStorage.getItem("LoginUserName"),
            }

            dispatch(commonContactDetailsListAction(contactData));

            const addCommonContactDetail = {
                commonContactDetailsChanged: true
            }

            dispatch(commonContactDetailChangedAction(addCommonContactDetail));

            if ($("#btnSave").attr('disabled'))
                $("#btnSave").attr('disabled', false);

            toast.success("Common Contact Added Successfully", {
                theme: 'colored'
            });
            hideCommonContactForm();
        }
    };

    const updateCommonContactDetails = () => {
        if (validateCommonContactDetailForm()) {

            var contactPersonDetailsToUpdate = localStorage.getItem("contactPersonDetailsToUpdate");

            const commonContactDetail = {
                encryptedCommonContactDetailsId: commonContactDetailData.encryptedClientContactDetailsId,
                encryptedClientCode: commonContactDetailData.encryptedClientCode,
                encryptedCompanyCode: commonContactDetailData.encryptedCompanyCode,
                contactPerson: commonContactDetailData.contactPerson,
                contactType: commonContactDetailData.contactType,
                contactDetails: commonContactDetailData.contactDetails,
                encryptedDesignationCode: commonContactDetailData.encryptedDesignationCode,
                designationName: $("#selDesignation").find("option:selected").text(),
                flag: commonContactDetailData.flag == "1" ? "1" : "0",
                addUser: commonContactDetailData.addUser,
                originatedFrom: commonContactDetailData.originatedFrom,
                modifyUser: localStorage.getItem("LoginUserName"),
            }

            var objectIndex = commonContactDetailList.findIndex(x => x.contactDetails == contactPersonDetailsToUpdate);
            commonContactDetailList[objectIndex] = commonContactDetail;

            dispatch(commonContactDetailsListAction(commonContactDetailList));

            const updateCommonContactDetail = {
                commonContactDetailsChanged: true
            }

            dispatch(commonContactDetailChangedAction(updateCommonContactDetail));

            if ($("#btnSave").attr('disabled'))
                $("#btnSave").attr('disabled', false);

            toast.success("Contact Updated Successfully", {
                theme: 'colored'
            });

            hideCommonContactForm();

            localStorage.removeItem("contactPersonDetailsToUpdate");
        }
    };


    if (commonContactDetailData.status && $('#txtStatus').val()) {
        $('#txtStatus option:contains(' + commonContactDetailData.status + ')').prop('selected', true);
    }

    const handleFieldChange = e => {
        dispatch(commonContactDetailsAction({
            ...commonContactDetailData,
            [e.target.name]: e.target.value
        }));
    };

    const hideCommonContactForm = () => {
        $("#CommonContactDetailsForm").hide();
        $("#CommonContactDetailsTable").show();
        dispatch(commonContactDetailsAction(undefined))
        resetCommonContactDetailData();
        clearStates();
    }

    return (
        <>
            {commonContactDetailData &&
                <Form noValidate validated={formHasError} className="details-form" id='AddCommonContactDetailsForm'>
                    <Row>
                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label className='details-form'>Contact Person<span className="text-danger">*</span></Form.Label>
                                <Form.Control id="txtContactPerson" name="contactPerson" maxLength={45} value={commonContactDetailData.contactPerson} onChange={handleFieldChange} placeholder="Contact person name" required />
                                {Object.keys(contactNameErr).map((key) => {
                                    return <span className="error-message">{contactNameErr[key]}</span>
                                })}
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Designation</Form.Label>
                                <Form.Select id="selDesignation" name="encryptedDesignationCode" defaultValue={commonContactDetailData.designationCode} onChange={handleFieldChange}>
                                    <option value=''>Select designation</option>
                                    {designationList.map((option, index) => (
                                        <option key={index} value={option.value}>{option.key}</option>
                                    ))}
                                </Form.Select>
                            </Row>
                        </Col>

                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Contact Type<span className="text-danger">*</span></Form.Label>
                                <Form.Select id="txtContactType" name="contactType" value={commonContactDetailData.contactType} onChange={handleFieldChange} required>
                                    <option value=''>Select contact type</option>                                    
                                    <option value="OMOB">Office Mobile No.</option>
                                    <option value="OEXT">Office Extension No.</option>
                                    <option value="OFAX">Office Fax No.</option>
                                    <option value="OE">Office Email</option>
                                    <option value="PPN">Personal PP No.</option>
                                    <option value="MOB">Personal Mobile No.</option>
                                    <option value="PLL">Personal Land Line No.</option>
                                    <option value="SMOB">Spouse Mob No.</option>
                                </Form.Select>
                                {Object.keys(contactTypeErr).map((key) => {
                                    return <span className="error-message">{contactTypeErr[key]}</span>
                                })}
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Contact Details<span className="text-danger">*</span></Form.Label>
                                <Form.Control id="txtContactDetails" name="contactDetails" maxLength={30} value={commonContactDetailData.contactDetails} onChange={handleFieldChange} placeholder="Contact details" required />
                                {Object.keys(contactDetailsErr).map((key) => {
                                    return <span className="error-message">{contactDetailsErr[key]}</span>
                                })}
                            </Row>
                        </Col>

                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Send Mail</Form.Label>
                                <Form.Select id="txtFlag" name="flag" value={commonContactDetailData.flag} onChange={handleFieldChange}>
                                    <option value=''>Select</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </Form.Select>
                            </Row>
                            <Row className="mb-3">
                                <Button variant="primary" id='btnAddCommonContactDetail' type="button" onClick={() => addCommonContactDetailInList()}>
                                    Add
                                </Button>
                            </Row>
                            <Row className="mb-3">
                                <Button variant="danger" onClick={() => hideCommonContactForm()}>
                                    Cancel
                                </Button>
                            </Row>
                            <Row className="mb-3">
                                <Button variant="primary" id='btnUpdateCommonContactDetail' type="button" onClick={() => updateCommonContactDetails()}>
                                    Update
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            }
        </>
    )
};

export default CommonContactDetails;