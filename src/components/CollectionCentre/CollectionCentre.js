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
    { accessor: 'stateName', Header: 'State' },
    { accessor: 'ccType', Header: 'CC Type' },
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

    const clearCollectionCentreReducers = () => {
        dispatch(collectionCentreDetailsErrorAction(undefined));
        dispatch(collectionCentreDetailsAction(undefined));
        dispatch(commonContactDetailsAction([]));
        dispatch(commonContactDetailsErrorAction(undefined))
        dispatch(figDetailsAction([]));
        dispatch(formChangedAction(undefined));
    }

    const newDetails = () => {
        if (localStorage.getItem("EncryptedCompanyCode")) {
            $('[data-rr-ui-event-key*="Add Collection Centre"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add Collection Centre"]').trigger('click');
            $('[data-rr-ui-event-key*="Add FIGs"]').attr('disabled', false);
            $('#btnSave').attr('disabled', false);
            dispatch(tabInfoAction({ title1: `Company: ${localStorage.getItem("CompanyName")}` }))
            clearCollectionCentreReducers();
            localStorage.removeItem("EncryptedCollectionCentreCode");
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
            $('[data-rr-ui-event-key*="Distribution List"]').trigger('click');
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
        }
    })

    $('[data-rr-ui-event-key*="Add Collection Centre"]').off('click').on('click', function () {
        setActiveTabName("Add Collection Centre")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();

        getCollectionCentreDetail();
        if (commonContactDetailList.length <= 0 && !(localStorage.getItem("DeleteCommonContactDetailsIds")) && (localStorage.getItem("EncryptedFarmerCode") || collectionCentreData.encryptedCollectionCentreCode)){
            getContactDetail();
        }
    });

    $('[data-rr-ui-event-key*="Add FIGs"]').off('click').on('click', function () {
        setActiveTabName("Add FIGs")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
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

    const updateCollectionCentreDetails = () => {

    }

    const getCollectionCentreDetail = async () => {
        const request = {
            encryptedCollectionCentreCode: localStorage.getItem("EncryptedCollectionCentreCode")
        }

        let collectionCentreResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-collection-centre-master-detail', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (collectionCentreResponse.data.status == 200) {
            if (collectionCentreResponse.data.data) {
                dispatch(collectionCentreDetailsAction(collectionCentreResponse.data.data))
                dispatch(tabInfoAction({
                    title1: `Company: ${localStorage.getItem("CompanyName")}`,
                    title2: collectionCentreResponse.data.data.collectionCentreName
                }))
            }
        }
    }

    const getContactDetail = async () => {
        const request = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
            EncryptedConnectingCode: localStorage.getItem("EncryptedCollectinCentreCode"),
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

    // const getFigDetail = async () => {

    // }

    return (
        <>
            {isLoading ? (
                <Spinner
                    className="position-absolute start-50 loader-color"
                    animation="border"
                />
            ) : null}

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