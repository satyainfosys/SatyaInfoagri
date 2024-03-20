import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Card, Row, Col, Table } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  handleNumericInputKeyPress,
  handlePercentageKeyPress
} from './../../helpers/utils.js';
import {
  productCatalogueDetailsAction,
  demandHeaderAction,
  demandProductDetailsAction,
  formChangedAction
} from 'actions';

const AddDemandDetail = () => {
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});
  const [formHasError, setFormError] = useState(false);
  const [vendorModal, setVendorModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [quantityUnitList, setQuantityUnitList] = useState([]);
  const [productCategoryList, setProductCategoryList] = useState([]);
  const [productCategory, setProductCategory] = useState();
  const [productMasterList, setProductMasterList] = useState([]);
  const [product, setProduct] = useState();
  const [rowData, setRowData] = useState([]);

  const columnsArray = [
    'S.No',
    'Product Category',
    'Product',
    'Variety',
    'Brand',
    'Unit',
    'Delivered Quantity',
    'Quantity',
    'Rate',
    'Amt',
    'CGST %',
    'CGST Amount',
    'SGST %',
    'SGST Amount',
    'Khasra',
    'Sowing Month',
    'Sowing Year',
    'Harvesting Month',
    'Harvesting Year',
    'Product Grand Amount',
    'Delete'
  ];

  const months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' }
  ];

  const currentYear = new Date().getFullYear();

  // Calculate the range of years
  const years = [];
  for (let i = currentYear - 5; i >= currentYear - 10; i--) {
    years.push(i);
  }

  const demandHeaderReducer = useSelector(
    state => state.rootReducer.demandHeaderReducer
  );
  var demandHeaderDetails = demandHeaderReducer.demandHeaderDetail;

  const demandProductDetailsReducer = useSelector(
    state => state.rootReducer.demandProductDetailsReducer
  );
  var demandProductDetails = demandProductDetailsReducer.demandProductDetails;

  let productCatalogueDetailsReducer = useSelector(
    state => state.rootReducer.productCatalogueDetailsReducer
  );
  let productCatalogueList =
    productCatalogueDetailsReducer.productCatalogueDetails;

  const demandHeaderDetailsErrorReducer = useSelector(
    state => state.rootReducer.demandHeaderDetailsErrorReducer
  );
  const demandHeaderErr =
    demandHeaderDetailsErrorReducer.demandHeaderDetailsError;

  const formChangedReducer = useSelector(
    state => state.rootReducer.formChangedReducer
  );
  var formChangedData = formChangedReducer.formChanged;

  useEffect(() => {
    if (demandProductDetailsReducer.demandProductDetails.length > 0) {
      setRowData(demandProductDetails);
      setSelectedRows([]);
      if (quantityUnitList.length <= 0) {
        getUnitList('W');
      }
    } else {
      setRowData([]);
      setSelectedRows([]);
    }

    const totalDemandAmount =
      demandProductDetails.length > 1
        ? demandProductDetails.reduce((acc, obj) => {
            const demandAmount =
              obj.productGrandAmt !== '' ? parseFloat(obj.productGrandAmt) : 0;
            return acc + (isNaN(demandAmount) ? 0 : demandAmount);
          }, 0)
        : demandProductDetails.length === 1
        ? parseFloat(demandProductDetails[0].productGrandAmt)
        : 0;

    dispatch(
      demandHeaderAction({
        ...demandHeaderDetails,
        demandAmount: isNaN(totalDemandAmount) ? 0 : totalDemandAmount
      })
    );

    if (productCategoryList.length <= 0) {
      getProductCategoryList();
    }
  }, [demandProductDetails, demandProductDetailsReducer]);

  const getUnitList = async type => {
    let requestData = {
      UnitType: type
    };

    let response = await axios.post(
      process.env.REACT_APP_API_URL + '/unit-list',
      requestData
    );
    let unitListData = [];

    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        response.data.data.forEach(units => {
          unitListData.push({ key: units.unitName, value: units.unitCode });
        });
        setQuantityUnitList(unitListData);
      }
    } else {
      setQuantityUnitList([]);
    }
  };

  const getProductCategoryList = async () => {
    let productCategoryData = [];
    let productCategoryResponse = await axios.get(
      process.env.REACT_APP_API_URL + '/product-category-master-list',
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('Token')).value
          }`
        }
      }
    );

    if (productCategoryResponse.data.status == 200) {
      if (
        productCategoryResponse.data &&
        productCategoryResponse.data.data.length > 0
      ) {
        productCategoryResponse.data.data.forEach(productCategory => {
          productCategoryData.push({
            key: productCategory.productCategoryName,
            value: productCategory.productCategoryCode
          });
        });
      }
      setProductCategoryList(productCategoryData);
    } else {
      setProductCategoryList([]);
    }
  };

  const getProductList = async productCategoryCode => {
    const request = {
      pageNumber: 1,
      pageSize: 1,
      ProductCategoryCode: productCategoryCode
    };

    let productData = [];
    let response = await axios.post(
      process.env.REACT_APP_API_URL + '/get-product-master-list',
      request,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('Token')).value
          }`
        }
      }
    );

    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        response.data.data.forEach(product => {
          productData.push({
            key: product.productName,
            value: product.code
          });
        });
      }
      setProductMasterList(productData);
    } else {
      setProductMasterList([]);
    }
  };

  const handleProductCategoryChange = async e => {
    setProductMasterList([]);
    setProduct();
    setProductCategory(e.target.value);
    handleAPICall(e.target.value);
  };

  const handleAPICall = async categoryCode => {
    await getProductCatalogueMasterList('', categoryCode, '', true);
    if (categoryCode) await getProductList(categoryCode);
  };

  const handleAddItem = () => {
    setVendorModal(true);
    getProductCatalogueMasterList();
  };

  const handleProductChange = e => {
    setProduct(e.target.value);
    getProductCatalogueMasterList('', productCategory, e.target.value, true);
  };

  const handleSearchChange = e => {
    getProductCatalogueMasterList(e.target.value);
  };

  const getProductCatalogueMasterList = async (
    searchText,
    productCategoryCode,
    productCode,
    isManualFilter = false
  ) => {
    const requestData = {
      EncryptedCompanyCode: localStorage.getItem('EncryptedCompanyCode'),
      searchText: searchText,
      ProductCategoryCode: isManualFilter
        ? productCategoryCode
        : productCategory,
      ProductCode: isManualFilter ? productCode : product
    };

    const response = await axios.post(
      process.env.REACT_APP_API_URL + '/get-product-catalogue-master-list',
      requestData,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('Token')).value
          }`
        }
      }
    );
    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        dispatch(productCatalogueDetailsAction(response.data.data));
      }
    } else {
      dispatch(productCatalogueDetailsAction([]));
    }
  };

  const onCancelClick = async () => {
    setVendorModal(false);
  };

  const handleHeaderCheckboxChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows([]);
    }
  };

  const handleCheckboxChange = rowData => {
    if (selectedRows.includes(rowData)) {
      setSelectedRows(selectedRows.filter(row => row !== rowData));
    } else {
      setSelectedRows([...selectedRows, rowData]);
    }
  };

  const handleSelectedItem = () => {
    if (selectAll) {
      let totalProductQty = 0;

      for (let i = 0; i < productCatalogueList.length; i++) {
        totalProductQty += parseFloat(productCatalogueList[i].quantity);
      }

      dispatch(
        demandHeaderAction({
          ...demandHeaderDetails,
          totalProductQty: totalProductQty
        })
      );

      const updatedData = productCatalogueList.map(item => ({
        ...item,
        productGrandAmt: 0,
        cgstPer: 0,
        cgstAmt: 0,
        sgstPer: 0,
        sgstAmt: 0,
        deliveredQty: item.quantity
      }));

      dispatch(demandProductDetailsAction(updatedData));
    } else {
      let totalProductQty = 0;

      for (let i = 0; i < selectedRows.length; i++) {
        totalProductQty += parseFloat(selectedRows[i].quantity);
      }

      dispatch(
        demandHeaderAction({
          ...demandHeaderDetails,
          totalProductQty: totalProductQty
        })
      );

      const updatedRows = selectedRows.map(item => ({
        ...item,
        productGrandAmt: 0,
        cgstPer: 0,
        cgstAmt: 0,
        sgstPer: 0,
        sgstAmt: 0
      }));

      const updatedData = [...rowData, ...updatedRows];
      dispatch(demandProductDetailsAction(updatedData));
    }
    dispatch(
      formChangedAction({
        ...formChangedData,
        demandProductDetailsAdd: true,
        demandHeaderDetailUpdate: true
      })
    );

    setVendorModal(false);
    setSelectAll(false);
  };

  const handleFieldChange = async (e, index) => {
    const { name, value } = e.target;

    var demandProductDetails = [...rowData];
    demandProductDetails[index] = {
      ...demandProductDetails[index],
      [name]: value
    };
    dispatch(demandProductDetailsAction(demandProductDetails));

    if (name === 'sowingYear' || name === 'harvestingYear') {
      demandProductDetails[index] = {
        ...demandProductDetails[index],
        [name]: value
      };
    }

    if (name == 'demandQty') {
      let calculatedDemandAmount = 0;
      if (demandProductDetails[index].demandRate) {
        calculatedDemandAmount =
          parseFloat(value) *
          parseFloat(demandProductDetails[index].demandRate);
        demandProductDetails[index].amount = isNaN(calculatedDemandAmount)
          ? 0
          : calculatedDemandAmount.toString();
        // dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
      }

      let cgstAmt =
        (parseFloat(calculatedDemandAmount) *
          (parseFloat(demandProductDetails[index].cgstPer) !== ''
            ? parseFloat(demandProductDetails[index].cgstPer)
            : 0)) /
        100;
      demandProductDetails[index].cgstAmt = isNaN(cgstAmt)
        ? 0
        : cgstAmt.toString();
      let sgstAmt =
        (parseFloat(calculatedDemandAmount) *
          (parseFloat(demandProductDetails[index].sgstPer) !== ''
            ? parseFloat(demandProductDetails[index].sgstPer)
            : 0)) /
        100;
      demandProductDetails[index].sgstAmt = isNaN(sgstAmt)
        ? 0
        : sgstAmt.toString();
      let productGrandAmt =
        (calculatedDemandAmount > 0 ? parseFloat(calculatedDemandAmount) : 0) +
        (cgstAmt > 0 ? cgstAmt : 0) +
        (sgstAmt > 0 ? sgstAmt : 0);
      demandProductDetails[index].productGrandAmt = isNaN(productGrandAmt)
        ? 0
        : productGrandAmt.toString();

      let totalCGST = 0;
      let totalSGST = 0;
      let totalProductGrandAmount = 0;
      let totalDemandQty = 0;
      for (let i = 0; i < demandProductDetails.length; i++) {
        totalCGST += parseFloat(demandProductDetails[i].cgstAmt);
        totalSGST += parseFloat(demandProductDetails[i].sgstAmt);
        totalProductGrandAmount += parseFloat(
          demandProductDetails[i].productGrandAmt
        );
        totalDemandQty += parseFloat(demandProductDetails[i].demandQty);
      }

      let gstTotalAmt = totalCGST + (totalSGST ? totalSGST : 0);
      let demandGrandAmt = totalProductGrandAmount
        ? totalProductGrandAmount
        : 0;

      dispatch(
        demandHeaderAction({
          ...demandHeaderDetails,
          gstTotalAmt: gstTotalAmt,
          demandGrandAmt: demandGrandAmt,
          totalDemandQty: totalDemandQty
        })
      );

      dispatch(demandProductDetailsAction(demandProductDetails));
    }

    if (e.target.name == 'demandRate') {
      if (demandProductDetails[index].demandQty) {
        const calculatedDemandAmount =
          parseFloat(demandProductDetails[index].demandQty) *
          parseFloat(e.target.value);
        demandProductDetails[index].demandAmount = isNaN(calculatedDemandAmount)
          ? 0
          : calculatedDemandAmount.toString();
        dispatch(demandProductDetailsAction(demandProductDetails));
      } else if (parseFloat(demandProductDetails[index].demandAmount) > 0) {
        const calculatedQuantity =
          parseFloat(demandProductDetails[index].demandAmount) /
          parseFloat(e.target.value);
        demandProductDetails[index].demandQty = isNaN(calculatedQuantity)
          ? 0
          : calculatedQuantity.toString();
        dispatch(demandProductDetails(demandProductDetails));
      }

      let amount =
        e.target.value *
        (demandProductDetails[index].demandQty
          ? parseFloat(demandProductDetails[index].demandQty)
          : 0);
      let cgstAmt =
        (parseFloat(amount) *
          (parseFloat(demandProductDetails[index].cgstPer) !== ''
            ? parseFloat(demandProductDetails[index].cgstPer)
            : 0)) /
        100;
      demandProductDetails[index].cgstAmt = isNaN(cgstAmt)
        ? 0
        : cgstAmt.toString();
      let sgstAmt =
        (parseFloat(amount) *
          (parseFloat(demandProductDetails[index].sgstPer) !== ''
            ? parseFloat(demandProductDetails[index].sgstPer)
            : 0)) /
        100;
      demandProductDetails[index].sgstAmt = isNaN(sgstAmt)
        ? 0
        : sgstAmt.toString();
      let productGrandAmt =
        (amount > 0 ? parseFloat(amount) : 0) +
        (cgstAmt > 0 ? cgstAmt : 0) +
        (sgstAmt > 0 ? sgstAmt : 0);
      demandProductDetails[index].productGrandAmt = isNaN(productGrandAmt)
        ? 0
        : productGrandAmt.toString();

      let totalCGST = 0;
      let totalSGST = 0;
      let totalProductGrandAmount = 0;
      for (let i = 0; i < demandProductDetails.length; i++) {
        totalCGST += parseFloat(demandProductDetails[i].cgstAmt);
        totalSGST += parseFloat(demandProductDetails[i].sgstAmt);
        totalProductGrandAmount += parseFloat(
          demandProductDetails[i].productGrandAmt
        );
      }

      let gstTotalAmt =
        (totalCGST ? totalCGST : 0) + (totalSGST ? totalSGST : 0);
      let demandGrandAmt =
        gstTotalAmt +
        (totalProductGrandAmount > 0 ? parseFloat(totalProductGrandAmount) : 0);
      dispatch(
        demandHeaderAction({
          ...demandHeaderDetails,
          gstTotalAmt: gstTotalAmt,
          demandGrandAmt: demandGrandAmt
        })
      );

      dispatch(demandProductDetailsAction(demandProductDetails));
    }

    if (e.target.name == 'demandAmount') {
      if (demandProductDetails[index].demandRate) {
        const calculatedQuantity =
          parseFloat(e.target.value) /
          parseFloat(demandProductDetails[index].demandRate);
        demandProductDetails[index].demandQty = isNaN(calculatedQuantity)
          ? 0
          : calculatedQuantity.toString();
        dispatch(demandProductDetailsAction(demandProductDetails));
      }

      let cgstAmt =
        (parseFloat(e.target.value) *
          (parseFloat(demandProductDetails[index].cgstPer) !== ''
            ? parseFloat(demandProductDetails[index].cgstPer)
            : 0)) /
        100;
      demandProductDetails[index].cgstAmt = isNaN(cgstAmt)
        ? 0
        : cgstAmt.toString();
      let sgstAmt =
        (parseFloat(e.target.value) *
          (parseFloat(demandProductDetails[index].sgstPer) !== ''
            ? parseFloat(demandProductDetails[index].sgstPer)
            : 0)) /
        100;
      demandProductDetails[index].sgstAmt = isNaN(sgstAmt)
        ? 0
        : sgstAmt.toString();
      let productGrandAmt =
        (e.target.value !== '' ? parseFloat(e.target.value) : 0) +
        (cgstAmt > 0 ? cgstAmt : 0) +
        (sgstAmt > 0 ? sgstAmt : 0);
      demandProductDetails[index].productGrandAmt = isNaN(productGrandAmt)
        ? 0
        : productGrandAmt.toString();
      let totalCGST = 0;
      let totalSGST = 0;
      let totalProductGrandAmount = 0;
      for (let i = 0; i < demandProductDetails.length; i++) {
        totalCGST += parseFloat(demandProductDetails[i].cgstAmt);
        totalSGST += parseFloat(demandProductDetails[i].sgstAmt);
        totalProductGrandAmount += parseFloat(
          demandProductDetails[i].productGrandAmt
        );
      }

      let gstTotalAmt =
        (totalCGST ? totalCGST : 0) + (totalSGST ? totalSGST : 0);
      let demandGrandAmt =
        totalProductGrandAmount > 0 ? parseFloat(totalProductGrandAmount) : 0;
      dispatch(
        demandHeaderAction({
          ...demandHeaderDetails,
          gstTotalAmt: gstTotalAmt,
          demandGrandAmt: demandGrandAmt
        })
      );

      dispatch(demandProductDetailsAction(demandProductDetails));
    }

    if (e.target.name == 'cgstPer') {
      if (demandProductDetails[index].demandAmount) {
        var cgstAmt =
          (parseFloat(demandProductDetails[index].demandAmount) *
            parseFloat(e.target.value)) /
          100;
        demandProductDetails[index].cgstAmt = isNaN(cgstAmt)
          ? 0
          : cgstAmt.toString();
        var productGrandAmt =
          parseFloat(demandProductDetails[index].demandAmount) +
          (cgstAmt > 0 ? cgstAmt : 0) +
          (demandProductDetails[index].sgstAmt
            ? parseFloat(demandProductDetails[index].sgstAmt)
            : 0);
        demandProductDetails[index].productGrandAmt = isNaN(productGrandAmt)
          ? 0
          : productGrandAmt.toString();
        let totalCGST = 0;
        let totalSGST = 0;
        let totalProductGrandAmount = 0;
        for (let i = 0; i < demandProductDetails.length; i++) {
          totalCGST += parseFloat(demandProductDetails[i].cgstAmt);
          totalSGST += parseFloat(demandProductDetails[i].sgstAmt);
          totalProductGrandAmount += parseFloat(
            demandProductDetails[i].productGrandAmt
          );
        }

        let gstTotalAmt = totalCGST + (totalSGST ? totalSGST : 0);
        let demandGrandAmt =
          gstTotalAmt +
          (totalProductGrandAmount > 0
            ? parseFloat(totalProductGrandAmount)
            : 0);
        dispatch(
          demandHeaderAction({
            ...demandHeaderDetails,
            gstTotalAmt: gstTotalAmt,
            demandGrandAmt: demandGrandAmt
          })
        );
        dispatch(demandProductDetailsAction(demandProductDetails));
      }
    }

    if (e.target.name == 'sgstPer') {
      if (demandProductDetails[index].demandAmount) {
        var sgstAmt =
          (parseFloat(demandProductDetails[index].demandAmount) *
            parseFloat(e.target.value)) /
          100;
        demandProductDetails[index].sgstAmt = isNaN(sgstAmt)
          ? 0
          : sgstAmt.toString();
        var calculatedProductGrandAmt =
          parseFloat(demandProductDetails[index].demandAmount) +
          (sgstAmt > 0 ? sgstAmt : 0) +
          (demandProductDetails[index].cgstAmt
            ? parseFloat(demandProductDetails[index].cgstAmt)
            : 0);
        demandProductDetails[index].productGrandAmt = isNaN(
          calculatedProductGrandAmt
        )
          ? 0
          : calculatedProductGrandAmt.toString();
        let totalCGST = 0;
        let totalSGST = 0;
        let totalProductGrandAmount = 0;
        for (let i = 0; i < demandProductDetails.length; i++) {
          totalCGST += parseFloat(demandProductDetails[i].cgstAmt);
          totalSGST += parseFloat(demandProductDetails[i].sgstAmt);
          totalProductGrandAmount += parseFloat(
            demandProductDetails[i].productGrandAmt
          );
        }
        let gstTotalAmt = (totalCGST ? totalCGST : 0) + totalSGST;
        let demandGrandAmt =
          gstTotalAmt +
          (totalProductGrandAmount > 0
            ? parseFloat(totalProductGrandAmount)
            : 0);
        dispatch(
          demandHeaderAction({
            ...demandHeaderDetails,
            gstTotalAmt: gstTotalAmt,
            demandGrandAmt: demandGrandAmt
          })
        );
        dispatch(demandProductDetailsAction(demandProductDetails));
      }
    }

    if (demandProductDetails[index].encryptedDemandDetailId) {
      dispatch(
        formChangedAction({
          ...formChangedData,
          demandHeaderProductDetailsUpdate: true,
          demandHeaderDetailUpdate: true
        })
      );
    } else {
      dispatch(
        formChangedAction({
          ...formChangedData,
          demandHeaderProductDetailsAdd: true
        })
      );
    }
  };

  const ModalPreview = encryptedDemandDetailId => {
    setModalShow(true);
    setParamsData({ encryptedDemandDetailId });
  };

  const deleteDemandProductDetail = () => {
    if (!paramsData) return false;

    var objectIndex =
      demandProductDetailsReducer.demandProductDetails.findIndex(
        x => x.encryptedDemandDetailId == paramsData.encryptedDemandDetailId
      );
    demandProductDetailsReducer.demandProductDetails.splice(objectIndex, 1);

    var deleteDemandProductDetailId = localStorage.getItem(
      'DeleteDemandProductDetailIds'
    );

    if (paramsData.encryptedDemandDetailId) {
      var deleteDemandProductDetail = deleteDemandProductDetailId
        ? deletePoProductDetailId + ',' + paramsData.encryptedDemandDetailId
        : paramsData.encryptedDemandDetailId;
      localStorage.setItem(
        'DeleteDemandProductDetailIds',
        deleteDemandProductDetail
      );
    }

    toast.success('Demand product details deleted successfully', {
      theme: 'colored'
    });

    dispatch(demandProductDetailsAction(objectIndex));

    dispatch(
      formChangedAction({
        ...formChangedData,
        demandProductDetailsDelete: true,
        demandProductDetailUpdate: true
      })
    );

    setModalShow(false);
  };

  return (
    <>
      {modalShow && paramsData && (
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
            <h4>
              Are you sure, you want to delete this Demand Product detail?
            </h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteDemandProductDetail()}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {vendorModal && (
        <Modal
          show={vendorModal}
          onHide={() => setVendorModal(false)}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Product
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="max-five-rows">
            <Form className="details-form" id="OemDetailsForm">
              <Row>
                <Col className="me-3 ms-3" md="4">
                  <Form.Group
                    as={Row}
                    className="mb-2"
                    controlId="formPlaintextPassword"
                  >
                    <Form.Label column sm="2">
                      Search
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        id="txtSearch"
                        name="search"
                        placeholder="Search"
                        maxLength={45}
                        onChange={handleSearchChange}
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col className="me-2 ms-3" md="4">
                  <Form.Group
                    as={Row}
                    className="mb-2"
                    controlId="formPlaintextPassword"
                  >
                    <Col sm="8">
                      <Form.Select
                        type="text"
                        name="productCategoryCode"
                        className="form-control"
                        onChange={handleProductCategoryChange}
                        value={productCategory}
                      >
                        <option value="">Select Product Category</option>
                        {productCategoryList.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.key}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>
                <Col className="me-2 ms-3" md="3">
                  <Form.Group
                    as={Row}
                    className="mb-2"
                    controlId="formPlaintextPassword"
                  >
                    <Col sm="8">
                      <Form.Select
                        type="text"
                        name="productCode"
                        className="form-control"
                        onChange={handleProductChange}
                        value={product}
                      >
                        <option value="">Select Product</option>
                        {productMasterList.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.key}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>

                {productCatalogueDetailsReducer.productCatalogueDetails.length >
                0 ? (
                  <Table
                    striped
                    bordered
                    responsive
                    id="TableList"
                    className="no-pb text-nowrap tab-page-table"
                  >
                    <thead className="custom-bg-200">
                      <tr>
                        <th>S.No</th>
                        <th>
                          Select{' '}
                          <Form.Check type="checkbox" id="vendorListChkbox">
                            <Form.Check.Input
                              type="checkbox"
                              name="selectAll"
                              style={{ width: '15px', height: '15px' }}
                              onChange={handleHeaderCheckboxChange}
                              checked={selectAll}
                            />
                          </Form.Check>
                        </th>
                        <th>OEM Name</th>
                        <th>Product Category</th>
                        <th>Product</th>
                        <th>Variety</th>
                        <th>Brand</th>
                        <th>Type</th>
                        <th>Unit</th>
                        <th>Rate</th>
                        <th>Org/Inorg</th>
                        <th>Season</th>
                        <th>Area</th>
                        <th>Sowing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productCatalogueDetailsReducer.productCatalogueDetails.map(
                        (data, index) => (
                          <>
                            <tr>
                              <td>{index + 1}</td>
                              <td key={index}>
                                <Form.Check type="checkbox" className="mb-1">
                                  <Form.Check.Input
                                    type="checkbox"
                                    name="singleChkBox"
                                    style={{ width: '20px', height: '20px' }}
                                    onChange={() => handleCheckboxChange(data)}
                                    checked={
                                      selectAll || selectedRows.includes(data)
                                    }
                                  />
                                </Form.Check>
                              </td>
                              <td>{data.oemName}</td>
                              <td>{data.productCategoryName}</td>
                              <td>{data.productName}</td>
                              <td>{data.varietyName}</td>
                              <td>{data.brandName}</td>
                              <td>{data.type}</td>
                              <td>{data.unitName}</td>
                              <td>{data.vendorRate}</td>
                              <td>{data.orgInorg}</td>
                              <td>{data.season}</td>
                              <td>{data.area}</td>
                              <td>{data.sowing}</td>
                            </tr>
                          </>
                        )
                      )}
                    </tbody>
                  </Table>
                ) : (
                  <h5>No record found</h5>
                )}
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => handleSelectedItem()}>
              Add
            </Button>
            <Button variant="danger" onClick={() => onCancelClick()}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Card className="h-100 mb-2">
        <FalconCardHeader
          title="Product Details"
          titleTag="h6"
          className="py-2"
          light
          endEl={
            <Flex>
              <div>
                <Button
                  variant="primary"
                  size="sm"
                  className="btn-reveal"
                  type="button"
                  onClick={() => handleAddItem()}
                >
                  Add Item
                </Button>
              </div>
            </Flex>
          }
        />

        {demandProductDetails && demandProductDetails.length > 0 && (
          <Card.Body className="position-relative pb-0 p3px cp-table-card">
            <Form
              noValidate
              validated={
                formHasError ||
                (demandHeaderErr.demandProductDetailsErr &&
                  demandHeaderErr.demandProductDetailsErr.invalidProductDetail)
              }
              className="details-form"
              id="AddDemandProductDetailsForm"
            >
              <Table
                striped
                bordered
                responsive
                id="TableList"
                className="no-pb text-nowrap tab-page-table"
              >
                <thead className="custom-bg-200">
                  {rowData && (
                    <tr>
                      {columnsArray.map((column, index) => {
                        if (
                          column === 'Delete' &&
                          demandHeaderDetails.demandStatus == 'Approved'
                        ) {
                          return null;
                        }
                        return (
                          <th className="text-left" key={index}>
                            {column}
                          </th>
                        );
                      })}
                    </tr>
                  )}
                </thead>
                <tbody id="tbody" className="details-form">
                  {rowData.map((productDetail, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>
                        <EnlargableTextbox
                          name="productCategoryName"
                          placeholder="Product Category"
                          value={productDetail.productCategoryName}
                          disabled
                          required
                        />
                      </td>

                      <td>
                        <EnlargableTextbox
                          name="productName"
                          placeholder="Product"
                          value={productDetail.productName}
                          disabled
                          required
                        />
                      </td>

                      <td>
                        <EnlargableTextbox
                          name="varietyName"
                          placeholder="Variety"
                          value={productDetail.varietyName}
                          disabled
                        />
                      </td>

                      <td>
                        <EnlargableTextbox
                          name="brandName"
                          placeholder="Brand"
                          value={productDetail.brandName}
                          disabled
                        />
                      </td>
                      <td>
                        <Form.Select
                          type="text"
                          name="unitCode"
                          className="form-control select"
                          onChange={e => handleFieldChange(e, index)}
                          value={productDetail.unitCode}
                          required
                        >
                          <option value="">Select </option>
                          {quantityUnitList.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.key}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <EnlargableTextbox
                          name="DeliveredQty"
                          placeholder="Delivered Quantity"
                          maxLength={5}
                          required
                          disabled
                          onChange={e => handleFieldChange(e, index)}
                          value={
                            productDetail.quantity ? productDetail.quantity : ''
                          }
                          onKeyPress={handleNumericInputKeyPress}
                        />
                      </td>

                      <td>
                        <EnlargableTextbox
                          name="demandQty"
                          placeholder="Quantity"
                          maxLength={5}
                          required
                          onChange={e => handleFieldChange(e, index)}
                          value={
                            productDetail.demandQty
                              ? productDetail.demandQty
                              : ''
                          }
                          onKeyPress={handleNumericInputKeyPress}
                        />
                      </td>

                      <td>
                        <EnlargableTextbox
                          name="demandRate"
                          placeholder="Rate"
                          maxLength={10}
                          required
                          onChange={e => handleFieldChange(e, index)}
                          value={
                            productDetail.demandRate
                              ? productDetail.demandRate
                              : ''
                          }
                          onKeyPress={handleNumericInputKeyPress}
                        />
                      </td>

                      <td>
                        <EnlargableTextbox
                          name="amount"
                          placeholder="Amount"
                          maxLength={13}
                          required
                          onChange={e => handleFieldChange(e, index)}
                          value={
                            productDetail.demandAmount
                              ? productDetail.demandAmount
                              : ''
                          }
                          onKeyPress={handleNumericInputKeyPress}
                        />
                      </td>
                      <td>
                        <EnlargableTextbox
                          name="cgstPer"
                          placeholder="CGST %"
                          maxLength={5}
                          onChange={e => handleFieldChange(e, index)}
                          value={
                            productDetail.cgstPer ? productDetail.cgstPer : ''
                          }
                          onKeyPress={handlePercentageKeyPress}
                        />
                      </td>
                      <td>
                        <EnlargableTextbox
                          name="cgstAmt"
                          placeholder="CGST Amount"
                          maxLength={13}
                          onChange={e => handleFieldChange(e, index)}
                          value={
                            productDetail.cgstAmt ? productDetail.cgstAmt : ''
                          }
                          onKeyPress={handleNumericInputKeyPress}
                          disabled
                        />
                      </td>
                      <td>
                        <EnlargableTextbox
                          name="sgstPer"
                          placeholder="SGST %"
                          maxLength={5}
                          onChange={e => handleFieldChange(e, index)}
                          value={
                            productDetail.sgstPer ? productDetail.sgstPer : ''
                          }
                          onKeyPress={handlePercentageKeyPress}
                        />
                      </td>
                      <td>
                        <EnlargableTextbox
                          name="sgstAmt"
                          placeholder="SGST Amount"
                          maxLength={13}
                          onKeyPress={handleNumericInputKeyPress}
                          onChange={e => handleFieldChange(e, index)}
                          value={
                            productDetail.sgstAmt ? productDetail.sgstAmt : ''
                          }
                          disabled
                        />
                      </td>
                      {/* <td>
                        <EnlargableTextbox
                          name="khasra"
                          placeholder="Khasra"
                          maxLength={13}
                          onChange={(e) => handleFieldChange(e, index)}
                          value={productDetail.khasra ? productDetail.khasra : ""}
                        />
                      </td> */}
                      <td>
                        <Form.Select
                          name="khasra"
                          placeholder="Khasra"
                          className="form-control select"
                          onChange={e => handleFieldChange(e, index)}
                          value={
                            productDetail.khasra ? productDetail.khasra : ''
                          }
                          required
                        >
                          <option value="">Select </option>
                          {demandHeaderDetails?.khasraNo?.map(
                            (option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            )
                          )}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Select
                          className="form-control select"
                          id="sowingMonth"
                          placeholder="Sowing Month"
                          name="sowingMonth"
                          value={demandHeaderDetails.sowingMonth}
                          onChange={e => handleFieldChange(e, index)}
                        >
                          <option value="">Select </option>
                          {/* {months.map((month, index) => (
                            <option key={index} value={month.value}>
                              {month.name}
                            </option>
                          ))} */}
                          <option value="01">January</option>
                          <option value="02">February</option>
                          <option value="03">March</option>
                          <option value="04">April</option>
                          <option value="05">May</option>
                          <option value="06">June</option>
                          <option value="07">July</option>
                          <option value="08">August</option>
                          <option value="09">September</option>
                          <option value="10">October</option>
                          <option value="11">November</option>
                          <option value="12">December</option>
                          {/* <option value="OFX">Office Ext No</option>
                          <option value="OFF">Office Fax No</option>
                          <option value="PPP">PP No</option>
                          <option value="PMN">Personal Mobile No</option>
                          <option value="PRL">Personal Land Line No</option>
                          <option value="PRS">Spouse Mob No</option>
                          <option value="PRE">Personal Mail</option> */}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Select
                          className="form-control select"
                          name="sowingYear"
                          placeholder="Select Sowing Year"
                          value={demandHeaderDetails.sowingYear}
                          onChange={e => handleFieldChange(e, index)}
                        >
                          <option value="">Select</option>
                          {years.map((year, index) => (
                            <option key={index} value={year}>
                              {year}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Select
                          id="harvestingMonth"
                          className="form-control select"
                          name="harvestingMonth"
                          value={demandHeaderDetails.harvestingMonth}
                          onChange={e => handleFieldChange(e, index)}
                        >
                          <option value="">Select </option>
                          {months.map((month, index) => (
                            <option key={index} value={month.value}>
                              {month.name}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Select
                          className="form-control select"
                          name="harvestingYear"
                          placeholder="Select Harvesting Year"
                          value={demandHeaderDetails.harvestingYear}
                          onChange={e => handleFieldChange(e, index)}
                        >
                          <option value="">Select</option>
                          {years.map((year, index) => (
                            <option key={index} value={year}>
                              {year}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <EnlargableTextbox
                          name="productGrandAmt"
                          placeholder="Product Grand Amount"
                          maxLength={13}
                          onChange={e => handleFieldChange(e, index)}
                          value={
                            productDetail.productGrandAmt
                              ? productDetail.productGrandAmt
                              : ''
                          }
                          onKeyPress={handleNumericInputKeyPress}
                          required
                          disabled
                        />
                      </td>
                      {
                        <td>
                          <FontAwesomeIcon
                            icon={'trash'}
                            className="fa-2x"
                            onClick={() => {
                              ModalPreview(
                                productDetail.encryptedDemandDetailId
                              );
                            }}
                          />
                        </td>
                      }
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Form>
          </Card.Body>
        )}
      </Card>
    </>
  );
};

export default AddDemandDetail;
