import React, { useState, useEffect } from 'react'
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { commonContactDetailsAction, commonContactDetailsErrorAction, distributionCentreDetailsAction, distributionCentreDetailsErrorAction, formChangedAction, tabInfoAction } from 'actions';
import { toast } from 'react-toastify';
import $ from "jquery";

const tabArray = ['Distribution List', 'Add New Distribution'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'distributionCentreCode', Header: 'Distribution Code' },
    { accessor: 'distributionName', Header: 'Distribution Name' },
    { accessor: 'stateName', Header: 'State' },
    { accessor: 'processingUnit', Header: 'Processing Unit' },
    { accessor: 'coldStorage', Header: 'Cold Storage' },
    { accessor: 'status', Header: 'Status' }
];

export const DistributionCentre = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [companyList, setCompanyList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [formHasError, setFormError] = useState(false);
    const [activeTabName, setActiveTabName] = useState();

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add New Distribution"]').attr('disabled', true);
        getCompany();
        localStorage.removeItem("DeleteCommonContactDetailsIds");
    }, []);

    const distributionCentreDetailsReducer = useSelector((state) => state.rootReducer.distributionCentreDetailsReducer)
    var distirbutionCentreData = distributionCentreDetailsReducer.distributionCentreDetails;

    const commonContactDetailsReducer = useSelector((state) => state.rootReducer.commonContactDetailsReducer)
    const commonContactDetailList = commonContactDetailsReducer.commonContactDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let isFormChanged = Object.values(formChangedData).some(value => value === true);

    const clearDistributionCentreReducers = () => {
        dispatch(distributionCentreDetailsErrorAction(undefined));
        // dispatch(distributionCentreDetailsAction(undefined));
        dispatch(commonContactDetailsAction([]));
        dispatch(formChangedAction(undefined));
        dispatch(tabInfoAction(undefined));
        dispatch(commonContactDetailsErrorAction(undefined));
    }

    const newDetails = () => {
        if (localStorage.getItem("EncryptedCompanyCode")) {
            $('[data-rr-ui-event-key*="Add New Distribution"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add New Distribution"]').trigger('click');
            $('#btnSave').attr('disabled', false);
            clearDistributionCentreReducers();
            dispatch(distributionCentreDetailsAction(undefined));
            localStorage.removeItem("EncryptedDistributionCentreCode");
            localStorage.removeItem("DeleteCommonContactDetailsIds");
            dispatch(tabInfoAction({ title1: `Company: ${localStorage.getItem("CompanyName")}` }))
        } else {
            toast.error("Please select company first", {
                theme: 'colored',
                autoClose: 5000
            });
        }
    }

    const discardChanges = () => {
        $('#btnDiscard').attr('isDiscard', 'true');
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else {
            $('[data-rr-ui-event-key*="Distribution List"]').trigger('click');
        }

        setModalShow(false);
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            $('[data-rr-ui-event-key*="Distribution List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            window.location.href = '/dashboard';
            // clearDistributionCentreReducers();
            // localStorage.removeItem("EncryptedDistributionCentreCode");
        }
    }

    $('[data-rr-ui-event-key*="Add New Distribution"]').off('click').on('click', function () {
        setActiveTabName("Add New Distribution");
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();

        if(!modalShow && distirbutionCentreData.encryptedDistributionCentreCode)
        {
            getDistributionCentreDetail();
        }

        if (commonContactDetailList.length <= 0 && 
           !(localStorage.getItem("DeleteCommonContactDetailsIds")) &&
            (localStorage.getItem("EncryptedDistributionCentreCode") || 
             distirbutionCentreData.encryptedDistributionCentreCode)) {
            getContactDetail();
        }
    });

    $('[data-rr-ui-event-key*="Distribution List"]').off('click').on('click', function () {
        let isDiscard = $('#btnDiscard').attr('isDiscard');
        if (isDiscard != 'true' && isFormChanged) {
            setModalShow(true);
            setTimeout(function () {
                $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
            }, 50);
        }
        else {
            $("#btnNew").show();
            $("#btnSave").hide();
            $("#btnCancel").hide();
            $('[data-rr-ui-event-key*="Add New Distribution"]').attr('disabled', true);
            $("#btnDiscard").attr("isDiscard", false)
            clearDistributionCentreReducers();
            dispatch(distributionCentreDetailsAction(undefined));
            localStorage.removeItem("EncryptedDistributionCentreCode");
            localStorage.removeItem("DeleteCommonContactDetailsIds");
        }
    })

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
                        value: company.encryptedCompanyCode,
                        label: company.companyName
                    })
                })
            }
            setCompanyList(companyData)
        } else {
            setCompanyList([])
        }
    }

    const handleFieldChange = e => {
        localStorage.setItem("EncryptedCompanyCode", e.target.value);
        const selectedOption = e.target.options[e.target.selectedIndex];
        const selectedKey = selectedOption.dataset.key || selectedOption.label;
        localStorage.setItem("CompanyName", selectedKey)
        fetchDistributionCentreList(1, perPage, e.target.value);
    }

    const fetchDistributionCentreList = async (page, size = perPage, encryptedCompanyCode) => {

        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
            EncryptedCompanyCode: encryptedCompanyCode
        };

        setIsLoading(true);
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-distribution-centre-list', listFilter, {
            headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
        })

        if (response.data.status == 200) {
            setIsLoading(false);
            setListData(response.data.data);
        } else {
            setIsLoading(false);
            setListData([])
        }
    }

    const distributionCentreValidation = () => {
        const distributionNameErr = {};
        const countryErr = {};
        const stateErr = {};
        const contactErr = {};

        let isValid = true;

        if (!distirbutionCentreData.distributionName) {
            distributionNameErr.empty = "Enter distribution name";
            isValid = false;
            setFormError(true)
        }

        if (!distirbutionCentreData.countryCode) {
            countryErr.empty = "Select country"
            isValid = false;
            setFormError(true);
        }

        if (!distirbutionCentreData.stateCode) {
            stateErr.empty = "Select state"
            isValid = false;
            setFormError(true)
        }

        if (commonContactDetailList.length < 1) {
            contactErr.contactEmpty = "At least one contact detail required";
            toast.error(contactErr.contactEmpty, {
                theme: 'colored'
            });
            isValid = false;
            setFormError(true);
        }
        else if (commonContactDetailList && commonContactDetailList.length > 0) {
            const seenCombination = {};
            commonContactDetailList.forEach((row, index) => {
                if (!row.contactPerson || !row.contactType || !row.contactDetails) {
                    contactErr.invalidContactDetail = "All fields are required in contact details";
                    isValid = false
                }
                else {
                    const combinationString = `${row.contactDetails},${row.contactType}`;
                    if (seenCombination[combinationString]) {
                        toast.error("Contact details can not be duplicate", {
                            theme: 'colored',
                            autoClose: 10000
                        });
                        isValid = false;
                        setFormError(true);
                    } else {
                        seenCombination[combinationString] = true;
                    }
                }
            });
        }

        if (!isValid) {
            var errorObject = {
                distributionNameErr,
                countryErr,
                stateErr
            }
            dispatch(distributionCentreDetailsErrorAction(errorObject));

            var contactErrorObject = {
                contactErr
            }
            dispatch(commonContactDetailsErrorAction(contactErrorObject));
        }

        return isValid;
    }

    const updateDistributionCentreCallback = (isAddDistributionCentre = false) => {
        setModalShow(false);

        dispatch(distributionCentreDetailsErrorAction(undefined));
        localStorage.removeItem("DeleteCommonContactDetailsIds");

        if (!isAddDistributionCentre) {
            toast.success("Distribution centre details updated successfully!", {
                theme: 'colored'
            });
        }

        $('#btnSave').attr('disabled', true)

        clearDistributionCentreReducers();

        fetchDistributionCentreList(1, perPage, localStorage.getItem("EncryptedCompanyCode"))

        $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
    }

    const addDistributionCentreDetails = () => {
        if (distributionCentreValidation()) {
            const requestData = {
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                distributionName: distirbutionCentreData.distributionName,
                distributionShortName: distirbutionCentreData.distributionShortName ? distirbutionCentreData.distributionShortName : "",
                coldStorage: !distirbutionCentreData.coldStorage || distirbutionCentreData.coldStorage == "No" ? "N" : "Y",
                processingUnit: !distirbutionCentreData.processingUnit || distirbutionCentreData.processingUnit == "No" ? "N" : "Y",
                address: distirbutionCentreData.address ? distirbutionCentreData.address : "",
                stateCode: distirbutionCentreData.stateCode,
                activeStatus: distirbutionCentreData.status == null || distirbutionCentreData.status == "Active" ? "A" : "S",
                addUser: localStorage.getItem("LoginUserName"),
                commonContactDetails: commonContactDetailList
            }

            const keys = ["distributionName", "distributionShortName", "address", "addUser"]
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
            axios.post(process.env.REACT_APP_API_URL + '/add-distribution-centre', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    if (res.data.status == 200) {
                        setIsLoading(false)
                        setTimeout(function () {
                            dispatch(distributionCentreDetailsAction({
                                encryptedDistributionCentreCode: res.data.data.encryptedDistributionCentreCode
                            }))
                        }, 50);
                        localStorage.setItem("EncryptedDistributionCentreCode", res.data.data.encryptedDistributionCentreCode);

                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updateDistributionCentreCallback(true);
                    } else {
                        setIsLoading(false)
                        toast.error(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        });
                    }
                })
        }
    }

    const updateDistributionCentreDetails = async () => {

        if (distributionCentreValidation()) {

            if (!formChangedData.distirbutionCentreUpdate && 
                !(formChangedData.contactDetailUpdate || formChangedData.contactDetailAdd || formChangedData.contactDetailDelete)) 
            {
                return;    
            }

            var deleteCommonContactDetailsId = localStorage.getItem("DeleteCommonContactDetailsIds");

            const updatedDistributionCentreData = {
                encryptedDistributionCentreCode: distirbutionCentreData.encryptedDistributionCentreCode,
                encryptedCompanyCode: distirbutionCentreData.encryptedCompanyCode ? distirbutionCentreData.encryptedCompanyCode : localStorage.getItem("EncryptedCompanyCode"),
                encryptedClientCode: distirbutionCentreData.encryptedClientCode ? distirbutionCentreData.encryptedClientCode : localStorage.getItem("EncryptedClientCode"),
                distributionName: distirbutionCentreData.distributionName,
                distributionShortName: distirbutionCentreData.distributionShortName ? distirbutionCentreData.distributionShortName : "",
                address: distirbutionCentreData.address ? distirbutionCentreData.address : "",
                stateCode: distirbutionCentreData.stateCode,
                coldStorage: !distirbutionCentreData.coldStorage || distirbutionCentreData.coldStorage == "No" ? "N" : "Y",
                processingUnit: !distirbutionCentreData.processingUnit || distirbutionCentreData.processingUnit == "No" ? "N" : "Y",
                activeStatus: !distirbutionCentreData.status || distirbutionCentreData.status == "Active" ? "A" : "S",
                modifyUser: localStorage.getItem("LoginUserName"),
            }

            const keys = ["distributionName", "distributionShortName", "address", "modifyUser"]
            for (const key of Object.keys(updatedDistributionCentreData).filter((key) => keys.includes(key))) {
                updatedDistributionCentreData[key] = updatedDistributionCentreData[key] ? updatedDistributionCentreData[key].toUpperCase() : '';
            }

            var hasError = false;

            if (formChangedData.distirbutionCentreUpdate) {
                setIsLoading(true)
                await axios.post(process.env.REACT_APP_API_URL + '/update-distribution-centre', updatedDistributionCentreData, {
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
                            setModalShow(false);
                        }
                    })
            }

            var commonContactDetailIndex = 1;

            //ContactDetail Add, Update, Delete
            if (!hasError && ((formChangedData.contactDetailUpdate || formChangedData.contactDetailAdd || formChangedData.contactDetailDelete))) {

                if (!hasError && formChangedData.contactDetailDelete) {
                    var deleteCommonContactDetailsList = deleteCommonContactDetailsId ? deleteCommonContactDetailsId.split(',') : null;
                    if (deleteCommonContactDetailsList) {
                        var deleteCommonContactDetailsIndex = 1;

                        for (let i = 0; i < deleteCommonContactDetailsList.length; i++) {
                            const deleteDistributionContactDetailId = deleteCommonContactDetailsList[i];
                            const data = { encryptedCommonContactDetailsId: deleteDistributionContactDetailId }
                            const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

                            const deleteCommContactDetailResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-common-contact-detail', { headers, data });
                            if (deleteCommContactDetailResponse.data.status != 200) {
                                toast.error(deleteCommContactDetailResponse.data.message, {
                                    theme: 'colored',
                                    autoClose: 10000
                                });
                                hasError = true;
                                break;
                            }
                        }
                        deleteCommonContactDetailsIndex++
                    }
                }

                for (let i = 0; i < commonContactDetailList.length; i++) {
                    const distributionContactDetails = commonContactDetailList[i];

                    const keys = ['contactPerson', 'addUser', 'modifyUser']
                    for (const key of Object.keys(distributionContactDetails).filter((key) => keys.includes(key))) {
                        distributionContactDetails[key] = distributionContactDetails[key] ? distributionContactDetails[key].toUpperCase() : '';
                    }

                    if (!hasError && formChangedData.contactDetailUpdate && distributionContactDetails.encryptedCommonContactDetailsId) {
                        const contactRequestData = {
                            encryptedCommonContactDetailsId: distributionContactDetails.encryptedCommonContactDetailsId,
                            contactPerson: distributionContactDetails.contactPerson,
                            contactType: distributionContactDetails.contactType,
                            contactDetails: distributionContactDetails.contactDetails,
                            originatedFrom: "DC",
                            modifyUser: localStorage.getItem("LoginUserName")
                        }

                        setIsLoading(true);
                        const updateContactDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-common-contact-detail', contactRequestData, {
                            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        });
                        setIsLoading(false);
                        if (updateContactDetailResponse.data.status != 200) {
                            toast.error(updateContactDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                            break;
                        }
                    }
                    else if (!hasError && formChangedData.contactDetailAdd && !distributionContactDetails.encryptedCommonContactDetailsId) {
                        const contactRequestData = {
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedConnectingCode: localStorage.getItem("EncryptedDistributionCentreCode"),
                            contactPerson: distributionContactDetails.contactPerson,
                            contactType: distributionContactDetails.contactType,
                            contactDetails: distributionContactDetails.contactDetails,
                            originatedFrom: "DC",
                            addUser: localStorage.getItem("LoginUserName")
                        }
                        setIsLoading(true);
                        const addFarmerContactDetailsResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/add-common-contact-details', contactRequestData, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (addFarmerContactDetailsResponse.data.status != 200) {
                            toast.error(addFarmerContactDetailsResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                            break;
                        }
                    }
                    commonContactDetailIndex++
                }
            }

            if (!hasError) {
                clearDistributionCentreReducers();
                updateDistributionCentreCallback();
            }

        }
    }

    const getDistributionCentreDetail = async () => {
        const request = {
            encryptedDistributionCentreCode: localStorage.getItem("EncryptedDistributionCentreCode")
        }

        let distributionCentreResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-distribution-centre-master-detail', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (distributionCentreResponse.data.status == 200) {
            if (distributionCentreResponse.data.data) {
                dispatch(distributionCentreDetailsAction(distributionCentreResponse.data.data))
                dispatch(tabInfoAction({
                    title1: `Company: ${localStorage.getItem("CompanyName")}`,
                    title2: distributionCentreResponse.data.data.distributionName
                }))
            }
        }
    }

    const getContactDetail = async () => {
        const request = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
            EncryptedConnectingCode: localStorage.getItem("EncryptedDistributionCentreCode"),
            OriginatedFrom: "DC"
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-common-contact-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(commonContactDetailsAction(response.data.data));
            }
        }
    }

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
                        <Button variant="success" onClick={formChangedData.distirbutionCentreUpdate ? updateDistributionCentreDetails : addDistributionCentreDetails}>Save</Button>
                        <Button id="btnDiscard" variant="danger" onClick={() => discardChanges()}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="DistributionCentre"
                saveDetails={distirbutionCentreData.encryptedDistributionCentreCode ? updateDistributionCentreDetails : addDistributionCentreDetails}
                newDetails={newDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
                tableFilterOptions={companyList}
                tableFilterName={'Company'}
                supportingMethod1={handleFieldChange}
            />
        </>
    )
}

export default DistributionCentre