import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spinner, Modal, Button } from 'react-bootstrap';
import $ from "jquery";
import { formChangedAction, oemProductDetailsAction, tabInfoAction, vendorMasterDetailsAction, vendorMasterDetailsErrAction, vendorProductCatalogueDetailsAction } from 'actions';
import Moment from "moment";

const tabArray = ['Vendor List', 'Add Vendor']

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'vendorName', Header: 'Name' },
    { accessor: 'vendorType', Header: 'Type' },
    { accessor: 'vendorRating', Header: 'Rating' },
    { accessor: 'vendorAddress', Header: 'Address' },
    { accessor: 'vendorPincode', Header: 'Pincode' },
    { accessor: 'stateName', Header: 'State' },
    { accessor: 'countryName', Header: 'Country' },
    { accessor: 'status', Header: 'Status' }
]

const VendorMaster = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [activeTabName, setActiveTabName] = useState();
    const [formHasError, setFormError] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add Vendor"]').attr('disabled', true);
        getCompany();
    }, [])

    const vendorMasterDetailsReducer = useSelector((state) => state.rootReducer.vendorMasterDetailsReducer)
    var vendorMasterData = vendorMasterDetailsReducer.vendorMasterDetails;

    let vendorProductCatalogueDetailsReducer = useSelector((state) => state.rootReducer.vendorProductCatalogueDetailsReducer)
    let vendorProductCatalogueList = vendorProductCatalogueDetailsReducer.vendorProductCatalogueDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let isFormChanged = Object.values(formChangedData).some(value => value === true);

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
            if (companyResponse.data.data.length == 1) {
                fetchVendorMasterList(1, perPage, companyResponse.data.data[0].encryptedCompanyCode);
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
        fetchVendorMasterList(1, perPage, e.target.value);
    }

    const fetchVendorMasterList = async (page, size = perPage, encryptedCompanyCode) => {

        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedCompanyCode: encryptedCompanyCode
        }

        setIsLoading(true);
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-master-list', listFilter, {
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

    $('[data-rr-ui-event-key*="Vendor List"]').off('click').on('click', function () {
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
            $('[data-rr-ui-event-key*="Add Vendor"]').attr('disabled', true);
            clearVendorMasterReducers();
            dispatch(vendorMasterDetailsAction(undefined));
            dispatch(oemProductDetailsAction([]));
            localStorage.removeItem("EncryptedVendorCode");
            localStorage.removeItem("DeleteVendorProductCatalogueCodes");
        }
    })

    $('[data-rr-ui-event-key*="Add Vendor"]').off('click').on('click', function () {

        setActiveTabName("Add Vendor")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();

        if (vendorProductCatalogueList.length <= 0 &&
            !(localStorage.getItem("DeleteVendorProductCatalogueCodes"))) {
            getVendorProductCatalogueList();
        }
    })

    const newDetails = () => {
        if (localStorage.getItem("EncryptedCompanyCode")) {
            $('[data-rr-ui-event-key*="Add Vendor"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add Vendor"]').trigger('click');
            $('#btnSave').attr('disabled', false);
            dispatch(tabInfoAction({ title1: `${localStorage.getItem("CompanyName")}` }))
        } else {
            toast.error("Please select company first", {
                theme: 'colored',
                autoClose: 5000
            });
        }
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            $('[data-rr-ui-event-key*="Vendor List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            window.location.href = '/dashboard';
            clearVendorMasterReducers();
            dispatch(vendorMasterDetailsAction(undefined));
            localStorage.removeItem("EncryptedVendorMasterCode");
            localStorage.removeItem("DeleteVendorProductCatalogueCodes");
            localStorage.removeItem("EncryptedCompanyCode");
            localStorage.removeItem("CompanyName");
        }
    }

    const discardChanges = () => {
        $('#btnDiscard').attr('isDiscard', 'true');
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else {
            $('[data-rr-ui-event-key*="Vendor List"]').trigger('click');
        }

        setModalShow(false);
    }

    const getVendorProductCatalogueList = async () => {
        const request = {
            EncryptedVendorCode: localStorage.getItem("EncryptedVendorCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-product-catalogue-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(vendorProductCatalogueDetailsAction(response.data.data));
            }
        }
    }

    const clearVendorMasterReducers = () => {
        dispatch(formChangedAction(undefined))
        dispatch(vendorProductCatalogueDetailsAction([]));
        dispatch(vendorMasterDetailsErrAction(undefined));
        localStorage.removeItem("DeleteVendorProductCatalogueCodes");
    }

    const vendorMasterValidation = () => {
        setModalShow(false);

        const vendorNameErr = {};
        const countryCodeErr = {};
        const stateCodeErr = {};
        const panNoErr = {};
        const gstNoErr = {};
        const websiteErr = {};
        const vendorProductCatalogueDetailErr = {};

        let isValid = true;

        if (!vendorMasterData.vendorName) {
            vendorNameErr.empty = "Enter vendor name";
            isValid = false;
            setFormError(true);
        }

        if (!vendorMasterData.countryCode) {
            countryCodeErr.empty = "Select country";
            isValid = false;
            setFormError(true);
        }

        if (!vendorMasterData.stateCode) {
            stateCodeErr.empty = "Select state";
            isValid = false;
            setFormError(true);
        }

        if (vendorMasterData.vendorGstNo &&
            !(/^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ][0-9a-zA-Z]{1}$/.test(vendorMasterData.vendorGstNo))) {
            gstNoErr.gstNoInvalid = "Enter valid GST number";
            isValid = false;
            setFormError(true);
        }

        if (vendorMasterData.vendorPanNo &&
            !(/^[a-zA-Z]{3}[abcfghljptABCFGHLJPT][a-zA-Z][0-9]{4}[a-zA-Z]$/.test(vendorMasterData.vendorPanNo))) {
            panNoErr.panNoInvalid = "Enter valid PAN number";
            isValid = false;
            setFormError(true);
        }

        if (vendorMasterData.vendorWebsite &&
            !(/^(ftp|http|https):\/\/[^ "]+$/.test(vendorMasterData.vendorWebsite))) {
            websiteErr.webSiteInvalid = "Enter valid website";
            isValid = false;
            setFormError(true);
        }

        if (vendorProductCatalogueList && vendorProductCatalogueList.length > 0) {
            vendorProductCatalogueList.forEach((row, index) => {
                if (!row.validFrom || !row.validTo) {
                    vendorProductCatalogueDetailErr.invalidVendorProductCatalogueDetail = "Fill the required fields"
                    isValid = false;
                    setFormError(true);
                }

                if(row.validFrom > row.validTo){
                    vendorProductCatalogueDetailErr.invalidDate = "From Date cannot be greater than To Date"
                    isValid = false;
                    setFormError(true);
                    toast.error(vendorProductCatalogueDetailErr.invalidDate, {
                        theme: 'colored'
                    });
                }
            })
        }

        if (!isValid) {
            var errorObject = {
                vendorNameErr,
                countryCodeErr,
                stateCodeErr,
                panNoErr,
                gstNoErr,
                websiteErr,
                vendorProductCatalogueDetailErr
            }
            dispatch(vendorMasterDetailsErrAction(errorObject))
        }

        return isValid;
    }

    const updateVendorMasterCallback = (isAddVendorMaster = false) => {
        setModalShow(false);

        if (!isAddVendorMaster) {
            toast.success("Vendor details updated successfully", {
                time: 'colored'
            })
        }

        $('#btnSave').attr('disabled', true)

        clearVendorMasterReducers();

        fetchVendorMasterList(1, perPage, localStorage.getItem("EncryptedCompanyCode"));

        $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
    }

    const addVendorMasterDetails = () => {
        if (vendorMasterValidation()) {
            const requestData = {
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                vendorName: vendorMasterData.vendorName,
                vendorType: vendorMasterData.vendorType && vendorMasterData.vendorType == "Seed Supplier" ? "SS" : vendorMasterData.vendorType == "Transporter" ? "TR" : vendorMasterData.vendorType == "Input Supplier" ? "IS" : vendorMasterData.vendorType == "Machinery Supplier" ? "MS" : vendorMasterData.vendorType == "Seedling Supplier" ? "SD" : "",
                vendorAddress: vendorMasterData.vendorAddress ? vendorMasterData.vendorAddress : "",
                vendorPincode: vendorMasterData.vendorPincode ? vendorMasterData.vendorPincode : "",
                countryCode: vendorMasterData.countryCode,
                stateCode: vendorMasterData.stateCode,
                vendorGstNo: vendorMasterData.vendorGstNo ? vendorMasterData.vendorGstNo : "",
                vendorPanNo: vendorMasterData.vendorPanNo ? vendorMasterData.vendorPanNo : "",
                vendorTinNo: vendorMasterData.vendorTinNo ? vendorMasterData.vendorTinNo : "",
                vendorWebsite: vendorMasterData.vendorWebsite ? vendorMasterData.vendorWebsite : "",
                vendorRating: vendorMasterData.vendorRating ? vendorMasterData.vendorRating : "",
                activeStatus: vendorMasterData.status == null || vendorMasterData.status == "Active" ? "A" : "S",
                vendorProductCatalogueDetails: vendorProductCatalogueList,
                addUser: localStorage.getItem("LoginUserName")
            }

            const keys = ["vendorName", "vendorAddress", "vendorGstNo", "vendorPanNo", "addUser"]
            for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
                requestData[key] = requestData[key] ? requestData[key].toUpperCase() : '';
            }

            const vendorProductCatalogueKeys = ["addUser"]
            var index = 0;
            for (var obj in requestData.vendorProductCatalogueDetails) {
                var vendorProductCatalogueDetailObj = requestData.vendorProductCatalogueDetails[obj];

                for (const key of Object.keys(vendorProductCatalogueDetailObj).filter((key) => vendorProductCatalogueKeys.includes(key))) {
                    vendorProductCatalogueDetailObj[key] = vendorProductCatalogueDetailObj[key] ? vendorProductCatalogueDetailObj[key].toUpperCase() : "";
                }
                requestData.vendorProductCatalogueDetails[index] = vendorProductCatalogueDetailObj;
                index++;
            }

            setIsLoading(true);
            axios.post(process.env.REACT_APP_API_URL + '/add-vendor-master-detail', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    if (res.data.status == 200) {
                        setIsLoading(false)
                        setTimeout(function () {
                            dispatch(vendorMasterDetailsAction({
                                ...vendorMasterData,
                                encryptedVendorCode: res.data.data.encryptedVendorCode,
                                vendorCode: res.data.data.vendorCode
                            }))
                        }, 50);
                        localStorage.setItem("EncryptedVendorCode", res.data.data.encryptedVendorCode);
                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updateVendorMasterCallback(true);
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

    const updateVendorMasterDetails = async () => {
        if (vendorMasterValidation()) {
            if (!formChangedData.vendorMasterDetailUpdate &&
                !(formChangedData.vendorProductCatalogueDetailUpdate ||
                    formChangedData.vendorProductCatalogueDetailAdd || formChangedData.vendorProductCatalogueDetailDelete)) {
                return;
            }

            var deleteVendorProductCatalogueCodes = localStorage.getItem("DeleteVendorProductCatalogueCodes")

            const updateRequestData = {
                encryptedVendorCode: localStorage.getItem("EncryptedVendorCode"),
                encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                vendorName: vendorMasterData.vendorName,
                vendorType: vendorMasterData.vendorType && vendorMasterData.vendorType == "Seed Supplier" ? "SS" : vendorMasterData.vendorType == "Transporter" ? "TR" : vendorMasterData.vendorType == "Input Supplier" ? "IS" : vendorMasterData.vendorType == "Machinery Supplier" ? "MS" : vendorMasterData.vendorType == "Seedling Supplier" ? "SD" : "",
                vendorAddress: vendorMasterData.vendorAddress ? vendorMasterData.vendorAddress : "",
                vendorPincode: vendorMasterData.vendorPincode ? vendorMasterData.vendorPincode : "",
                countryCode: vendorMasterData.countryCode,
                stateCode: vendorMasterData.stateCode,
                vendorGstNo: vendorMasterData.vendorGstNo ? vendorMasterData.vendorGstNo : "",
                vendorPanNo: vendorMasterData.vendorPanNo ? vendorMasterData.vendorPanNo : "",
                vendorTinNo: vendorMasterData.vendorTinNo ? vendorMasterData.vendorTinNo : "",
                vendorWebsite: vendorMasterData.vendorWebsite ? vendorMasterData.vendorWebsite : "",
                vendorRating: vendorMasterData.vendorRating ? vendorMasterData.vendorRating : "",
                activeStatus: vendorMasterData.status == null || vendorMasterData.status == "Active" ? "A" : "S",
                modifyUser: localStorage.getItem("LoginUserName")
            }

            const keys = ["vendorName", "vendorAddress", "vendorGstNo", "vendorPanNo", "modifyUser"]
            for (const key of Object.keys(updateRequestData).filter((key) => keys.includes(key))) {
                updateRequestData[key] = updateRequestData[key] ? updateRequestData[key].toUpperCase() : '';
            }

            var hasError = false;

            if (formChangedData.vendorMasterDetailUpdate) {
                setIsLoading(true)
                await axios.post(process.env.REACT_APP_API_URL + '/update-vendor-master-detail', updateRequestData, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                })
                    .then(res => {
                        setIsLoading(false);
                        if (res.data.status !== 200) {
                            toast.error(res.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                        }
                    })
            }

            var vendorProductCatalogueDetailIndex = 1;

            //VendorProductCatalogueDetail ADD, UPDATE, DELETE
            if (!hasError && (formChangedData.vendorProductCatalogueDetailUpdate ||
                formChangedData.vendorProductCatalogueDetailAdd || formChangedData.vendorProductCatalogueDetailDelete)) {

                if (!hasError && formChangedData.vendorProductCatalogueDetailDelete) {
                    var deleteVendorProductCatalogueDetailsList = deleteVendorProductCatalogueCodes ? deleteVendorProductCatalogueCodes.split(',') : null;
                    if (deleteVendorProductCatalogueDetailsList) {
                        var deleteVendorProductCatalogueDetailsIndex = 1;

                        for (let i = 0; i < deleteVendorProductCatalogueDetailsList.length; i++) {
                            const deleteVendorProductCatalogueDetailCode = deleteVendorProductCatalogueDetailsList[i];
                            const data = { encryptedVendorProductCatalogueCode: deleteVendorProductCatalogueDetailCode }
                            const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

                            const deleteResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-vendor-product-catalogue-detail', { headers, data });
                            if (deleteResponse.data.status != 200) {
                                toast.error(deleteResponse.data.message, {
                                    theme: 'colored',
                                    autoClose: 10000
                                });
                                hasError = true;
                                break;
                            }
                            deleteVendorProductCatalogueDetailsIndex++
                        }
                    }
                }

                for (let i = 0; i < vendorProductCatalogueList.length; i++) {
                    const vendorProductCatalogueDetail = vendorProductCatalogueList[i];

                    const keys = ['modifyUser']
                    for (const key of Object.keys(vendorProductCatalogueDetail).filter((key) => keys.includes(key))) {
                        vendorProductCatalogueDetail[key] = vendorProductCatalogueDetail[key] ? vendorProductCatalogueDetail[key].toUpperCase() : "";
                    }

                    if (!hasError && formChangedData.vendorProductCatalogueDetailUpdate && vendorProductCatalogueDetail.encryptedVendorProductCatalogueCode) {
                        const requestData = {
                            encryptedVendorProductCatalogueCode: vendorProductCatalogueDetail.encryptedVendorProductCatalogueCode,
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                            oemProductCatalogueCode: vendorProductCatalogueDetail.oemProductCatalogueCode,
                            productCode: vendorProductCatalogueDetail.productCode,
                            vendorCode: vendorProductCatalogueDetail.vendorCode,
                            oemRate: vendorProductCatalogueDetail.oemRate ? parseFloat(vendorProductCatalogueDetail.oemRate) : 0,
                            vendorRate: vendorProductCatalogueDetail.vendorRate ? parseFloat(vendorProductCatalogueDetail.vendorRate) : 0,
                            vendorAmount: vendorProductCatalogueDetail.vendorAmount ? parseFloat(vendorProductCatalogueDetail.vendorAmount) : 0,
                            quantity: vendorProductCatalogueDetail.quantity ? parseFloat(vendorProductCatalogueDetail.quantity) : 0,
                            unitCode: vendorProductCatalogueDetail.unitCode ? parseInt(vendorProductCatalogueDetail.unitCode) : 0,
                            validFrom: Moment(vendorProductCatalogueDetail.validFrom).format("YYYY-MM-DD"),
                            validTo: Moment(vendorProductCatalogueDetail.validTo).format("YYYY-MM-DD"),
                            activeStatus: !vendorProductCatalogueDetail.activeStatus || vendorProductCatalogueDetail.activeStatus == "Active" ? "A" : "S",
                            modifyUser: localStorage.getItem("LoginUserName")
                        }
                        setIsLoading(true);
                        const updateResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-vendor-product-catalogue-detail', requestData, {
                            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        });
                        setIsLoading(false);
                        if (updateResponse.data.status != 200) {
                            toast.error(updateResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                            break;
                        }
                    }
                    else if (!hasError && formChangedData.vendorProductCatalogueDetailAdd && !vendorProductCatalogueDetail.encryptedVendorProductCatalogueCode) {
                        const requestData = {
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                            encryptedVendorCode: localStorage.getItem("EncryptedVendorCode"),
                            encryptedProductMasterCode: vendorProductCatalogueDetail.encryptedProductMasterCode,
                            encryptedProductVarietyCode: vendorProductCatalogueDetail.encryptedProductVarietyCode,
                            oemRate: vendorProductCatalogueDetail.oemRate ? vendorProductCatalogueDetail.oemRate : "",
                            vendorRate: vendorProductCatalogueDetail.vendorRate ? vendorProductCatalogueDetail.vendorRate : "",
                            vendorAmount: vendorProductCatalogueDetail.vendorAmount ? vendorProductCatalogueDetail.vendorAmount : "",
                            quantity: vendorProductCatalogueDetail.quantity ? vendorProductCatalogueDetail.quantity : "",
                            unitCode: vendorProductCatalogueDetail.unitCode ? vendorProductCatalogueDetail.unitCode : "",
                            validFrom: Moment(vendorProductCatalogueDetail.validFrom).format("YYYY-MM-DD"),
                            validTo: Moment(vendorProductCatalogueDetail.validTo).format("YYYY-MM-DD"),
                            activeStatus: vendorProductCatalogueDetail.activeStatus,
                            addUser: localStorage.getItem("LoginUserName"),
                            productLineCode: vendorProductCatalogueDetail.productLineCode,
                            productCategoryCode: vendorProductCatalogueDetail.productCategoryCode
                        }
                        setIsLoading(true);
                        const addResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-vendor-product-catalogue-detail', requestData, {
                            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        });
                        setIsLoading(false);
                        if (addResponse.data.status != 200) {
                            toast.error(addResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                            break;
                        } else {
                            const updatedVendorProductCatalogueList = [...vendorProductCatalogueList];
                            updatedVendorProductCatalogueList[i] = {
                                ...updatedVendorProductCatalogueList[i],
                                encryptedVendorProductCatalogueCode: addResponse.data.data.encryptedVendorProductCatalogueCode
                            };

                            dispatch(vendorProductCatalogueDetailsAction(updatedVendorProductCatalogueList));
                        }
                    }
                    vendorProductCatalogueDetailIndex++
                }
            }

            if (!hasError) {
                clearVendorMasterReducers();
                updateVendorMasterCallback();
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
                        <h5>Do you want to save changes?</h5>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={vendorMasterData.encryptedVendorCode ? updateVendorMasterDetails : addVendorMasterDetails}>Save</Button>
                        <Button variant="danger" id='btnDiscard' onClick={discardChanges}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="VendorMaster"
                saveDetails={vendorMasterData.encryptedVendorCode ? updateVendorMasterDetails : addVendorMasterDetails}
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

export default VendorMaster