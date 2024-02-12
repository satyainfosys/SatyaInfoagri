import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import $ from "jquery";
import { toast } from 'react-toastify';
import Moment from "moment";
import { formChangedAction, materialReceiptDetailsAction, materialReceiptErrorAction, materialReceiptHeaderDetailsAction, tabInfoAction, vendorMasterDetailsListAction } from 'actions';

const tabArray = ["Material List", "Add Material"]

const listColumnArray = [
    { accessor: 's1', Header: 'S.No' },
    { accessor: 'poNo', Header: 'Po No' },
    { accessor: 'materialReceiptId', Header: 'Material Receipt No' },
    { accessor: 'vendorName', Header: 'Vendor Name' },
    { accessor: 'materialReceiptDate', Header: 'Delivery Date' },
    { accessor: 'personName', Header: 'Person Name' },
    { accessor: 'materialStatus', Header: 'Material Status' },
    { accessor: 'printStatus', Header: 'Print' },
]

const MaterialReceipt = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [activeTabName, setActiveTabName] = useState();
    const [formHasError, setFormError] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add Material"]').attr('disabled', true);
        localStorage.removeItem("EncryptedMaterialReceiptId");
        getCompany();
    }, [])

    const materialReceiptHeaderReducer = useSelector((state) => state.rootReducer.materialReceiptHeaderReducer)
    var materialReceiptHeaderData = materialReceiptHeaderReducer.materialReceiptHeaderDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const materialReceiptDetailsReducer = useSelector((state) => state.rootReducer.materialReceiptDetailsReducer)
    var materialReceiptList = materialReceiptDetailsReducer.materialReceiptDetails;

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
                if (companyResponse.data && companyResponse.data.data.length > 0) {
                    if (localStorage.getItem('CompanyCode')) {
                        var companyDetail = companyResponse.data.data.find(company => company.companyCode == localStorage.getItem('CompanyCode'));
                        companyData.push({
                            key: companyDetail.companyName,
                            value: companyDetail.encryptedCompanyCode,
                            label: companyDetail.companyName
                        })
                        localStorage.setItem("EncryptedCompanyCode", companyDetail.encryptedCompanyCode)
                        localStorage.setItem("CompanyName", companyDetail.companyName)
                        setCompanyList(companyData);
                        fetchMaterialReceiptHeaderList(1, perPage, companyDetail.encryptedCompanyCode);
                        getVendorMasterList(companyDetail.encryptedCompanyCode);
                    }
                    else {
                        companyResponse.data.data.forEach(company => {
                            companyData.push({
                                key: company.companyName,
                                value: company.encryptedCompanyCode,
                                label: company.companyName
                            })
                        })
                        setCompanyList(companyData)
                    }
                }
            }
            setCompanyList(companyData)
            if (companyResponse.data.data.length == 1) {
                fetchMaterialReceiptHeaderList(1, perPage, companyResponse.data.data[0].encryptedCompanyCode);
                getVendorMasterList(companyResponse.data.data[0].encryptedCompanyCode)
                localStorage.setItem("CompanyName", companyResponse.data.data[0].companyName)
                localStorage.setItem("EncryptedCompanyCode", companyResponse.data.data[0].encryptedCompanyCode);
            }
        } else {
            setCompanyList([])
        }
    }

    const getVendorMasterList = async () => {
        const requestData = {
            pageNumber: 1,
            pageSize: 1,
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-master-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                dispatch(vendorMasterDetailsListAction(response.data.data))
            }
        } else {
            dispatch(vendorMasterDetailsListAction([]))
        }
    }

    const handleFieldChange = e => {
        localStorage.setItem("EncryptedCompanyCode", e.target.value);
        const selectedOption = e.target.options[e.target.selectedIndex];
        const selectedKey = selectedOption.dataset.key || selectedOption.label;
        localStorage.setItem("CompanyName", selectedKey)
        fetchMaterialReceiptHeaderList(1, perPage, e.target.value);
        getVendorMasterList(e.target.value);
    }

    const fetchMaterialReceiptHeaderList = async (page, size = perPage, encryptedCompanyCode) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedCompanyCode: encryptedCompanyCode
        }

        setIsLoading(true);
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-material-receipt-header-list', listFilter, {
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

    $('[data-rr-ui-event-key*="Material List"]').off('click').on('click', function () {
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
            $('[data-rr-ui-event-key*="Add Material"]').attr('disabled', true);
            clearMaterialReceiptReducers();
            localStorage.removeItem("EncryptedMaterialReceiptId");
            localStorage.removeItem("OldMaterialStatus");
            dispatch(materialReceiptHeaderDetailsAction(undefined));
        }
    })

    $('[data-rr-ui-event-key*="Add Material"]').off('click').on('click', function () {
        setActiveTabName("Add Material")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();

        if (materialReceiptList.length <= 0) {
            getMaterialReceiptDetailList();
        }
    })

    const newDetails = () => {
        if (localStorage.getItem("EncryptedCompanyCode") && localStorage.getItem("CompanyName")) {
            $('[data-rr-ui-event-key*="Add Material"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add Material"]').trigger('click');
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
            $('[data-rr-ui-event-key*="Material List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            window.location.href = '/dashboard';
            dispatch(materialReceiptHeaderDetailsAction(undefined));
            dispatch(vendorMasterDetailsListAction([]));
            localStorage.removeItem("EncryptedMaterialReceiptId");
            localStorage.removeItem("EncryptedCompanyCode");
            localStorage.removeItem("CompanyName");
            localStorage.removeItem("DeleteMaterialReceiptDetailIds");
        }
    }

    const discardChanges = () => {
        $('#btnDiscard').attr('isDiscard', 'true');
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else {
            $('[data-rr-ui-event-key*="Material List"]').trigger('click');
        }

        setModalShow(false);
    }

    const getMaterialReceiptDetailList = async () => {
        const request = {
            encryptedMaterialReceiptId: localStorage.getItem("EncryptedMaterialReceiptId")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-material-receipt-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(materialReceiptDetailsAction(response.data.data));
            }
        }
    }

    const clearMaterialReceiptReducers = () => {
        dispatch(formChangedAction(undefined));
        dispatch(materialReceiptDetailsAction([]));
        dispatch(materialReceiptErrorAction(undefined));
        localStorage.removeItem("DeleteMaterialReceiptDetailIds");
    }

    const materialReceiptValidation = () => {
        setModalShow(false);

        const vendorErr = {};
        const materialReceiptDetailErr = {};

        let isValid = true;

        if (!materialReceiptHeaderData.vendorCode) {
            vendorErr.empty = "Select vendor";
            isValid = false;
        }

        if (materialReceiptList.length < 1) {
            materialReceiptDetailErr.materialReceiptDetailEmpty = "At least one material details required";
            setTimeout(() => {
                toast.error(materialReceiptDetailErr.materialReceiptDetailEmpty, {
                    theme: 'colored'
                });
            }, 1000);
            isValid = false;
        }
        else if (materialReceiptList && materialReceiptList.length > 0) {
            materialReceiptList.forEach((row, index) => {
                if (!row.productLineCode || !row.productCategoryCode || !row.productCode || !row.receivedQuantity) {
                    materialReceiptDetailErr.invalidMaterialReceiptDetail = "Fill the required fields"
                    isValid = false;
                } else if (!row.poDetailId) {
                    if (!row.rate || !row.amount) {
                        materialReceiptDetailErr.invalidMaterialReceiptDetail = "Fill the required fields"
                        isValid = false;
                    }
                }
            })
        }

        if (!isValid) {
            var errorObject = {
                vendorErr,
                materialReceiptDetailErr
            }

            dispatch(materialReceiptErrorAction(errorObject))
        }

        return isValid;
    }

    const updateMaterialReceiptCallback = (isAddMaterialReceipt = false) => {
        setModalShow(false);

        if (!isAddMaterialReceipt) {
            toast.success("Material receipt details updated successfully", {
                time: 'colored'
            })
        }

        $('#btnSave').attr('disabled', true)

        clearMaterialReceiptReducers();

        fetchMaterialReceiptHeaderList(1, perPage, localStorage.getItem("EncryptedCompanyCode"));

        $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
    }

    const addMaterialReceiptDetails = () => {
        if (materialReceiptValidation()) {
            const requestData = {
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                vendorCode: materialReceiptHeaderData.vendorCode,
                poNo: materialReceiptHeaderData.poNo ? materialReceiptHeaderData.poNo : "",
                materialReceiptDate: materialReceiptHeaderData.materialReceiptDate ?
                    Moment(materialReceiptHeaderData.materialReceiptDate).format("YYYY-MM-DD") : Moment().format("YYYY-MM-DD"),
                personName: localStorage.getItem("Name"),
                challanNo: materialReceiptHeaderData.challanNo ? materialReceiptHeaderData.challanNo : "",
                receivedPoQty: materialReceiptHeaderData.receivedPoQty ? materialReceiptHeaderData.receivedPoQty : 0,
                activeStatus: "A",
                addUser: localStorage.getItem("LoginUserName"),
                materialStatus: materialReceiptHeaderData.materialStatus && materialReceiptHeaderData.materialStatus == "Approved" ? "A" : "D",
                materialReceiptDetails: materialReceiptList
            }

            const keys = ["addUser", "personName"]
            for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
                requestData[key] = requestData[key] ? requestData[key].toUpperCase() : "";
            }

            const materialReceiptDetailKeys = ['addUser']
            var index = 0;
            for (var obj in requestData.materialReceiptDetails) {
                var materialReceiptObject = requestData.materialReceiptDetails[obj];

                for (const key of Object.keys(materialReceiptObject).filter((key) => materialReceiptDetailKeys.includes(key))) {
                    materialReceiptObject[key] = materialReceiptObject[key] ? materialReceiptObject[key].toUpperCase() : "";
                }

                requestData.materialReceiptDetails[index] = materialReceiptObject;
                index++;
            }

            setIsLoading(true);
            axios.post(process.env.REACT_APP_API_URL + '/add-material-receipt-header', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    if (res.data.status == 200) {
                        setIsLoading(false)
                        setTimeout(function () {
                            dispatch(materialReceiptHeaderDetailsAction({
                                ...materialReceiptHeaderData,
                                encryptedMaterialReceiptId: res.data.data.encryptedMaterialReceiptId,
                                materialReceiptId: res.data.data.materialReceiptId
                            }))
                        }, 50);
                        localStorage.setItem("EncryptedMaterialReceiptId", res.data.data.encryptedMaterialReceiptId);
                        localStorage.setItem("OldMaterialStatus", materialReceiptHeaderData.materialStatus)
                        if (materialReceiptHeaderData.materialStatus == "Approved") {
                            createdInventoryDetail(res.data.data.materialReceiptDetailIdList);
                            $('#btnSave').attr('disabled', true);
                        }
                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updateMaterialReceiptCallback(true);
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

    const updateMaterialReceiptDetails = async () => {
        let materialReceiptDetailIds = []
        let filteredMaterialReceiptDetails = []
        if (materialReceiptValidation()) {
            if (!formChangedData.materialReceiptHeaderDetailUpdate &&
                !(formChangedData.materialReceiptDetailAdd || formChangedData.materialReceiptDetailUpdate || formChangedData.materialReceiptDetailDelete)) {
                return;
            }

            var deleteMaterialReceiptDetailIds = localStorage.getItem("DeleteMaterialReceiptDetailIds");

            const updateRequestData = {
                encryptedMaterialReceiptId: localStorage.getItem("EncryptedMaterialReceiptId"),
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                vendorCode: materialReceiptHeaderData.vendorCode,
                poNo: materialReceiptHeaderData.poNo ? materialReceiptHeaderData.poNo : "",
                materialReceiptDate: materialReceiptHeaderData.materialReceiptDate ?
                    Moment(materialReceiptHeaderData.materialReceiptDate).format("YYYY-MM-DD") : Moment().format("YYYY-MM-DD"),
                personName: localStorage.getItem("Name"),
                challanNo: materialReceiptHeaderData.challanNo ? materialReceiptHeaderData.challanNo : "",
                receivedPoQty: materialReceiptHeaderData.receivedPoQty ? materialReceiptHeaderData.receivedPoQty : 0,
                materialStatus: materialReceiptHeaderData.materialStatus && materialReceiptHeaderData.materialStatus == "Approved" ? "A" : "D",
                modifyUser: localStorage.getItem("LoginUserName"),
            }

            const keys = ["modifyUser", "personName"]
            for (const key of Object.keys(updateRequestData).filter((key) => keys.includes(key))) {
                updateRequestData[key] = updateRequestData[key] ? updateRequestData[key].toUpperCase() : "";
            }

            var hasError = false;
            if (formChangedData.materialReceiptHeaderDetailUpdate) {
                setIsLoading(true);
                await axios.post(process.env.REACT_APP_API_URL + '/update-material-receipt-header', updateRequestData, {
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
                        } else {
                            localStorage.setItem("OldMaterialStatus", materialReceiptHeaderData.materialStatus);
                            if (materialReceiptHeaderData.materialStatus == "Approved") {
                                materialReceiptDetailIds = res.data.data.materialReceiptDetailId
                                $('#btnSave').attr('disabled', true);
                            }
                        }
                    })
            }

            var materialReceiptDetailIndex = 1;

            //MaterialReceiptDetail ADD, UPDATE, DELETE
            if (!hasError && (formChangedData.materialReceiptDetailAdd || formChangedData.materialReceiptDetailUpdate || formChangedData.materialReceiptDetailDelete)) {
                if (!hasError && formChangedData.materialReceiptDetailDelete) {
                    var deleteMaterialReceiptDetailList = deleteMaterialReceiptDetailIds ? deleteMaterialReceiptDetailIds.split(',') : null;
                    if (deleteMaterialReceiptDetailList) {
                        var deletMaterialReceiptDetailIndex = 1;

                        for (let i = 0; i < deleteMaterialReceiptDetailList.length; i++) {
                            const deleteId = deleteMaterialReceiptDetailList[i];
                            const data = { encryptedMaterialReceiptDetailId: deleteId }
                            const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

                            const deleteResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-material-receipt-detail', { headers, data });
                            if (deleteResponse.data.status != 200) {
                                toast.error(deleteResponse.data.message, {
                                    theme: 'colored',
                                    autoClose: 10000
                                });
                                hasError = true;
                                break;
                            }
                            deletMaterialReceiptDetailIndex++
                        }
                    }
                }

                for (let i = 0; i < materialReceiptList.length; i++) {
                    const materialReceiptDetailData = materialReceiptList[i];

                    const keys = ["modifyUser", "varietyName", "brandName"];
                    for (const key of Object.keys(materialReceiptDetailData).filter((key) => keys.includes(key))) {
                        materialReceiptDetailData[key] = materialReceiptDetailData[key] ? materialReceiptDetailData[key].toUpperCase() : "";
                    }

                    if (!hasError && formChangedData.materialReceiptDetailUpdate && materialReceiptDetailData.encryptedMaterialReceiptDetailId) {
                        const requestData = {
                            encryptedMaterialReceiptDetailId: materialReceiptDetailData.encryptedMaterialReceiptDetailId,
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                            encryptedMaterialReceiptId: localStorage.getItem("EncryptedMaterialReceiptId"),
                            vendorCode: materialReceiptDetailData.vendorCode,
                            productLineCode: materialReceiptDetailData.productLineCode,
                            productCategoryCode: materialReceiptDetailData.productCategoryCode,
                            productCode: materialReceiptDetailData.productCode,
                            poDetailId: materialReceiptDetailData.poDetailId ? materialReceiptDetailData.poDetailId : 0,
                            receivedQuantity: parseFloat(materialReceiptDetailData.receivedQuantity),
                            rejectedQuantity: materialReceiptDetailData.rejectedQuantity ? parseFloat(materialReceiptDetailData.rejectedQuantity) : 0,
                            varietyName: materialReceiptDetailData.varietyName ? materialReceiptDetailData.varietyName : "",
                            brandName: materialReceiptDetailData.brandName ? materialReceiptDetailData.brandName : "",
                            unitCode: materialReceiptDetailData.unitCode ? parseInt(materialReceiptDetailData.unitCode) : 0,
                            modifyUser: localStorage.getItem("LoginUserName"),
                            rate: parseFloat(materialReceiptDetailData.rate),
                            amount: parseFloat(materialReceiptDetailData.amount),
                            materialStatus: materialReceiptHeaderData.materialStatus,
                            materialReceiptDate: materialReceiptHeaderData.materialReceiptDate ?
                                Moment(materialReceiptHeaderData.materialReceiptDate).format("YYYY-MM-DD") : Moment().format("YYYY-MM-DD")
                        }
                        setIsLoading(true);
                        const updateResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-material-receipt-detail', requestData, {
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
                    else if (!hasError && formChangedData.materialReceiptDetailAdd && !materialReceiptDetailData.encryptedMaterialReceiptDetailId) {
                        const requestData = {
                            encryptedMaterialReceiptId: localStorage.getItem("EncryptedMaterialReceiptId"),
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                            vendorCode: materialReceiptHeaderData.vendorCode,
                            poDetailId: materialReceiptDetailData.poDetailId ? materialReceiptDetailData.poDetailId : 0,
                            productLineCode: materialReceiptDetailData.productLineCode,
                            productCategoryCode: materialReceiptDetailData.productCategoryCode,
                            productCode: materialReceiptDetailData.productCode,
                            receivedQuantity: materialReceiptDetailData.receivedQuantity,
                            rejectedQuantity: materialReceiptDetailData.rejectedQuantity ? materialReceiptDetailData.rejectedQuantity : "",
                            varietyName: materialReceiptDetailData.varietyName ? materialReceiptDetailData.varietyName : "",
                            brandName: materialReceiptDetailData.brandName ? materialReceiptDetailData.brandName : "",
                            rate: materialReceiptDetailData.poDetailId ? materialReceiptDetailData.poRate : materialReceiptDetailData.rate,
                            amount: materialReceiptDetailData.poDetailId ? materialReceiptDetailData.poAmt : materialReceiptDetailData.amount,
                            unitCode: materialReceiptDetailData.unitCode ? materialReceiptDetailData.unitCode : "",
                            addUser: localStorage.getItem("LoginUserName"),
                            materialStatus: materialReceiptHeaderData.materialStatus,
                            materialReceiptDate: materialReceiptHeaderData.materialReceiptDate ?
                                Moment(materialReceiptHeaderData.materialReceiptDate).format("YYYY-MM-DD") : Moment().format("YYYY-MM-DD")
                        }
                        setIsLoading(true);
                        const addResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-material-receipt-detail', requestData, {
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
                        }
                        else {
                            const updateMaterialReceiptDetailList = [...materialReceiptList]
                            updateMaterialReceiptDetailList[i] = {
                                ...updateMaterialReceiptDetailList[i],
                                encryptedMaterialReceiptDetailId: addResponse.data.data.encryptedMaterialReceiptDetailId
                            };
                            for (let i = 0; i < materialReceiptList.length; i++) {
                                let materialReceiptDetail = materialReceiptList[i];
                                let matchingMaterialReceiptDetailId = materialReceiptDetailIds.find(item => item.productCode === materialReceiptDetail.productCode);
                                if (!matchingMaterialReceiptDetailId) {
                                    filteredMaterialReceiptDetails.push({
                                        productCode: materialReceiptDetail.productCode,
                                        materialReceiptDetailId: (addResponse.data.data.materialReceiptDetailId).toString()
                                    });
                                }
                            }
                            dispatch(materialReceiptDetailsAction(updateMaterialReceiptDetailList));
                        }
                    }
                    materialReceiptDetailIndex++
                }
            }
        }
        if (materialReceiptHeaderData.materialStatus == "Approved") {
            if (filteredMaterialReceiptDetails != null) {
                for (let i = 0; i < filteredMaterialReceiptDetails.length; i++) {
                    materialReceiptDetailIds.push(filteredMaterialReceiptDetails[i])
                }
            }
            createdInventoryDetail(materialReceiptDetailIds);
        }
        if (!hasError) {
            clearMaterialReceiptReducers();
            updateMaterialReceiptCallback();
        }
    }

  const createdInventoryDetail = async (materialReceiptDetailIdList, materialReceiptId) => {
    var hasInventoryError = false;
    for (let i = 0; i < materialReceiptList.length; i++) {
      const inventoryDetailData = materialReceiptList[i];
      const materialReceiptDetailId = materialReceiptDetailIdList && materialReceiptDetailIdList.find(item => item.productCode == inventoryDetailData.productCode);
      if (!hasInventoryError) {
        const headerRequest = {
          encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
          encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
          productLineCode: inventoryDetailData.productLineCode,
          productCategoryCode: inventoryDetailData.productCategoryCode,
          productCode: inventoryDetailData.productCode,
          quantity: inventoryDetailData.receivedQuantity,
          amount: inventoryDetailData.poDetailId ? inventoryDetailData.poAmt : inventoryDetailData.amount,
          unitCode: inventoryDetailData.unitCode,
          addUser: localStorage.getItem("LoginUserName")
        }
        setIsLoading(true);
        const addHeaderResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-inventory-header-detail', headerRequest, {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });
        setIsLoading(true);
        if (addHeaderResponse.data.status != 200) {
          toast.error(addHeaderResponse.data.message, {
            theme: 'colored',
            autoClose: 10000
          });
          hasInventoryError = true;
          break;
        }

        const detailRequest = {
          encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
          encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
          productLineCode: inventoryDetailData.productLineCode,
          productCategoryCode: inventoryDetailData.productCategoryCode,
          productCode: inventoryDetailData.productCode,
          poDate: materialReceiptHeaderData.poDate ? materialReceiptHeaderData.poDate : null,
          grade: inventoryDetailData.gradeCode,
          quantity: inventoryDetailData.receivedQuantity,
          rate: inventoryDetailData.rate ? inventoryDetailData.rate : inventoryDetailData.poRate,
          amount: inventoryDetailData.amount ? inventoryDetailData.amount : inventoryDetailData.poAmt,
          unitCode: inventoryDetailData.unitCode,
          availableQuantity: inventoryDetailData.receivedQuantity,
          MaterialReceiptDetailId: materialReceiptDetailId ? materialReceiptDetailId.materialReceiptDetailId : materialReceiptId,
          ExpiryDate: materialReceiptHeaderData.poDate ? materialReceiptHeaderData.poDate : null,
          receiveDate: materialReceiptHeaderData.poDate ? Moment(materialReceiptHeaderData.poDate).format("YYYY-MM-DD") : null,
          addUser: localStorage.getItem("LoginUserName")
        }
        setIsLoading(true);
        const addDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-inventory-detail', detailRequest, {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });
        setIsLoading(true);
        if (addDetailResponse.data.status != 200) {
          setIsLoading(false)
          toast.error(addDetailResponse.data.message, {
            theme: 'colored',
            autoClose: 10000
          });
          hasInventoryError = true;
          break;
        }
        else {
          setIsLoading(false)
        }
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
                        <Button variant="success" onClick={materialReceiptHeaderData.encryptedMaterialReceiptId ? updateMaterialReceiptDetails : addMaterialReceiptDetails}>Save</Button>
                        <Button variant="danger" id='btnDiscard' onClick={discardChanges}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="MaterialReceipt"
                saveDetails={materialReceiptHeaderData.encryptedMaterialReceiptId ? updateMaterialReceiptDetails : addMaterialReceiptDetails}
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

export default MaterialReceipt