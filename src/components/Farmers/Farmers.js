import React, { useState, useEffect, useRef } from 'react';
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { bankDetailsAction, commonContactDetailsAction, farmerCardDetailsAction, farmerDetailsAction, farmerDetailsErrorAction, farmerFamilyDetailsAction, farmerIrrigationDetailsAction, farmerLiveStockCattleDetailsAction, farmerMachineryDetailsAction } from 'actions';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const tabArray = ['Farmers', 'Add Farmer', 'Family', 'Bank', 'Land', 'Cattle', 'Documents', 'Events', 'Mkt SMS'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'cardNo', Header: 'Card No' },
    { accessor: 'farmerName', Header: 'Farmer Name' },
    { accessor: 'farmerFatherName', Header: 'Father Name' },
    { accessor: 'village', Header: 'Village' },
    { accessor: 'district', Header: 'District Code' },
    { accessor: 'figCode', Header: 'FIG Code' },
    { accessor: 'mobile', Header: 'Mobile' },
    { accessor: 'user', Header: 'User' },
    { accessor: 'approvalStatus', Header: 'Approval Status' }
];

export const Farmers = () => {

    const dispatch = useDispatch();
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(false);
    const [formHasError, setFormError] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [familyAPI, setFamilyAPI] = useState(true);

    const fetchFarmerList = async (page, size = perPage, encryptedCompanyCode) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            encryptedCompanyCode: encryptedCompanyCode
        };

        setIsLoading(true);
        await axios
            .post(process.env.REACT_APP_API_URL + '/farmer-list', listFilter, {
                headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
            })
            .then(res => {
                setIsLoading(false);
                if (res.data.status == 200) {
                    setListData(res.data.data);
                } else {
                    setListData([])
                }
            });
    };

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add Farmer"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Family"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Bank"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Land"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Cattle"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Documents"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Events"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Mkt SMS"]').attr('disabled', true);
        getCompany();
        localStorage.removeItem("DeleteFarmerFamilyCodes");
    }, []);

    const farmerDetailsReducer = useSelector((state) => state.rootReducer.farmerDetailsReducer)
    const farmerData = farmerDetailsReducer.farmerDetails;

    const farmerFamilyDetailsReducer = useSelector((state) => state.rootReducer.farmerFamilyDetailsReducer)
    const farmerFamilyDetailsList = farmerFamilyDetailsReducer.farmerFamilyDetails;

    const commonContactDetailsReducer = useSelector((state) => state.rootReducer.commonContactDetailsReducer)
    const commonContactDetailList = commonContactDetailsReducer.commonContactDetails;

    const bankDetailsReducer = useSelector((state) => state.rootReducer.bankDetailsReducer)
    const bankDetailList = bankDetailsReducer.bankDetails;

    const farmerLiveStockCattleDetailsReducer = useSelector((state) => state.rootReducer.farmerLiveStockCattleDetailsReducer)
    const farmerLiveStockCattleList = farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails;

    const farmerMachineryDetailsReducer = useSelector((state) => state.rootReducer.farmerMachineryDetailsReducer)
    const farmerMachineryDetailsList = farmerMachineryDetailsReducer.farmerMachineryDetails;

    const farmerCardDetailsReducer = useSelector((state) => state.rootReducer.farmerCardDetailsReducer)
    const farmerCardDetailsList = farmerCardDetailsReducer.farmerCardDetails;

    const farmerIrrigationDetailsReducer = useSelector((state) => state.rootReducer.farmerIrrigationDetailsReducer)
    const farmerIrrigationDetailsList = farmerIrrigationDetailsReducer.farmerIrrigationDetails;

    const farmerFamilyDetailChangedReducer = useSelector((state) => state.rootReducer.farmerFamilyDetailChangedReducer)
    let farmerFamilyDetailChanged = farmerFamilyDetailChangedReducer.farmerFamilyDetailChanged;

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

    $("#AddFarmersDetailForm").trackChanges();

    const clearFarmerReducers = () => {
        dispatch(farmerDetailsErrorAction(undefined));
        dispatch(farmerDetailsAction(undefined));
        dispatch(farmerFamilyDetailsAction(undefined));
        dispatch(commonContactDetailsAction(undefined));
        dispatch(bankDetailsAction(undefined));
        dispatch(farmerCardDetailsAction(undefined));
        dispatch(farmerLiveStockCattleDetailsAction(undefined));
        dispatch(farmerMachineryDetailsAction(undefined));
        dispatch(farmerIrrigationDetailsAction(undefined));
        $("#AddFarmerDetailsForm").data("changed", false);
    }

    const newDetails = () => {
        if (localStorage.getItem("EncryptedCompanyCode")) {
            $('[data-rr-ui-event-key*="Add Farmer"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add Farmer"]').trigger('click');
            $('[data-rr-ui-event-key*="Family"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Bank"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Land"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Cattle"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Documents"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Events"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Mkt SMS"]').attr('disabled', false);
            $('#btnSave').attr('disabled', false);
            $("#AddFarmerDetailsForm").data("changed", false);
            clearFarmerReducers();
        } else {
            toast.error("Please select company first", {
                theme: 'colored',
                autoClose: 5000
            });
        }
    }

    $('[data-rr-ui-event-key*="Farmers"]').click(function () {
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add Farmer"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Family"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Bank"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Land"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Cattle"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Documents"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Events"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Mkt SMS"]').attr('disabled', true);
        clearFarmerReducers();
        localStorage.removeItem("EncryptedFarmerCode");
    })

    $('[data-rr-ui-event-key*="Add Farmer"]').click(function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        $('[data-rr-ui-event-key*="Family"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Bank"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Land"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Cattle"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Documents"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Events"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Mkt SMS"]').attr('disabled', false);
    })

    $('[data-rr-ui-event-key*="Family"]').click(function () {
        $('#btnSave').attr('disabled', false);
        getFarmerFamilyDetail();
        getFarmerContactDetail();
    })

    // $(document).on('click', '[data-rr-ui-event-key*="Family"]', function () {
    //     debugger
    //     $("#btnNew").hide();
    //     $("#btnSave").show();
    //     $("#btnCancel").show();
    //     if (!familyAPICalled) {
    //         getFarmerFamilyDetail();
    //         getFarmerContactDetail();
    //     }
    // });

    $('[data-rr-ui-event-key*="Bank"]').click(function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        getFarmerKisanCardDetail();
        getBankDetail();
    })

    $('[data-rr-ui-event-key*="Land"]').click(function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        getFarmerIrrigationDetail();
    })

    $('[data-rr-ui-event-key*="Cattle"]').click(function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        getFarmerLiveStockCattleList();
        getFarmerMachineryList();

    })

    const farmerValidation = () => {
        const firstNameErr = {};
        const lastNameErr = {};
        const addressErr = {};

        let isValid = true;

        if (!farmerData.firstName) {
            firstNameErr.empty = "Enter first name";
            isValid = false;
            setFormError(true);
        }

        if (!farmerData.lastName) {
            lastNameErr.empty = "Enter last name";
            isValid = false;
            setFormError(true);
        }

        if (!farmerData.address) {
            addressErr.empty = "Enter address";
            isValid = false;
            setFormError(true);
        }

        if (!isValid) {
            var errorObject = {
                firstNameErr,
                lastNameErr,
                addressErr
            }
            dispatch(farmerDetailsErrorAction(errorObject))
        }
        return isValid;
    }

    const updateFarmerCallback = (isAddFarmer = false) => {
        $("#AddFarmersDetailForm").data("changed", false);
        $('#AddFarmersDetailForm').get(0).reset();

        $("#AddDocumentDetailsForm").data("changed", false);
        $('#AddDocumentDetailsForm').get(0).reset();

        dispatch(farmerDetailsErrorAction(undefined));
        localStorage.removeItem("DeleteFarmerFamilyCodes");
        localStorage.removeItem("DeleteCommonContactDetailsIds");

        if (!isAddFarmer) {
            toast.success("Farmer details updated successfully!", {
                theme: 'colored'
            });
        }

        $('#btnSave').attr('disabled', true)

        fetchFarmerList(1, perPage, localStorage.getItem("EncryptedCompanyCode"));
    }

    const uploadDocuments = async (uploadDocument, encryptedId, documentType, isUpdate, isRemoved) => {
        var formData = new FormData();
        formData.append("UploadDocument", uploadDocument);
        formData.append("EncryptedId", encryptedId)
        formData.append("DocumentType", documentType)
        formData.append("IsUpdate", isUpdate)
        formData.append("IsRemoved", isRemoved)
        await axios.post(process.env.REACT_APP_API_URL + '/upload-document', formData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
            .then(res => {
                setIsLoading(false);
                if (res.data.status == 200) {
                    if (!isUpdate) {
                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        });
                        updateFarmerCallback(true);
                        $('[data-rr-ui-event-key*="Farmers"]').click();
                    }
                    else {
                        updateFarmerCallback();
                    }
                } else {
                    toast.error(res.data.message, {
                        theme: 'colored',
                        autoClose: 10000
                    });
                }
            })
    }

    const deleteDocument = async (encryptedId, isRemoved, documentType) => {
        var deleteRequest = {
            EncryptedId: encryptedId,
            DocumentType: documentType,
            IsRemoved: isRemoved
        }

        await axios.post(process.env.REACT_APP_API_URL + '/delete-document', deleteRequest, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
            .then(res => {
                setIsLoading(false);
                if (res.data.status == 200) {
                    if (documentType == "ProfilePhoto") {
                        dispatch(farmerDetailsAction({
                            ...farmerData,
                            removeProfilePhoto: false
                        }))
                    }

                    if (documentType == "FarmerForm") {
                        dispatch(farmerDetailsAction({
                            ...farmerData,
                            removeFarmerOriginalForm: false
                        }))
                    }

                    updateFarmerCallback();
                } else {
                    toast.error(res.data.message, {
                        theme: 'colored',
                        autoClose: 10000
                    });
                }
            })
    }

    const addFarmerDetails = () => {
        if (farmerValidation()) {
            const requestData = {
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                farmerFirstName: farmerData.firstName,
                farmerMiddleName: farmerData.middleName ? farmerData.middleName : "",
                farmerLastName: farmerData.lastName,
                farmerAddress: farmerData.address,
                farmerEducation: farmerData.educationalStatus == "Primary School" ? "PRS" : farmerData.educationalStatus == "High School" ? "HGS" : farmerData.educationalStatus == "Inter" ? "INT" : farmerData.educationalStatus == "Graduate" ? "GRD" : farmerData.educationalStatus == "Post Graduate" ? "PSG" : farmerData.educationalStatus == "Illiterate" ? "ILT" : farmerData.educationalStatus == "Doctrate" ? "DOC" : "",
                farmerIDType: farmerData.farmerIDType == "Voter ID" ? "VID" : farmerData.farmerIDType == "Driving License" ? "DL" : farmerData.farmerIDType == "PAN Card" ? "PAN" : farmerData.farmerIDType == "Ration Card" ? "RTC" : farmerData.farmerIDType == "Other" ? "OTH" : "",
                farmerIdNo: farmerData.farmerIdNo ? farmerData.farmerIdNo : "",
                farmerSocialCategory: farmerData.socialCategory == "ST" ? "ST" : farmerData.socialCategory == "SC" ? "SC" : farmerData.socialCategory == "OBC" ? "OBC" : farmerData.socialCategory == "General" ? "GEN" : "",
                farmerDOB: farmerData.farmerDOB ? farmerData.farmerDOB : new Date(),
                farmerGender: farmerData.farmerGender == "Male" ? "M" : farmerData.farmerGender == "Female" ? "F" : farmerData.farmerGender == "Others" ? "O" : "",
                farmerMaritalStatus: farmerData.maritalStatus == "Married" ? "M" : farmerData.maritalStatus == "Unmarried" ? "U" : farmerData.maritalStatus == "Divorced" ? "D" : "",
                farmerFatherName: farmerData.fatherName ? farmerData.fatherName : "",
                farmerTotalLand: farmerData.totalLand ? parseFloat(farmerData.totalLand).toFixed(2) : 0,
                farmerUser: "",
                farmerPassword: "",
                encryptedFigCode: "",
                encryptedCollCentreCode: "",
                encryptedDistributionCentreCode: "",
                encryptedCountryCode: farmerData.encryptedCountryCode ? farmerData.encryptedCountryCode : "",
                encryptedStateCode: farmerData.encryptedStateCode ? farmerData.encryptedStateCode : "",
                encryptedDistrictCode: farmerData.encryptedDistrictCode ? farmerData.encryptedDistrictCode : "",
                encryptedTehsilCode: farmerData.encryptedTehsilCode ? farmerData.encryptedTehsilCode : "",
                encryptedBlockCode: farmerData.encryptedBlockCode ? farmerData.encryptedBlockCode : "",
                encryptedPostOfficeCode: farmerData.encryptedPostOfficeCode ? farmerData.encryptedPostOfficeCode : "",
                encryptedVillageCode: farmerData.encryptedVillageCode ? farmerData.encryptedVillageCode : "",
                activeStatus: farmerData.status == null || farmerData.status == "Active" ? "A" : "S",
                approvalStatus: farmerData.approvalStatus == "Approved" ? "A" : farmerData.approvalStatus == "Draft" ? "D" : farmerData.approvalStatus == "Send for Verification" ? "SV" : farmerData.approvalStatus == "Suspended" ? "S" : "",
                addUser: localStorage.getItem("LoginUserName"),
                familyDetails: farmerFamilyDetailsList,
                commonContactDetails: commonContactDetailList,
                bankDetails: bankDetailList,
                farmerMachineryDetails: farmerMachineryDetailsList,
                farmerLiveStockCattleDetails: farmerLiveStockCattleList,
                farmerKisanCardDetails: farmerCardDetailsList,
                farmerIrrigationDetails: farmerIrrigationDetailsList
            }

            const keys = ['farmerFirstName', 'farmerMiddleName', 'farmerLastName', 'farmerAddress', 'farmerFatherName', 'farmerUser', 'addUser', "farmerEducation", "farmerIdNo"]
            for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
                requestData[key] = requestData[key] ? requestData[key].toUpperCase() : '';
            }

            const familyDetailsKeys = ['familyMemberName', 'addUser']
            var index = 0;
            for (var obj in requestData.familyDetails) {
                var familyDetailObj = requestData.familyDetails[obj];

                for (const key of Object.keys(familyDetailObj).filter((key) => familyDetailsKeys.includes(key))) {
                    familyDetailObj[key] = familyDetailObj[key] ? familyDetailObj[key].toUpperCase() : '';
                }
                requestData.familyDetails[index] = familyDetailObj;
                index++;
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

            const bankKeys = ['bankName', 'bankAddress', 'branchName', 'bankIfscCode', 'addUser']
            var index = 0;
            for (var obj in requestData.bankDetails) {
                var bankDetailObj = requestData.bankDetails[obj];

                for (const key of Object.keys(bankDetailObj).filter((key) => bankKeys.includes(key))) {
                    bankDetailObj[key] = bankDetailObj[key] ? bankDetailObj[key].toUpperCase() : '';
                }
                requestData.bankDetails[index] = bankDetailObj;
                index++;
            }

            const machineryKeys = ['machineryType', 'addUser']
            var index = 0;
            for (var obj in requestData.farmerMachineryDetails) {
                var farmerMachineryDetailsObj = requestData.farmerMachineryDetails[obj];

                for (const key of Object.keys(farmerMachineryDetailsObj).filter((key) => machineryKeys.includes(key))) {
                    farmerMachineryDetailsObj[key] = farmerMachineryDetailsObj[key] ? farmerMachineryDetailsObj[key].toUpperCase() : '';
                }
                requestData.farmerMachineryDetails[index] = farmerMachineryDetailsObj;
                index++;
            }

            const irrigationKeys = ['addUser']
            var index = 0;
            for (var obj in requestData.farmerIrrigationDetails) {
                var farmerIrrigationDetailsObj = requestData.farmerIrrigationDetails[obj];

                for (const key of Object.keys(farmerIrrigationDetailsObj).filter((key) => irrigationKeys.includes(key))) {
                    farmerIrrigationDetailsObj[key] = farmerIrrigationDetailsObj[key] ? farmerIrrigationDetailsObj[key].toUpperCase() : '';
                }
                requestData.farmerIrrigationDetails[index] = farmerIrrigationDetailsObj;
                index++;
            }

            setIsLoading(true);
            axios.post(process.env.REACT_APP_API_URL + '/add-farmer', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    if (res.data.status == 200) {
                        if (farmerData.farmerPic) {
                            uploadDocuments(farmerData.farmerPic, res.data.data.encryptedFarmerCode, "ProfilePhoto", false);
                        }

                        if (farmerData.farmerForm) {
                            uploadDocuments(farmerData.farmerForm, res.data.data.encryptedFarmerCode, "FarmerForm", false);
                        } else {
                            setIsLoading(false);
                            toast.success(res.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            updateFarmerCallback(true);
                            $('[data-rr-ui-event-key*="Farmers"]').click();
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

    const discardChanges = () => {
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else
            $('[data-rr-ui-event-key*="Farmers"]').trigger('click');

        setModalShow(false);
    }

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
                        value: company.encryptedCompanyCode
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
        fetchFarmerList(1, perPage, e.target.value);
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (($("#AddFarmersDetailForm").isChanged())) {
            setModalShow(true);
        }
        else {
            window.location.href = '/dashboard';
        }
    }

    const getFarmerFamilyDetail = async () => {
        const request = {
            EncryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode")
        }

        let familyResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-farmer-family-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (familyResponse.data.status == 200) {
            if (familyResponse.data.data) {
                dispatch(farmerFamilyDetailsAction(familyResponse.data.data));
            }
        }
    }

    const getFarmerContactDetail = async () => {
        const request = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
            EncryptedConnectingCode: localStorage.getItem("EncryptedFarmerCode"),
            OriginatedFrom: "FR"
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

    const getFarmerKisanCardDetail = async () => {
        const request = {
            EncryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-farmer-kisan-card-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(farmerCardDetailsAction(response.data.data));
            }
        }
    }

    const getFarmerIrrigationDetail = async () => {
        const request = {
            EncryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-farmer-irrigation-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(farmerCardDetailsAction(response.data.data));
            }
        }
    }

    const getBankDetail = async () => {
        const request = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-bank-details-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(bankDetailsAction(response.data.data));
            }
        }
    }

    const getFarmerLiveStockCattleList = async () => {
        const request = {
            EncryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-farmer-live-stock-cattle-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(farmerCardDetailsAction(response.data.data));
            }
        }
    }

    const getFarmerMachineryList = async () => {
        const request = {
            EncryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode")
        }
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-farmer-machinery-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(farmerMachineryDetailsAction(response.data.data));
            }
        }

    }

    const updateFarmerDetails = async () => {
        if (farmerValidation()) {
            const updateFarmerData = {
                encryptedFarmerCode: farmerData.encryptedFarmerCode,
                encryptedClientCode: farmerData.encryptedClientCode,
                encryptedCompanyCode: farmerData.encryptedCompanyCode,
                farmerFirstName: farmerData.firstName,
                farmerMiddleName: farmerData.middleName,
                farmerLastName: farmerData.lastName,
                farmerAddress: farmerData.address,
                farmerIDType: farmerData.farmerIDType == "Voter ID" ? "VID" : farmerData.farmerIDType == "Driving License" ? "DL" : farmerData.farmerIDType == "PAN Card" ? "PAN" : farmerData.farmerIDType == "Ration Card" ? "RTC" : farmerData.farmerIDType == "Other" ? "OTH" : "",
                farmerIdNo: farmerData.farmerIdNo,
                farmerEducation: farmerData.educationalStatus == "Primary School" ? "PRS" : farmerData.educationalStatus == "High School" ? "HGS" : farmerData.educationalStatus == "Inter" ? "INT" : farmerData.educationalStatus == "Graduate" ? "GRD" : farmerData.educationalStatus == "Post Graduate" ? "PSG" : farmerData.educationalStatus == "Illiterate" ? "ILT" : farmerData.educationalStatus == "Doctrate" ? "DOC" : "",
                farmerSocialCategory: farmerData.socialCategory == "ST" ? "ST" : farmerData.socialCategory == "SC" ? "SC" : farmerData.socialCategory == "OBC" ? "OBC" : farmerData.socialCategory == "General" ? "GEN" : "",
                farmerDOB: farmerData.farmerDOB ? farmerData.farmerDOB : new Date(),
                farmerGender: farmerData.farmerGender == "Male" ? "M" : farmerData.farmerGender == "Female" ? "F" : farmerData.farmerGender == "Others" ? "O" : "",
                farmerMaritalStatus: farmerData.maritalStatus == "Married" ? "M" : farmerData.maritalStatus == "Unmarried" ? "U" : farmerData.maritalStatus == "Divorced" ? "D" : "",
                farmerFatherName: farmerData.fatherName ? farmerData.fatherName : "",
                farmerTotalLand: farmerData.totalLand ? parseFloat(farmerData.totalLand).toFixed(2) : 0,
                farmerUser: "",
                farmerPassword: "",
                encryptedFigCode: "",
                encryptedCollCentreCode: "",
                encryptedDistributionCentreCode: "",
                encryptedCountryCode: farmerData.encryptedCountryCode ? farmerData.encryptedCountryCode : "",
                encryptedStateCode: farmerData.encryptedStateCode ? farmerData.encryptedStateCode : "",
                encryptedDistrictCode: farmerData.encryptedDistrictCode ? farmerData.encryptedDistrictCode : "",
                encryptedTehsilCode: farmerData.encryptedTehsilCode ? farmerData.encryptedTehsilCode : "",
                encryptedBlockCode: farmerData.encryptedBlockCode ? farmerData.encryptedBlockCode : "",
                encryptedPostOfficeCode: farmerData.encryptedPostOfficeCode ? farmerData.encryptedPostOfficeCode : "",
                encryptedVillageCode: farmerData.encryptedVillageCode ? farmerData.encryptedVillageCode : "",
                approvalStatus: farmerData.approvalStatus == "Approved" ? "A" : farmerData.approvalStatus == "Draft" ? "D" : farmerData.approvalStatus == "Send for Verification" ? "SV" : farmerData.approvalStatus == "Suspended" ? "S" : "",
                activeStatus: !farmerData.status || farmerData.status == "Active" ? "A" : "S",
                modifyUser: localStorage.getItem("LoginUserName"),
            }
            // debugger
            // var updateRequired = $("#AddFarmersDetailForm").isChanged() || farmerData.removeFarmerOriginalForm == true || farmerData.removeProfilePhoto == true || farmerFamilyDetailChanged.familyDetailsChanged

            // if (!updateRequired) {
            //     toast.warning("Nothing to change!", {
            //         theme: 'colored'
            //     });

            //     return;
            // }

            const keys = ['farmerFirstName', 'farmerMiddleName', 'farmerLastName', 'farmerAddress', 'farmerFatherName', 'farmerUser', 'modifyUser', "farmerEducation", "farmerIdNo"]
            for (const key of Object.keys(updateFarmerData).filter((key) => keys.includes(key))) {
                updateFarmerData[key] = updateFarmerData[key] ? updateFarmerData[key].toUpperCase() : '';
            }

            if ($("#AddFarmersDetailForm").isChanged()) {
                setIsLoading(true);
                await axios.post(process.env.REACT_APP_API_URL + '/update-farmer', updateFarmerData, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                })
                    .then(res => {
                        setIsLoading(false);
                        if (res.data.status != 200) {
                            toast.error(res.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                        } else if (res.data.status == 200) {
                            if (farmerData.farmerPic.type) {
                                uploadDocuments(farmerData.farmerPic, res.data.data.encryptedFarmerCode, "ProfilePhoto", true);
                            }

                            if (farmerData.farmerForm && farmerData.farmerForm.type) {
                                uploadDocuments(farmerData.farmerForm, res.data.data.encryptedFarmerCode, "FarmerForm", true);
                            }

                            if (farmerData.removeProfilePhoto) {
                                deleteDocument(farmerData.encryptedFarmerCode, farmerData.removeProfilePhoto, "ProfilePhoto")
                            }

                            if (farmerData.removeFarmerOriginalForm) {
                                deleteDocument(farmerData.encryptedFarmerCode, farmerData.removeFarmerOriginalForm, "FarmerForm")
                            }
                        }
                        else if (!farmerFamilyDetailChanged.familyDetailsChanged) {
                            updateFarmerCallback();
                        }
                    })
            }

            if (farmerData.removeFarmerOriginalForm) {
                deleteDocument(farmerData.encryptedFarmerCode, farmerData.removeFarmerOriginalForm, "FarmerForm")
            }

            if (farmerData.removeProfilePhoto) {
                deleteDocument(farmerData.encryptedFarmerCode, farmerData.removeProfilePhoto, "ProfilePhoto")
            }

            var deleteFarmerFamilyCodes = localStorage.getItem("DeleteFarmerFamilyCodes");
            var deleteFarmerContactDetailsId = localStorage.getItem("DeleteCommonContactDetailsIds");

            var loopBreaked = false;
            var farmerFamilyDetailIndex = 1;
            var farmerContactDetailIndex = 1;

            for (let i = 0; i < farmerFamilyDetailsList.length; i++) {
                const farmerFamilyDetails = farmerFamilyDetailsList[i];
                if (!loopBreaked) {
                    const keys = ['familyMemberName', 'modifyUser', 'addUser']
                    for (const key of Object.keys(farmerFamilyDetails).filter((key) => keys.includes(key))) {
                        farmerFamilyDetails[key] = farmerFamilyDetails[key] ? farmerFamilyDetails[key].toUpperCase() : '';
                    }

                    if (farmerFamilyDetails.encryptedFarmerFamilyCode) {
                        setIsLoading(true);
                        const updateFarmerFamilyDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-farmer-family-detail', farmerFamilyDetails, {
                            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        });
                        setIsLoading(false);
                        if (updateFarmerFamilyDetailResponse.data.status != 200) {
                            toast.error(updateFarmerFamilyDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            loopBreaked = true;
                        }
                        else if (farmerFamilyDetailIndex == farmerFamilyDetailsList.length && !loopBreaked && !farmerData.farmerPic.type && !farmerData.farmerForm.type && !deleteFarmerFamilyCodes && !deleteFarmerContactDetailsId) {
                            updateFarmerCallback();
                        } else {
                            farmerFamilyDetailIndex++;
                        }
                    }
                    else if (!farmerFamilyDetails.encryptedFarmerFamilyCode) {
                        setIsLoading(true);
                        const addFarmerFamilyDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/add-farmer-family-member', farmerFamilyDetails, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (addFarmerFamilyDetailResponse.data.status != 200) {
                            toast.error(addFarmerFamilyDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            loopBreaked = true;
                        }
                        else if (farmerFamilyDetailIndex == farmerFamilyDetailsList.length && !loopBreaked && !farmerData.farmerPic.type && !farmerData.farmerForm.type && !deleteFarmerFamilyCodes && !deleteFarmerContactDetailsId) {
                            updateFarmerCallback();
                        }
                        else {
                            farmerFamilyDetailIndex++
                        }
                    }
                }
            }

            var deleteFarmerFamilyMemberList = deleteFarmerFamilyCodes ? deleteFarmerFamilyCodes.split(',') : null;

            if (deleteFarmerFamilyMemberList) {
                var deleteFamerFamilyMemberIndex = 1;

                deleteFarmerFamilyMemberList.forEach(async deleteFarmerFamilyCode => {
                    if (!loopBreaked) {

                        const data = { encryptedFarmerFamilycode: deleteFarmerFamilyCode }
                        const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        const deleteFarmerFamilyResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-farmer-family-detail', { headers, data });
                        if (deleteFarmerFamilyResponse.data.status != 200) {
                            toast.error(deleteContactResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            loopBreaked = true;
                        }
                        else if (deleteFamerFamilyMemberIndex == deleteFarmerFamilyMemberList.length && !loopBreaked && !deleteFarmerContactDetailsId) {
                            updateFarmerCallback();
                        }
                        else {
                            deleteFamerFamilyMemberIndex++;
                        }
                    }
                });
            }

            if (!loopBreaked) {
                for (let i = 0; i < commonContactDetailList.length; i++) {
                    const farmerContactDetails = commonContactDetailList[i];
                    const keys = ['contactPerson', 'addUser', 'modifyUser']
                    for (const key of Object.keys(farmerContactDetails).filter((key) => keys.includes(key))) {
                        farmerContactDetails[key] = farmerContactDetails[key] ? farmerContactDetails[key].toUpperCase() : '';
                    }

                    if (farmerContactDetails.encryptedCommonContactDetailsId) {
                        setIsLoading(true);
                        const updateContactDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-common-contact-detail', farmerContactDetails, {
                            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        });
                        setIsLoading(false);
                        if (updateContactDetailResponse.data.status != 200) {
                            toast.error(updateContactDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            loopBreaked = true;
                        }
                        else if (farmerContactDetailIndex == commonContactDetailList.length && !loopBreaked && !farmerData.farmerPic.type && !farmerData.farmerForm.type && !deleteFarmerContactDetailsId) {
                            updateFarmerCallback();
                        }
                        else {
                            farmerContactDetailIndex++;
                        }
                    }
                    else if (!farmerContactDetails.encryptedCommonContactDetailsId) {
                        setIsLoading(true);
                        const addFarmerContactDetailsResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/add-common-contact-details', farmerContactDetails, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (addFarmerContactDetailsResponse.data.status != 200) {
                            toast.error(addFarmerContactDetailsResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            loopBreaked = true;
                        }
                        else if (farmerContactDetailIndex == commonContactDetailList.length && !loopBreaked && !farmerData.farmerPic.type && !farmerData.farmerForm.type && !deleteFarmerContactDetailsId) {
                            updateFarmerCallback();
                        } else {
                            farmerContactDetailIndex++
                        }
                    }
                }
            }

            var deleteFarmerContactDetailsList = deleteFarmerContactDetailsId ? deleteFarmerContactDetailsId.split(',') : null;
            if (deleteFarmerContactDetailsList) {
                var deleteFarmerContactDetailIndex = 1;

                deleteFarmerContactDetailsList.forEach(async deleteFarmerContactDetailId => {
                    if (!loopBreaked) {
                        const data = { encryptedCommonContactDetailsId: deleteFarmerContactDetailId }
                        const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        const deleteCommContactDetailResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-common-contact-detail', { headers, data });
                        if (deleteCommContactDetailResponse.data.status != 200) {
                            toast.error(deleteCommContactDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            loopBreaked = true;
                        }
                        else if (deleteFarmerContactDetailIndex == deleteFarmerContactDetailsList.length && !loopBreaked) {
                            updateFarmerCallback();
                        }
                        else {
                            deleteFarmerContactDetailIndex++;
                        }

                    }
                })
            }
        }
    };

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        // if ($("#AddFarmersDetailForm").isChanged() ||
        //     clientContactDetailChanged.contactDetailsChanged ||
        //     transactionDetailChanged.transactionDetailChanged
        // ) {
        //     setModalShow(true);
        // }

        $('[data-rr-ui-event-key*="Farmers"]').trigger('click');

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
                        <Button variant="success" onClick={addFarmerDetails}>Save</Button>
                        <Button variant="danger" onClick={discardChanges}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="Farmers"
                newDetails={newDetails}
                saveDetails={!farmerData.encryptedFarmerCode ? addFarmerDetails : updateFarmerDetails}
                exitModule={exitModule}
                companyList={companyList}
                cancelClick={cancelClick}
                supportingMethod1={handleFieldChange}
            />
        </>
    )
}

export default Farmers
