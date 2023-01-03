import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { companyDetailsAction, commonContactDetailsAction, companyDetailsErrorAction, commonContactDetailsListAction, commonContactDetailChangedAction } from '../../actions/index';
import Moment from "moment";

const tabArray = ['Company List', 'Maintenance'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'companyName', Header: 'Company Name' },
    { accessor: 'companyType', Header: 'Company Type' },
    { accessor: 'state', Header: 'State' },
    { accessor: 'country', Header: 'Country' },
    { accessor: 'status', Header: 'Status' }
];

export const CompanyMaster = () => {

    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const dispatch = useDispatch();

    const fetchCompanyList = async (page, size = perPage) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
        };

        const response = await axios
            .post(process.env.REACT_APP_API_URL + '/company-list', listFilter, {
                headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
            })
            .then(res => {
                if (res.data.status == 200) {
                    setListData(res.data.data);
                }
            });
    };

    useEffect(() => {
        fetchCompanyList(1);
        $('[data-rr-ui-event-key*="Maintenance"]').attr('disabled', true);
        localStorage.removeItem("EncryptedResponseCompanyCode");
        localStorage.removeItem("DeleteCommonContactDetailsId");
    }, []);

    const companyDetailsReducer = useSelector((state) => state.rootReducer.companyDetailsReducer)
    const companyData = companyDetailsReducer.companyDetails;

    const commonContactChanged = useSelector((state) => state.rootReducer.commonContactDetailChangedReducer)
    let commonContactDetailChanged = commonContactChanged.commonContactDetailChanged;

    const commonContactDetailListReducer = useSelector((state) => state.rootReducer.commonContactDetailsListReducer)
    const commonContactDetailList = commonContactDetailListReducer.commonContactDetailsList;

    const [formHasError, setFormError] = useState(false);


    $.fn.extend({
        trackChanges: function () {
            $(":input", this).change(function () {
                $(this.form).data("changed", true);
            });
        }
        ,
        isChanged: function () {
            return this.data("changed");
        }
    });

    $("#AddCompanyDetailsForm").trackChanges();

    const clearCompanyReducers = () => {
        dispatch(companyDetailsAction(undefined));
        dispatch(commonContactDetailsAction(undefined));
        dispatch(companyDetailsErrorAction(undefined));
        dispatch(commonContactDetailsListAction(undefined));
        dispatch(commonContactDetailChangedAction(undefined));
        $("#AddCompanyDetailsForm").data("changed", false);
    }

    $('[data-rr-ui-event-key*="Company List"]').click(function () {
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Maintenance"]').attr('disabled', true);
        $('#AddCompanyDetailsForm').get(0).reset();
        localStorage.removeItem("EncryptedResponseCompanyCode")
        localStorage.removeItem("DeleteCommonContactDetailsId")
        clearCompanyReducers();
    })

    $('[data-rr-ui-event-key*="Maintenance"]').click(function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        $("#CommonContactDetailsForm").hide();
        $("#CommonContactDetailsCard").show();
    })

    const newDetails = () => {
        $('[data-rr-ui-event-key*="Maintenance"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Maintenance"]').trigger('click');
        $("#clientChkBoxRow").show();
        $("#contactListChkBoxRow").show();
        $('#clientChkBox').prop('checked', false);
        $('#contactListChkBox').prop('checked', false);
        $('#btnSave').attr('disabled', false);
        $("#AddCompanyDetailsForm").data("changed", false);
        clearCompanyReducers();
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if ($("#AddCompanyDetailsForm").isChanged() ||
            commonContactDetailChanged.commonContactDetailsChanged
        ) {
            setModalShow(true);
        }
        else {
            $('[data-rr-ui-event-key*="Company List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (($("#AddCompanyDetailsForm").isChanged()) ||
            commonContactDetailChanged.commonContactDetailsChanged) {
            setModalShow(true);
        }
        else {
            window.location.href = '/dashboard';
        }
    }

    const discardChanges = () => {
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else
            $('[data-rr-ui-event-key*="Company List"]').trigger('click');

        setModalShow(false);
    }

    const companyValidation = () => {
        const companyNameErr = {};
        const companyTypeErr = {};
        const addressErr = {};
        const countryErr = {};
        const stateErr = {};
        const panNoErr = {};
        const gstNoErr = {};
        const regDateErr = {};

        let isValid = true;

        if (!companyData.companyName) {
            companyNameErr.nameEmpty = "Enter company name";
            isValid = false;
            setFormError(true);
        }

        if (!companyData.companyType) {
            companyTypeErr.companyTypeEmpty = "Enter company type";
            isValid = false;
            setFormError(true);
        }

        if (!companyData.encryptedCountryCode) {
            countryErr.empty = "Select country";
            isValid = false;
            setFormError(true);
        }

        if (!companyData.encryptedStateCode) {
            stateErr.empty = "Select state";
            isValid = false;
            setFormError(true);
        }

        if (!companyData.address1) {
            addressErr.addressEmpty = "Enter address";
            isValid = false;
            setFormError(true);
        }

        if (companyData.companyPan && !(/^[A-Z]{3}[ABCFGHLJPT][A-Z][0-9]{4}[A-Z]$/.test(companyData.companyPan))) {
            panNoErr.panNoInvalid = "Enter valid PAN number";
            isValid = false;
            setFormError(true);
        }

        if (companyData.companyGstNo && !(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(companyData.companyGstNo))) {
            gstNoErr.gstNoEmpty = "Enter valid GST number";
            isValid = false;
            setFormError(true);
        }

        if(companyData.companyRegDate && Moment(companyData.companyRegDate).format("YYYY-MM-DD") >= Moment(new Date()).format("YYYY-MM-DD")){
            regDateErr.invalidRegDate = "Registration date can not be greater than or equal to today's date";
            isValid = false;
            setFormError(true);
        }

        if (!isValid) {
            var errorObject = {
                companyNameErr,
                companyTypeErr,
                addressErr,
                countryErr,
                stateErr,
                panNoErr,
                gstNoErr,
                regDateErr
            }
            dispatch(companyDetailsErrorAction(errorObject))
        }

        return isValid;
    }

    const updateCompanyCallback = (isAddCompany = false) => {

        $("#AddCompanyDetailsForm").data("changed", false);
        $('#AddCompanyDetailsForm').get(0).reset();

        dispatch(companyDetailsErrorAction(undefined));

        commonContactDetailChanged = {
            commonContactDetailChanged: false
        }

        dispatch(commonContactDetailChangedAction(commonContactDetailChanged));

        localStorage.removeItem("DeleteCommonContactDetailsId");

        if (!isAddCompany) {
            toast.success("Company details updated successfully!", {
                theme: 'colored'
            });
        }

        $('#btnSave').attr('disabled', true)

        fetchCompanyList(1);
    }

    const addCompanyDetails = () => {
        if (companyValidation()) {
            const requestData = {
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                companyName: companyData.companyName,
                companyShortName: companyData.companyShortName,
                companyType: companyData.companyType,
                address1: companyData.address1,
                address2: companyData.address2 ? companyData.address2 : '',
                address3: companyData.address3 ? companyData.address3 : '',
                encryptedCountryCode: companyData.encryptedCountryCode,
                encryptedStateCode: companyData.encryptedStateCode,
                companyRegDate: companyData.companyRegDate ? companyData.companyRegDate : new Date(),
                companyRegNo: companyData.companyRegNo ? companyData.companyRegNo : '',
                companySalesTax: companyData.companySalesTax ? companyData.companySalesTax : '',
                companyTinNo: companyData.companyTinNo ? companyData.companyTinNo : '',
                companyPan: companyData.companyPan ? companyData.companyPan : '',
                companyGstNo: companyData.companyGstNo ? companyData.companyGstNo : '',
                companyLutNo: companyData.companyLutNo ? companyData.companyLutNo : '',
                companyExpImp: companyData.companyExpImp ? companyData.companyExpImp : '',
                companyLogo: companyData.companyLogo ? companyData.companyLogo : '',
                pinCode: companyData.pinCode ? companyData.pinCode : '',
                activeStatus: companyData.status == null || companyData.status == "Active" ? "A" : "S",
                addUser: localStorage.getItem("LoginUserName"),
                commonContactDetails: commonContactDetailList
            }

            const keys = ['companyName', 'companyShortName', 'companyType', 'address1', 'address2', 'address3', 'companyPan', 'companyGstNo', 'addUser']
            for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
                requestData[key] = requestData[key] ? requestData[key].toUpperCase() : '';
            }

            const contactKeys = ['contactPerson', 'addUser']
            var index = 0;
            for (var obj in requestData.commonContactDetails) {
                var contactDetailObj = requestData.commonContactDetails[obj];

                for (const key of Object.keys(contactDetailObj).filter((key) => contactKeys.includes(key))) {
                    contactDetailObj[key] = contactDetailObj[key] ? contactDetailObj[key].toUpperCase() : '';
                }
                requestData.commonContactDetails[index] = contactDetailObj;
                index++;
            }
            setIsLoading(true);
            axios.post(process.env.REACT_APP_API_URL + '/add-company', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    setIsLoading(false);
                    if (res.data.status == 200) {
                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        });
                        updateCompanyCallback(true);
                        $('[data-rr-ui-event-key*="Company List"]').click();
                    } else {
                        toast.error(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        });
                    }
                })
        }
    }

    const updateCompanyDetails = async () => {
        if (companyValidation()) {
            const updatedCompanyData = {
                encryptedClientCode: companyData.encryptedClientCode,
                encryptedCompanyCode: companyData.encryptedCompanyCode,
                companyName: companyData.companyName,
                companyShortName: companyData.companyShortName ? companyData.companyShortName : '',
                companyType: companyData.companyType,
                address1: companyData.address1,
                address2: companyData.address2 ? companyData.address2 : '',
                address3: companyData.address3 ? companyData.address3 : '',
                companyRegDate: companyData.companyRegDate ? companyData.companyRegDate : new Date(),
                companyRegNo: companyData.companyRegNo ? companyData.companyRegNo : '',
                companySalesTax: companyData.companySalesTax ? companyData.companySalesTax : '',
                companyTinNo: companyData.companyTinNo ? companyData.companyTinNo : '',
                companyPan: companyData.companyPan ? companyData.companyPan : '',
                companyGstNo: companyData.companyGstNo ? companyData.companyGstNo : '',
                companyLutNo: companyData.companyLutNo ? companyData.companyLutNo : '',
                companyExpImp: companyData.companyExpImp ? companyData.companyExpImp : '',
                companyLogo: companyData.companyLogo ? companyData.companyLogo : '',
                encryptedCountryCode: companyData.encryptedCountryCode,
                encryptedStateCode: companyData.encryptedStateCode,
                pinCode: companyData.pinCode ? companyData.pinCode : '',
                ActiveStatus: !companyData.status || companyData.status == "Active" ? "A" : "S",
                ModifyUser: localStorage.getItem("LoginUserName")
            }
            var updateRequired = $("#AddCompanyDetailsForm").isChanged() || commonContactDetailChanged.commonContactDetailsChanged;

            if (!updateRequired) {
                toast.warning("Nothing to change!", {
                    theme: 'colored'
                });

                return;
            }

            const keys = ['companyName', 'companyShortName', 'companyType', 'address1', 'address2', 'address3', 'companyPan', 'companyGstNo', 'ModifyUser']
            for (const key of Object.keys(updatedCompanyData).filter((key) => keys.includes(key))) {
                updatedCompanyData[key] = updatedCompanyData[key] ? updatedCompanyData[key].toUpperCase() : '';
            }

            if ($("#AddCompanyDetailsForm").isChanged()) {
                setIsLoading(true);
                await axios.post(process.env.REACT_APP_API_URL + '/update-company', updatedCompanyData, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                })
                    .then(res => {
                        setIsLoading(false);
                        if (res.data.status != 200) {
                            toast.error(res.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                        }
                        else if (!commonContactDetailChanged.commonContactDetailsChanged) {
                            updateCompanyCallback();
                        }
                    })
            }

            var deleteCommonContactDetailsId = localStorage.getItem("DeleteCommonContactDetailsId");

            if (commonContactDetailChanged.commonContactDetailsChanged) {
                var loopBreaked = false;
                var commoncontactDetailIndex = 1;

                for (let i = 0; i < commonContactDetailList.length; i++) {
                    const commonContactDetails = commonContactDetailList[i];
                    if (!loopBreaked) {

                        const keys = ['contactPerson', 'modifyUser']
                        for (const key of Object.keys(commonContactDetails).filter((key) => keys.includes(key))) {
                            commonContactDetails[key] = commonContactDetails[key] ? commonContactDetails[key].toUpperCase() : '';
                        }

                        if (commonContactDetails.encryptedCommonContactDetailsId) {
                            const updateCommonContactDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-common-contact-detail', commonContactDetails, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                            if (updateCommonContactDetailResponse.data.status != 200) {
                                toast.error(updateCommonContactDetailResponse.data.message, {
                                    theme: 'colored',
                                    autoClose: 10000
                                });
                                loopBreaked = true;
                            }
                            else if (commoncontactDetailIndex == commonContactDetailList.length && !loopBreaked && !deleteCommonContactDetailsId) {
                                updateCompanyCallback();
                            }
                            else {
                                commoncontactDetailIndex++;
                            }
                        }
                        else if (!commonContactDetails.encryptedCommonContactDetailsId) {
                            const addCommonContactDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-common-contact-details', commonContactDetails, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                            if (addCommonContactDetailResponse.data.status != 200) {
                                toast.error(addCommonContactDetailResponse.data.message, {
                                    theme: 'colored',
                                    autoClose: 10000
                                });
                                loopBreaked = true;
                            }
                            else if (commoncontactDetailIndex == commonContactDetailList.length && !loopBreaked && !deleteCommonContactDetailsId) {
                                updateCompanyCallback();
                            }
                            else {
                                commoncontactDetailIndex++;
                            }
                        }
                    }
                }

                var deleteCommonContactDetailList = deleteCommonContactDetailsId ? deleteCommonContactDetailsId.split(',') : null;

                if (deleteCommonContactDetailList) {
                    var deleteContactDetailIndex = 1;

                    deleteCommonContactDetailList.forEach(async deleteCommonContactDetailsId => {
                        if (!loopBreaked) {

                            const data = { encryptedCommonContactDetailsId: deleteCommonContactDetailsId }
                            const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

                            const deleteCommonContactResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-common-contact-detail', { headers, data });
                            if (deleteCommonContactResponse.data.status != 200) {
                                toast.error(deleteCommonContactResponse.data.message, {
                                    theme: 'colored',
                                    autoClose: 10000
                                });
                                loopBreaked = true;
                            }
                            else if (deleteContactDetailIndex == deleteCommonContactDetailList.length && !loopBreaked) {
                                updateCompanyCallback();
                            }
                            else {
                                deleteContactDetailIndex++;
                            }
                        }
                    });
                }
            }
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

            {modalShow &&
                <Modal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Do you want to save changes?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={addCompanyDetails}>Save</Button>
                        <Button variant="danger" onClick={discardChanges}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="CompanyMaster"
                newDetails={newDetails}
                saveDetails={!companyData.encryptedCompanyCode ? addCompanyDetails : updateCompanyDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
            />
        </>
    )
};

export default CompanyMaster;