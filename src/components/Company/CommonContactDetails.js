import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Form, Row, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { commonContactDetailsListAction, commonContactDetailsAction, commonContactDetailChangedAction } from '../../actions/index';
import EnlargableTextbox from 'components/common/EnlargableTextbox';

const CommonContactDetails = () => {

    const dispatch = useDispatch();
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

    const commonContactDetailListReducer = useSelector((state) => state.rootReducer.commonContactDetailsListReducer)
    const commonContactDetailList = commonContactDetailListReducer.commonContactDetailsList;

    const commonContactDetailsReducer = useSelector((state) => state.rootReducer.commonContactDetailsReducer)
    var commonContactDetailData = commonContactDetailsReducer.commonContactDetails;

    const companyDetailsReducer = useSelector((state) => state.rootReducer.companyDetailsReducer)
    const companyData = companyDetailsReducer.companyDetails;

    const userDetailsReducer = useSelector((state) => state.rootReducer.userDetailsReducer)
    const userData = userDetailsReducer.userDetails;

    if (!commonContactDetailsReducer.commonContactDetails ||
        commonContactDetailsReducer.commonContactDetails.length <= 0) {
        resetCommonContactDetailData();
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
                encryptedClientCode: companyData.encryptedClientCode ? companyData.encryptedClientCode : userData.encryptedClientCode,
                encryptedCompanyCode: companyData.encryptedCompanyCode != null ? companyData.encryptedCompanyCode : "",
                contactPerson: commonContactDetailData.contactPerson,
                contactType: commonContactDetailData.contactType,
                contactDetails: commonContactDetailData.contactDetails,
                flag: commonContactDetailData.flag == "1" ? "1" : "0",
                originatedFrom: companyData.encryptedCompanyCode != null ? "CM" : "SU",
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
                encryptedCommonContactDetailsId: commonContactDetailData.encryptedCommonContactDetailsId,
                encryptedClientCode: commonContactDetailData.encryptedClientCode,
                encryptedCompanyCode: commonContactDetailData.encryptedCompanyCode ? commonContactDetailData.encryptedCompanyCode : "",
                contactPerson: commonContactDetailData.contactPerson,
                contactType: commonContactDetailData.contactType,
                contactDetails: commonContactDetailData.contactDetails,
                flag: commonContactDetailData.flag == "1" ? "1" : "0",
                originatedFrom: commonContactDetailData.originatedFrom ? commonContactDetailData.originatedFrom : "CM",
                modifyUser: localStorage.getItem("LoginUserName"),
                addUser: localStorage.getItem("LoginUserName"),
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
        if ($("#btnSave").attr('disabled'))
            $("#btnSave").attr('disabled', false);
    };

    const hideCommonContactForm = () => {
        $("#CommonContactDetailsForm").hide();
        $("#CommonContactDetailsCard").show();
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
                                <EnlargableTextbox id="txtContactPerson" name="contactPerson" maxLength={45} value={commonContactDetailData.contactPerson} onChange={handleFieldChange} placeholder="Contact person name" required={true} />
                                {Object.keys(contactNameErr).map((key) => {
                                    return <span className="error-message">{contactNameErr[key]}</span>
                                })}
                            </Row>
                        </Col>
                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Contact Type<span className="text-danger">*</span></Form.Label>
                                <Form.Select id="txtContactType" name="contactType" value={commonContactDetailData.contactType} onChange={handleFieldChange} required>
                                    <option value=''>Select contact type</option>
                                    <option value="OFE">Office Email Id</option>
                                    <option value="OFM">Office Mobile No</option>
                                    <option value="OFL">Office Land Line No</option>
                                    <option value="OFX">Office Ext No</option>
                                    <option value="OFF">Office Fax No</option>
                                    <option value="PPP">PP No</option>
                                    <option value="PMN">Personal Mobile No</option>
                                    <option value="PRL">Personal Land Line No</option>
                                    <option value="PRS">Spouse Mob No</option>
                                    <option value="PRE">Personal Mail</option>
                                </Form.Select>
                                {Object.keys(contactTypeErr).map((key) => {
                                    return <span className="error-message">{contactTypeErr[key]}</span>
                                })}
                            </Row>
                        </Col>
                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Contact Details<span className="text-danger">*</span></Form.Label>
                                <EnlargableTextbox id="txtContactDetails" name="contactDetails" maxLength={30} value={commonContactDetailData.contactDetails} onChange={handleFieldChange} placeholder="Contact details" required />
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
                            <Row className="mb-2" id='btnAddCommonContactDetail'>
                                <Button variant="primary" type="button" onClick={() => addCommonContactDetailInList()}>
                                    Add
                                </Button>
                            </Row>
                            <Row className="mb-2" id='btnUpdateCommonContactDetail'>
                                <Button variant="primary" type="button" onClick={() => updateCommonContactDetails()}>
                                    Update
                                </Button>
                            </Row>
                            <Row className="mb-2">
                                <Button variant="danger" onClick={() => hideCommonContactForm()}>
                                    Cancel
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