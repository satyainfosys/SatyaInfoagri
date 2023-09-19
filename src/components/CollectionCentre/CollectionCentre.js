import React, { useEffect, useState } from 'react';
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { collectionCentreDetailsAction, collectionCentreDetailsErrorAction, commonContactDetailsAction, commonContactDetailsErrorAction, distributionCentreListAction, figDetailsAction, formChangedAction, tabInfoAction } from 'actions';

const tabArray = ['Collection Centre List', 'Add Collection Centre', 'Add FIGs'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'collectionCentreCode', Header: 'Collection Centre Code' },
    { accessor: 'collectionCentreName', Header: 'Collection Centre Name' },
    { accessor: 'distributionCentreName', Header: 'Distribution Centre Name' },
    { accessor: 'stateName', Header: 'State' },
    { accessor: 'collectionCentreType', Header: 'CC Type' },
    { accessor: 'status', Header: 'Status' }
];

export const CollectionCentre = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [companyList, setCompanyList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [formHasError, setFormError] = useState(false);
    const [activeTabName, setActiveTabName] = useState();

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add Collection Centre"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Add FIGs"]').attr('disabled', true);
        getCompany();
    }, []);

    const collectionCentreDetailsReducer = useSelector((state) => state.rootReducer.collectionCentreDetailsReducer)
    var collectionCentreData = collectionCentreDetailsReducer.collectionCentreDetails;

    const commonContactDetailsReducer = useSelector((state) => state.rootReducer.commonContactDetailsReducer)
    const commonContactDetailList = commonContactDetailsReducer.commonContactDetails;

    const figDetailsReducer = useSelector((state) => state.rootReducer.figDetailsReducer)
    const figDetailsList = figDetailsReducer.figDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let isFormChanged = Object.values(formChangedData).some(value => value === true);

    const getContactDetail = async () => {
        const request = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
            EncryptedConnectingCode: localStorage.getItem("EncryptedCollectionCentreCode"),
            OriginatedFrom: "CC"
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

    if ((localStorage.getItem("EncryptedCollectionCentreCode") || collectionCentreData.encryptedCollectionCentreCode)
        && commonContactDetailList.length <= 0
        && !(localStorage.getItem("DeleteCommonContactDetailsIds"))) {
        getContactDetail();
    }

    const clearCollectionCentreReducers = () => {
        dispatch(collectionCentreDetailsErrorAction(undefined));
        dispatch(commonContactDetailsAction([]));
        dispatch(commonContactDetailsErrorAction(undefined))
        dispatch(figDetailsAction([]));
        dispatch(formChangedAction(undefined));
        localStorage.removeItem('DeleteCommonContactDetailsIds');
        localStorage.removeItem('DeleteFigCodes');
        localStorage.removeItem('EncryptedDistributionCentreCode')
    }

    const newDetails = () => {
        if (localStorage.getItem("EncryptedCompanyCode")) {
            $('[data-rr-ui-event-key*="Add Collection Centre"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add Collection Centre"]').trigger('click');
            $('[data-rr-ui-event-key*="Add FIGs"]').attr('disabled', false);
            $('#btnSave').attr('disabled', false);
            dispatch(tabInfoAction({ title1: `${localStorage.getItem("CompanyName")}` }))
            clearCollectionCentreReducers();
            dispatch(collectionCentreDetailsAction(undefined));
        }
        else {
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
            $('[data-rr-ui-event-key*="Collection Centre List"]').trigger('click');
        }

        setModalShow(false);
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            $('[data-rr-ui-event-key*="Collection Centre List"]').trigger('click');
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

    $('[data-rr-ui-event-key*="Collection Centre List"]').off('click').on('click', function () {
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
            $('[data-rr-ui-event-key*="Add Collection Centre"]').attr('disabled', true);
            $('[data-rr-ui-event-key*="Add FIGs"]').attr('disabled', true);
            $("#btnDiscard").attr("isDiscard", false)
            clearCollectionCentreReducers();
            dispatch(collectionCentreDetailsAction(undefined));
            localStorage.removeItem('EncryptedCollectionCentreCode');
        }
    })

    $('[data-rr-ui-event-key*="Add Collection Centre"]').off('click').on('click', function () {
        setActiveTabName("Add Collection Centre")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        $('[data-rr-ui-event-key*="Add FIGs"]').attr('disabled', false);

        if (commonContactDetailList.length <= 0 && !(localStorage.getItem("DeleteCommonContactDetailsIds")) && (localStorage.getItem("EncryptedCollectionCentreCode") || collectionCentreData.encryptedCollectionCentreCode)) {
            getContactDetail();
        }
    });

    $('[data-rr-ui-event-key*="Add FIGs"]').off('click').on('click', function () {
        setActiveTabName("Add FIGs")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();

        if (figDetailsList.length <= 0 &&
            !(localStorage.getItem("DeleteFigCodes")) &&
            (localStorage.getItem("EncryptedCollectionCentreCode") ||
                collectionCentreData.encryptedCollectionCentreCode)) {
            getFigDetail();
        }
    });

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
            if(companyResponse.data.data.length == 1){
                fetchCollectionCentreList(1, perPage, companyResponse.data.data[0].encryptedCompanyCode);
                fetchDistributionCentreList(companyResponse.data.data[0].encryptedCompanyCode);
                localStorage.setItem("CompanyName", companyResponse.data.data[0].companyName)
                localStorage.setItem("EncryptedCompanyCode", companyResponse.data.data[0].encryptedCompanyCode);
            }
        } else {
            setCompanyList([])
        }
    }

    const handleFieldChange = e => {
        localStorage.setItem("EncryptedCompanyCode", e.target.value);
        const selectedOption = e.target.options[e.target.selectedIndex];
        const selectedKey = selectedOption.dataset.key || selectedOption.label;
        localStorage.setItem("CompanyName", selectedKey)
        fetchCollectionCentreList(1, perPage, e.target.value)
        fetchDistributionCentreList(e.target.value);
    }

    const fetchCollectionCentreList = async (page, size = perPage, encryptedCompanyCode) => {

        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
            EncryptedCompanyCode: encryptedCompanyCode
        };

        setIsLoading(true);
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-collection-centre-master-list', listFilter, {
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

    const fetchDistributionCentreList = async (encryptedCompanyCode) => {
        const request = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
            EncryptedCompanyCode: encryptedCompanyCode
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-distribution-centre-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        let distributionCentreListData = [];
        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(distributionCentre => {
                    distributionCentreListData.push({
                        key: distributionCentre.distributionName,
                        value: distributionCentre.distributionCentreCode
                    })
                })
            }
            dispatch(distributionCentreListAction(distributionCentreListData));
        }
    }

    const collectionCentreValidation = () => {
        setModalShow(false);
        const collectionCentreNameErr = {};
        const distributionCentreErr = {};
        const countryErr = {};
        const stateErr = {};
        const collectionCentreTypeErr = {};
        const figDetailErr = {};
        const contactErr = {};

        let isValid = true;
        let isAddCollectionCentreTabValid = true;

        if (!collectionCentreData.collectionCentreName) {
            collectionCentreNameErr.empty = "Enter collection centre name";
            isValid = false;
            isAddCollectionCentreTabValid = false;
            setFormError(true);
        }

        if (!collectionCentreData.distributionCentreCode) {
            distributionCentreErr.empty = "Select distribution centre";
            isValid = false;
            isAddCollectionCentreTabValid = false;
            setFormError(true);
        }

        if (!collectionCentreData.countryCode) {
            countryErr.empty = "Select country"
            isValid = false;
            isAddCollectionCentreTabValid = false;
            setFormError(true);
        }

        if (!collectionCentreData.stateCode) {
            stateErr.empty = "Select state"
            isValid = false;
            isAddCollectionCentreTabValid = false;
            setFormError(true);
        }

        if (!collectionCentreData.collectionCentreType) {
            collectionCentreTypeErr.empty = "Select collection centre type"
            isValid = false;
            isAddCollectionCentreTabValid = false;
            setFormError(true);
        }

        if (!isAddCollectionCentreTabValid) {
            if (!$('[data-rr-ui-event-key*="Add Collection Centre"]').hasClass('active')) {
                $('[data-rr-ui-event-key*="Add Collection Centre"]').trigger('click');
            }
        }

        if (commonContactDetailList.length < 1) {
            contactErr.contactEmpty = "At least one contact detail required";
            toast.error(contactErr.contactEmpty, {
                theme: 'colored'
            });
            isValid = false;
            isAddCollectionCentreTabValid = false;
            setFormError(true);
        }
        else if (commonContactDetailList && commonContactDetailList.length > 0) {
            commonContactDetailList.forEach((row, index) => {
                if (!row.contactPerson || !row.contactType || !row.contactDetails) {
                    contactErr.invalidContactDetail = "All fields are required in contact details";
                    isValid = false
                }
            });
        }

        if (figDetailsList && figDetailsList.length > 0) {
            figDetailsList.forEach((row, index) => {
                if (!row.figName || !row.stateCode || !row.countryCode) {
                    figDetailErr.invalidFigDetail = "Fill the required fields";
                    isValid = false;
                    if (isAddCollectionCentreTabValid) {
                        $('[data-rr-ui-event-key*="Add FIGs"]').trigger('click');
                    }
                }
            });
        }

        if (!isValid) {
            var errorObject = {
                collectionCentreNameErr,
                countryErr,
                stateErr,
                figDetailErr,
                collectionCentreTypeErr,
                distributionCentreErr
            }
            dispatch(collectionCentreDetailsErrorAction(errorObject))

            var contactErrorObject = {
                contactErr
            }
            dispatch(commonContactDetailsErrorAction(contactErrorObject));
        }
        return isValid;
    }

    const updateCollectionCentreCallback = (isAddCollectionCentre = false) => {
        setModalShow(false);

        dispatch(collectionCentreDetailsErrorAction(undefined));
        localStorage.removeItem("DeleteCommonContactDetailsIds");

        if (!isAddCollectionCentre) {
            toast.success("Collection centre details updated successfully", {
                theme: 'colored'
            })
        }

        $('#btnSave').attr('disabled', true)

        clearCollectionCentreReducers();

        fetchCollectionCentreList(1, perPage, localStorage.getItem("EncryptedCompanyCode"))

        $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
    }

    const addCollectionCentreDetails = () => {
        if (collectionCentreValidation()) {
            const requestData = {
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                distributionCentreCode: collectionCentreData.distributionCentreCode,
                collectionCentreName: collectionCentreData.collectionCentreName,
                collectionCentreShortName: collectionCentreData.collectionCentreShortName ? collectionCentreData.collectionCentreShortName : "",
                collectionCentreType: collectionCentreData.collectionCentreType == "Owned" ? "O" : "F",
                address: collectionCentreData.address ? collectionCentreData.address : "",
                stateCode: collectionCentreData.stateCode,
                activeStatus: collectionCentreData.status == null || collectionCentreData.status == "Active" ? "A" : "S",
                addUser: localStorage.getItem("LoginUserName"),
                commonContactDetails: commonContactDetailList,
                figDetails: figDetailsList
            }

            const keys = ["collectionCentreName", "collectionCentreShortName", "address", "addUser"]
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

            const figDetailKeys = ['figName', 'figShortName', 'address']
            var index = 0;
            for (var obj in requestData.figDetails) {
                var figDetailObj = requestData.figDetails[obj];

                for (const key of Object.keys(figDetailObj).filter((key) => figDetailKeys.includes(key))) {
                    figDetailObj[key] = figDetailObj[key] ? figDetailObj[key].toUpperCase() : '';
                }
                requestData.figDetails[index] = figDetailObj;
                index++;
            }

            setIsLoading(true);
            axios.post(process.env.REACT_APP_API_URL + '/add-collection-centre-details', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    if (res.data.status == 200) {
                        setIsLoading(false)
                        setTimeout(function () {
                            dispatch(collectionCentreDetailsAction({
                                ...collectionCentreData,
                                encryptedCollectionCentreCode: res.data.data.encryptedCollectionCentreCode
                            }))
                        }, 50);
                        localStorage.setItem("EncryptedCollectionCentreCode", res.data.data.encryptedCollectionCentreCode)

                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updateCollectionCentreCallback(true);
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

    const getFigDetail = async () => {
        const request = {
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
            EncryptedCollectionCentreCode: localStorage.getItem("EncryptedCollectionCentreCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-fig-master-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(figDetailsAction(response.data.data));
            }
        }
    }

    const updateCollectionCentreDetails = async () => {
        if (collectionCentreValidation()) {
            var deleteCommonContactDetailsId = localStorage.getItem("DeleteCommonContactDetailsIds");
            var deleteFigCodes = localStorage.getItem("DeleteFigCodes");

            const updateCollectionCentreDetails = {
                encryptedCollectionCentreCode: collectionCentreData.encryptedCollectionCentreCode,
                encryptedClientCode: localStorage.getItem('EncryptedClientCode'),
                encryptedCompanyCode: localStorage.getItem('EncryptedCompanyCode'),
                distributionCentreCode: collectionCentreData.distributionCentreCode,
                collectionCentreName: collectionCentreData.collectionCentreName,
                collectionCentreShortName: collectionCentreData.collectionCentreShortName,
                collectionCentreType: collectionCentreData.collectionCentreType == "Owned" ? "O" : "F",
                address: collectionCentreData.address ? collectionCentreData.address : "",
                stateCode: collectionCentreData.stateCode,
                activeStatus: collectionCentreData.status == null || collectionCentreData.status == "Active" ? "A" : "S",
                modifyUser: localStorage.getItem("LoginUserName")
            }

            const keys = ['collectionCentreName', 'collectionCentreShortName', 'address', 'modifyUser']
            for (const key of Object.keys(updateCollectionCentreDetails).filter((key) => keys.includes(key))) {
                updateCollectionCentreDetails[key] = updateCollectionCentreDetails[key] ? updateCollectionCentreDetails[key].toUpperCase() : '';
            }

            var hasError = false;

            if (formChangedData.collectionCentreUpdate) {
                setIsLoading(true)
                await axios.post(process.env.REACT_APP_API_URL + '/update-collection-centre-details', updateCollectionCentreDetails, {
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
            var figDetailIndex = 1;

            //CommonContactDetail add, update and delete
            if (!hasError && ((formChangedData.contactDetailUpdate || formChangedData.contactDetailAdd || formChangedData.contactDetailDelete))) {

                if (!hasError && formChangedData.contactDetailDelete) {
                    var deleteCommonContactDetailsList = deleteCommonContactDetailsId ? deleteCommonContactDetailsId.split(',') : null;
                    if (deleteCommonContactDetailsList) {
                        var deleteCommonContactDetailsIndex = 1;

                        for (let i = 0; i < deleteCommonContactDetailsList.length; i++) {
                            const deleteCommonContactDetailId = deleteCommonContactDetailsList[i];
                            const data = { encryptedCommonContactDetailsId: deleteCommonContactDetailId }
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
                    const contactDetail = commonContactDetailList[i];

                    const keys = ['contactPerson', 'addUser', 'modifyUser']
                    for (const key of Object.keys(contactDetail).filter((key) => keys.includes(key))) {
                        contactDetail[key] = contactDetail[key] ? contactDetail[key].toUpperCase() : '';
                    }

                    if (!hasError && formChangedData.contactDetailUpdate && contactDetail.encryptedCommonContactDetailsId) {
                        const requestData = {
                            encryptedCommonContactDetailsId: contactDetail.encryptedCommonContactDetailsId,
                            contactPerson: contactDetail.contactPerson,
                            contactType: contactDetail.contactType,
                            contactDetails: contactDetail.contactDetails,
                            originatedFrom: "CC",
                            modifyUser: localStorage.getItem("LoginUserName")
                        }

                        setIsLoading(true);
                        const updateContactDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-common-contact-detail', requestData, {
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
                    else if (!hasError && formChangedData.contactDetailAdd && !contactDetail.encryptedCommonContactDetailsId) {
                        const requestData = {
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedConnectingCode: localStorage.getItem("EncryptedCollectionCentreCode"),
                            contactPerson: contactDetail.contactPerson,
                            contactType: contactDetail.contactType,
                            contactDetails: contactDetail.contactDetails,
                            originatedFrom: "CC",
                            addUser: localStorage.getItem("LoginUserName")
                        }
                        setIsLoading(true);
                        const addFarmerContactDetailsResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/add-common-contact-details', requestData, {
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

            //FigDetail add, update and delete
            if (!hasError && ((formChangedData.figDelete || formChangedData.figDetailAdd || formChangedData.figDetailUpdate))) {

                if (!hasError && formChangedData.figDelete) {
                    var deleteFigDetailsList = deleteFigCodes ? deleteFigCodes.split(',') : null;
                    if (deleteFigDetailsList) {
                        var deleteFigDetailsIndex = 1;

                        for (let i = 0; i < deleteFigDetailsList.length; i++) {
                            const deleteFigDetailCode = deleteFigDetailsList[i];
                            const data = { encryptedFigCode: deleteFigDetailCode }
                            const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

                            const deleteFigDetailResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-fig-details', { headers, data });
                            if (deleteFigDetailResponse.data.status != 200) {
                                toast.error(deleteFigDetailResponse.data.message, {
                                    theme: 'colored',
                                    autoClose: 10000
                                });
                                hasError = true;
                                break;
                            }
                        }
                        deleteFigDetailsIndex++
                    }
                }

                for (let i = 0; i < figDetailsList.length; i++) {
                    const figDetail = figDetailsList[i];

                    const keys = ['figName', 'figShortName', 'address', 'addUser', 'modifyUser']
                    for (const key of Object.keys(figDetail).filter((key) => keys.includes(key))) {
                        figDetail[key] = figDetail[key] ? figDetail[key].toUpperCase() : '';
                    }

                    if (!hasError && formChangedData.figDetailUpdate && figDetail.encryptedFigCode) {
                        const figRequestData = {
                            encryptedFigCode: figDetail.encryptedFigCode,
                            encryptedCompanyCode: localStorage.getItem('EncryptedCompanyCode'),
                            encryptedClientCode: localStorage.getItem('EncryptedClientCode'),
                            encryptedCollectionCentreCode: localStorage.getItem('EncryptedCollectionCentreCode'),
                            figName: figDetail.figName,
                            figShortName: figDetail.figShortName ? figDetail.figShortName : '',
                            address: figDetail.address ? figDetail.address : '',
                            stateCode: figDetail.stateCode,
                            activeStatus: figDetail.activeStatus,
                            modifyUser: localStorage.getItem("LoginUserName")
                        }

                        setIsLoading(true);
                        const updateFigDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-fig-details', figRequestData, {
                            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        });
                        setIsLoading(false);
                        if (updateFigDetailResponse.data.status != 200) {
                            toast.error(updateFigDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                            break;
                        }
                    }
                    else if (!hasError && formChangedData.figDetailAdd && !figDetail.encryptedFigCode) {
                        const figRequestData = {
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                            encryptedCollectionCentreCode: localStorage.getItem("EncryptedCollectionCentreCode"),
                            figName: figDetail.figName,
                            figShortName: figDetail.figShortName,
                            address: figDetail.address,
                            stateCode: figDetail.stateCode,
                            activeStatus: figDetail.activeStatus,
                            addUser: localStorage.getItem("LoginUserName")
                        }
                        setIsLoading(true);
                        const addFigDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-fig-details', figRequestData, {
                            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        });
                        setIsLoading(false);
                        if (addFigDetailResponse.data.status != 200) {
                            toast.error(addFigDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                            break;
                        }
                    }
                    figDetailIndex++
                }
            }

            if (!hasError) {
                clearCollectionCentreReducers();
                updateCollectionCentreCallback();
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
                        <Button variant="success" onClick={collectionCentreData.encryptedCollectionCentreCode ? updateCollectionCentreDetails : addCollectionCentreDetails}>Save</Button>
                        <Button id="btnDiscard" variant="danger" onClick={() => discardChanges()}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="CollectionCentre"
                saveDetails={collectionCentreData.encryptedCollectionCentreCode ? updateCollectionCentreDetails : addCollectionCentreDetails}
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

export default CollectionCentre