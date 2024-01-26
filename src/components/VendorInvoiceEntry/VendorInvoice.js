import React, { useState, useEffect } from 'react'
import TabPage from 'components/common/TabPage';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { tabInfoAction, formChangedAction, vendorMasterDetailsListAction, vendorInvoiceEntryErrorAction, vendorInvoiceEntryHeaderDetailsAction, vendorInvoiceEntryDetailsAction, farmerDetailsAction } from 'actions';
import Moment from 'moment';

const tabArray = ['Vendor Invoice Entry List', 'Add Vendor Invoice Entry'];

const listColumnArray = [
  { accessor: 'sl', Header: 'S.No' },
  { accessor: 'invoiceNo', Header: 'Invoice No' },
  { accessor: 'invoiceDate', Header: 'Invoice Date' },
  { accessor: 'invoiceDueDate', Header: 'Due Date' },
  { accessor: 'poNo', Header: 'Po No' },
  { accessor: 'invoiceAmount', Header: 'Invoice Amount' },
  { accessor: 'vendorName', Header: 'Vendor Name' },
  { accessor: 'invoiceStatus', Header: 'Status' },
  { accessor: 'vendorInvoicePrintStatus', Header: 'Print' },
];

const VendorInvoice = () => {
  const [listData, setListData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [perPage, setPerPage] = useState(15);
  const [activeTabName, setActiveTabName] = useState();
  const [unitList, setUnitList] = useState([])

  const dispatch = useDispatch();

  useEffect(() => {
    $('[data-rr-ui-event-key*="Add Vendor Invoice Entry"]').attr('disabled', true);
    $('[data-rr-ui-event-key*="Add Vendor Invoice Entry"]').attr('disabled', true);
    getCompany();
    getUnitList();
    localStorage.removeItem("DeleteInvoiceDetailCodes");
  }, [])

  const vendorInvoiceEntryHeaderDetailsReducer = useSelector((state) => state.rootReducer.vendorInvoiceEntryHeaderDetailsReducer)
  var vendorInvoiceEntryHeaderDetails = vendorInvoiceEntryHeaderDetailsReducer.vendorInvoiceEntryHeaderDetails;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  const vendorInvoiceEntryDetailsReducer = useSelector((state) => state.rootReducer.vendorInvoiceEntryDetailsReducer)
  var vendorInvoiceEntryDetails = vendorInvoiceEntryDetailsReducer.vendorInvoiceEntryDetails;


  let isFormChanged = Object.values(formChangedData).some(value => value === true);

  $('[data-rr-ui-event-key*="Vendor Invoice Entry List"]').off('click').on('click', function () {
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
      $('[data-rr-ui-event-key*="Add Vendor Invoice Entry"]').attr('disabled', true);
      clearVendorInvoiceEntryDetailsReducers();
      localStorage.removeItem("EncryptedInvoiceHeaderCode");
      localStorage.removeItem("OldInvoiceStatus");
      dispatch(vendorInvoiceEntryHeaderDetailsAction(undefined));
    }
  })

  $('[data-rr-ui-event-key*="Add Vendor Invoice Entry"]').off('click').on('click', function () {
    setActiveTabName("Add Vendor Invoice Entry")
    $("#btnNew").hide();
    $("#btnSave").show();
    $("#btnCancel").show();

    if (vendorInvoiceEntryDetails.length <= 0) {
      getVendorInvoiceEntryDetailList();
    }
  })

  const clearVendorInvoiceEntryDetailsReducers = () => {
    dispatch(formChangedAction(undefined));
    dispatch(vendorInvoiceEntryDetailsAction([]));
    dispatch(vendorInvoiceEntryErrorAction(undefined));
    dispatch(farmerDetailsAction(undefined))
    localStorage.removeItem("DeleteInvoiceDetailCodes");
  }

  const newDetails = () => {
    if (localStorage.getItem("EncryptedCompanyCode") && localStorage.getItem("CompanyName")) {
      dispatch(vendorInvoiceEntryHeaderDetailsAction(undefined));
      $('[data-rr-ui-event-key*="Add Vendor Invoice Entry"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add Vendor Invoice Entry"]').trigger('click');
      $('#btnSave').attr('disabled', false);
      dispatch(tabInfoAction({ title1: `${localStorage.getItem("CompanyName")}` }))
      localStorage.removeItem("EncryptedInvoiceHeaderCode");
      localStorage.removeItem("DeleteInvoiceDetailCodes");
    }
    else {
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
    }
    else {
      $('[data-rr-ui-event-key*="Vendor Invoice Entry List"]').trigger('click');
    }
  }

  const exitModule = () => {
    $('#btnExit').attr('isExit', 'true');
    if (isFormChanged) {
      setModalShow(true);
    }
    else {
      window.location.href = '/dashboard';
      dispatch(vendorInvoiceEntryHeaderDetailsAction(undefined));
      dispatch(vendorMasterDetailsListAction([]));
      localStorage.removeItem("EncryptedInvoiceHeaderCode")
      localStorage.removeItem("EncryptedCompanyCode");
      localStorage.removeItem("CompanyName");
      localStorage.removeItem("DeleteInvoiceDetailCodes");
    }
  }

  const discardChanges = () => {
    $('#btnDiscard').attr('isDiscard', 'true');
    if ($('#btnExit').attr('isExit') == 'true')
      window.location.href = '/dashboard';
    else {
      $('[data-rr-ui-event-key*="Vendor Invoice Entry List"]').trigger('click');
    }

    setModalShow(false);
  }

  const vendorInvoiceEntryValidation = () => {
    setModalShow(false);

    const vendorErr = {};
    const invoiceNoErr = {};
    const invoiceAmountErr = {};
    const invoiceDateErr = {};
    const invoiceDueDateErr = {};
    const vendorInvoiceEntryDetailErr = {};
    const totalInvoiceAmountErr = {};
    const productDuplicateErr = {};

    let isValid = true;

    if (!vendorInvoiceEntryHeaderDetails.vendorCode) {
      vendorErr.empty = "Select vendor";
      isValid = false;
    }
    if (!vendorInvoiceEntryHeaderDetails.invoiceNo) {
      invoiceNoErr.empty = "Enter invoice no";
      isValid = false;
    }
    if (!vendorInvoiceEntryHeaderDetails.invoiceAmount) {
      invoiceAmountErr.empty = "Enter invoice amount";
      isValid = false;
    }
    if (!vendorInvoiceEntryHeaderDetails.invoiceDate) {
      invoiceDateErr.empty = "Select invoice date";
      isValid = false;
    }
    if (!vendorInvoiceEntryHeaderDetails.invoiceDueDate) {
      invoiceDueDateErr.empty = "Select invoice due date";
      isValid = false;
    }

    // if (!vendorInvoiceEntryHeaderDetails.poNo) {
    //   const itemDescriptions = new Set();

    //   vendorInvoiceEntryDetails.forEach((row, index) => {
    //     if (itemDescriptions.has(row.itemDescription)) {
    //       productDuplicateErr.productDuplicate = "Product is already exist";
    //       toast.error(productDuplicateErr.productDuplicate, {
    //         theme: 'colored'
    //       });
    //       isValid = false;
    //     } else {
    //       itemDescriptions.add(row.itemDescription);
    //     }
    //   });
    // }

    if (vendorInvoiceEntryDetails.length < 1) {
      vendorInvoiceEntryDetailErr.vendorInvoiceEntryDetailEmpty = "At least one vendor invoice entry details required";
      setTimeout(() => {
        toast.error(vendorInvoiceEntryDetailErr.vendorInvoiceEntryDetailEmpty, {
          theme: 'colored'
        });
      }, 1000);
      isValid = false;
    }
    else if (vendorInvoiceEntryDetails && vendorInvoiceEntryDetails.length > 0) {
      vendorInvoiceEntryDetails.forEach((row, index) => {
        if (!row.invoiceQty || !row.invoiceRate || !row.productAmount) {
          vendorInvoiceEntryDetailErr.invalidVendorInvoiceEntryDetail = "Fill the required fields"
          isValid = false;
        }
        else if (!row.poDetailId) {
          if (!row.itemDescription) {
            vendorInvoiceEntryDetailErr.invalidVendorInvoiceEntryDetail = "Fill the required fields"
            isValid = false;
          }
        }

        if (parseFloat(row.invoiceRate) > parseFloat(row.poRate)) {
          vendorInvoiceEntryDetailErr.vendorInvoiceEntryDetailEmpty = "Invoice rate should not be greater than po rate";
          setTimeout(() => {
            toast.error(vendorInvoiceEntryDetailErr.vendorInvoiceEntryDetailEmpty, {
              theme: 'colored'
            });
          }, 1000);
          isValid = false;
        }

        if (parseFloat(row.invoiceQty) > parseFloat(row.quantity)) {
          vendorInvoiceEntryDetailErr.vendorInvoiceEntryDetailEmpty = "Invoice quantity should not be greater than po quantity";
          setTimeout(() => {
            toast.error(vendorInvoiceEntryDetailErr.vendorInvoiceEntryDetailEmpty, {
              theme: 'colored'
            });
          }, 1000);
          isValid = false;
        }
      })

      const totalProductAmount = vendorInvoiceEntryDetails.length > 1
        ? vendorInvoiceEntryDetails.reduce((acc, obj) => {
          const productAmount = obj.productAmount !== "" ? parseFloat(obj.productAmount) : 0;
          return acc + (isNaN(productAmount) ? 0 : productAmount);
        }, 0)
        : vendorInvoiceEntryDetails.length === 1
          ? parseFloat(vendorInvoiceEntryDetails[0].productAmount)
          : 0;
      if (vendorInvoiceEntryHeaderDetails.invoiceAmount != totalProductAmount) {
        totalInvoiceAmountErr.empty = "Invoice amount should be equal to total product amount";
        setTimeout(() => {
          toast.error(totalInvoiceAmountErr.empty, {
            theme: 'colored'
          });
        }, 1000);
        isValid = false;
      }

    }

    if (!isValid) {
      var errorObject = {
        vendorErr,
        invoiceNoErr,
        invoiceAmountErr,
        invoiceDateErr,
        invoiceDueDateErr,
        vendorInvoiceEntryDetailErr,
        totalInvoiceAmountErr
      }

      dispatch(vendorInvoiceEntryErrorAction(errorObject))
    }

    return isValid;
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
            fetchVendorInvoiceEntryHeaderList(1, perPage, companyDetail.encryptedCompanyCode);
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
        fetchVendorInvoiceEntryHeaderList(1, perPage, companyResponse.data.data[0].encryptedCompanyCode);
        getVendorMasterList(companyResponse.data.data[0].encryptedCompanyCode)
        localStorage.setItem("CompanyName", companyResponse.data.data[0].companyName)
        localStorage.setItem("EncryptedCompanyCode", companyResponse.data.data[0].encryptedCompanyCode);
      }
    } else {
      setCompanyList([])
    }
  }

  const fetchVendorInvoiceEntryHeaderList = async (page, size = perPage, encryptedCompanyCode) => {
    let token = localStorage.getItem('Token');

    const listFilter = {
      pageNumber: page,
      pageSize: size,
      EncryptedCompanyCode: encryptedCompanyCode
    }

    setIsLoading(true);
    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-invoice-entry-header-list', listFilter, {
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
    fetchVendorInvoiceEntryHeaderList(1, perPage, e.target.value);
    localStorage.setItem("CompanyName", selectedKey)
    getVendorMasterList(e.target.value);
  }

  const updateVendorInvoiceEntryCallback = (isAddVendorInvoiceEntry = false) => {
    setModalShow(false);

    if (!isAddVendorInvoiceEntry) {
      toast.success("Vendor invoice entry details updated successfully", {
        time: 'colored'
      })
    }

    $('#btnSave').attr('disabled', true)

    clearVendorInvoiceEntryDetailsReducers();

    fetchVendorInvoiceEntryHeaderList(1, perPage, localStorage.getItem("EncryptedCompanyCode"));

    $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
  }

  const addVendorInvoiceEntryDetails = () => {
    if (vendorInvoiceEntryValidation()) {
      const requestData = {
        invoiceNo: vendorInvoiceEntryHeaderDetails.invoiceNo,
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
        vendorCode: vendorInvoiceEntryHeaderDetails.vendorCode,
        poNo: vendorInvoiceEntryHeaderDetails.poNo ? vendorInvoiceEntryHeaderDetails.poNo : "",
        invoiceAmount: vendorInvoiceEntryHeaderDetails.invoiceAmount.toString(),
        invoiceDate: vendorInvoiceEntryHeaderDetails.invoiceDate,
        invoiceDueDate: vendorInvoiceEntryHeaderDetails.invoiceDueDate,
        invoiceStatus: vendorInvoiceEntryHeaderDetails.invoiceStatus && vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" ? "A" : vendorInvoiceEntryHeaderDetails.invoiceStatus == "Rejected" ? "R" : "D",
        vendorType: 'V',
        addUser: localStorage.getItem("LoginUserName"),
        vendorInvoiceDetails: vendorInvoiceEntryDetails
      }

      const keys = ["addUser"]
      for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
        requestData[key] = requestData[key] ? requestData[key].toUpperCase() : "";
      }

      const vendorInvoiceDetailsKeys = ['addUser', 'modifyUser', 'itemDescription', 'description']
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
            setTimeout(function () {
              dispatch(vendorInvoiceEntryHeaderDetailsAction({
                ...vendorInvoiceEntryHeaderDetails,
                encryptedInvoiceHeaderCode: res.data.data.encryptedInvoiceHeaderCode,
                invoiceHeaderCode: res.data.data.invoiceHeaderCode
              }))
            }, 50);
            localStorage.setItem("EncryptedInvoiceHeaderCode", res.data.data.encryptedInvoiceHeaderCode);
            localStorage.setItem("OldInvoiceStatus", requestData.invoiceStatus);
            if (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved") {
              $('#btnSave').attr('disabled', true);
            }
            toast.success(res.data.message, {
              theme: 'colored',
              autoClose: 10000
            })
            updateVendorInvoiceEntryCallback(true);
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

  const updateVendorInvoiceEntryDetails = async () => {
    if (vendorInvoiceEntryValidation()) {
      if (!formChangedData.vendorInvoiceEntryHeaderDetailUpdate &&
        !(formChangedData.vendorInvoiceEntryDetailsAdd || formChangedData.vendorInvoiceEntryDetailsUpdate || formChangedData.vendorInvoiceEntryDetailsDelete)) {
        return;
      }

      var deleteInvoiceDetailCodes = localStorage.getItem("DeleteInvoiceDetailCodes");

      const updateRequestData = {
        encryptedInvoiceHeaderCode: localStorage.getItem("EncryptedInvoiceHeaderCode"),
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        invoiceNo: vendorInvoiceEntryHeaderDetails.invoiceNo,
        vendorCode: vendorInvoiceEntryHeaderDetails.vendorCode,
        poNo: vendorInvoiceEntryHeaderDetails.poNo ? vendorInvoiceEntryHeaderDetails.poNo : "",
        invoiceAmount: vendorInvoiceEntryHeaderDetails.invoiceAmount ? vendorInvoiceEntryHeaderDetails.invoiceAmount.toString() : 0,
        invoiceDate: vendorInvoiceEntryHeaderDetails.invoiceDate ? Moment(vendorInvoiceEntryHeaderDetails.invoiceDate).format("YYYY-MM-DD") : Moment().format("YYYY-MM-DD"),
        invoiceDueDate: vendorInvoiceEntryHeaderDetails.invoiceDueDate ? Moment(vendorInvoiceEntryHeaderDetails.invoiceDueDate).format("YYYY-MM-DD") : Moment().format("YYYY-MM-DD"),
        invoiceStatus: vendorInvoiceEntryHeaderDetails.invoiceStatus && vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" ? "A" : vendorInvoiceEntryHeaderDetails.invoiceStatus == "Rejected" ? "R" : "D",
        modifyUser: localStorage.getItem("LoginUserName"),
      }

      const keys = ["modifyUser"]
      for (const key of Object.keys(updateRequestData).filter((key) => keys.includes(key))) {
        updateRequestData[key] = updateRequestData[key] ? updateRequestData[key].toUpperCase() : "";
      }

      var hasError = false;
      if (formChangedData.vendorInvoiceEntryHeaderDetailUpdate) {
        setIsLoading(true);
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
              hasError = true;
            } else {
              localStorage.setItem("OldInvoiceStatus", vendorInvoiceEntryHeaderDetails.invoiceStatus);
              if (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved") {
                $('#btnSave').attr('disabled', true);
              }
            }
          })
      }

      var vendorInvoiceEntryDetailIndex = 1;

      //VendorInvoiceEntryDetail ADD, UPDATE, DELETE
      if (!hasError && (formChangedData.vendorInvoiceEntryDetailsAdd || formChangedData.vendorInvoiceEntryDetailsUpdate || formChangedData.vendorInvoiceEntryDetailsDelete)) {
        if (!hasError && formChangedData.vendorInvoiceEntryDetailsDelete) {
          var deleteInvoiceDetailCodesList = deleteInvoiceDetailCodes ? deleteInvoiceDetailCodes.split(',') : null;
          if (deleteInvoiceDetailCodesList) {
            var deleteInvoiceDetailCodesIndex = 1;

            for (let i = 0; i < deleteInvoiceDetailCodesList.length; i++) {
              const deleteId = deleteInvoiceDetailCodesList[i];
              const data = { encryptedInvoiceDetailCode: deleteId }
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

        for (let i = 0; i < vendorInvoiceEntryDetails.length; i++) {
          const vendorInvoiceEntryDetailsData = vendorInvoiceEntryDetails[i];

          const keys = ["modifyUser", "addUser", "itemDescription", "description"];
          for (const key of Object.keys(vendorInvoiceEntryDetailsData).filter((key) => keys.includes(key))) {
            vendorInvoiceEntryDetailsData[key] = vendorInvoiceEntryDetailsData[key] ? vendorInvoiceEntryDetailsData[key].toUpperCase() : "";
          }

          if (!hasError && formChangedData.vendorInvoiceEntryDetailsUpdate && vendorInvoiceEntryDetailsData.encryptedInvoiceDetailCode) {
            const requestData = {
              encryptedInvoiceHeaderCode: localStorage.getItem("EncryptedInvoiceHeaderCode"),
              encryptedInvoiceDetailCode: vendorInvoiceEntryDetailsData.encryptedInvoiceDetailCode,
              productLineCode: vendorInvoiceEntryDetailsData.productLineCode,
              productCategoryCode: vendorInvoiceEntryDetailsData.productCategoryCode,
              productCode: vendorInvoiceEntryDetailsData.productCode,
              itemDescription: vendorInvoiceEntryDetailsData.itemDescription ? vendorInvoiceEntryDetailsData.itemDescription : "",
              description: vendorInvoiceEntryDetailsData.description ? vendorInvoiceEntryDetailsData.description : "",
              invoiceQty: parseFloat(vendorInvoiceEntryDetailsData.invoiceQty),
              invoiceRate: parseFloat(vendorInvoiceEntryDetailsData.invoiceRate),
              UnitCode: vendorInvoiceEntryDetailsData.unitCode,
              productAmount: parseFloat(vendorInvoiceEntryDetailsData.productAmount),
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
          else if (!hasError && formChangedData.vendorInvoiceEntryDetailsAdd && !vendorInvoiceEntryDetailsData.encryptedInvoiceDetailCode) {
            const requestData = {
              encryptedInvoiceHeaderCode: localStorage.getItem("EncryptedInvoiceHeaderCode"),
              productLineCode: vendorInvoiceEntryDetailsData.productLineCode,
              productCategoryCode: vendorInvoiceEntryDetailsData.productCategoryCode,
              productCode: vendorInvoiceEntryDetailsData.productCode,
              itemDescription: vendorInvoiceEntryDetailsData.itemDescription ? vendorInvoiceEntryDetailsData.itemDescription : "",
              description: vendorInvoiceEntryDetailsData.description ? vendorInvoiceEntryDetailsData.description : "",
              invoiceQty: vendorInvoiceEntryDetailsData.invoiceQty.toString(),
              invoiceRate: vendorInvoiceEntryDetailsData.invoiceRate.toString(),
              UnitCode: vendorInvoiceEntryDetailsData.unitCode,
              productAmount: vendorInvoiceEntryDetailsData.productAmount.toString(),
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
            else {
              const updateVendorInvoiceEntryDetailList = [...vendorInvoiceEntryDetails]
              updateVendorInvoiceEntryDetailList[i] = {
                ...updateVendorInvoiceEntryDetailList[i],
                encryptedInvoiceDetailCode: addResponse.data.data.encryptedInvoiceDetailCode
              };

              dispatch(vendorInvoiceEntryDetailsAction(updateVendorInvoiceEntryDetailList));
            }
          }

          vendorInvoiceEntryDetailIndex++
        }
      }
      if (!hasError) {
        clearVendorInvoiceEntryDetailsReducers();
        updateVendorInvoiceEntryCallback();
      }
    }
  }

  const getUnitList = async () => {
    let requestData = {
      UnitType: "W"
    }
    let response = await axios.post(process.env.REACT_APP_API_URL + '/unit-list', requestData)
    let unitListData = [];

    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        response.data.data.forEach(units => {
          unitListData.push({
            key: units.unitName,
            value: units.unitCode
          })
        })
        
        setUnitList(unitListData);
      }
    }
    else {
      setUnitList([]);
    }
  }

  const getVendorInvoiceEntryDetailList = async () => {
    const request = {
      encryptedInvoiceHeaderCode: localStorage.getItem("EncryptedInvoiceHeaderCode"),
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-invoice-entry-detail-list', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })

    if (response.data.status == 200) {
      if (response.data.data && response.data.data.length > 0) {
        const updatedInvoiceDetails = response.data.data.map(detail => {
          const unit = unitList.find(u => u.value === detail.unitCode);
          const unitName = unit ? unit.key : '';
          return {
            ...detail,
            unitName: unitName
          };
        });
        dispatch(vendorInvoiceEntryDetailsAction(updatedInvoiceDetails))
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
            <Button variant="success" onClick={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode ? updateVendorInvoiceEntryDetails : addVendorInvoiceEntryDetails}>Save</Button>
            <Button variant="danger" id='btnDiscard' onClick={discardChanges}>Discard</Button>
          </Modal.Footer>
        </Modal>
      }

      <TabPage
        listData={listData}
        tabArray={tabArray}
        listColumnArray={listColumnArray}
        module="VendorInvoice"
        tableFilterOptions={companyList}
        tableFilterName={'Company'}
        supportingMethod1={handleFieldChange}
        newDetails={newDetails}
        cancelClick={cancelClick}
        exitModule={exitModule}
        saveDetails={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode ? updateVendorInvoiceEntryDetails : addVendorInvoiceEntryDetails}
      />
    </>
  )
}

export default VendorInvoice