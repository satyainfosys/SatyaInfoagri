import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import $ from 'jquery';
import {
  tabInfoAction,
  distributionCentreListAction,
  formChangedAction,
  demandHeaderAction,
  demandProductDetailsAction,
  demandHeaderDetailsErrAction,
  productCatalogueDetailsAction
} from 'actions';
import { toast } from 'react-toastify';
import Moment from 'moment';

const tabArray = ['Demand List', 'Add Demand'];

const listColumnArray = [
  { accessor: 'sl', Header: 'S. No' },
  { accessor: 'demandNo', Header: 'Demand No.' },
  { accessor: 'demandDate', Header: 'Demand Date' },
  { accessor: 'farmerName', Header: 'Farmer Name' },
  { accessor: 'demandStatus', Header: 'Demand Status' },
  { accessor: 'status', Header: 'Status' },
  { accessor: 'demandPrintStatus', Header: 'Print' }
];

const Demand = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [listData, setListData] = useState([]);
  const [perPage, setPerPage] = useState(15);
  const [activeTabName, setActiveTabName] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [formHasError, setFormError] = useState(false);

  useEffect(() => {
    $('[data-rr-ui-event-key*="Add Demand"]').attr('disabled', true);
    localStorage.removeItem('EncryptedDemandNo');
    // localStorage.removeItem("EncryptedCompanyCode");
    if (
      demandHeaderDetails.encryptedDemandNo &&
      demandHeaderDetails.demandSStatus == 'Approved'
    ) {
      $('#btnSave').attr('disabled', true);
    }
    getCompany();
  }, []);

  const demandHeaderDetailReducer = useSelector(
    state => state.rootReducer.demandHeaderReducer
  );
  var demandHeaderDetails = demandHeaderDetailReducer.demandHeaderDetail;

  let demandProductDetailsReducer = useSelector(
    state => state.rootReducer.demandProductDetailsReducer
  );
  let demandProductDetails = demandProductDetailsReducer.demandProductDetails;

  const formChangedReducer = useSelector(
    state => state.rootReducer.formChangedReducer
  );
  var formChangedData = formChangedReducer.formChanged;

  let isFormChanged = Object.values(formChangedData).some(
    value => value === true
  );

  const getCompany = async () => {
    let companyData = [];
    const companyRequest = {
      EncryptedClientCode: localStorage.getItem('EncryptedClientCode')
    };

    let companyResponse = await axios.post(
      process.env.REACT_APP_API_URL + '/get-client-companies',
      companyRequest,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('Token')).value
          }`
        }
      }
    );

    if (companyResponse.data.status == 200) {
      if (companyResponse.data && companyResponse.data.data.length > 0) {
        if (companyResponse.data && companyResponse.data.data.length > 0) {
          if (localStorage.getItem('CompanyCode')) {
            var companyDetail = companyResponse.data.data.find(
              company =>
                company.companyCode == localStorage.getItem('CompanyCode')
            );
            companyData.push({
              key: companyDetail.companyName,
              value: companyDetail.encryptedCompanyCode,
              label: companyDetail.companyName
            });
            localStorage.setItem(
              'EncryptedCompanyCode',
              companyDetail.encryptedCompanyCode
            );
            localStorage.setItem('CompanyName', companyDetail.companyName);
            setCompanyList(companyData);
            fetchDemandHeaderList(
              1,
              perPage,
              companyDetail.encryptedCompanyCode
            );
            fetchDistributionCentreList(companyDetail.encryptedCompanyCode);
          } else {
            companyResponse.data.data.forEach(company => {
              companyData.push({
                key: company.companyName,
                value: company.encryptedCompanyCode,
                label: company.companyName
              });
            });
            setCompanyList(companyData);
          }
        }
      }
      if (companyResponse.data.data.length == 1) {
        fetchDemandHeaderList(
          1,
          perPage,
          companyResponse.data.data[0].encryptedCompanyCode
        );
        fetchDistributionCentreList(
          companyResponse.data.data[0].encryptedCompanyCode
        );
        localStorage.setItem(
          'CompanyName',
          companyResponse.data.data[0].companyName
        );
        localStorage.setItem(
          'EncryptedCompanyCode',
          companyResponse.data.data[0].encryptedCompanyCode
        );
      }
    } else {
      setCompanyList([]);
    }
  };

  const fetchDistributionCentreList = async encryptedCompanyCode => {
    const request = {
      EncryptedClientCode: localStorage.getItem('EncryptedClientCode'),
      EncryptedCompanyCode: encryptedCompanyCode
    };

    let response = await axios.post(
      process.env.REACT_APP_API_URL + '/get-distribution-centre-list',
      request,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('Token')).value
          }`
        }
      }
    );
    let distributionCentreListData = [];
    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        response.data.data.forEach(distributionCentre => {
          distributionCentreListData.push({
            key: distributionCentre.distributionName,
            value: distributionCentre.distributionCentreCode
          });
        });
      }
      dispatch(distributionCentreListAction(distributionCentreListData));
    }
  };

  const fetchDemandHeaderList = async (
    page,
    size = perPage,
    encryptedCompanyCode
  ) => {
    let token = localStorage.getItem('Token');

    const listFilter = {
      pageNumber: page,
      pageSize: size,
      EncryptedCompanyCode: encryptedCompanyCode
    };

    setIsLoading(true);
    let response = await axios.post(
      process.env.REACT_APP_API_URL + '/get-demand-header-list',
      listFilter,
      {
        headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
      }
    );

    if (response.data.status == 200) {
      setIsLoading(false);
      setListData(response.data.data);
    } else {
      setIsLoading(false);
      setListData([]);
    }
  };

  $('[data-rr-ui-event-key*="Demand List"]')
    .off('click')
    .on('click', function () {
      let isDiscard = $('#btnDiscard').attr('isDiscard');
      if (isDiscard != 'true' && isFormChanged) {
        setModalShow(true);
        setTimeout(function () {
          $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
        }, 50);
      } else {
        $('#btnNew').show();
        $('#btnSave').hide();
        $('#btnCancel').hide();
        $('[data-rr-ui-event-key*="Add Demand"]').attr('disabled', true);
        clearDemandReducers();
        dispatch(demandHeaderAction(undefined));
        dispatch(productCatalogueDetailsAction([]));
        localStorage.removeItem('EncryptedDemandNo');
      }
    });

  $('[data-rr-ui-event-key*="Add Demand"]')
    .off('click')
    .on('click', function () {
      setActiveTabName('Add Demand');
      $('#btnNew').hide();
      $('#btnSave').show();
      $('#btnCancel').show();

      if (
        demandProductDetails.length <= 0 &&
        !localStorage.getItem('DeleteDemandProductDetailIds')
      ) {
        getDemandProductDetailsList();
      }
    });

  const newDetails = () => {
    if (
      localStorage.getItem('EncryptedCompanyCode') &&
      localStorage.getItem('CompanyName')
    ) {
      $('[data-rr-ui-event-key*="Add Demand"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add Demand"]').trigger('click');
      $('#btnSave').attr('disabled', false);
      dispatch(
        tabInfoAction({ title1: `${localStorage.getItem('CompanyName')}` })
      );
    } else {
      toast.error('Please select company first', {
        theme: 'colored',
        autoClose: 5000
      });
    }
  };

  const cancelClick = () => {
    $('#btnExit').attr('isExit', 'false');
    if (isFormChanged) {
      setModalShow(true);
    } else {
      $('[data-rr-ui-event-key*="Demand List"]').trigger('click');
    }
    // $('#btnSave').hide();
    // $('#btnCancel').hide();
    // $('#btnNew').show();
    // $('[data-rr-ui-event-key*="Add Demand"]').attr('disabled', true);
  };

  const exitModule = () => {
    $('#btnExit').attr('isExit', 'true');
    if (isFormChanged) {
      setModalShow(true);
    } else {
      window.location.href = '/dashboard';
      clearDemandReducers();
      dispatch(demandHeaderAction(undefined));
      dispatch(productCatalogueDetailsAction(undefined));
      localStorage.removeItem('EncryptedDemandNo');
      localStorage.removeItem('DeleteDemandProductDetailIds');
      localStorage.removeItem('EncryptedCompanyCode');
      localStorage.removeItem('CompanyName');
    }
  };

  const discardChanges = () => {
    $('#btnDiscard').attr('isDiscard', 'true');
    if ($('#btnExit').attr('isExit') == 'true')
      window.location.href = '/dashboard';
    else {
      $('[data-rr-ui-event-key*="Demand List"]').trigger('click');
    }
    setModalShow(false);
  };

  const handleFieldChange = e => {
    localStorage.setItem('EncryptedCompanyCode', e.target.value);
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedKey = selectedOption.dataset.key || selectedOption.label;
    localStorage.setItem('CompanyName', selectedKey);
    fetchDemandHeaderList(1, perPage, e.target.value);
    fetchDistributionCentreList(e.target.value);
  };

  const clearDemandReducers = () => {
    dispatch(formChangedAction(undefined));
    // dispatch(demandHeaderAction([]));
    dispatch(demandProductDetailsAction([]));
    dispatch(demandHeaderDetailsErrAction(undefined));
    localStorage.removeItem('DeleteDemandProductDetailIds');
  };

  
  const getDemandProductDetailsList = async () => {
    const request = {
      EncryptedDemandNo: localStorage.getItem("EncryptedDemandNo")
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-demand-product-detail-list', request, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })

    if (response.data.status == 200) {
        if (response.data.data && response.data.data.length > 0) {
            dispatch(demandProductDetailsAction(response.data.data));
        }
    }
}
  const demandValidation = () => {
    setModalShow(false);

    const farmerErr = {};
    const distributionCentreCodeErr = {};
    const collCenterCodeErr = {};
    const productDetailsErr = {};
    const advancedAmountErr = {};
    const demandAmountErr = {};

    let isValid = true;

    if (!demandHeaderDetails.farmerCode) {
      farmerErr.empty = 'Select Farmer';
      isValid = false;
      setFormError(true);
    }

    if (!demandHeaderDetails.distributionCentreCode) {
      distributionCentreCodeErr.empty = 'Select Distribution Center';
      isValid = false;
      setFormError(true);
    }

    if (!demandHeaderDetails.collCenterCode) {
      collCenterCodeErr.empty = 'Select Collection Center';
      isValid = false;
      setFormError(true);
    }

    if (demandHeaderDetails.advancedAmount > demandHeaderDetails.demandAmount) {
      advancedAmountErr.empty =
        'Advanced amount can not be greater than demand amount';
      isValid = false;
      setFormError(true);
    }

    // if (demandHeaderDetails.demandDate  > demandHeaderDetails.deliveryDate) {
    //   deliveryDateErr.empty = "Delivery date can not be greater than demand date";
    //     isValid = false;
    //     setFormError(true);
    // }

    if (demandProductDetails.length < 1) {
      productDetailsErr.productDetailEmpty =
        'At least one product detail required';
      setTimeout(() => {
        toast.error(productDetailsErr.productDetailEmpty, {
          theme: 'colored'
        });
      }, 1000);
      isValid = false;
    } else if (demandProductDetails && demandProductDetails.length > 0) {
      demandProductDetails.forEach((row, index) => {
        if (!row.productCode || !row.productCategoryCode) {
          productDetailsErr.invalidProductDetail =
            'Fill the required fields in demand product detail';
          isValid = false;
          setFormError(true);
        }
      });
    }

    const totalProductGrandAmount =
      demandProductDetails.length > 1
        ? demandProductDetails.reduce((acc, obj) => {
            const productGrandAmount =
              obj.productGrandAmt !== '' ? parseFloat(obj.productGrandAmt) : 0;
            return acc + (isNaN(productGrandAmount) ? 0 : productGrandAmount);
          }, 0)
        : demandProductDetails.length === 1
        ? parseFloat(demandProductDetails[0].productGrandAmt !== '' ? parseFloat(demandHeaderDetails[0].productGrandAmount) : 0)
        : 0;

    if (demandHeaderDetails.demandAmount != totalProductGrandAmount) {
      demandAmountErr.empty =
        'Demand amount should be equal to total grand product amount';
      setTimeout(() => {
        toast.error(demandAmountErr.empty, {
          theme: 'colored'
        });
      }, 1000);
      isValid = false;
    }

    if (!isValid) {
      var errorObject = {
        farmerErr,
        distributionCentreCodeErr,
        collCenterCodeErr,
        productDetailsErr,
        advancedAmountErr,
        demandAmountErr
      };

      dispatch(demandHeaderDetailsErrAction(errorObject));
    }

    return isValid;
  };

  const updateDemandOrderCallback = (isAddDemandDetail = false) => {
    setModalShow(false);

    if (!isAddDemandDetail) {
        toast.success("Demand details updated successfully", {
            time: 'colored'
        })
    }

    $('#btnSave').attr('disabled', true);

    clearDemandReducers();

    fetchDemandHeaderList(1, perPage, localStorage.getItem("EncryptedCompanyCode"));

    $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
}

  const updateDemandDetails = async () => {
    if (demandValidation()) {
      if (!formChangedData.demandHeaderDetailUpdate && 
        !(formChangedData.demandProductDetailsUpdate || formChangedData.demandProductDetailsAdd || formChangedData.demandProductDetailsDelete)) {
        return;
      }
      
      var deleteDemandProductDetailIds = localStorage.getItem("DeleteDemandProductDetailIds");

      const updateRequestData = {
        encryptedDemandNo: localStorage.getItem('EncryptedDemandNo'),
        distributionCentreCode: demandHeaderDetails.distributionCentreCode
          ? demandHeaderDetails.distributionCentreCode
          : '',
        collectionCentreCode: demandHeaderDetails.collCenterCode
          ? demandHeaderDetails.collCenterCode
          : '',
        farmerCode: demandHeaderDetails.farmerCode,
        farmerCollectionCentreCode: demandHeaderDetails.farmerCollCenterCode,
        demandDate: demandHeaderDetails.demandDate ?  Moment(demandHeaderDetails.demandDate).format(
          'YYYY-MM-DD'
        ) : null,
        deliveryDate: demandHeaderDetails.deliveryDate ? Moment(demandHeaderDetails.deliveryDate).format(
          'YYYY-MM-DD'
        ) : null,
        demandAmount: demandHeaderDetails.demandAmount
          ? parseFloat(demandHeaderDetails.demandAmount)
          : 0,
        advancedAmount: demandHeaderDetails.advancedAmount
          ? parseFloat(demandHeaderDetails.demandAmount)
          : 0,
        demandStatus: demandHeaderDetails.demandStatus
          ? demandHeaderDetails.demandStatus === 'Draft'
            ? 'D'
            : demandHeaderDetails.demandStatus === 'Approved'
            ? 'A'
            : demandHeaderDetails.demandStatus === 'Cancelled'
            ? 'C'
            : ''
          : 'D',
        modifyUser: localStorage.getItem('LoginUserName')
      };

      const keys = ['modifyUser']
      for (const key of Object.keys(updateRequestData).filter((key) => keys.includes(key))) {
          updateRequestData[key] = updateRequestData[key] ? updateRequestData[key].toUpperCase() : "";
      }

      var hasError = false;
      if (formChangedData.demandHeaderDetailUpdate) {
        setIsLoading(true);
        await axios
          .post(
            process.env.REACT_APP_API_URL + '/update-demand-header-detail',
            updateRequestData,
            {
              headers: {
                Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem('Token')).value
                }`
              }
            }
          )
          .then(res => {
            setIsLoading(false);
            if (res.data.status !== 200) {
              toast.error(res.data.message, {
                theme: 'colored',
                autoClose: 10000
              });
              hasError = true;
            } else {
              localStorage.setItem(
                'OldDemandStatus',
                updateRequestData.demandStatus
              );
            }
          });
      }

      var demandProductDetailIndex = 1;

      if (!hasError && (formChangedData.demandProductDetailsAdd || formChangedData.demandProductDetailsUpdate || formChangedData.demandProductDetailsDelete)) {
        if (!hasError && formChangedData.demandProductDetailsDelete) {
            var deleteDemandProductDetailList = deleteDemandProductDetailIds ? deleteDemandProductDetailIds.split(',') : null;
            if (deleteDemandProductDetailList) {
                var deleteDemandProductDetailIndex = 1;

                for (let i = 0; i < deleteDemandProductDetailList.length; i++) {
                    const deleteId = deleteDemandProductDetailList[i];
                    const data = { encryptedDemandDetailId: deleteId }
                    const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

                    const deleteResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-demand-detail', { headers, data });
                    if (deleteResponse.data.status != 200) {
                        toast.error(deleteResponse.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        });
                        hasError = true;
                        break;
                    }
                    deleteDemandProductDetailIndex++
                }
            }
        }

        for (let i = 0; i < demandProductDetails.length; i++) {
            const demandProductDetail = demandProductDetails[i];

            const keys = ["modifyUser"];
            for (const key of Object.keys(demandProductDetail).filter((key) => keys.includes(key))) {
              demandProductDetail[key] = demandProductDetail[key] ? demandProductDetail[key].toUpperCase() : "";
            }

            if (!hasError && formChangedData.demandProductDetailsUpdate && demandProductDetail.encryptedDemandProductDetailId) {
                const requestData = {
                    encryptedDemandDetailId: demandProductDetail.encryptedDemandProductDetailId,
                    encryptedDemandNo: localStorage.getItem("EncryptedDemandNo"),
                    vendorProductCatalogueCode: demandProductDetail.vendorProductCatalogueCode,
                    vendorCode : demandProductDetail.vendorCode,
                    productCategoryCode: demandProductDetail.productCategoryCode,
                    productCode: demandProductDetail.productCode,
                    deliveredQty: demandProductDetail.deliveredQty ? parseFloat(demandProductDetail.deliveredQty) : 0,
                    demandQty: demandProductDetail.demandQty ? parseFloat(demandProductDetail.demandQty) : 0,
                    unitCode: demandProductDetail.unitCode ?  parseInt(demandProductDetail.unitCode) : null,
                    demandRate: demandProductDetail.demandRate ? parseFloat(demandProductDetail.demandRate) : 0,
                    demandAmount: demandProductDetail.demandAmount ? parseFloat(demandProductDetail.demandAmount) : 0,
                    cgstPer: demandProductDetail.cgstPer ? demandProductDetail.cgstPer : 0,
                    cgstAmt: demandProductDetail.cgstAmt ? demandProductDetail.cgstAmt : 0,
                    sgstPer: demandProductDetail.sgstPer ? demandProductDetail.sgstPer : 0,
                    sgstAmt: demandProductDetail.sgstAmt ? demandProductDetail.sgstAmt : 0,
                    khasra : demandProductDetail.khasra ? demandProductDetail.khasra : null,
                    productGrandAmt: demandProductDetail.productGrandAmt ? demandProductDetail.productGrandAmt : 0,
                    harvestingMonth : demandProductDetail.harvestingMonth ? demandProductDetail.harvestingMonth : null,
                    harvestingYear : demandProductDetail.harvestingYear ? demandProductDetail.harvestingYear : null,
                    sowingMonth : demandProductDetail.sowingMonth ? demandProductDetail.sowingMonth : null,
                    sowingYear : demandProductDetail.sowingYear ? demandProductDetail.sowingYear : null,
                    modifyUser: localStorage.getItem("LoginUserName")
                }
                setIsLoading(true);
                const updateResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-demand-detail', requestData, {
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
            else if (!hasError && formChangedData.demandProductDetailsAdd && !demandProductDetail.encryptedDemandProductDetailId) {
                const requestData = {
                  encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                  encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                  encryptedDemandNo: localStorage.getItem("EncryptedDemandNo"),
                  vendorProductCatalogueCode: demandProductDetail.vendorProductCatalogueCode,
                  vendorCode : demandProductDetail.vendorCode,
                  productCategoryCode: demandProductDetail.productCategoryCode,
                  productCode: demandProductDetail.productCode,
                  deliveredQty: demandProductDetail.deliveredQty ? parseFloat(demandProductDetail.deliveredQty) : null,
                    demandQty: demandProductDetail.demandQty ? parseFloat(demandProductDetail.demandQty) : null,
                    unitCode: demandProductDetail.unitCode ?  parseInt(demandProductDetail.unitCode) : null,
                    demandRate: demandProductDetail.demandRate ? parseFloat(demandProductDetail.demandRate) : 0,
                    demandAmount: demandProductDetail.demandAmount ? parseFloat(demandProductDetail.demandAmount) : 0,
                  cgstPer: demandProductDetail.cgstPer ? demandProductDetail.cgstPer : 0,
                  cgstAmt: demandProductDetail.cgstAmt ? demandProductDetail.cgstAmt : 0,
                  sgstPer: demandProductDetail.sgstPer ? demandProductDetail.sgstPer : 0,
                  sgstAmt: demandProductDetail.sgstAmt ? demandProductDetail.sgstAmt : 0,
                  khasra : demandProductDetail.khasra ? demandProductDetail.khasra : null,
                  productGrandAmt: demandProductDetail.productGrandAmt ? demandProductDetail.productGrandAmt : '',
                  harvestingMonth : demandProductDetail.harvestingMonth ? demandProductDetail.harvestingMonth : null,
                  harvestingYear : demandProductDetail.harvestingYear ? demandProductDetail.harvestingYear : null,
                  sowingMonth : demandProductDetail.sowingMonth ? demandProductDetail.sowingMonth : null,
                  sowingYear : demandHeaderDetails.SowingYear ? demandHeaderDetails.SowingYear : null,
                  addUser: localStorage.getItem("LoginUserName")
                }
                setIsLoading(true);
                const addResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-demand-detail', requestData, {
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
                    const demandProductDetails = [...demandProductDetails]
                    demandProductDetails[i] = {
                        ...demandProductDetails[i],
                        encryptedDemandProductDetailId: addResponse.data.data.encryptedDemandDetailId
                    };

                    dispatch(demandProductDetailsAction(demandProductDetails))
                }
            }
            demandProductDetailIndex++
        }
    }
      if (!hasError) {
        // clearDemandReducers();
        updateDemandOrderCallback();
      }
    }
  };

  const addDemandDetails = () => {
    if (demandValidation()) {
      const demandProductDetailsList = demandProductDetails.map(detail => {
        return {
          ...detail,
          cgstPer: detail.cgstPer ? detail.cgstPer : 0,
          cgstAmt: detail.cgstAmt ? detail.cgstAmt : 0,
          sgstPer: detail.sgstPer ? detail.sgstPer : 0,
          sgstAmt: detail.sgstAmt ? detail.sgstAmt : 0,
          productGrandAmt: detail.productGrandAmt ? detail.productGrandAmt : null,
          deliveredQty : detail.quantity ? detail.quantity : 0
        };
      });

      const requestData = {
        encryptedClientCode: localStorage.getItem('EncryptedClientCode'),
        encryptedCompanyCode: localStorage.getItem('EncryptedCompanyCode'),
        distributionCentreCode: demandHeaderDetails.distributionCentreCode
          ? demandHeaderDetails.distributionCentreCode
          : '',
        collectionCentreCode: demandHeaderDetails.collCenterCode
          ? demandHeaderDetails.collCenterCode
          : '',
        farmerCode: demandHeaderDetails.farmerCode,
        farmerCollectionCentreCode: demandHeaderDetails.farmerCollCenterCode,
        demandDate: demandHeaderDetails.demandDate ? Moment(demandHeaderDetails.demandDate).format(
          'YYYY-MM-DD' 
        ): null,
        deliveryDate:demandHeaderDetails.deliveryDate ? Moment(demandHeaderDetails.deliveryDate).format(
          'YYYY-MM-DD'
        ) : null,
        demandAmount: demandHeaderDetails.demandAmount
          ? parseFloat(demandHeaderDetails.demandAmount)
          : 0,
        advancedAmount: demandHeaderDetails.advancedAmount
          ? parseFloat(demandHeaderDetails.demandAmount)
          : 0,
        demandStatus: demandHeaderDetails.demandStatus
          ? demandHeaderDetails.demandStatus === 'Draft'
            ? 'D'
            : demandHeaderDetails.demandStatus === 'Approved'
            ? 'A'
            : demandHeaderDetails.demandStatus === 'Cancelled'
            ? 'C'
            : ''
          : 'D',
        addUser: localStorage.getItem('LoginUserName'),
        demandProductDetails: demandProductDetailsList
      };
      const keys = ['addUser'];
      for (const key of Object.keys(requestData).filter(key =>
        keys.includes(key)
      )) {
        requestData[key] = requestData[key]
          ? requestData[key].toUpperCase()
          : '';
      }
      
      setIsLoading(true);
      axios
        .post(
          process.env.REACT_APP_API_URL + '/add-demand-header-detail',
          requestData,
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem('Token')).value
              }`
            }
          }
        )
        .then(res => {
          if (res.data.status == 200) {
            setIsLoading(false);
            setTimeout(function () {
              dispatch(
                demandHeaderAction({
                  ...demandHeaderDetails,
                  encryptedDemandNo: res.data.data.encryptedDemandNo,
                  demandNo: res.data.data.demandNo
                })
              );
            }, 50);
            localStorage.setItem(
              'EncryptedDemandNo',
              res.data.data.encryptedDemandNo
            );
            localStorage.setItem('OldDemandStatus', requestData.demandStatus);
            toast.success(res.data.message, {
              theme: 'colored',
              autoClose: 10000
            });
            updateDemandOrderCallback(true);
          } else {
            setIsLoading(false);
            toast.error(res.data.message, {
              theme: 'colored',
              autoClose: 10000
            });
          }
        });
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner
          className="position-absolute start-50 loader-color"
          animation="border"
        />
      ) : null}

      {modalShow && (
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Do you want to save changes?</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={demandHeaderDetails.encryptedDemandNo ? updateDemandDetails : addDemandDetails}>Save</Button>
            <Button variant="danger" id="btnDiscard" onClick={discardChanges}>
              Discard
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <TabPage
        listData={listData}
        listColumnArray={listColumnArray}
        tabArray={tabArray}
        module="DemandCollection"
        saveDetails={demandHeaderDetails.encryptedDemandNo ? updateDemandDetails : addDemandDetails}
        newDetails={newDetails}
        cancelClick={cancelClick}
        exitModule={exitModule}
        tableFilterOptions={companyList}
        tableFilterName={'Company'}
        supportingMethod1={handleFieldChange}
      />
    </>
  );
};

export default Demand;
