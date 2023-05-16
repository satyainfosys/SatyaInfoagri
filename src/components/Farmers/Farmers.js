import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { bankDetailsAction, commonContactDetailsAction, distributionCentreListAction, farmerCardDetailsAction, farmerDetailsAction, farmerDetailsErrorAction, farmerDocumentDetailsAction, farmerFamilyDetailsAction, farmerIrrigationDetailsAction, farmerLandDetailsAction, farmerLiveStockCattleDetailsAction, farmerMachineryDetailsAction, figMasterListAction } from 'actions';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import $ from "jquery";

const tabArray = ['Farmers', 'Add Farmer', 'Family', 'Bank', 'Land', 'Cattle', 'Documents'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'farmerName', Header: 'Farmer Name' },
    { accessor: 'farmerFatherName', Header: 'Father Name' },
    { accessor: 'village', Header: 'Village' },
    { accessor: 'districtName', Header: 'District' },
    { accessor: 'figName', Header: 'FIG' },
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
        getCompany();
        clearFarmerLocalStorages();
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

    const farmerLandDetailsReducer = useSelector((state) => state.rootReducer.farmerLandDetailsReducer)
    const farmerLandDetailsList = farmerLandDetailsReducer.farmerLandDetails;

    const farmerDocumentDetailsReducer = useSelector((state) => state.rootReducer.farmerDocumentDetailsReducer)
    const farmerDocumentDetailsList = farmerDocumentDetailsReducer.farmerDocumentDetails;

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

    if (farmerData.encryptedFarmerCode && (!commonContactDetailList || commonContactDetailList.length == 0)) {
        getFarmerContactDetail();
    }

    // $.fn.extend({
    //     trackChanges: function () {
    //         $(":input", this).change(function () {
    //             $(this.form).data("changed", true);
    //         });
    //     }
    //     ,
    //     isChanged: function () {
    //         return this.data("changed");
    //     }
    // });

    // $("#AddFarmersDetailForm").trackChanges();

    const clearFarmerReducers = () => {
        dispatch(farmerDetailsErrorAction(undefined));
        dispatch(farmerDetailsAction(undefined));
        dispatch(farmerFamilyDetailsAction([]));
        dispatch(commonContactDetailsAction([]));
        dispatch(bankDetailsAction([]));
        dispatch(farmerCardDetailsAction([]));
        dispatch(farmerLandDetailsAction([]));
        dispatch(farmerIrrigationDetailsAction([]));
        dispatch(farmerLiveStockCattleDetailsAction([]));
        dispatch(farmerMachineryDetailsAction([]));
        dispatch(farmerDocumentDetailsAction([]));
        // $("#AddFarmerDetailsForm").data("changed", false);
    }

    const clearFarmerLocalStorages = () => {
        localStorage.removeItem("DeleteFarmerFamilyCodes");
        localStorage.removeItem("DeleteCommonContactDetailsIds");
        localStorage.removeItem("DeleteFarmerBankDetailIds");
        localStorage.removeItem("DeleteFarmerKisanCardIds");
        localStorage.removeItem("DeleteFarmerIrrigationCodes");
        localStorage.removeItem("DeleteFarmerLiveStockCattleDetailIds");
        localStorage.removeItem("DeleteFarmerMachineryDetailCodes");
        localStorage.removeItem("DeleteFarmerLandCodes");
        localStorage.removeItem("DeleteFarmerLandGeoDetailCodes");
        localStorage.removeItem("DeleteFarmerDocumentIds");
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
            $('#btnSave').attr('disabled', false);
            $("#AddFarmerDetailsForm").data("changed", false);
            localStorage.removeItem("EncryptedFarmerCode");
            clearFarmerReducers();
        } else {
            toast.error("Please select company first", {
                theme: 'colored',
                autoClose: 5000
            });
        }
    }

    $('[data-rr-ui-event-key*="Farmers"]').off('click').on('click', function () {
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add Farmer"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Family"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Bank"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Land"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Cattle"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Documents"]').attr('disabled', true);

        clearFarmerReducers();
        clearFarmerLocalStorages();
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
    })

    $('[data-rr-ui-event-key*="Family"]').off('click').on('click', function () {
        $('#btnSave').attr('disabled', false);

        if (farmerFamilyDetailsList.length <= 0) {
            getFarmerFamilyDetail();
        }

        getFarmerContactDetail();
    })

    $('[data-rr-ui-event-key*="Bank"]').off('click').on('click', function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        $('#btnSave').attr('disabled', false);

        if (farmerCardDetailsList.length <= 0) {
            getFarmerKisanCardDetail();
        }

        if (bankDetailList.length <= 0) {
            getBankDetail();
        }
    })

    $('[data-rr-ui-event-key*="Land"]').off('click').on('click', function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        $('#btnSave').attr('disabled', false);

        if (farmerIrrigationDetailsList.length <= 0) {
            getFarmerIrrigationDetail();
        }

        if (farmerLandDetailsList.length <= 0) {
            getFarmerLandList();
        }
    })

    $('[data-rr-ui-event-key*="Cattle"]').off('click').on('click', function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        $('#btnSave').attr('disabled', false);

        if (farmerLiveStockCattleList.length <= 0) {
            getFarmerLiveStockCattleList();
        }

        if (farmerMachineryDetailsList.length <= 0) {
            getFarmerMachineryList();
        }
    })

    $('[data-rr-ui-event-key*="Documents"]').off('click').on('click', function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        $('#btnSave').attr('disabled', false);

        if (farmerDocumentDetailsList.length <= 0) {
            getFarmerDocumentDetailList();
        }
    })

    const farmerValidation = () => {
        const firstNameErr = {};
        const lastNameErr = {};
        const addressErr = {};
        const farmerDobErr = {};
        const farmerGenderErr = {};
        const farmerFatherNameErr = {};
        const maritalStatusErr = {};
        const socailCategoryErr = {};
        const countyrErr = {};
        const stateErr = {};
        const districtErr = {};
        const tehsilErr = {};
        const blockErr = {};
        const postOfficeErr = {};
        const villageErr = {};
        const ditributionErr = {};
        const collectionErr = {};
        const contactErr = {};
        const familyErr = {};
        const bankDetailErr = {};
        const irrigationDetailErr = {};
        const landDetailErr = {};
        const unitErr = {};
        const cattleStockErr = {};
        const machineryDetailErr = {};
        const documentDetailErr = {};

        let isValid = true;
        let isFarmerValid = true;
        let isFamilyTabValid = true;
        let isBankValid = true;
        let isLandTabValid = true;
        let isCattleTabValid = true;
        let isDocumentValid = true;

        if (!farmerData.firstName) {
            firstNameErr.empty = "Enter first name";
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.lastName) {
            lastNameErr.empty = "Enter last name";
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.address) {
            addressErr.empty = "Enter address";
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.farmerDOB) {
            farmerDobErr.empty = "Enter DOB"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.farmerGender) {
            farmerGenderErr.empty = "Select gender"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.fatherName) {
            farmerFatherNameErr.empty = "Enter father name"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.maritalStatus) {
            maritalStatusErr.empty = "Select marital status"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.socialCategory) {
            socailCategoryErr.empty = "Select social category"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.countryCode) {
            countyrErr.empty = "Select country"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.stateCode) {
            stateErr.empty = "Select state"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.districtCode) {
            districtErr.empty = "Select district"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.tehsilCode) {
            tehsilErr.empty = "Select tehsil"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.blockCode) {
            blockErr.empty = "Select block"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.postOfficeCode) {
            postOfficeErr.empty = "Select post office"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.villageCode) {
            villageErr.empty = "Select village"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.distributionCentreCode) {
            ditributionErr.empty = "Select distribution centre"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!farmerData.collectionCentreCode) {
            collectionErr.empty = "Select collection centre"
            isValid = false;
            isFarmerValid = false;
            setFormError(true);
        }

        if (!isFarmerValid) {
            if (!$('[data-rr-ui-event-key*="Add Farmer"]').hasClass('active')) {
                $('[data-rr-ui-event-key*="Add Farmer"]').trigger('click');
            }
        }

        if (farmerFamilyDetailsList && farmerFamilyDetailsList.length > 0) {
            farmerFamilyDetailsList.forEach((row, index) => {
                if (!row.familyMemberName || !row.memberAge || !row.memberSex || !row.farmerMemberRelation || !row.memberEducation) {
                    familyErr.invalidFamilyDetail = 'All fields are required';
                    isValid = false;
                    isFamilyTabValid = false;

                    if (isFarmerValid) {
                        $('[data-rr-ui-event-key*="Family"]').trigger('click');
                    }
                }
            });
        }

        //To-do: Will open this validation once first two tabs are completed
        if (commonContactDetailList.length < 1) {
            contactErr.contactEmpty = "At least one contact detail required";
            setTimeout(() => {
                toast.error(contactErr.contactEmpty, {
                    theme: 'colored'
                });
            }, 500);
            isValid = false;
            isFamilyTabValid = false;

            if (isFarmerValid) {
                $('[data-rr-ui-event-key*="Family"]').trigger('click');

                setTimeout(() => {
                    document.getElementById("ContactDetailsTable").scrollIntoView({ behavior: 'smooth' });
                }, 500)
            }
            setFormError(true);
        }
        else if (commonContactDetailList && commonContactDetailList.length > 0) {
            commonContactDetailList.forEach((row, index) => {
                if (!row.contactPerson || !row.contactType || !row.contactDetails) {
                    contactErr.invalidContactDetail = "All fields are required";
                    isValid = false
                }

            });
        }

        if (bankDetailList && bankDetailList.length > 0) {
            bankDetailList.forEach((row, index) => {
                if (!row.bankCode || !row.bankAddress || !row.bankBranch || !row.bankAccount || !row.accountType || !row.bankIfscCode) {
                    bankDetailErr.invalidBankDetail = "All fields are required";
                    isValid = false;
                    isBankValid = false;
                    if (isFarmerValid && isFamilyTabValid) {
                        $('[data-rr-ui-event-key*="Bank"]').trigger('click');
                    }
                }
            })
        }

        if (farmerLandDetailsList && farmerLandDetailsList.length > 0) {
            farmerLandDetailsList.forEach((row, index) => {
                if (!row.khasraNo || !row.ownerShip || !row.croppingType || !row.landArea) {
                    landDetailErr.invalidLandDetail = "Enter the required fields";
                    isValid = false;
                    isLandTabValid = false;

                    if (isFarmerValid && isFamilyTabValid && isBankValid) {
                        $('[data-rr-ui-event-key*="Land"]').trigger('click');
                    }
                }
            })
        }

        if (farmerLandDetailsList && farmerLandDetailsList.length > 0) {
            if (!farmerData.unitName) {
                unitErr.invalidUnit = "Select unit";
                setTimeout(() => {
                    toast.error(unitErr.invalidUnit, {
                        theme: 'colored'
                    });
                }, 500);
                isValid = false;
                isLandTabValid = false;
                setFormError(true);
                if (isFarmerValid && isFamilyTabValid && isBankValid) {
                    $('[data-rr-ui-event-key*="Land"]').trigger('click');
                }
            }
        }

        if (farmerIrrigationDetailsList && farmerIrrigationDetailsList.length > 0) {
            farmerIrrigationDetailsList.forEach((row, index) => {
                if (!row.irrigationOwner || !row.irrigationType || !row.irrigationSource) {
                    irrigationDetailErr.invalidIrrigationDetail = "All fields are required"
                    isValid = false;
                    isLandTabValid = false;

                    if (isFarmerValid && isFamilyTabValid && isBankValid) {
                        $('[data-rr-ui-event-key*="Land"]').trigger('click');
                    }
                }
            })
        }

        if (farmerLiveStockCattleList && farmerLiveStockCattleList.length > 0) {
            farmerLiveStockCattleList.forEach((row, index) => {
                if (!row.cattleCode || !row.noOfCattle) {
                    cattleStockErr.invalidCattleDetail = "Fill the required fields"
                    isValid = false;
                    isCattleTabValid = false;

                    if (isFarmerValid && isFamilyTabValid && isBankValid && isLandTabValid) {
                        $('[data-rr-ui-event-key*="Cattle"]').trigger('click');
                    }
                }
            })
        }

        if (farmerMachineryDetailsList && farmerMachineryDetailsList.length > 0) {
            farmerMachineryDetailsList.forEach((row, index) => {
                if (!row.machineryCategory || !row.machineryType || !row.machineryQty) {
                    machineryDetailErr.invalidMachineryDetail = "Fill the required fields"
                    isValid = false;
                    isCattleTabValid = false;

                    if (isFarmerValid && isFamilyTabValid && isBankValid && isLandTabValid) {
                        $('[data-rr-ui-event-key*="Cattle"]').trigger('click');
                    }
                }
            })
        }

        if (farmerDocumentDetailsList && farmerDocumentDetailsList.length > 0) {
            farmerDocumentDetailsList.forEach((row, index) => {
                if (!row.documentType || !row.farmerDocument) {
                    documentDetailErr.invalidDocumentDetail = "Fill the required fields"
                    isValid = false;
                    isDocumentValid = false;

                    if (isFarmerValid && isFamilyTabValid && isBankValid && isLandTabValid && isCattleTabValid) {
                        $('[data-rr-ui-event-key*="Documents"]').trigger('click');
                    }
                }

                if (row.farmerDocument && row.farmerDocument.type) {
                    var fileType = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    if (!fileType.includes(row.farmerDocument.type)) {
                        isValid = false;
                        setFormError(true);
                        toast.error("Selected file type is invalid, file type accepted are .pdf, .doc, .docx, .png, .jpeg, .jpg", {
                            theme: 'colored',
                            autoClose: 5000
                        })
                    }

                    if (row.farmerDocument.size > 1024 * 500) {
                        isValid = false;
                        setFormError(true);
                        toast.error("File size must be under 500 KB", {
                            theme: 'colored',
                            autoClose: 5000
                        })
                    }
                }
            })
        }

        if (!isValid) {
            var errorObject = {
                firstNameErr,
                lastNameErr,
                addressErr,
                farmerDobErr,
                farmerGenderErr,
                farmerFatherNameErr,
                maritalStatusErr,
                socailCategoryErr,
                countyrErr,
                stateErr,
                districtErr,
                tehsilErr,
                blockErr,
                postOfficeErr,
                villageErr,
                ditributionErr,
                collectionErr,
                contactErr,
                familyErr,
                bankDetailErr,
                irrigationDetailErr,
                landDetailErr,
                unitErr,
                cattleStockErr,
                machineryDetailErr,
                documentDetailErr
            }
            dispatch(farmerDetailsErrorAction(errorObject))
        }
        return isValid;
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

    const updateFarmerCallback = (isAddFarmer = false) => {
        $("#AddFarmersDetailForm").data("changed", false);
        $('#AddFarmersDetailForm').get(0).reset();

        // $("#AddDocumentDetailsForm").data("changed", false);
        // $('#AddDocumentDetailsForm').get(0).reset();

        dispatch(farmerDetailsErrorAction(undefined));
        clearFarmerLocalStorages();

        if (!isAddFarmer) {
            toast.success("Farmer details updated successfully!", {
                theme: 'colored'
            });
        }

        $('#btnSave').attr('disabled', true)

        fetchFarmerList(1, perPage, localStorage.getItem("EncryptedCompanyCode"));

        $('[data-rr-ui-event-key*="Farmers"]').click();
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
                farmerSocialCategory: farmerData.socialCategory == "ST" ? "ST" : farmerData.socialCategory == "SC" ? "SC" : farmerData.socialCategory == "OBC" ? "OBC" : farmerData.socialCategory == "General" ? "GEN" : "",
                farmerDOB: farmerData.farmerDOB ? farmerData.farmerDOB : new Date(),
                farmerGender: farmerData.farmerGender == "Male" ? "M" : farmerData.farmerGender == "Female" ? "F" : farmerData.farmerGender == "Others" ? "O" : "",
                farmerMaritalStatus: farmerData.maritalStatus == "Married" ? "M" : farmerData.maritalStatus == "Unmarried" ? "U" : farmerData.maritalStatus == "Divorced" ? "D" : "",
                farmerFatherName: farmerData.fatherName ? farmerData.fatherName : "",
                farmerTotalLand: farmerData.totalLand ? parseFloat(farmerData.totalLand).toFixed(2) : 0,
                farmerUser: "",
                farmerPassword: "",
                figCode: farmerData.figCode ? farmerData.figCode : "",
                collCentreCode: farmerData.collectionCentreCode ? farmerData.collectionCentreCode : "",
                distributionCentreCode: farmerData.distributionCentreCode ? farmerData.distributionCentreCode : "",
                countryCode: farmerData.countryCode ? farmerData.countryCode : "",
                stateCode: farmerData.stateCode ? farmerData.stateCode : "",
                districtCode: farmerData.districtCode ? farmerData.districtCode : "",
                tehsilCode: farmerData.tehsilCode ? farmerData.tehsilCode : "",
                blockCode: farmerData.blockCode ? farmerData.blockCode : "",
                postOfficeCode: farmerData.postOfficeCode ? farmerData.postOfficeCode : "",
                villageCode: farmerData.villageCode ? farmerData.villageCode : "",
                activeStatus: farmerData.status == null || farmerData.status == "Active" ? "A" : "S",
                approvalStatus: farmerData.approvalStatus == "Approved" ? "A" : farmerData.approvalStatus == "Draft" ? "D" : farmerData.approvalStatus == "Send for Verification" ? "SV" : farmerData.approvalStatus == "Suspended" ? "S" : "D",
                addUser: localStorage.getItem("LoginUserName"),
                familyDetails: farmerFamilyDetailsList,
                commonContactDetails: commonContactDetailList,
                bankDetails: bankDetailList,
                farmerMachineryDetails: farmerMachineryDetailsList,
                farmerLiveStockCattleDetails: farmerLiveStockCattleList,
                farmerKisanCardDetails: farmerCardDetailsList,
                farmerIrrigationDetails: farmerIrrigationDetailsList,
                farmerLandDetails: farmerLandDetailsList,
                farmerDocumentDetails: farmerDocumentDetailsList
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

            const bankKeys = ['bankAddress', 'bankBranch', 'bankIfscCode', 'addUser']
            var index = 0;
            for (var obj in requestData.bankDetails) {
                var bankDetailObj = requestData.bankDetails[obj];

                for (const key of Object.keys(bankDetailObj).filter((key) => bankKeys.includes(key))) {
                    bankDetailObj[key] = bankDetailObj[key] ? bankDetailObj[key].toUpperCase() : '';
                }
                requestData.bankDetails[index] = bankDetailObj;
                index++;
            }

            const machineryKeys = ['addUser']
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

            const landKeys = ['landMark', 'addUser']
            var index = 0;
            for (var obj in requestData.farmerLandDetails) {
                var farmerLandDetailsObj = requestData.farmerLandDetails[obj];

                for (const key of Object.keys(farmerLandDetailsObj).filter((key) => landKeys.includes(key))) {
                    farmerLandDetailsObj[key] = farmerLandDetailsObj[key] ? farmerLandDetailsObj[key].toUpperCase() : '';
                }
                requestData.farmerLandDetails[index] = farmerLandDetailsObj;
                index++
            }

            const documentKeys = ['documentNo', 'addUser']
            var index = 0;
            for (var obj in requestData.farmerDocumentDetails) {
                var farmerDocumentDetailsObj = requestData.farmerDocumentDetails[obj];

                for (const key of Object.keys(farmerDocumentDetailsObj).filter((key) => documentKeys.includes(key))) {
                    farmerDocumentDetailsObj[key] = farmerDocumentDetailsObj[key] ? farmerDocumentDetailsObj[key].toUpperCase() : '';
                }
                requestData.farmerDocumentDetails[index] = farmerDocumentDetailsObj;
                index++
            }

            const formData = new FormData();
            formData.append("EncryptedClientCode", localStorage.getItem("EncryptedClientCode"))
            formData.append("EncryptedCompanyCode", localStorage.getItem("EncryptedCompanyCode"))
            formData.append("FarmerFirstName", farmerData.firstName)
            formData.append("FarmerMiddleName", farmerData.middleName ? farmerData.middleName : "")
            formData.append("FarmerLastName", farmerData.lastName)
            formData.append("FarmerAddress", farmerData.address)
            formData.append("FarmerEducation", farmerData.educationalStatus == "Primary School" ? "PRS" : farmerData.educationalStatus == "High School" ? "HGS" : farmerData.educationalStatus == "Inter" ? "INT" : farmerData.educationalStatus == "Graduate" ? "GRD" : farmerData.educationalStatus == "Post Graduate" ? "PSG" : farmerData.educationalStatus == "Illiterate" ? "ILT" : farmerData.educationalStatus == "Doctrate" ? "DOC" : "")
            formData.append("FarmerSocialCategory", farmerData.socialCategory == "ST" ? "ST" : farmerData.socialCategory == "SC" ? "SC" : farmerData.socialCategory == "OBC" ? "OBC" : farmerData.socialCategory == "General" ? "GEN" : "GEN")
            formData.append("FarmerDOB", farmerData.farmerDOB ? farmerData.farmerDOB : new Date())
            formData.append("FarmerGender", farmerData.farmerGender == "Male" ? "M" : farmerData.farmerGender == "Female" ? "F" : farmerData.farmerGender == "Others" ? "O" : "M")
            formData.append("FarmerMaritalStatus", farmerData.maritalStatus == "Married" ? "M" : farmerData.maritalStatus == "Unmarried" ? "U" : farmerData.maritalStatus == "Divorced" ? "D" : "U")
            formData.append("FarmerFatherName", farmerData.fatherName)
            formData.append("FarmerTotalLand", farmerData.totalLand ? parseFloat(farmerData.totalLand).toFixed(2) : 0)
            formData.append("FarmerUser", "")
            formData.append("FarmerPassword", "")
            formData.append("FigCode", farmerData.figCode ? farmerData.figCode : "")
            formData.append("CollCentreCode", farmerData.collectionCentreCode)
            formData.append("DistributionCentreCode", farmerData.distributionCentreCode)
            formData.append("CountryCode", farmerData.countryCode)
            formData.append("StateCode", farmerData.stateCode)
            formData.append("DistrictCode", farmerData.districtCode)
            formData.append("TehsilCode", farmerData.tehsilCode)
            formData.append("BlockCode", farmerData.blockCode)
            formData.append("PostOfficeCode", farmerData.postOfficeCode)
            formData.append("VillageCode", farmerData.villageCode)
            formData.append("ActiveStatus", farmerData.status == null || farmerData.status == "Active" ? "A" : "S")
            formData.append("ApprovalStatus", farmerData.approvalStatus == "Approved" ? "A" : farmerData.approvalStatus == "Draft" ? "D" : farmerData.approvalStatus == "Send for Verification" ? "SV" : farmerData.approvalStatus == "Suspended" ? "S" : "D")
            formData.append("AddUser", localStorage.getItem("LoginUserName"))
            formData.append("FamilyDetails", farmerFamilyDetailsList)
            formData.append("CommonContactDetails", commonContactDetailList)
            formData.append("BankDetails", bankDetailList)
            formData.append("FarmerLandDetails", farmerLandDetailsList)
            formData.append("FarmerIrrigationDetails", farmerIrrigationDetailsList)
            formData.append("FarmerLiveStockCattleDetails", farmerLiveStockCattleList)
            formData.append("FarmerMachineryDetails", farmerMachineryDetailsList)
            formData.append("FarmerDocumentDetails", farmerDocumentDetailsList)

            requestData = formData;

            setIsLoading(true);
            axios.post(process.env.REACT_APP_API_URL + '/add-farmer', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    if (res.data.status == 200) {
                        // if (farmerData.farmerPic) {
                        //     uploadDocuments(farmerData.farmerPic, res.data.data.encryptedFarmerCode, "ProfilePhoto", false);
                        // }

                        // if (farmerData.farmerForm) {
                        //     uploadDocuments(farmerData.farmerForm, res.data.data.encryptedFarmerCode, "FarmerForm", false);
                        // } else {
                        //     setIsLoading(false);
                        //     toast.success(res.data.message, {
                        //         theme: 'colored',
                        //         autoClose: 10000
                        //     });

                        //     updateFarmerCallback(true);
                        //     $('[data-rr-ui-event-key*="Farmers"]').click();
                        // }
                        setIsLoading(false);
                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updateFarmerCallback(true);

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

    const handleFieldChange = e => {
        localStorage.setItem("EncryptedCompanyCode", e.target.value);
        const selectedOption = e.target.options[e.target.selectedIndex];
        const selectedKey = selectedOption.dataset.key || selectedOption.label;
        localStorage.setItem("CompanyName", selectedKey)
        fetchFarmerList(1, perPage, e.target.value);
        fetchDistributionCentreList(e.target.value);
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

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        window.location.href = '/dashboard';
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
                dispatch(farmerIrrigationDetailsAction(response.data.data));
            }
        }
    }

    const getBankDetail = async () => {
        const request = {
            EncryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-farmer-bank-detail-list', request, {
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
                dispatch(farmerLiveStockCattleDetailsAction(response.data.data));
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

    const getFarmerLandList = async () => {
        const request = {
            EncryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode")
        }
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-farmer-land-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(farmerLandDetailsAction(response.data.data));
            }
        }
    }

    const updateFarmerDetails = async () => {

        if (farmerValidation()) {

            var deleteFarmerFamilyCodes = localStorage.getItem("DeleteFarmerFamilyCodes");
            var deleteFarmerContactDetailsId = localStorage.getItem("DeleteCommonContactDetailsIds");
            var deleteBankDetails = localStorage.getItem("DeleteFarmerBankDetailIds");
            var deleteFarmerKisanCardIds = localStorage.getItem("DeleteFarmerKisanCardIds");
            var deleteFarmerIrrigationDetailCodes = localStorage.getItem("DeleteFarmerIrrigationCodes");
            var deleteFarmerLiveStockCattleDetailIds = localStorage.getItem("DeleteFarmerLiveStockCattleDetailIds");
            var deleteFarmerMachineryDetailCodes = localStorage.getItem("DeleteFarmerMachineryDetailCodes");
            var deleteFarmerLandDetailCodes = localStorage.getItem("DeleteFarmerLandCodes");
            var deleteFarmerLandGeoDetailcodes = localStorage.getItem("DeleteFarmerLandGeoDetailCodes");
            var deleteFarmerDocumentIds = localStorage.getItem("DeleteFarmerDocumentIds");

            const updateFarmerData = {
                encryptedFarmerCode: farmerData.encryptedFarmerCode,
                encryptedClientCode: farmerData.encryptedClientCode,
                encryptedCompanyCode: farmerData.encryptedCompanyCode,
                farmerFirstName: farmerData.firstName,
                farmerMiddleName: farmerData.middleName,
                farmerLastName: farmerData.lastName,
                farmerAddress: farmerData.address,
                farmerEducation: farmerData.educationalStatus == "Primary School" ? "PRS" : farmerData.educationalStatus == "High School" ? "HGS" : farmerData.educationalStatus == "Inter" ? "INT" : farmerData.educationalStatus == "Graduate" ? "GRD" : farmerData.educationalStatus == "Post Graduate" ? "PSG" : farmerData.educationalStatus == "Illiterate" ? "ILT" : farmerData.educationalStatus == "Doctrate" ? "DOC" : "",
                farmerSocialCategory: farmerData.socialCategory == "ST" ? "ST" : farmerData.socialCategory == "SC" ? "SC" : farmerData.socialCategory == "OBC" ? "OBC" : farmerData.socialCategory == "General" ? "GEN" : "",
                farmerDOB: farmerData.farmerDOB ? farmerData.farmerDOB : new Date(),
                farmerGender: farmerData.farmerGender == "Male" ? "M" : farmerData.farmerGender == "Female" ? "F" : farmerData.farmerGender == "Others" ? "O" : "",
                farmerMaritalStatus: farmerData.maritalStatus == "Married" ? "M" : farmerData.maritalStatus == "Unmarried" ? "U" : farmerData.maritalStatus == "Divorced" ? "D" : "",
                farmerFatherName: farmerData.fatherName ? farmerData.fatherName : "",
                farmerTotalLand: farmerData.totalLand ? parseFloat(farmerData.totalLand).toFixed(2) : 0,
                farmerUser: "",
                farmerPassword: "",
                figCode: farmerData.figCode ? farmerData.figCode : "",
                collCentreCode: farmerData.collectionCentreCode ? farmerData.collectionCentreCode : "",
                distributionCentreCode: farmerData.distributionCentreCode ? farmerData.distributionCentreCode : "",
                countryCode: farmerData.countryCode ? farmerData.countryCode : "",
                stateCode: farmerData.stateCode ? farmerData.stateCode : "",
                districtCode: farmerData.districtCode ? farmerData.districtCode : "",
                tehsilCode: farmerData.tehsilCode ? farmerData.tehsilCode : "",
                blockCode: farmerData.blockCode ? farmerData.blockCode : "",
                postOfficeCode: farmerData.postOfficeCode ? farmerData.postOfficeCode : "",
                villageCode: farmerData.villageCode ? farmerData.villageCode : "",
                approvalStatus: farmerData.approvalStatus == "Approved" ? "A" : farmerData.approvalStatus == "Draft" ? "D" : farmerData.approvalStatus == "Send for Verification" ? "SV" : farmerData.approvalStatus == "Suspended" ? "S" : "D",
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

            // if ($("#AddFarmersDetailForm").isChanged()) {
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
                        var existUpdate = true;
                        if (farmerData.farmerPic && farmerData.farmerPic.type) {
                            existUpdate = false;
                            uploadDocuments(farmerData.farmerPic, res.data.data.encryptedFarmerCode, "ProfilePhoto", true);
                        }

                        if (farmerData.farmerForm && farmerData.farmerForm.type) {
                            existUpdate = false;
                            uploadDocuments(farmerData.farmerForm, res.data.data.encryptedFarmerCode, "FarmerForm", true);
                        }

                        if (farmerData.removeProfilePhoto) {
                            existUpdate = false;
                            deleteDocument(farmerData.encryptedFarmerCode, farmerData.removeProfilePhoto, "ProfilePhoto")
                        }

                        if (farmerData.removeFarmerOriginalForm) {
                            existUpdate = false;
                            deleteDocument(farmerData.encryptedFarmerCode, farmerData.removeFarmerOriginalForm, "FarmerForm")
                        }

                        if (deleteFarmerFamilyCodes || deleteFarmerContactDetailsId || deleteBankDetails || deleteFarmerKisanCardIds ||
                            deleteFarmerIrrigationDetailCodes || deleteFarmerLiveStockCattleDetailIds || deleteFarmerMachineryDetailCodes || deleteFarmerLandDetailCodes || deleteFarmerDocumentIds) {
                            existUpdate = false
                        }
                        else if (existUpdate) {
                            //updateFarmerCallback();
                        }
                    }
                })


            if (farmerData.removeFarmerOriginalForm) {
                deleteDocument(farmerData.encryptedFarmerCode, farmerData.removeFarmerOriginalForm, "FarmerForm")
            }

            if (farmerData.removeProfilePhoto) {
                deleteDocument(farmerData.encryptedFarmerCode, farmerData.removeProfilePhoto, "ProfilePhoto")
            }

            var loopBreaked = false;
            var farmerFamilyDetailIndex = 1;
            var farmerContactDetailIndex = 1;
            var bankDetailIndex = 1;
            var farmerCardDetailIndex = 1;
            var farmerLandDetailIndex = 1;
            var farmerIrrigationDetailIndex = 1;
            var farmerLiveStockCattleDetailIndex = 1;
            var farmerMachineryDetailIndex = 1;
            var farmerDocumentDetailIndex = 1;


            //FarmerFamilyDetail Add, Update, Delete
            for (let i = 0; i < farmerFamilyDetailsList.length; i++) {
                const farmerFamilyDetails = farmerFamilyDetailsList[i];
                if (!loopBreaked) {
                    const keys = ['familyMemberName', 'modifyUser', 'addUser']
                    for (const key of Object.keys(farmerFamilyDetails).filter((key) => keys.includes(key))) {
                        farmerFamilyDetails[key] = farmerFamilyDetails[key] ? farmerFamilyDetails[key].toUpperCase() : '';
                    }

                    if (farmerFamilyDetails.encryptedFarmerFamilyCode) {
                        const familyRequestData = {
                            encryptedFarmerFamilyCode: farmerFamilyDetails.encryptedFarmerFamilyCode,
                            encryptedFarmerCode: farmerFamilyDetails.encryptedFarmerCode,
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                            familyMemberName: farmerFamilyDetails.familyMemberName,
                            memberAge: farmerFamilyDetails.memberAge,
                            memberSex: farmerFamilyDetails.memberSex,
                            farmerMemberRelation: farmerFamilyDetails.farmerMemberRelation,
                            memberEducation: farmerFamilyDetails.memberEducation,
                            modifyUser: localStorage.getItem("LoginUserName")
                        }
                        setIsLoading(true);
                        const updateFarmerFamilyDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-farmer-family-detail', familyRequestData, {
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
                        else if (farmerFamilyDetailIndex == farmerFamilyDetailsList.length && !loopBreaked
                            && !deleteFarmerFamilyCodes && !deleteFarmerContactDetailsId && !deleteBankDetails && !deleteFarmerKisanCardIds && !deleteFarmerLandGeoDetailcodes && !deleteFarmerLandDetailCodes
                            && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            //updateFarmerCallback();
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
                        else if (farmerFamilyDetailIndex == farmerFamilyDetailsList.length && !loopBreaked && !deleteFarmerFamilyCodes && !deleteFarmerContactDetailsId && !deleteBankDetails
                            && !deleteFarmerKisanCardIds && !deleteFarmerLandGeoDetailcodes && !deleteFarmerLandDetailCodes
                            && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds
                            && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            //updateFarmerCallback();
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
                            toast.error(deleteFarmerFamilyResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            loopBreaked = true;
                        }
                        else if (deleteFamerFamilyMemberIndex == deleteFarmerFamilyMemberList.length && !loopBreaked && !deleteFarmerContactDetailsId && !deleteBankDetails
                            && !deleteFarmerKisanCardIds && !deleteFarmerLandGeoDetailcodes && !deleteFarmerLandDetailCodes && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds
                            && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            updateFarmerCallback();
                        }
                        else {
                            deleteFamerFamilyMemberIndex++;
                        }
                    }
                });
            }

            //FarmerContactDetail Add, Update, Delete
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
                        else if (farmerContactDetailIndex == commonContactDetailList.length && !loopBreaked && !deleteFarmerContactDetailsId
                            && !deleteBankDetails && !deleteFarmerKisanCardIds && !deleteFarmerLandGeoDetailcodes && !deleteFarmerLandDetailCodes && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds
                            && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            //updateFarmerCallback();
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
                        else if (farmerContactDetailIndex == commonContactDetailList.length && !loopBreaked && !deleteFarmerContactDetailsId
                            && !deleteBankDetails && !deleteFarmerKisanCardIds && !deleteFarmerLandGeoDetailcodes && !deleteFarmerLandDetailCodes && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds
                            && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            //updateFarmerCallback();
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
                        else if (deleteFarmerContactDetailIndex == deleteFarmerContactDetailsList.length && !loopBreaked && !deleteBankDetails && !deleteFarmerKisanCardIds && !deleteFarmerLandGeoDetailcodes && !deleteFarmerLandDetailCodes
                            && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            updateFarmerCallback();
                        }
                        else {
                            deleteFarmerContactDetailIndex++;
                        }

                    }
                })
            }

            //BankDetail Add, Update, Delete            
            var deleteBankDetailList = deleteBankDetails ? deleteBankDetails.split(',') : null;

            if (deleteBankDetailList) {
                var deleteBankDetailIndex = 1;

                deleteBankDetailList.forEach(async deleteFarmerBankDetailId => {
                    if (!loopBreaked) {
                        const data = { encryptedFarmerBankId: deleteFarmerBankDetailId }
                        const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        const deleteBankDetailResponse =
                            await axios.delete(process.env.REACT_APP_API_URL + '/delete-farmer-bank-details', { headers, data });
                        if (deleteBankDetailResponse.data.status != 200) {
                            toast.error(deleteBankDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            loopBreaked = true;
                        }
                        else if (deleteBankDetailIndex == deleteBankDetailList.length && !loopBreaked && !deleteFarmerKisanCardIds && !deleteFarmerLandGeoDetailcodes && !deleteFarmerLandDetailCodes
                            && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            updateFarmerCallback();
                        }
                        else {
                            deleteBankDetailIndex++;
                        }
                    }
                })
            }

            if (!loopBreaked) {
                for (let i = 0; i < bankDetailList.length; i++) {
                    const bankDetails = bankDetailList[i];
                    const keys = ['bankAddress', 'bankBranch', 'bankIfscCode', 'addUser', 'modifyUser']
                    for (const key of Object.keys(bankDetails).filter((key) => keys.includes(key))) {
                        bankDetails[key] = bankDetails[key] ? bankDetails[key].toUpperCase() : '';
                    }
                    if (bankDetails.encryptedFarmerBankId) {
                        const bankRequestData = {
                            encryptedFarmerBankId: bankDetails.encryptedFarmerBankId,
                            encryptedFarmerCode: bankDetails.encryptedFarmerCode,
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                            bankCode: bankDetails.bankCode,
                            bankAddress: bankDetails.bankAddress,
                            bankBranch: bankDetails.bankBranch,
                            bankAccount: bankDetails.bankAccount,
                            accountType: bankDetails.accountType,
                            bankIfscCode: bankDetails.bankIfscCode,
                            activeStatus: bankDetails.activeStatus,
                            modifyUser: localStorage.getItem("LoginUserName")
                        }

                        setIsLoading(true);
                        const updateBankDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/update-farmer-bank-details', bankRequestData, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (updateBankDetailResponse.data.status != 200) {
                            toast.error(updateBankDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if (bankDetailIndex == bankDetailList.length && !loopBreaked && !deleteBankDetails
                            && !deleteFarmerKisanCardIds && !deleteFarmerLandGeoDetailcodes && !deleteFarmerLandDetailCodes && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds
                            && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            // updateFarmerCallback();
                        }
                        else {
                            bankDetailIndex++;
                        }
                    }
                    else if (!bankDetails.encryptedBankCode) {
                        setIsLoading(true);
                        const addBankDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/add-farmer-bank-details', bankDetails, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (addBankDetailResponse.data.status != 200) {
                            toast.error(addBankDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if (bankDetailIndex == bankDetailList.length && !loopBreaked && !deleteBankDetails
                            && !deleteFarmerKisanCardIds && !deleteFarmerLandGeoDetailcodes && !deleteFarmerLandDetailCodes && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds
                            && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            // updateFarmerCallback();
                        }
                        else {
                            bankDetailIndex++;
                        }
                    }
                }
            }

            //FarmerLandDetail Add, Update, Delete
            if (!loopBreaked) {
                for (let i = 0; i < farmerLandDetailsList.length; i++) {
                    const farmerLandDetail = farmerLandDetailsList[i];
                    const keys = ['landMark', 'addUser', 'modifyUser']
                    for (const key of Object.keys(farmerLandDetail).filter((key) => keys.includes(key))) {
                        farmerLandDetail[key] = farmerLandDetail[key] ? farmerLandDetail[key].toUpperCase() : '';
                    }
                    if (farmerLandDetail.encryptedFarmerLandCode) {
                        const landRequestData = {
                            encryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode"),
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                            encryptedFarmerLandCode: farmerLandDetail.encryptedFarmerLandCode,
                            encryptedFarmerLandGeoCode: farmerLandDetail.encryptedFarmerLandGeoCode,
                            khasraNo: farmerLandDetail.khasraNo ? farmerLandDetail.khasraNo : '',
                            landMark: farmerLandDetail.landMark ? farmerLandDetail.landMark : '',
                            ownerShip: farmerLandDetail.ownerShip ? farmerLandDetail.ownerShip : '',
                            usage: farmerLandDetail.usage ? farmerLandDetail.usage : '',
                            croppingType: farmerLandDetail.croppingType ? farmerLandDetail.croppingType : '',
                            landArea: farmerLandDetail.landArea ? farmerLandDetail.landArea : '',
                            cultivatedLandUnit: farmerLandDetail.cultivatedLandUnit ? farmerLandDetail.cultivatedLandUnit : '',
                            unitCode: farmerLandDetail.unitCode ? farmerLandDetail.unitCode : '',
                            activeStatus: farmerLandDetail.activeStatus ? farmerLandDetail.activeStatus : '',
                            modifyUser: localStorage.getItem("LoginUserName"),
                            farmerGeofancingLand: farmerLandDetail.farmerGeofancingLand
                        }

                        setIsLoading(true);
                        const updateFarmerLandDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/update-farmer-land-detail', landRequestData, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (updateFarmerLandDetailResponse.data.status != 200) {
                            toast.error(updateFarmerLandDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });


                            loopBreaked = true;
                        }
                        else if ((farmerLandDetailIndex == farmerLandDetailsList.length) && !loopBreaked && !deleteFarmerLandGeoDetailcodes &&
                            !deleteFarmerLandDetailCodes && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            // updateFarmerCallback();
                        }
                        else {
                            farmerLandDetailIndex++;
                        }
                    }
                    else if (!farmerLandDetail.encryptedFarmerLandCode) {
                        setIsLoading(true);
                        const addFarmerLandDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/add-farmer-land-details', farmerLandDetail, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (addFarmerLandDetailResponse.data.status != 200) {
                            toast.error(addFarmerLandDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if ((farmerLandDetailIndex == farmerLandDetailsList) && !loopBreaked && !deleteFarmerLandGeoDetailcodes &&
                            !deleteFarmerLandDetailCodes && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            // updateFarmerCallback();
                        }
                        else {
                            farmerLandDetailIndex++
                        }
                    }
                }
            }

            var deleteFarmerLandGeoDetailList = deleteFarmerLandGeoDetailcodes ? deleteFarmerLandGeoDetailcodes.split(',') : null;

            if (deleteFarmerLandGeoDetailList) {
                var delteFarmerLandGeoIndex = 1;

                for (let i = 0; i < deleteFarmerLandGeoDetailList.length; i++) {
                    const deleteFarmerLandGeoDetailCode = deleteFarmerLandGeoDetailList[i];
                    if (!loopBreaked) {
                        const data = { encryptedFarmerLandGeoCode: deleteFarmerLandGeoDetailCode }
                        const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        const deleteFarmerLandGeoResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-farmer-land-geo-fancing-detail', { headers, data });
                        if (deleteFarmerLandGeoResponse.data.status != 200) {
                            toast.error(deleteFarmerLandGeoResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        } else if ((delteFarmerLandGeoIndex == deleteFarmerLandGeoDetailList.length) && !loopBreaked && !deleteFarmerLandDetailCodes && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            updateFarmerCallback();
                        } else {
                            delteFarmerLandGeoIndex++;
                        }
                    }
                }
            }

            var deleteFarmerLandDetailList = deleteFarmerLandDetailCodes ? deleteFarmerLandDetailCodes.split(',') : null;

            if (deleteFarmerLandDetailList) {
                var deleteFarmerLandDetailIndex = 1;

                deleteFarmerLandDetailList.forEach(async deleteFarmerLandCode => {
                    if (!loopBreaked) {
                        const data = { encryptedFarmerLandCode: deleteFarmerLandCode }
                        const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        const deleteFarmerLandDetailResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-farmer-land-detail', { headers, data });
                        if (deleteFarmerLandDetailResponse.data.status != 200) {
                            toast.error(deleteFarmerLandDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if ((deleteFarmerLandDetailIndex == deleteFarmerLandDetailList.length) && !loopBreaked
                            && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            updateFarmerCallback();
                        }
                        else {
                            deleteFarmerLandDetailIndex++
                        }
                    }
                })
            }

            //FarmerIrrigationDetail Add, Update, Delete
            if (!loopBreaked) {
                for (let i = 0; i < farmerIrrigationDetailsList.length; i++) {
                    const farmerIrrigationDetail = farmerIrrigationDetailsList[i]

                    if (farmerIrrigationDetail.encryptedFarmerIrrigationCode) {
                        const irrigationRequestData = {
                            encryptedFarmerCode: farmerIrrigationDetail.encryptedFarmerCode,
                            encryptedFarmerIrrigationCode: farmerIrrigationDetail.encryptedFarmerIrrigationCode,
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                            irrigationOwner: farmerIrrigationDetail.irrigationOwner,
                            irrigationType: farmerIrrigationDetail.irrigationType,
                            irrigationSource: farmerIrrigationDetail.irrigationSource,
                            activeStatus: farmerIrrigationDetail.activeStatus,
                            modifyUser: localStorage.getItem("LoginUserName")
                        }

                        setIsLoading(true);
                        const updateFarmerIrrigationDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/update-farmer-irrigation-detail', irrigationRequestData, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (updateFarmerIrrigationDetailResponse.data.status != 200) {
                            toast.error(updateFarmerIrrigationDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if (farmerIrrigationDetailIndex == farmerIrrigationDetailsList.length && !loopBreaked
                            && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds && !deleteFarmerMachineryDetailCodes
                            && !deleteFarmerDocumentIds) {
                            // updateFarmerCallback();
                        }
                        else {
                            farmerIrrigationDetailIndex++;
                        }
                    }
                    else if (!farmerIrrigationDetail.encryptedFarmerIrrigationCode) {
                        setIsLoading(true);
                        const addFarmerIrrigationDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/add-farmer-irrigation-detail', farmerIrrigationDetail, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (addFarmerIrrigationDetailResponse.data.status != 200) {
                            toast.error(addFarmerIrrigationDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if (farmerIrrigationDetailIndex == farmerIrrigationDetailsList.length && !loopBreaked
                            && !deleteFarmerIrrigationDetailCodes && !deleteFarmerLiveStockCattleDetailIds && !deleteFarmerMachineryDetailCodes
                            && !deleteFarmerDocumentIds) {
                            // updateFarmerCallback();
                        }
                        else {
                            farmerIrrigationDetailIndex++;
                        }
                    }
                }
            }

            var deleteFarmerIrrigationDetailList = deleteFarmerIrrigationDetailCodes ? deleteFarmerIrrigationDetailCodes.split(',') : null;

            if (deleteFarmerIrrigationDetailList) {
                var deleteFarmerIrrigationDetailIndex = 1;

                deleteFarmerIrrigationDetailList.forEach(async deleteFarmerIrrigationDetailCode => {
                    if (!loopBreaked) {
                        const data = { encryptedFarmerIrrigationCode: deleteFarmerIrrigationDetailCode }
                        const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        const deleteFarmerIrrigationDetailResponse =
                            await axios.delete(process.env.REACT_APP_API_URL + '/delete-farmer-irrigation-detail', { headers, data });
                        if (deleteFarmerIrrigationDetailResponse.data.status != 200) {
                            toast.error(deleteFarmerIrrigationDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if (deleteFarmerIrrigationDetailIndex == deleteFarmerIrrigationDetailList.length && !loopBreaked && !deleteFarmerLiveStockCattleDetailIds
                            && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            updateFarmerCallback();
                        }
                        else {
                            deleteFarmerIrrigationDetailIndex++;
                        }
                    }
                })
            }

            //FarmerLiveStockCattleDetail Add, Update, Delete
            if (!loopBreaked) {
                for (let i = 0; i < farmerLiveStockCattleList.length; i++) {
                    const farmerLiveStockCattleDetail = farmerLiveStockCattleList[i]

                    if (farmerLiveStockCattleDetail.encryptedFarmerCattleCode) {
                        const requestData = {
                            encryptedFarmerCode: farmerLiveStockCattleDetail.encryptedFarmerCode,
                            encryptedFarmerCattleCode: farmerLiveStockCattleDetail.encryptedFarmerCattleCode,
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                            cattleCode: farmerLiveStockCattleDetail.cattleCode,
                            noOfCattle: farmerLiveStockCattleDetail.noOfCattle,
                            production: farmerLiveStockCattleDetail.production,
                            rate: farmerLiveStockCattleDetail.rate,
                            cattleAge: farmerLiveStockCattleDetail.cattleAge,
                            milkType: farmerLiveStockCattleDetail.milkType,
                            activeStatus: farmerLiveStockCattleDetail.activeStatus,
                            modifyUser: localStorage.getItem("LoginUserName")
                        }

                        setIsLoading(true);
                        const updateFarmerLiveStockCattleDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/update-farmer-live-stock-cattle-detail', requestData, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (updateFarmerLiveStockCattleDetailResponse.data.status != 200) {
                            toast.error(updateFarmerLiveStockCattleDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            loopBreaked = true;
                        }
                        else if (farmerCardDetailIndex == farmerCardDetailsList.length && !loopBreaked && !deleteFarmerLiveStockCattleDetailIds
                            && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            // updateFarmerCallback();
                        }
                        else {
                            farmerLiveStockCattleDetailIndex++;
                        }
                    }
                    else if (!farmerLiveStockCattleDetail.encryptedFarmerCattleCode) {
                        setIsLoading(true);
                        const addFarmerLiveStockCattleDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/add-farmer-live-stock-cattle-details', farmerLiveStockCattleDetail, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (addFarmerLiveStockCattleDetailResponse.data.status != 200) {
                            toast.error(addFarmerLiveStockCattleDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if (farmerCardDetailIndex == farmerCardDetailsList.length && !loopBreaked && !deleteFarmerLiveStockCattleDetailIds
                            && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            // updateFarmerCallback();
                        }
                        else {
                            farmerLiveStockCattleDetailIndex++;
                        }
                    }
                }
            }

            var deleteFarmerLiveStockCattleDetailList = deleteFarmerLiveStockCattleDetailIds ? deleteFarmerLiveStockCattleDetailIds.split(',') : null;

            if (deleteFarmerLiveStockCattleDetailList) {
                var deleteFarmerLiveStockCattleDetailIndex = 1;

                deleteFarmerLiveStockCattleDetailList.forEach(async deleteFarmerLiveStockCattleCode => {
                    if (!loopBreaked) {
                        const data = { encryptedFarmerCattleCode: deleteFarmerLiveStockCattleCode }
                        const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        const deleteFarmerLiveStockCattleDetailResponse =
                            await axios.delete(process.env.REACT_APP_API_URL + '/delete-farmer-live-stock-cattle-detail', { headers, data });
                        if (deleteFarmerLiveStockCattleDetailResponse.data.status != 200) {
                            toast.error(deleteFarmerLiveStockCattleDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if ((deleteFarmerLiveStockCattleDetailIndex == deleteFarmerLiveStockCattleDetailList.length) && !loopBreaked
                            && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            updateFarmerCallback();
                        }
                        else {
                            deleteFarmerLiveStockCattleDetailIndex++;
                        }
                    }
                })
            }

            //FarmerMachineryDetail Add, Update, Delete
            if (!loopBreaked) {
                for (let i = 0; i < farmerMachineryDetailsList.length; i++) {
                    const farmerMachineryDetail = farmerMachineryDetailsList[i]

                    if (farmerMachineryDetail.encryptedFarmerMachineryCode) {
                        const requestData = {
                            encryptedFarmerMachineryCode: farmerMachineryDetail.encryptedFarmerMachineryCode,
                            encryptedFarmerCode: farmerMachineryDetail.encryptedFarmerCode,
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                            machineryCategory: farmerMachineryDetail.machineryCategory,
                            machineryType: farmerMachineryDetail.machineryType,
                            machineryQty: farmerMachineryDetail.machineryQty,
                            activeStatus: farmerMachineryDetail.activeStatus,
                            modifyUser: localStorage.getItem("LoginUserName")
                        }

                        setIsLoading(true);
                        const updateFarmerMachineryDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/update-farmer-machinery-detail', requestData, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (updateFarmerMachineryDetailResponse.data.status != 200) {
                            toast.error(updateFarmerMachineryDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if ((farmerMachineryDetailIndex == farmerMachineryDetailsList.length) && !loopBreaked
                            && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            // updateFarmerCallback();
                        }
                        else {
                            farmerMachineryDetailIndex++
                        }
                    }
                    else if (!farmerMachineryDetail.encryptedFarmerMachineryCode) {
                        setIsLoading(true)
                        const addFarmerMachineryDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/add-farmer-machinery-details', farmerMachineryDetail, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (addFarmerMachineryDetailResponse.data.status != 200) {
                            toast.error(addFarmerMachineryDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if ((farmerMachineryDetailIndex == farmerMachineryDetailsList.length) && !loopBreaked
                            && !deleteFarmerMachineryDetailCodes && !deleteFarmerDocumentIds) {
                            // updateFarmerCallback();
                        }
                        else {
                            farmerLiveStockCattleDetailIndex++;
                        }
                    }
                }
            }

            var deleteFarmerMachineryDetailList = deleteFarmerMachineryDetailCodes ? deleteFarmerMachineryDetailCodes.split(',') : null;

            if (deleteFarmerMachineryDetailList) {
                var deleteFarmerMachineryDetailIndex = 1;

                deleteFarmerMachineryDetailList.forEach(async deleteFarmerMachineryCode => {
                    if (!loopBreaked) {
                        const data = { encryptedFarmerMachineryCode: deleteFarmerMachineryCode }
                        const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        const deleteFarmerMachineryDetailResponse =
                            await axios.delete(process.env.REACT_APP_API_URL + '/delete-farmer-machinery-detail', { headers, data });
                        if (deleteFarmerMachineryDetailResponse.data.status != 200) {
                            toast.error(deleteFarmerMachineryDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if ((deleteFarmerMachineryDetailIndex == deleteFarmerMachineryDetailList.length) && !loopBreaked && !deleteFarmerDocumentIds) {
                            updateFarmerCallback();
                        }
                        else {
                            deleteFarmerMachineryDetailIndex++;
                        }
                    }
                })
            }

            //FarmerDocumentDetail Add, Update, Delete
            if (!loopBreaked) {
                for (let i = 0; i < farmerDocumentDetailsList.length; i++) {
                    const farmerDocumentDetail = farmerDocumentDetailsList[i];
                    const keys = ['documentNo', 'addUser', 'modifyUser']
                    for (const key of Object.keys(farmerDocumentDetail).filter((key) => keys.includes(key))) {
                        farmerDocumentDetail[key] = farmerDocumentDetail[key] ? farmerDocumentDetail[key].toUpperCase() : '';
                    }

                    if (farmerDocumentDetail.encryptedFarmerDocumentId) {
                        const formData = new FormData();
                        formData.append("EncryptedFarmerDocumentId", farmerDocumentDetail.encryptedFarmerDocumentId)
                        formData.append("EncryptedFarmerCode", localStorage.getItem("EncryptedFarmerCode"))
                        formData.append("EncryptedClientCode", localStorage.getItem("EncryptedClientCode"))
                        formData.append("EncryptedCompanyCode", localStorage.getItem("EncryptedCompanyCode"))
                        formData.append("DocumentType", farmerDocumentDetail.documentType)
                        formData.append("DocumentNo", farmerDocumentDetail.documentNo ? farmerDocumentDetail.documentNo : "")
                        formData.append("UploadDocument", farmerDocumentDetail.farmerDocument)
                        formData.append("ModifyUser", localStorage.getItem("LoginUserName"))

                        setIsLoading(true);
                        const updateFarmerDocumentDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/update-farmer-document-detail', formData, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (updateFarmerDocumentDetailResponse.data.status != 200) {
                            toast.error(updateFarmerDocumentDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if ((farmerDocumentDetailIndex == farmerDocumentDetailsList.length) && !loopBreaked
                            && !deleteFarmerDocumentIds) {
                            // updateFarmerCallback();
                        }
                        else {
                            farmerDocumentDetailIndex++
                        }
                    }
                    else if (!farmerDocumentDetail.encryptedFarmerDocumentId) {
                        const formData = new FormData();
                        formData.append("EncryptedFarmerCode", localStorage.getItem("EncryptedFarmerCode"))
                        formData.append("EncryptedClientCode", localStorage.getItem("EncryptedClientCode"))
                        formData.append("EncryptedCompanyCode", localStorage.getItem("EncryptedCompanyCode"))
                        formData.append("DocumentType", farmerDocumentDetail.documentType)
                        formData.append("DocumentNo", farmerDocumentDetail.documentNo ? farmerDocumentDetail.documentNo : "")
                        formData.append("UploadDocument", farmerDocumentDetail.farmerDocument)
                        formData.append("AddUser", farmerDocumentDetail.addUser)
                        setIsLoading(true)
                        const addFarmerDocumentDetailResponse =
                            await axios.post(process.env.REACT_APP_API_URL + '/add-farmer-document-detail', formData, {
                                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            });
                        setIsLoading(false);
                        if (addFarmerDocumentDetailResponse.data.status != 200) {
                            toast.error(addFarmerDocumentDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if ((farmerDocumentDetailIndex == farmerDocumentDetailsList.length) && !loopBreaked
                            && !deleteFarmerDocumentIds) {
                            // updateFarmerCallback();
                        }
                        else {
                            farmerDocumentDetailIndex++
                        }
                    }
                }
            }

            var deleteFarmerDocumentDetailList = deleteFarmerDocumentIds ? deleteFarmerDocumentIds.split(',') : null;

            if (deleteFarmerDocumentDetailList) {
                var deleteFarmerDocumentDetailIndex = 1;

                for (let i = 0; i < deleteFarmerDocumentDetailList.length; i++) {
                    const deleteFarmerDocumentId = deleteFarmerDocumentDetailList[i];
                    if (!loopBreaked) {
                        const data = {
                            encryptedFarmerDocumentId: deleteFarmerDocumentId,
                            encryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode")
                        }
                        const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        const deleteFarmerDocumentResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-farmer-document-detail', { headers, data });
                        if (deleteFarmerDocumentResponse.data.status != 200) {
                            toast.error(deleteFarmerDocumentResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });

                            loopBreaked = true;
                        }
                        else if ((deleteFarmerDocumentDetailIndex == deleteFarmerDocumentDetailList.list) && !loopBreaked) {
                            updateFarmerCallback();
                        }
                        else {
                            deleteFarmerDocumentDetailIndex++
                        }
                    }
                }
            }
            updateFarmerCallback();
        }
    };

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        $('[data-rr-ui-event-key*="Farmers"]').trigger('click');
    }

    const getFarmerDocumentDetailList = async () => {
        const request = {
            EncryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-farmer-document-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(farmerDocumentDetailsAction(response.data.data));
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
