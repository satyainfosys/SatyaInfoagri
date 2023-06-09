import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { companyDetailsAction, commonContactDetailsAction, companyDetailsErrorAction, commonContactDetailsListAction, commonContactDetailChangedAction, formChangedAction } from '../../actions/index';
import Moment from "moment";

const tabArray = ['Company List', 'Maintenance'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'companyName', Header: 'Company Name' },
    { accessor: 'companyTypeFullName', Header: 'Company Type' },
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

        const response =
            setIsLoading(true);
        await axios
            .post(process.env.REACT_APP_API_URL + '/company-list', listFilter, {
                headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
            })
            .then(res => {
                setIsLoading(false);
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

    let commonContactDetailsReducer = useSelector((state) => state.rootReducer.commonContactDetailsReducer)
    const commonContactDetailList = commonContactDetailsReducer.commonContactDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let isFormChanged = Object.values(formChangedData).some(value => value === true);

    const [formHasError, setFormError] = useState(false);
    const [activeTabName, setActiveTabName] = useState();

    const clearCompanyReducers = () => {
        dispatch(companyDetailsAction(undefined));
        dispatch(companyDetailsErrorAction(undefined));
        dispatch(commonContactDetailsAction([]));
        dispatch(formChangedAction(undefined));
        localStorage.removeItem("DeleteCommonContactDetailsIds")
    }

    $('[data-rr-ui-event-key*="Company List"]').off('click').on('click', function () {
        let isDiscard = $('#btnDiscard').attr('isDiscard');
        if (isDiscard != 'true' && isFormChanged) {
            setModalShow(true);
            setTimeout(function () {
                $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
            }, 50);
        } else {
            $("#btnNew").show();
            $("#btnSave").hide();
            $("#btnCancel").hide();
            $('[data-rr-ui-event-key*="Maintenance"]').attr('disabled', true);
            $('#AddCompanyDetailsForm').get(0).reset();
            localStorage.removeItem("EncryptedResponseCompanyCode")
            localStorage.removeItem("DeleteCommonContactDetailsIds")
            clearCompanyReducers();
        }
    })

    $('[data-rr-ui-event-key*="Maintenance"]').off('click').on('click', function () {
        setActiveTabName("Maintenance")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        $("#CommonContactDetailsForm").hide();
        $("#CommonContactDetailsCard").show();
    })

    const newDetails = () => {
        if (listData.length >= localStorage.getItem("NoOfCompany")) {
            toast.error(`You have authorization to create only ${localStorage.getItem("NoOfCompany")} companies`, {
                theme: 'colored',
                autoClose: 10000
            });
        } else {
            $('[data-rr-ui-event-key*="Maintenance"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Maintenance"]').trigger('click');
            $("#clientChkBoxRow").show();
            $("#contactListChkBoxRow").show();
            $("#imgCompanyLogo").hide();
            $('#clientChkBox').prop('checked', false);
            $('#contactListChkBox').prop('checked', false);
            $('#btnSave').attr('disabled', false);
            clearCompanyReducers();
        }
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            $('[data-rr-ui-event-key*="Company List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            window.location.href = '/dashboard';
        }
    }

    const discardChanges = () => {
        $('#btnDiscard').attr('isDiscard', 'true');
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
        let imageTypeErr = {};
        let contactErr = {};

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

        if (!companyData.countryCode) {
            countryErr.empty = "Select country";
            isValid = false;
            setFormError(true);
        }

        if (!companyData.stateCode) {
            stateErr.empty = "Select state";
            isValid = false;
            setFormError(true);
        }

        if (!companyData.address1) {
            addressErr.addressEmpty = "Enter address";
            isValid = false;
            setFormError(true);
        }

        if (companyData.companyPan && !(/^[a-zA-Z]{3}[abcfghljptABCFGHLJPT][a-zA-Z][0-9]{4}[a-zA-Z]$/.test(companyData.companyPan))) {
            panNoErr.panNoInvalid = "Enter valid PAN number";
            isValid = false;
            setFormError(true);
        }

        if (companyData.companyGstNo && !(/^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ][0-9a-zA-Z]{1}$/.test(companyData.companyGstNo))) {
            gstNoErr.gstNoEmpty = "Enter valid GST number";
            isValid = false;
            setFormError(true);
        }

        if (companyData.companyRegDate && Moment(companyData.companyRegDate).format("YYYY-MM-DD") >= Moment(new Date()).format("YYYY-MM-DD")) {
            regDateErr.invalidRegDate = "Registration date can not be greater than or equal to today's date";
            isValid = false;
            setFormError(true);
        }

        if (companyData.companyLogo && companyData.companyLogo.type) {
            var imageType = ['image/jpeg', 'image/jpg', 'image/bmp'];
            if (imageType.indexOf(companyData.companyLogo.type) === -1) {
                imageTypeErr.invalidImage = "Selected image is invalid";
                isValid = false;
                setFormError(true);
            }

            if (companyData.companyLogo.size > 1024 * 30) {
                imageTypeErr.invalidSize = "File size must be under 30 KB";
                isValid = false;
                setFormError(true);
            }
        }

        if (commonContactDetailList && commonContactDetailList.length > 0) {
            const seenCombination = {};
            commonContactDetailList.forEach((row, index) => {
                if (!row.contactPerson || !row.contactType || !row.contactDetails) {
                    contactErr.invalidContactDetail = "All fields are required in contact details";
                    isValid = false
                }
                else {
                    const combinationString = `${row.contactDetails},${row.contactType}`;
                    if (seenCombination[combinationString]) {
                        contactErr.invalidContactDetail = "Contact details can not be duplicate";
                        isValid = false;
                        setFormError(true);
                    } else {
                        seenCombination[combinationString] = true;
                    }
                }
            });
            if (contactErr.invalidContactDetail) {
                toast.error(contactErr.invalidContactDetail, {
                    theme: 'colored'
                });
            }
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
                regDateErr,
                imageTypeErr,
                contactErr
            }
            dispatch(companyDetailsErrorAction(errorObject))
        }
        return isValid;
    }

    const updateCompanyCallback = (isAddCompany = false, encryptedCompanyCode = '') => {

        setModalShow(false);
        $("#AddCompanyDetailsForm").data("changed", false);
        $('#AddCompanyDetailsForm').get(0).reset();

        dispatch(companyDetailsErrorAction(undefined));
        dispatch(formChangedAction(undefined));

        localStorage.removeItem("DeleteCommonContactDetailsId");

        if (!isAddCompany) {
            toast.success("Company details updated successfully!", {
                theme: 'colored'
            });
        }
        else {
            dispatch(companyDetailsAction({
                ...companyData,
                encryptedCompanyCode: encryptedCompanyCode,
                encryptedClientCode: localStorage.getItem("EncryptedClientCode")
            }))

            $("#contactListChkBoxRow").hide();
            $("#clientChkBoxRow").hide();
            localStorage.setItem('EncryptedResponseCompanyCode', encryptedCompanyCode);
            getCommonContactDetailsList(encryptedCompanyCode);
        }

        $('#btnSave').attr('disabled', true)

        fetchCompanyList(1);
    }

    const getCommonContactDetailsList = async (encryptedCompanyCode) => {
        const request = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
            EncryptedCompanyCode: encryptedCompanyCode,
            OriginatedFrom: "CM"
        }

        axios
            .post(process.env.REACT_APP_API_URL + '/get-common-contact-detail-list', request, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
            .then(res => {

                if (res.data.status == 200) {
                    if (res.data.data && res.data.data.length > 0) {
                        dispatch(commonContactDetailsAction(res.data.data))
                    }
                }
                else {
                    $("#CompanyContactDetailsTable").hide();
                }
            });
    }

    const uploadCompanyLogo = async (companyLogo, encryptedCompanyCode, isUpdate, isRemoved) => {
        var formData = new FormData();
        formData.append("CompanyLogo", companyLogo);
        formData.append("EncryptedCompanyCode", encryptedCompanyCode)
        formData.append("IsUpdate", isUpdate)
        formData.append("IsRemoved", isRemoved)
        await axios.post(process.env.REACT_APP_API_URL + '/upload-company-logo', formData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
            .then(res => {
                setIsLoading(false);
                if (res.data.status == 200) {
                    if (!formChangedData.commonContactDetailUpdate && !formChangedData.commonContactDetailAdd && !formChangedData.commonContactDetailDelete) {
                        updateCompanyCallback();
                    }
                    else if (!isUpdate) {
                        updateCompanyCallback(true, encryptedCompanyCode);
                    }
                } else {
                    toast.error(res.data.message, {
                        theme: 'colored',
                        autoClose: 10000
                    });
                }
            })
    }

    const deleteCompanyLogo = async (encryptedCompanyCode, isRemoved) => {
        var deleteRequest = {
            EncryptedCompanyCode: encryptedCompanyCode,
            IsRemoved: isRemoved
        }

        await axios.post(process.env.REACT_APP_API_URL + '/delete-company-logo', deleteRequest, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
            .then(res => {
                setIsLoading(false);
                if (res.data.status == 200) {
                    dispatch(companyDetailsAction({
                        ...companyData,
                        isRemoved: false
                    }))
                } else {
                    toast.error(res.data.message, {
                        theme: 'colored',
                        autoClose: 10000
                    });
                }
            })
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
                countryCode: companyData.countryCode,
                stateCode: companyData.stateCode,
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

                    if (res.data.status == 200) {
                        if (companyData.companyLogo) {
                            uploadCompanyLogo(companyData.companyLogo, res.data.data.encryptedCompanyCode, false);
                        } else {
                            setIsLoading(false);
                            toast.success(res.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            updateCompanyCallback(true, res.data.data.encryptedCompanyCode);
                        }

                    } else {
                        setIsLoading(false);
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
                countryCode: companyData.countryCode,
                stateCode: companyData.stateCode,
                pinCode: companyData.pinCode ? companyData.pinCode : '',
                ActiveStatus: !companyData.status || companyData.status == "Active" ? "A" : "S",
                ModifyUser: localStorage.getItem("LoginUserName")
            }

            const keys = ['companyName', 'companyShortName', 'companyType', 'address1', 'address2', 'address3', 'companyPan', 'companyGstNo', 'ModifyUser']
            for (const key of Object.keys(updatedCompanyData).filter((key) => keys.includes(key))) {
                updatedCompanyData[key] = updatedCompanyData[key] ? updatedCompanyData[key].toUpperCase() : '';
            }

            var hasError = false;

            if (formChangedData.companyDetailUpdate) {
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
                            hasError = true;
                        } else if (res.data.status == 200) {
                            if (companyData.companyLogo.type) {
                                uploadCompanyLogo(companyData.companyLogo, companyData.encryptedCompanyCode, true);
                            }
                            if (companyData.isRemoved) {
                                deleteCompanyLogo(companyData.encryptedCompanyCode, companyData.isRemoved)
                            }
                        }
                    })
            }

            if (!formChangedData.companyDetailUpdate && companyData.isRemoved) {
                deleteCompanyLogo(companyData.encryptedCompanyCode, companyData.isRemoved)
            }

            var deleteCommonContactDetailsId = localStorage.getItem("DeleteCommonContactDetailsIds");

            if (!hasError && (formChangedData.commonContactDetailUpdate || formChangedData.commonContactDetailAdd || formChangedData.commonContactDetailDelete)) {
                var commoncontactDetailIndex = 1;

                for (let i = 0; i < commonContactDetailList.length; i++) {

                    const commonContactDetails = commonContactDetailList[i];

                    const keys = ['contactPerson', 'modifyUser', 'addUser']
                    for (const key of Object.keys(commonContactDetails).filter((key) => keys.includes(key))) {
                        commonContactDetails[key] = commonContactDetails[key] ? commonContactDetails[key].toUpperCase() : '';
                    }

                    if (formChangedData.commonContactDetailUpdate && commonContactDetails.encryptedCommonContactDetailsId) {

                        setIsLoading(true);
                        const updateCommonContactDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/update-common-contact-detail', commonContactDetails, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (updateCommonContactDetailResponse.data.status != 200) {
                            toast.error(updateCommonContactDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                            break;
                        }
                    }
                    else if (formChangedData.commonContactDetailAdd && !commonContactDetails.encryptedCommonContactDetailsId) {
                        setIsLoading(true);
                        const addCommonContactDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/add-common-contact-details', commonContactDetails, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (addCommonContactDetailResponse.data.status != 200) {
                            toast.error(addCommonContactDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                            break;
                        }
                    }
                    commoncontactDetailIndex++;
                }

                if (!hasError && formChangedData.commonContactDetailDelete) {
                    var deleteCommonContactDetailList = deleteCommonContactDetailsId ? deleteCommonContactDetailsId.split(',') : null;

                    if (deleteCommonContactDetailList) {
                        var deleteContactDetailIndex = 1;

                        for (let i = 0; i < deleteCommonContactDetailList.length; i++) {
                            const deleteCommonContactDetailsId = deleteCommonContactDetailList[i]
                            const data = { encryptedCommonContactDetailsId: deleteCommonContactDetailsId }
                            const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

                            const deleteCommonContactResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-common-contact-detail', { headers, data });
                            if (deleteCommonContactResponse.data.status != 200) {
                                toast.error(deleteCommonContactResponse.data.message, {
                                    theme: 'colored',
                                    autoClose: 10000
                                });
                                hasError = true;
                                break;
                            }
                        }
                        deleteContactDetailIndex++
                    }
                }
            }
            if (!hasError) {
                updateCompanyCallback();
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
                        <Button variant="success" onClick={!companyData.encryptedCompanyCode ? addCompanyDetails : updateCompanyDetails}>Save</Button>
                        <Button variant="danger" id="btnDiscard" onClick={() => discardChanges()}>Discard</Button>
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