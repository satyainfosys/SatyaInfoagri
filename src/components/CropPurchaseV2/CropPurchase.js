import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Moment from "moment";
import { Spinner, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { distributionCentreListAction, formChangedAction, purchaseOrderDetailsAction, purchaseOrderDetailsErrAction, purchaseOrderProductDetailsAction, tabInfoAction } from 'actions';

const tabArray = ['Crop Purchase List', 'Add Crop Purchase']

const listColumnArray = [
  { accessor: 'sl', Header: 'S. No' },
  { accessor: 'poNo', Header: 'Material Receipt No.' },
  { accessor: 'poDate', Header: 'Purchase Date' },
  { accessor: 'poAmount', Header: 'Total Amount' },
  { accessor: 'farmerName', Header: 'Farmer Name' },
  { accessor: 'farmerFatherName', Header: 'Farmer Father Name' },
  { accessor: 'farmerPhoneNumber', Header: 'Farmer Phone Number' },
  { accessor: 'poStatus', Header: 'PO Status' },
  { accessor: 'poPrintStatus', Header: 'Print' }
]

const CropPurchase = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [listData, setListData] = useState([]);
  const [perPage, setPerPage] = useState(15);
  const [activeTabName, setActiveTabName] = useState();
  const [companyList, setCompanyList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [generateReportModal, setGenerateReportModal] = useState(false);
  const [formHasError, setFormError] = useState(false);

  const [fromDate, setFromDate] = useState(Moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(Moment().format('YYYY-MM-DD'));

  const [startDateErr, setStartDateErr] = useState({});
  const [endDateErr, setEndDateErr] = useState({});

  useEffect(() => {
    $('[data-rr-ui-event-key*="Add Crop Purchase"]').attr('disabled', true);
    getCompany();
    localStorage.removeItem("EncryptedPoNo");
    if (purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved") {
      $("#btnSave").attr('disabled', true);
    }
  }, [])

  const purchaseOrderDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsReducer)
  var purchaseOrderData = purchaseOrderDetailsReducer.purchaseOrderDetails;

  let purchaseOrderProductDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderProductDetailsReducer)
  let purchaseOrderProductDetailsList = purchaseOrderProductDetailsReducer.purchaseOrderProductDetails;

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
          fetchPurchaseOrderList(1, perPage, companyDetail.encryptedCompanyCode);
          fetchDistributionCentreList(companyDetail.encryptedCompanyCode);
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
      if (companyResponse.data.data.length == 1) {
        fetchPurchaseOrderList(1, perPage, companyResponse.data.data[0].encryptedCompanyCode);
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
    fetchPurchaseOrderList(1, perPage, e.target.value);
    fetchDistributionCentreList(e.target.value);
  }

  const fetchPurchaseOrderList = async (page, size = perPage, encryptedCompanyCode) => {

    let token = localStorage.getItem('Token');

    const listFilter = {
      pageNumber: page,
      pageSize: size,
      EncryptedCompanyCode: encryptedCompanyCode,
      isCropPurchase: true
    }

    setIsLoading(true);
    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-po-header-list', listFilter, {
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

  $('[data-rr-ui-event-key*="Crop Purchase List"]').off('click').on('click', function () {
    let isDiscard = $('#btnDiscard').attr('isDiscard');
    if (isDiscard != 'true' && isFormChanged) {
      setModalShow(true);
      setTimeout(function () {
        $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
      }, 50);
    } else {
      $("#btnNew").show();
      $("#purchaseReport").show();
      $("#btnSave").hide();
      $("#btnCancel").hide();
      $('[data-rr-ui-event-key*="Add Crop Purchase"]').attr('disabled', true);
      clearCropPurchaseOrderReducers();
      dispatch(purchaseOrderDetailsAction(undefined));
      localStorage.removeItem("EncryptedPoNo");
      localStorage.removeItem("OldPoStatus");
    }
  })

  $('[data-rr-ui-event-key*="Add Crop Purchase"]').off('click').on('click', function () {
    setActiveTabName("Add Crop Purchase")
    $("#btnNew").hide();
    $("#purchaseReport").hide();
    $("#btnSave").show();
    $("#btnCancel").show();

    if (purchaseOrderProductDetailsList.length <= 0 &&
      !(localStorage.getItem("DeleteCropPurchaseIds"))) {
      getPurchaseOrderProductDetailsList()
    }
  })

  const newDetails = () => {
    if (localStorage.getItem("EncryptedCompanyCode") && localStorage.getItem("CompanyName")) {
      $('[data-rr-ui-event-key*="Add Crop Purchase"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add Crop Purchase"]').trigger('click');
      $('#btnSave').attr('disabled', false);
      dispatch(tabInfoAction({ title1: `${localStorage.getItem("CompanyName")}` }))
      dispatch(purchaseOrderDetailsAction(undefined));
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
      $('[data-rr-ui-event-key*="Crop Purchase List"]').trigger('click');
    }
  }

  const exitModule = () => {
    $('#btnExit').attr('isExit', 'true');
    if (isFormChanged) {
      setModalShow(true);
    } else {
      window.location.href = '/dashboard';
      clearCropPurchaseOrderReducers();
      dispatch(purchaseOrderDetailsAction(undefined));
      localStorage.removeItem("EncryptedPoNo");
      localStorage.removeItem("DeleteCropPurchaseIds");
      localStorage.removeItem("DeleteInvoiceDetails");
      localStorage.removeItem("EncryptedCompanyCode");
      localStorage.removeItem("CompanyName");
    }
  }

  const discardChanges = () => {
    $('#btnDiscard').attr('isDiscard', 'true');
    if ($('#btnExit').attr('isExit') == 'true')
      window.location.href = '/dashboard';
    else {
      $('[data-rr-ui-event-key*="Crop Purchase List"]').trigger('click');
    }

    setModalShow(false);
  }

  const handleButtonClick = () => {
    if (localStorage.getItem("EncryptedCompanyCode") && localStorage.getItem("CompanyName")) {
      setGenerateReportModal(true);
      setFromDate(Moment().format('YYYY-MM-DD'));
      setEndDate(Moment().format('YYYY-MM-DD'));
    }
    else {
      toast.error("Please select company first", {
        theme: 'colored',
        autoClose: 5000
      });
    }
  }

  const getPurchaseOrderProductDetailsList = async () => {
    const request = {
      EncryptedPoNo: localStorage.getItem("EncryptedPoNo")
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-po-detail-list', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })

    if (response.data.status == 200) {
      if (response.data.data && response.data.data.length > 0) {
        dispatch(purchaseOrderProductDetailsAction(response.data.data));
      }
    }
  }

  const clearCropPurchaseOrderReducers = () => {
    dispatch(formChangedAction(undefined));
    dispatch(purchaseOrderProductDetailsAction([]));
    dispatch(purchaseOrderDetailsErrAction(undefined));
    localStorage.removeItem("DeleteCropPurchaseIds");
    localStorage.removeItem("DeleteInvoiceDetails");
    // localStorage.removeItem("DeleteMaterialReceiptDetails");
  }

  const cropPurchaseValidation = () => {
    setModalShow(false);

    const poDateErr = {};
    const poProductDetailsErr = {};

    let isValid = true;

    if (!purchaseOrderData.farmerCode) {
      toast.error("Please select farmer", {
        theme: 'colored'
      });
      isValid = false;
      setFormError(true);
    }

    if (!purchaseOrderData.poDate) {
      poDateErr.empty = "Select purchase date";
      isValid = false;
      setFormError(true);
    }

    if (purchaseOrderProductDetailsList.length < 1) {
      poProductDetailsErr.poProductDetailEmpty = "At least one crop purchase detail is required";
      setTimeout(() => {
        toast.error(poProductDetailsErr.poProductDetailEmpty, {
          theme: 'colored'
        });
      }, 1000);
      isValid = false;
    }
    else if (purchaseOrderProductDetailsList && purchaseOrderProductDetailsList.length > 0) {
      purchaseOrderProductDetailsList.forEach((row, index) => {
        if (!row.unitCode || !row.quantity || !row.poRate || !row.poAmt || !row.gradeCode || !row.cropType || !row.pack || !row.carate) {
          poProductDetailsErr.invalidPoProductDetail = "Fill the required fields in crop purchase detail";
          isValid = false;
          setFormError(true);
        }
      })
    }

    if (!isValid) {
      var errorObject = {
        poDateErr,
        poProductDetailsErr
      }

      dispatch(purchaseOrderDetailsErrAction(errorObject))
    }

    return isValid;
  }

  const updateCropPurchaseCallback = (isAddCropPurchaseOrder = false) => {
    setModalShow(false);

    if (!isAddCropPurchaseOrder) {
      toast.success("Crop purchase details updated successfully", {
        time: 'colored'
      })
    }

    $('#btnSave').attr('disabled', true)

    clearCropPurchaseOrderReducers();

    fetchPurchaseOrderList(1, perPage, localStorage.getItem("EncryptedCompanyCode"));

    $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
  }

  const addCropPurchaseDetails = () => {
    if (cropPurchaseValidation()) {
      const requestData = {
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
        distributionCentreCode: purchaseOrderData.distributionCentreCode ? purchaseOrderData.distributionCentreCode : "",
        collectionCentreCode: purchaseOrderData.collectionCentreCode ? purchaseOrderData.collectionCentreCode : "",
        farmerCode: purchaseOrderData.farmerCode,
        poDate: Moment(purchaseOrderData.poDate).format("YYYY-MM-DD"),
        poAmount: parseFloat(purchaseOrderData.poAmount),
        poStatus: purchaseOrderData.poStatus ? purchaseOrderData.poStatus : "Draft",
        activeStatus: "A",
        purchaseOrderProductDetails: purchaseOrderProductDetailsList,
        addUser: localStorage.getItem("LoginUserName")
      }

      const keys = ['addUser']
      for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
        requestData[key] = requestData[key] ? requestData[key].toUpperCase() : "";
      }

      setIsLoading(true);
      axios.post(process.env.REACT_APP_API_URL + '/add-po-header-detail', requestData, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
      })
        .then(res => {
          if (res.data.status == 200) {
            setIsLoading(false)
            setTimeout(function () {
              dispatch(purchaseOrderDetailsAction({
                ...purchaseOrderData,
                encryptedPoNo: res.data.data.encryptedPoNo,
                poNo: res.data.data.poNo
              }))
            }, 50);
            localStorage.setItem("EncryptedPoNo", res.data.data.encryptedPoNo);
            localStorage.setItem("OldPoStatus", requestData.poStatus);
            if (purchaseOrderData.poStatus == "Approved") {
              $('#btnSave').attr('disabled', true);
              createdInventoryDetail(true);
              addVendorInvoiceEntryDetails(res.data.data.poNo, purchaseOrderData.poStatus)
              addMaterialReceiptDetails(res.data.data.poNo, purchaseOrderData.poStatus,res.data.data.poDetailIdList)
            } else {
              updateCropPurchaseCallback(true);
            }
            toast.success("Crop purchase details added successfully!", {
              theme: 'colored',
              autoClose: 10000
            })
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

  const updateCropPurchaseDetails = async () => {
    if (cropPurchaseValidation()) {
      if (!formChangedData.cropPurchaseDetailUpdate &&
        !(formChangedData.cropPurchaseProductDetailsAdd || formChangedData.cropPurchaseProductDetailsUpdate || formChangedData.cropPurchaseProductDetailsDelete)) {
        return;
      }

      const updateRequestData = {
        encryptedPoNo: localStorage.getItem("EncryptedPoNo"),
        poDate: Moment(purchaseOrderData.poDate).format("YYYY-MM-DD"),
        poAmount: parseFloat(purchaseOrderData.poAmount),
        poStatus: purchaseOrderData.poStatus ? purchaseOrderData.poStatus : "Draft",
        distributionCentreCode: purchaseOrderData.distributionCentreCode ? purchaseOrderData.distributionCentreCode : "",
        collectionCentreCode: purchaseOrderData.collectionCentreCode ? purchaseOrderData.collectionCentreCode : "",
        farmerCode: purchaseOrderData.farmerCode,
        modifyUser: localStorage.getItem("LoginUserName")
      }

      const keys = ['modifyUser']
      for (const key of Object.keys(updateRequestData).filter((key) => keys.includes(key))) {
        updateRequestData[key] = updateRequestData[key] ? updateRequestData[key].toUpperCase() : "";
      }

      var hasError = false;

      if (formChangedData.cropPurchaseDetailUpdate) {
        setIsLoading(true);
        await axios.post(process.env.REACT_APP_API_URL + '/update-po-header-detail', updateRequestData, {
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
              localStorage.setItem("OldPoStatus", updateRequestData.poStatus)
            }
          })
      }

      var deleteCropPurchaseDetailIds = localStorage.getItem("DeleteCropPurchaseIds");
      var cropPurchaseProductDetailsIndex = 1;

      //CropPurchaseProductDetail ADD, UPDATE, DELETE

      if (!hasError && (formChangedData.cropPurchaseProductDetailsAdd || formChangedData.cropPurchaseProductDetailsUpdate || formChangedData.cropPurchaseProductDetailsDelete)) {
        if (!hasError && formChangedData.cropPurchaseProductDetailsDelete) {
          var deleteCropPurchaseProductDetailList = deleteCropPurchaseDetailIds ? deleteCropPurchaseDetailIds.split(',') : null;
          if (deleteCropPurchaseProductDetailList) {
            var deleteCropPurchaseDetailIndex = 1;

            for (let i = 0; i < deleteCropPurchaseProductDetailList.length; i++) {
              const deleteId = deleteCropPurchaseProductDetailList[i];
              const data = { encryptedPoDetailId: deleteId }
              const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

              const deleteResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-po-detail', { headers, data });
              if (deleteResponse.data.status != 200) {
                toast.error(deleteResponse.data.message, {
                  theme: 'colored',
                  autoClose: 10000
                });
                hasError = true;
                break;
              }
              deleteCropPurchaseDetailIndex++
            }
          }
        }

        for (let i = 0; i < purchaseOrderProductDetailsList.length; i++) {
          const cropPurchaseProductDetailData = purchaseOrderProductDetailsList[i]

          const keys = ["modifyUser"];
          for (const key of Object.keys(cropPurchaseProductDetailData).filter((key) => keys.includes(key))) {
            cropPurchaseProductDetailData[key] = cropPurchaseProductDetailData[key] ? cropPurchaseProductDetailData[key].toUpperCase() : "";
          }

          if (!hasError && formChangedData.cropPurchaseProductDetailsUpdate && cropPurchaseProductDetailData.encryptedPoDetailId) {
            const requestData = {
              encryptedPoDetailId: cropPurchaseProductDetailData.encryptedPoDetailId,
              encryptedPoNo: localStorage.getItem("EncryptedPoNo"),
              encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
              encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
              productLineCode: cropPurchaseProductDetailData.productLineCode,
              productCategoryCode: cropPurchaseProductDetailData.productCategoryCode,
              productCode: cropPurchaseProductDetailData.productCode,
              quantity: parseFloat(cropPurchaseProductDetailData.quantity),
              unitCode: parseInt(cropPurchaseProductDetailData.unitCode),
              poRate: parseFloat(cropPurchaseProductDetailData.poRate),
              poAmt: parseFloat(cropPurchaseProductDetailData.poAmt),
              cropType: cropPurchaseProductDetailData.cropType && cropPurchaseProductDetailData.cropType == "Organic" ? "O" : "I",
              gradeCode: cropPurchaseProductDetailData.gradeCode,
              pack: parseInt(cropPurchaseProductDetailData.pack),
              carate: parseFloat(cropPurchaseProductDetailData.carate),
              modifyUser: localStorage.getItem("LoginUserName")
            }
            setIsLoading(true);
            const updateResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-po-detail', requestData, {
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
          else if (!hasError && formChangedData.cropPurchaseProductDetailsAdd && !cropPurchaseProductDetailData.encryptedPoDetailId) {
            const requestData = {
              encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
              encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
              encryptedPoNo: localStorage.getItem("EncryptedPoNo"),
              productLineCode: cropPurchaseProductDetailData.productLineCode,
              productCategoryCode: cropPurchaseProductDetailData.productCategoryCode,
              productCode: cropPurchaseProductDetailData.productCode,
              quantity: cropPurchaseProductDetailData.quantity,
              unitCode: cropPurchaseProductDetailData.unitCode,
              poRate: cropPurchaseProductDetailData.poRate,
              poAmt: cropPurchaseProductDetailData.poAmt,
              cropType: cropPurchaseProductDetailData.cropType,
              gradeCode: cropPurchaseProductDetailData.gradeCode,
              pack: cropPurchaseProductDetailData.pack.toString(),
              carate: cropPurchaseProductDetailData.carate.toString(),
              addUser: localStorage.getItem("LoginUserName")
            }
            setIsLoading(true);
            const addResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-po-detail', requestData, {
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
              const updatedPurchaseOrderProductDetailsList = [...purchaseOrderProductDetailsList]
              updatedPurchaseOrderProductDetailsList[i] = {
                ...updatedPurchaseOrderProductDetailsList[i],
                encryptedPoDetailId: addResponse.data.data.encryptedPoDetailId
              };

              dispatch(purchaseOrderProductDetailsAction(updatedPurchaseOrderProductDetailsList))
            }
          }

          cropPurchaseProductDetailsIndex++;
        }
      }
      updateVendorInvoiceEntryDetails(purchaseOrderData.poNo, purchaseOrderData.poStatus)
      updateMaterialReceiptDetails(purchaseOrderData.poNo, purchaseOrderData.poStatus)
      if (!hasError) {
        if (purchaseOrderData.poStatus == "Approved") {
          createdInventoryDetail(false);
        } else {
          clearCropPurchaseOrderReducers();
          updateCropPurchaseCallback();
        }
      }
    }
  }

  const createdInventoryDetail = async (isAdd) => {
    var hasInventoryError = false;

    var inventoryDetailIndex = 1;


    for (let i = 0; i < purchaseOrderProductDetailsList.length; i++) {
      const inventoryDetailData = purchaseOrderProductDetailsList[i];
      if (!hasInventoryError) {

        const headerRequest = {
          encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
          encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
          distributionCentreCode: inventoryDetailData.distributionCentreCode ? inventoryDetailData.distributionCentreCode : "",
          productLineCode: inventoryDetailData.productLineCode,
          productCategoryCode: inventoryDetailData.productCategoryCode,
          productCode: inventoryDetailData.productCode,
          quantity: inventoryDetailData.quantity,
          amount: inventoryDetailData.poAmt,
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
          distributionCentreCode: inventoryDetailData.distributionCentreCode ? inventoryDetailData.distributionCentreCode : "",
          productLineCode: inventoryDetailData.productLineCode,
          productCategoryCode: inventoryDetailData.productCategoryCode,
          productCode: inventoryDetailData.productCode,
          grade: inventoryDetailData.gradeCode,
          quantity: inventoryDetailData.quantity,
          rate: inventoryDetailData.poRate,
          amount: inventoryDetailData.poAmt,
          unitCode: inventoryDetailData.unitCode,
          availableQuantity: inventoryDetailData.quantity,
          orgIng: inventoryDetailData.cropType,
          receiveDate: Moment(purchaseOrderData.poDate).format("YYYY-MM-DD"),
          addUser: localStorage.getItem("LoginUserName")
        }
        setIsLoading(true);
        const addDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-inventory-detail', detailRequest, {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });
        setIsLoading(true);
        if (addDetailResponse.data.status != 200) {
          toast.error(addDetailResponse.data.message, {
            theme: 'colored',
            autoClose: 10000
          });
          hasInventoryError = true;
          break;
        }

      }
      inventoryDetailIndex++;

    }

    if (!hasInventoryError) {
      updateCropPurchaseCallback(isAdd);
    }
  }

  const validateGenerateReportModal = () => {
    console.log(fromDate)
    let startDateErr = {};
    let endDateErr = {};

    let isValid = true;

    if (!fromDate) {
      startDateErr.empty = "Select start date";
      isValid = false;
    }

    if (!endDate) {
      endDateErr.empty = "Select end date";
      isValid = false;
    }

    if (fromDate > endDate || endDate < fromDate) {
      toast.error("Start date cannot be greater than end date", {
        theme: 'colored',
        autoClose: 5000
      });
      isValid = false;
    }

    setStartDateErr(startDateErr);
    setEndDateErr(endDateErr);
    return isValid;
  }

  const getCropPurchaseReport = async () => {
    if (validateGenerateReportModal()) {
      const requestData = {
        encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
        startDate: Moment(fromDate).format("YYYY-MM-DD"),
        endDate: Moment(endDate).format("YYYY-MM-DD")
      }

      const queryParams = new URLSearchParams(requestData);
      const queryString = queryParams.toString();

      window.open(`/crop-purchase-report?${queryString}`, '_blank');
      setGenerateReportModal(false);
    }
  }

  const addVendorInvoiceEntryDetails = (poNo, status) => {
    let vendorInvoiceDetails = []
    for (let i = 0; i < purchaseOrderProductDetailsList.length; i++) {
      const cropPurchaseProductDetailData = purchaseOrderProductDetailsList[i];
      const productDetails = {
        productLineCode: cropPurchaseProductDetailData.productLineCode,
        productCategoryCode: cropPurchaseProductDetailData.productCategoryCode,
        productCode: cropPurchaseProductDetailData.productCode,
        itemDescription: cropPurchaseProductDetailData.productName,
        invoiceQty: (cropPurchaseProductDetailData.quantity).toString(),
        invoiceRate: (cropPurchaseProductDetailData.poRate).toString(),
        productAmount: (cropPurchaseProductDetailData.poAmt).toString(),
        addUser: localStorage.getItem("LoginUserName"),
      };
      vendorInvoiceDetails.push(productDetails);
    }

    const requestData = {
      invoiceNo: poNo,
      encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
      encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
      vendorCode: purchaseOrderData.farmerCode,
      poNo: poNo,
      invoiceAmount: (purchaseOrderData.poAmount).toString(),
      invoiceDate: Moment(purchaseOrderData.poDate).format("YYYY-MM-DD"),
      invoiceDueDate: Moment(purchaseOrderData.poDate).format("YYYY-MM-DD"),
      invoiceStatus: status == 'Approved' ? 'A' : 'D',
      addUser: localStorage.getItem("LoginUserName"),
      vendorType: 'C',
      vendorInvoiceDetails: vendorInvoiceDetails
    }

    const keys = ["addUser"]
    for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
      requestData[key] = requestData[key] ? requestData[key].toUpperCase() : "";
    }

    const vendorInvoiceDetailsKeys = ['addUser', 'modifyUser', 'itemDescription']
    var index = 0;
    for (var obj in requestData.vendorInvoiceDetails) {
      var vendorInvoiceObject = requestData.vendorInvoiceDetails[obj];

      for (const key of Object.keys(vendorInvoiceObject).filter((key) => vendorInvoiceDetailsKeys.includes(key))) {
        vendorInvoiceObject[key] = vendorInvoiceObject[key] ? vendorInvoiceObject[key].toUpperCase() : "";
      }
      requestData.vendorInvoiceDetails[index] = vendorInvoiceObject;
      index++;
    }

    setIsLoading(true);
    axios.post(process.env.REACT_APP_API_URL + '/add-vendor-invoice-entry-header', requestData, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })
      .then(res => {
        if (res.data.status == 200) {
          setIsLoading(false)
        } else {
          setIsLoading(false)
          toast.error(res.data.message, {
            theme: 'colored',
            autoClose: 10000
          });
        }
      })
  }

  const updateVendorInvoiceEntryDetails = async (poNo, status) => {

    var invoiceHeaderCode = ""
    var InvoiceDetailProductCode = localStorage.getItem("DeleteInvoiceDetails")
    const updateRequestData = {
      encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
      invoiceNo: poNo,
      vendorCode: purchaseOrderData.farmerCode,
      poNo: poNo,
      invoiceAmount: (purchaseOrderData.poAmount).toString(),
      invoiceDate: Moment(purchaseOrderData.poDate).format("YYYY-MM-DD"),
      invoiceDueDate: Moment(purchaseOrderData.poDate).format("YYYY-MM-DD"),
      invoiceStatus: status == 'Approved' ? 'A' : 'D',
      modifyUser: localStorage.getItem("LoginUserName"),
    }

    const keys = ["modifyUser"]
    for (const key of Object.keys(updateRequestData).filter((key) => keys.includes(key))) {
      updateRequestData[key] = updateRequestData[key] ? updateRequestData[key].toUpperCase() : "";
    }

    var hasError = false;
    await axios.post(process.env.REACT_APP_API_URL + '/update-vendor-invoice-entry-header', updateRequestData, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status !== 200) {
          toast.error(res.data.message, {
            theme: 'colored',
            autoClose: 10000
          });
        }
        else {
          invoiceHeaderCode = res.data.data.encryptedInvoiceHeaderCode;
        }
      })

    var vendorInvoiceEntryDetailIndex = 1;

    // VendorInvoiceEntryDetail ADD, UPDATE, DELETE
    if (!hasError && (formChangedData.cropPurchaseProductDetailsAdd || formChangedData.cropPurchaseProductDetailsUpdate || formChangedData.cropPurchaseProductDetailsDelete)) {
      if (!hasError && formChangedData.cropPurchaseProductDetailsDelete) {
        var invoiceDetailProductCodeList = InvoiceDetailProductCode ? InvoiceDetailProductCode.split(',') : null;
        var deleteInvoiceDetailCodesList = invoiceDetailProductCodeList.map(productCode => ({
          productCode: productCode,
          encryptedInvoiceHeaderCode: invoiceHeaderCode
        }))
        if (deleteInvoiceDetailCodesList) {
          var deleteInvoiceDetailCodesIndex = 1;

          for (let i = 0; i < deleteInvoiceDetailCodesList.length; i++) {
            const data = deleteInvoiceDetailCodesList[i]
            const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

            const deleteResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-vendor-invoice-entry-detail', { headers, data });
            if (deleteResponse.data.status != 200) {
              toast.error(deleteResponse.data.message, {
                theme: 'colored',
                autoClose: 10000
              });
              hasError = true;
              break;
            }
            deleteInvoiceDetailCodesIndex++
          }
        }
      }
    }

    for (let i = 0; i < purchaseOrderProductDetailsList.length; i++) {
      const cropPurchaseProductDetailData = purchaseOrderProductDetailsList[i];

      const keys = ["modifyUser", "addUser", "itemDescription"];
      for (const key of Object.keys(cropPurchaseProductDetailData).filter((key) => keys.includes(key))) {
        cropPurchaseProductDetailData[key] = cropPurchaseProductDetailData[key] ? cropPurchaseProductDetailData[key].toUpperCase() : "";
      }

      if (!hasError && formChangedData.cropPurchaseProductDetailsUpdate && cropPurchaseProductDetailData.encryptedPoDetailId) {
        const requestData = {
          encryptedInvoiceHeaderCode: invoiceHeaderCode,
          productLineCode: cropPurchaseProductDetailData.productLineCode,
          productCategoryCode: cropPurchaseProductDetailData.productCategoryCode,
          productCode: cropPurchaseProductDetailData.productCode,
          itemDescription: cropPurchaseProductDetailData.productName,
          invoiceQty: (cropPurchaseProductDetailData.quantity).toString(),
          invoiceRate: (cropPurchaseProductDetailData.poRate).toString(),
          productAmount: (cropPurchaseProductDetailData.poAmt).toString(),
          modifyUser: localStorage.getItem("LoginUserName"),
        }
        setIsLoading(true);
        const updateResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-vendor-invoice-entry-detail', requestData, {
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
      else if (!hasError && formChangedData.cropPurchaseProductDetailsAdd && !cropPurchaseProductDetailData.encryptedPoDetailId) {
        const requestData = {
          encryptedInvoiceHeaderCode: invoiceHeaderCode,
          productLineCode: cropPurchaseProductDetailData.productLineCode,
          productCategoryCode: cropPurchaseProductDetailData.productCategoryCode,
          productCode: cropPurchaseProductDetailData.productCode,
          itemDescription: cropPurchaseProductDetailData.productName,
          invoiceQty: (cropPurchaseProductDetailData.quantity).toString(),
          invoiceRate: (cropPurchaseProductDetailData.poRate).toString(),
          productAmount: (cropPurchaseProductDetailData.poAmt).toString(),
          addUser: localStorage.getItem("LoginUserName"),
        }
        setIsLoading(true);
        const addResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-vendor-invoice-entry-detail', requestData, {
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
      }
    }

    vendorInvoiceEntryDetailIndex++
  }

  const addMaterialReceiptDetails = (poNo, status, poDetailIdList) => {

    let materialReceiptDetails = []
    let productDetails = {}
    for (let i = 0; i < purchaseOrderProductDetailsList.length; i++) {
      const cropPurchaseProductDetailData = purchaseOrderProductDetailsList[i];
      const poDetail = poDetailIdList.find(item => item.poNo === poNo && item.productCode == cropPurchaseProductDetailData.productCode);
        productDetails = {
          encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
          encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
          // vendorCode: purchaseOrderData.farmerCode,
          productLineCode: cropPurchaseProductDetailData.productLineCode,
          productCategoryCode: cropPurchaseProductDetailData.productCategoryCode,
          productCode: cropPurchaseProductDetailData.productCode,
          poDetailId: poDetail.poDetailId,
          receivedQuantity: (cropPurchaseProductDetailData.quantity).toString(),
          rejectedQuantity: "0",
          // varietyName: materialReceiptDetailData.varietyName ? materialReceiptDetailData.varietyName : "",
          // brandName: materialReceiptDetailData.brandName ? materialReceiptDetailData.brandName : "",
          unitCode: cropPurchaseProductDetailData.unitCode ? (cropPurchaseProductDetailData.unitCode).toString() : 0,
          addUser: localStorage.getItem("LoginUserName"),
          rate: (cropPurchaseProductDetailData.poRate).toString(),
          amount: (cropPurchaseProductDetailData.poAmt).toString(),

      };
      materialReceiptDetails.push(productDetails);
    }

    const requestData = {
      encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
      encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
      farmerCode: purchaseOrderData.farmerCode,
      poNo: poNo,
      materialReceiptDate: Moment(purchaseOrderData.poDate).format("YYYY-MM-DD"),
      // personName: localStorage.getItem("Name"),
      challanNo: poNo,
      activeStatus: "A",
      addUser: localStorage.getItem("LoginUserName"),
      materialStatus: status == 'Approved' ? 'A' : 'D',
      materialReceiptDetails: materialReceiptDetails
    }

    const keys = ["addUser"]
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
        } else {
          setIsLoading(false)
          toast.error(res.data.message, {
            theme: 'colored',
            autoClose: 10000
          });
        }
      })
  }


  const updateMaterialReceiptDetails = async (poNo, status) => {
        // var materialReceiptDetailId = "" 
        // var materialReceiptProductCode =  localStorage.getItem("DeleteMaterialReceiptDetails")
        const updateRequestData = {
            // encryptedMaterialReceiptId: localStorage.getItem("EncryptedMaterialReceiptId"),
            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
            encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
            farmerCode:  purchaseOrderData.farmerCode,
            poNo: poNo,
            materialReceiptDate:  Moment(purchaseOrderData.poDate).format("YYYY-MM-DD"),
            personName: localStorage.getItem("Name"),
            challanNo: poNo,
            materialStatus: status == 'Approved' ? 'A' : 'D',
            modifyUser: localStorage.getItem("LoginUserName"),
        }

        const keys = ["modifyUser"]
        for (const key of Object.keys(updateRequestData).filter((key) => keys.includes(key))) {
            updateRequestData[key] = updateRequestData[key] ? updateRequestData[key].toUpperCase() : "";
        }

        var hasError = false;
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
                  }
                  else {
                    materialReceiptDetailId = res.data.data.materialReceiptDetailId;
                  }})
   

        var materialReceiptDetailIndex = 1;

        //MaterialReceiptDetail ADD, UPDATE, DELETE
        // if (!hasError && (formChangedData.materialReceiptDetailAdd || formChangedData.materialReceiptDetailUpdate || formChangedData.materialReceiptDetailDelete)) {
        //     if (!hasError && formChangedData.materialReceiptDetailDelete) {
        //       var materialReceiptProductCodeList = materialReceiptProductCode ? materialReceiptProductCode.split(',') : null;
        //       var deleteMaterialReceiptProductCodeList = materialReceiptProductCodeList.map(productCode => ({
        //         productCode: productCode,
        //         encryptedMaterialReceiptDetailId: materialReceiptDetailId
        //       }))
        //         if (deleteMaterialReceiptProductCodeList) {
        //             var deletMaterialReceiptDetailIndex = 1;

        //             for (let i = 0; i < deleteMaterialReceiptProductCodeList.length; i++) {
        //                 const data =  deleteMaterialReceiptProductCodeList[i]
        //                 const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

        //                 const deleteResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-material-receipt-detail', { headers, data });
        //                 if (deleteResponse.data.status != 200) {
        //                     toast.error(deleteResponse.data.message, {
        //                         theme: 'colored',
        //                         autoClose: 10000
        //                     });
        //                     hasError = true;
        //                     break;
        //                 }
        //                 deletMaterialReceiptDetailIndex++
        //             }
        //         }
        //     }

        //     for (let i = 0; i < purchaseOrderProductDetailsList.length; i++) {
        //         const cropPurchaseProductDetailData = purchaseOrderProductDetailsList[i];

        //         const keys = ["modifyUser"];
        //         for (const key of Object.keys(cropPurchaseProductDetailData).filter((key) => keys.includes(key))) {
        //           cropPurchaseProductDetailData[key] = cropPurchaseProductDetailData[key] ? cropPurchaseProductDetailData[key].toUpperCase() : "";
        //         }

        //         if (!hasError && formChangedData.cropPurchaseProductDetailsUpdate && cropPurchaseProductDetailData.encryptedPoDetailId) {
        //             const requestData = {
        //                 // encryptedMaterialReceiptDetailId: cropPurchaseProductDetailData.encryptedMaterialReceiptDetailId,
        //                 encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        //                 encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
        //                 encryptedMaterialReceiptId: materialReceiptDetailId,
        //                 farmerCode: purchaseOrderData.farmerCode,
        //                 productLineCode: cropPurchaseProductDetailData.productLineCode,
        //                 productCategoryCode: cropPurchaseProductDetailData.productCategoryCode,
        //                 productCode: cropPurchaseProductDetailData.productCode,
        //                 poDetailId: cropPurchaseProductDetailData.poDetailId ? cropPurchaseProductDetailData.poDetailId : 0,
        //                 receivedQuantity: parseFloat(cropPurchaseProductDetailData.receivedQuantity),
        //                 rejectedQuantity: cropPurchaseProductDetailData.rejectedQuantity ? parseFloat(cropPurchaseProductDetailData.rejectedQuantity) : 0,
        //                 // varietyName: cropPurchaseProductDetailData.varietyName ? cropPurchaseProductDetailData.varietyName : "",
        //                 // brandName: cropPurchaseProductDetailData.brandName ? cropPurchaseProductDetailData.brandName : "",
        //                 unitCode: (cropPurchaseProductDetailData.unitCode).toString(),
        //                 modifyUser: localStorage.getItem("LoginUserName"),
        //                 rate: parseFloat(cropPurchaseProductDetailData.rate),
        //                 amount: parseFloat(cropPurchaseProductDetailData.amount),
        //                 // materialStatus: cropPurchaseProductDetailData.materialStatus,
        //                 // materialReceiptDate: cropPurchaseProductDetailData.materialReceiptDate ?
        //                 //     Moment(cropPurchaseProductDetailData.materialReceiptDate).format("YYYY-MM-DD") : Moment().format("YYYY-MM-DD")
        //             }
        //             setIsLoading(true);
        //             const updateResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-material-receipt-detail', requestData, {
        //                 headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        //             });
        //             setIsLoading(false);
        //             if (updateResponse.data.status != 200) {
        //                 toast.error(updateResponse.data.message, {
        //                     theme: 'colored',
        //                     autoClose: 10000
        //                 });
        //                 hasError = true;
        //                 break;
        //             }
        //         }
        //         else if (!hasError && formChangedData.cropPurchaseProductDetailsAdd && !cropPurchaseProductDetailData.encryptedPoDetailId) {
        //             const requestData = {
        //                 encryptedMaterialReceiptId: localStorage.getItem("EncryptedMaterialReceiptId"),
        //                 encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        //                 encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
        //                 farmerCode: cropPurchaseProductDetailData.vendorCode,
        //                 poDetailId: cropPurchaseProductDetailData.poDetailId ? cropPurchaseProductDetailData.poDetailId : 0,
        //                 productLineCode: cropPurchaseProductDetailData.productLineCode,
        //                 productCategoryCode: cropPurchaseProductDetailData.productCategoryCode,
        //                 productCode: cropPurchaseProductDetailData.productCode,
        //                 receivedQuantity: cropPurchaseProductDetailData.quantity,
        //                 rejectedQuantity: "0",
        //                 // varietyName: cropPurchaseProductDetailData.varietyName ? cropPurchaseProductDetailData.varietyName : "",
        //                 // brandName: cropPurchaseProductDetailData.brandName ? cropPurchaseProductDetailData.brandName : "",
        //                 rate:  cropPurchaseProductDetailData.poRate, 
        //                 amount: cropPurchaseProductDetailData.poAmt,
        //                 unitCode: cropPurchaseProductDetailData.unitCode,
        //                 addUser: localStorage.getItem("LoginUserName"),
        //                 // materialStatus: cropPurchaseProductDetailData.materialStatus,
        //                 // materialReceiptDate: cropPurchaseProductDetailData.materialReceiptDate ?
        //                 //     Moment(cropPurchaseProductDetailData.materialReceiptDate).format("YYYY-MM-DD") : Moment().format("YYYY-MM-DD")
        //             }
        //             setIsLoading(true);
        //             const addResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-material-receipt-detail', requestData, {
        //                 headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        //             });
        //             setIsLoading(false);
        //             if (addResponse.data.status != 200) {
        //                 toast.error(addResponse.data.message, {
        //                     theme: 'colored',
        //                     autoClose: 10000
        //                 });
        //                 hasError = true;
        //                 break;
        //             }
        //         }

        //         materialReceiptDetailIndex++
        //     }
        // }

}

  return (
    <>
      {isLoading ? (
        <Spinner
          className="position-absolute start-50 loader-color"
          animation="border"
        />
      ) : null}

      {
        generateReportModal &&
        <Modal
          show={generateReportModal}
          onHide={() => setGenerateReportModal(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Purchase Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="details-form" id="FarmerDetails" >
              <Row>
                <Col className="me-3 ms-3" md="5">
                  <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                    <Form.Label column sm="3">
                      From Date
                    </Form.Label>
                    <Col sm="6">
                      <Form.Control type='date' id="txtStartDate" name="startDate" onChange={e => setFromDate(e.target.value)} value={fromDate ? fromDate : Moment().format('YYYY-MM-DD')} max={Moment().format("YYYY-MM-DD")} />
                      {Object.keys(startDateErr).map((key) => {
                        return <span className="error-message">{startDateErr[key]}</span>
                      })}
                    </Col>
                  </Form.Group>
                </Col>
                <Col className="me-3 ms-3" md="5">
                  <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                    <Form.Label column sm="3">
                      To Date
                    </Form.Label>
                    <Col sm="6">
                      <Form.Control type='date' id="txtEndDate" name="endDate" onChange={e => setEndDate(e.target.value)} value={endDate ? endDate : Moment().format('YYYY-MM-DD')} max={Moment().format("YYYY-MM-DD")} />
                      {Object.keys(endDateErr).map((key) => {
                        return <span className="error-message">{endDateErr[key]}</span>
                      })}
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" id='btnGenerateReport' onClick={() => getCropPurchaseReport()}>Generate Report</Button>
          </Modal.Footer>
        </Modal>
      }

      {
        modalShow &&
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
            <Button variant="success" onClick={purchaseOrderData.encryptedPoNo ? updateCropPurchaseDetails : addCropPurchaseDetails}>Save</Button>
            <Button variant="danger" id='btnDiscard' onClick={discardChanges}>Discard</Button>
          </Modal.Footer>
        </Modal>
      }

      <TabPage
        listData={listData}
        listColumnArray={listColumnArray}
        tabArray={tabArray}
        module="CropPurchase"
        saveDetails={purchaseOrderData.encryptedPoNo ? updateCropPurchaseDetails : addCropPurchaseDetails}
        newDetails={newDetails}
        cancelClick={cancelClick}
        exitModule={exitModule}
        tableFilterOptions={companyList}
        tableFilterName={'Company'}
        supportingMethod1={handleFieldChange}
        supportingButtonClick={handleButtonClick}
      />
    </>
  )
}

export default CropPurchase