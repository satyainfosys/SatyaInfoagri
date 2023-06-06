import React, { useState, useEffect } from 'react'
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { commonContactDetailsAction, distributionCentreDetailsAction, distributionCentreDetailsErrorAction, formChangedAction } from 'actions';
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
        dispatch(distributionCentreDetailsAction(undefined));
        dispatch(commonContactDetailsAction([]));
        dispatch(formChangedAction(undefined));
    }

    const newDetails = () => {
        if (localStorage.getItem("EncryptedCompanyCode")) {
            $('[data-rr-ui-event-key*="Add New Distribution"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add New Distribution"]').trigger('click');
            $('#btnSave').attr('disabled', false);
            clearDistributionCentreReducers();
            localStorage.removeItem("EncryptedDistributionCentreCode");
        } else {
            toast.error("Please select company first", {
                theme: 'colored',
                autoClose: 5000
            });
        }
    }

    $('[data-rr-ui-event-key*="Add New Distribution"]').off('click').on('click', function () {
        setActiveTabName("Add New Distribution");
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
       
        getDistributionCentreDetail();
        getContactDetail();
    });

    $('[data-rr-ui-event-key*="Distribution List"]').off('click').on('click', function () {
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add New Distribution"]').attr('disabled', true);
        clearDistributionCentreReducers();
        localStorage.removeItem("EncryptedDistributionCentreCode");
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
            commonContactDetailList.forEach((row, index) => {
                if (!row.contactPerson || !row.contactType || !row.contactDetails) {
                    contactErr.invalidContactDetail = "All fields are required in contact details";
                    isValid = false
                }
            });
        }

        if (!isValid) {
            var errorObject = {
                distributionNameErr,
                countryErr,
                stateErr,
                contactErr
            }
            dispatch(distributionCentreDetailsErrorAction(errorObject));
        }

        return isValid;
    }

    const updateDistributionCentreCallback = (isAddDistributionCentre = false) => {
        setModalShow(false);

        dispatch(distributionCentreDetailsErrorAction(undefined));

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
                distributionShortName: distirbutionCentreData.distributionShortName,
                coldStorage: distirbutionCentreData.coldStorage == null || distirbutionCentreData.coldStorage == "No" ? "N" : "Y",
                processingUnit: distirbutionCentreData.processingUnit == null || distirbutionCentreData.processingUnit == "No" ? "N" : "Y",
                address: distirbutionCentreData.address,
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
                        localStorage.setItem("EncryptedDistributionCentreCode", res.data.data.encryptedDistributionCentreCode)

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

            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="DistributionCentre"
                saveDetails={distirbutionCentreData.encryptedDistributionCentreCode ? updateDistributionCentreDetails : addDistributionCentreDetails}
                newDetails={newDetails}
                // cancelClick={cancelClick}
                // exitModule={exitModule}
                tableFilterOptions={companyList}
                tableFilterName={'Company'}
                supportingMethod1={handleFieldChange}
            />
        </>
    )
}

export default DistributionCentre