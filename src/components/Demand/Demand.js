import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import $ from 'jquery';
import { tabInfoAction, distributionCentreListAction, formChangedAction, demandHeaderAction, demandProductDetailsAction, demandHeaderDetailsErrAction, productCatalogueDetailsAction } from 'actions';
import { toast } from 'react-toastify';

const tabArray = ['Demand List', 'Add Demand'];

const listColumnArray = [
  { accessor: 'sl', Header: 'S. No' },
  { accessor: 'demandNo', Header: 'Demand No.' },
  { accessor: 'demandDate', Header: 'Demand Date' },
  { accessor: 'productCode', Header: 'Product Code' },
  { accessor: 'farmerName', Header: 'Farmer Name' },
  { accessor: 'demandStatus', Header: 'Demand Status' },
  { accessor: 'receiveStatus', Header: 'Receive Status' },
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
    getCompany();
  }, []);

  const demandHeaderDetailReducer = useSelector((state) => state.rootReducer.demandHeaderReducer)
    var demandHeaderDetails = demandHeaderDetailReducer.demandHeaderDetail;

    let demandProductDetailsReducer = useSelector((state) => state.rootReducer.demandProductDetailsReducer)
    let demandProductDetails = demandProductDetailsReducer.demandProductDetails;
  
  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  let isFormChanged = Object.values(formChangedData).some(value => value === true);

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
            fetchDemandHeaderList(1, perPage, companyDetail.encryptedCompanyCode);
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
        fetchDemandHeaderList(1, perPage, companyResponse.data.data[0].encryptedCompanyCode);
        fetchDistributionCentreList(companyResponse.data.data[0].encryptedCompanyCode);
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
      if (isDiscard != 'true') {
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
      }
    });

  $('[data-rr-ui-event-key*="Add Demand"]')
    .off('click')
    .on('click', function () {
      setActiveTabName('Add Demand');
      $('#btnNew').hide();
      $('#btnSave').show();
      $('#btnCancel').show();
    });

  const newDetails = () => {
    if (localStorage.getItem("EncryptedCompanyCode") && localStorage.getItem("CompanyName")) {
      $('[data-rr-ui-event-key*="Add Demand"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add Demand"]').trigger('click');
      $('#btnSave').attr('disabled', false);
	dispatch(tabInfoAction({ title1: `${localStorage.getItem("CompanyName")}` }))
    } else {
      toast.error("Please select company first", {
          theme: 'colored',
          autoClose: 5000
      });
    }
  };

  const cancelClick = () => {
    $('#btnExit').attr('isExit', 'false');
    setModalShow(true);
    $('#btnSave').hide();
    $('#btnCancel').hide();
    $('#btnNew').show();
    $('[data-rr-ui-event-key*="Add Demand"]').attr('disabled', true);
    $('[data-rr-ui-event-key*="Demand List"]').trigger('click');
  };

  const exitModule = () => {
    $('#btnExit').attr('isExit', 'true');
    if (isFormChanged) {
      setModalShow(true);
    } else {
      window.location.href = '/dashboard';
      clearDemandReducers();
      dispatchEvent(demandHeaderAction(undefined));
      dispatch(productCatalogueDetailsAction(undefined));
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
		localStorage.setItem("EncryptedCompanyCode", e.target.value);
		const selectedOption = e.target.options[e.target.selectedIndex];
		const selectedKey = selectedOption.dataset.key || selectedOption.label;
		localStorage.setItem("CompanyName", selectedKey)
    fetchDemandHeaderList(1, perPage, e.target.value);
    fetchDistributionCentreList(e.target.value);
}

const clearDemandReducers = () => {
  dispatch(formChangedAction(undefined));
  dispatch(demandHeaderAction([]));
  dispatch(demandProductDetailsAction([]));
  dispatch(demandHeaderDetailsErrAction(undefined));
}

const demandValidation = () => {
  setModalShow(false);

  const farmerErr = {};
  const distributionCentreCodeErr = {};
  const collCenterCodeErr = {};
  const productDetailsErr = {};

  let isValid = true;

  if (!demandHeaderDetails.farmerCode) {
      farmerErr.empty = "Select Farmer";
      isValid = false;
      setFormError(true);
  }

  if (!demandHeaderDetails.distributionCentreCode) {
    distributionCentreCodeErr.empty = "Select Distribution Center";
      isValid = false;
      setFormError(true);
  }

  if (!demandHeaderDetails.collCenterCode) {
    collCenterCodeErr.empty = "Select Collection Center";
      isValid = false;
      setFormError(true);
  }


  if (demandProductDetails.length < 1) {
      productDetailsErr.productDetailEmpty = "At least one product detail required";
      setTimeout(() => {
          toast.error(productDetailsErr.productDetailEmpty, {
              theme: 'colored'
          });
      }, 1000);
      isValid = false;
  }
  else if (demandProductDetails && demandProductDetails.length > 0) {
    demandProductDetails.forEach((row, index) => {
          if (!row.ProductCode || !row.ProductCategoryCode) {
              productDetailsErr.invalidProductDetail = "Fill the required fields in product detail";
              isValid = false;
              setFormError(true);
          }
      })
  }

  if (!isValid) {
      var errorObject = {
        farmerErr,
        distributionCentreCodeErr,
        collCenterCodeErr,
        productDetailsErr
      }

      dispatch(demandHeaderDetailsErrAction(errorObject))
  }

  return isValid;
}

const addDemandDetails = () => {
  if(demandValidation()) {

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
            <Button variant="success">Save</Button>
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
        saveDetails = {addDemandDetails}
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