import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { bankDetailsAction, commonContactDetailsAction, farmerCardDetailsAction, farmerDetailsAction, farmerDetailsErrorAction, farmerFamilyDetailsAction, farmerLiveStockCattleDetailsAction, farmerMachineryDetailsAction } from 'actions';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const tabArray = ['Farmers', 'Add Farmer', 'Family', 'Bank', 'Land', 'Cattle', 'Documents', 'Events', 'Mkt SMS'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'cardNo', Header: 'Card No' },
    { accessor: 'farmerName', Header: 'Farmer Name' },
    { accessor: 'farmerFatherName', Header: 'Father Name' },
    { accessor: 'village', Header: 'Village' },
    { accessor: 'districtCode', Header: 'District Code' },
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

    const fetchFarmerList = async (page, size = perPage) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size
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
                }
            });
    };

    useEffect(() => {
        fetchFarmerList(1);
        $('[data-rr-ui-event-key*="Add Farmer"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Family"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Bank"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Land"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Cattle"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Documents"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Events"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Mkt SMS"]').attr('disabled', true);
    }, []);

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

    $('[data-rr-ui-event-key*="Add Farmer"]').click(function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
    })

    const clearFarmerReducers = () => {
        dispatch(farmerDetailsErrorAction(undefined));
        dispatch(farmerDetailsAction(undefined));
        dispatch(farmerFamilyDetailsAction(undefined));
        dispatch(commonContactDetailsAction(undefined));
        dispatch(bankDetailsAction(undefined));
        dispatch(farmerCardDetailsAction(undefined));
        dispatch(farmerLiveStockCattleDetailsAction(undefined));
        dispatch(farmerMachineryDetailsAction(undefined));
        $("#AddFarmerDetailsForm").data("changed", false);
    }

    const newDetails = () => {
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
    })

    $('[data-rr-ui-event-key*="Add Farmer"]').click(function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Family"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Bank"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Land"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Cattle"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Documents"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Events"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Mkt SMS"]').attr('disabled', false);
        getFarmerFamilyDetail();
    })

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

        if (!isAddFarmer) {
            toast.success("Farmer details updated successfully!", {
                theme: 'colored'
            });
        }

        $('#btnSave').attr('disabled', true)

        fetchFarmerList(1);
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

    const addFarmerDetails = () => {
        if (farmerValidation()) {
            const requestData = {
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                encryptedCompanyCode: farmerData.encryptedCompanyCode,
                farmerFirstName: farmerData.firstName,
                farmerMiddleName: farmerData.middleName ? farmerData.middleName : "",
                farmerLastName: farmerData.lastName,
                farmerAddress: farmerData.address,
                farmerEducation: farmerData.educationalStatus == "Primary School" ? "PRS" : farmerData.educationalStatus == "High School" ? "HGS" : farmerData.educationalStatus == "Inter" ? "INT" : farmerData.educationalStatus == "Graduate" ? "GRD" : farmerData.educationalStatus == "Post Graduate" ? "PSG" : farmerData.educationalStatus == "Illiterate" ? "ILT" : farmerData.educationalStatus == "Doctrate" ? "DOC" : "",
                farmerIDType: farmerData.farmerIDType == "Voter ID" ? "VID" : farmerData.farmerIDType == "Driving License" ? "DL" : farmerData.farmerIDType == "PAN Card" ? "PAN" : farmerData.farmerIDType == "Ration Card" ? "RTC" : farmerData.farmerIDType == "Other" ? "OTH" : "",
                farmerIdNo: farmerData.farmerIdNo ? farmerData.farmerIdNo : "",
                farmerSocialCategory: farmerData.socialCategory == "ST" ? "ST" : farmerData.socialCategory == "SC" ? "SC" : farmerData.socialCategory == "OBC" ? "OBC" : farmerData.socialCategory == "General" ? "GEN" : "",
                farmerDOB: farmerData.farmerDOB ? farmerData.farmerDOB : new Date(),
                farmerGender: farmerData.Gender == null || farmerData.Gender == "Male" ? "M" : "F",
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
                        <Button variant="success" onClick={!userData.encryptedSecurityUserId ? addUserDetails : updateUserDetails}>Save</Button>
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
                saveDetails={addFarmerDetails}
            />
        </>
    )
}

export default Farmers
