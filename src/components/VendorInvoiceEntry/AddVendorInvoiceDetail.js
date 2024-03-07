import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import axios from 'axios';
import { toast } from 'react-toastify';
import { handleNumericInputKeyPress, handlePercentageKeyPress } from "./../../helpers/utils.js"
import { purchaseOrderProductDetailsAction, vendorInvoiceEntryDetailsAction, formChangedAction, vendorInvoiceEntryHeaderDetailsAction } from 'actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddVendorInvoiceDetail = () => {
  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});
  const [rowData, setRowData] = useState([]);
  const [poModal, setPoModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [formHasError, setFormError] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [unitList, setUnitList] = useState([])

  const dispatch = useDispatch();

  let oldInvoiceStatus = localStorage.getItem("OldInvoiceStatus");

  const columnsArray = [
    'S.No',
    'Product Line',
    'Product Category',
    'Product',
    'Unit',
    'PO. Qty',
    'PO. Rate',
    'Description',
    'Qty',
    'Rate',
    'Product Amount',
    'CGST %',
    'CGST Amount',
    'SGST %',
    'SGST Amount',
    'Product Grand Amount',
    'Delete',
  ];

  const emptyRow = {
    id: rowData.length + 1,
    encryptedInvoiceHeaderCode: localStorage.getItem("encryptedInvoiceHeaderCode"),
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
    productLineCode: '',
    productCategoryCode: '',
    invoiceRate: '',
    productAmount: 0,
    description: '',
    qty: '',
    unitCode:"",
    itemDescription: '',
    cgstPer: 0,
    sgstPer: 0,
    productGrandAmt:0,
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName"),
  }

  const vendorInvoiceEntryHeaderDetailsReducer = useSelector((state) => state.rootReducer.vendorInvoiceEntryHeaderDetailsReducer)
  var vendorInvoiceEntryHeaderDetails = vendorInvoiceEntryHeaderDetailsReducer.vendorInvoiceEntryHeaderDetails;

  let purchaseOrderProductDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderProductDetailsReducer)
  let purchaseOrderProductDetailsList = purchaseOrderProductDetailsReducer.purchaseOrderProductDetails;

  const vendorInvoiceEntryDetailsReducer = useSelector((state) => state.rootReducer.vendorInvoiceEntryDetailsReducer)
  var vendorInvoiceEntryDetails = vendorInvoiceEntryDetailsReducer.vendorInvoiceEntryDetails;

  const vendorInvoiceEntryErrorReducer = useSelector((state) => state.rootReducer.vendorInvoiceEntryErrorReducer)
  const vendorInvoiceEntryErr = vendorInvoiceEntryErrorReducer.vendorInvoiceEntryError;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  useEffect(() => {
    if (vendorInvoiceEntryDetailsReducer.vendorInvoiceEntryDetails.length > 0) {
      setRowData(vendorInvoiceEntryDetails);
      setSelectedRows([]);
    } else {
      setRowData([]);
      setSelectedRows([]);
    }

    getUnitList()
    
  }, [vendorInvoiceEntryDetails, vendorInvoiceEntryDetailsReducer])

  const validateVendorInvoiceEntryDetailForm = () => {
    let isValid = true;

    if (vendorInvoiceEntryDetails && vendorInvoiceEntryDetails.length > 0) {
      vendorInvoiceEntryDetails.forEach((row, index) => {
        if (vendorInvoiceEntryHeaderDetails.poNo) {
          if (!row.productLineCode || !row.productCategoryCode || !row.productCode || !row.invoiceQty || !row.productAmount || !row.itemDescription) {
            isValid = false;
            setFormError(true);
          }
        } else if (!row.itemDescription || !row.invoiceQty || !row.invoiceRate || !row.productAmount) {
          isValid = false;
          setFormError(true);
        }
      });
    }

    if (isValid) {
      setFormError(false);
    }

    return isValid;
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

  const handleAddItem = () => {
    if (vendorInvoiceEntryHeaderDetails.poNo) {
      setPoModal(true);
      getPoDetailList();
    }
    else {
      let formValid = validateVendorInvoiceEntryDetailForm()
      if (formValid) {
        vendorInvoiceEntryDetails.unshift(emptyRow);
        dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntryDetails));
      }
    }
  }

  const handleHeaderCheckboxChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows([]);
    }
  };

  const onCancelClick = () => {
    setPoModal(false);
  }

  const handleSelectedItem = () => {
    if (selectAll) {
      let updatedData;
      let newRows = purchaseOrderProductDetailsList.filter(row => !vendorInvoiceEntryDetails.some(existingRow => existingRow.productCode === row.productCode));
      newRows = newRows.map((data) => {
        if (data.sgstAmt > 0 && data.sgstPer > 0) {
          return {
            ...data,
            productGrandAmt: data.productGrandAmt ? data.productGrandAmt : 0,
            cgstPer: data.cgstPer ? data.cgstPer : 0,
            cgstAmt: data.cgstAmt ? data.cgstAmt : 0,
            sgstPer: data.sgstPer ? data.sgstPer : 0,
            sgstAmt: data.sgstAmt ? data.sgstAmt : 0,
            taxIncluded: true
          };
        } else {
          return {
            ...data,
            productGrandAmt: 0,
            cgstPer: 0,
            cgstAmt: 0,
            sgstPer: 0,
            sgstAmt: 0,
            taxIncluded: false
          };
        }
      });
      if (newRows.length > 0) {
        updatedData = [...vendorInvoiceEntryDetails, ...newRows];
      } else {
        updatedData = vendorInvoiceEntryDetails;
      }
      dispatch(vendorInvoiceEntryDetailsAction(updatedData));
    } else {
      let uniqueRows = selectedRows.filter(row => !vendorInvoiceEntryDetails.some(existingRow => existingRow.productCode === row.productCode));
      uniqueRows = uniqueRows.map((data) => {
        if (data.sgstAmt > 0 && data.sgstPer > 0) {
          return {
            ...data,
            productGrandAmt: data.productGrandAmt ? data.productGrandAmt : 0,
            cgstPer: data.cgstPer ? data.cgstPer : 0,
            cgstAmt: data.cgstAmt ? data.cgstAmt : 0,
            sgstPer: data.sgstPer ? data.sgstPer : 0,
            sgstAmt: data.sgstAmt ? data.sgstAmt : 0,
            taxIncluded: true
          };
        } else {
          return {
            ...data,
            productGrandAmt: 0,
            cgstPer: 0,
            cgstAmt: 0,
            sgstPer: 0,
            sgstAmt: 0,
            taxIncluded: false
          };
        }
      });
      const updatedData = [...uniqueRows, ...vendorInvoiceEntryDetails];
      dispatch(vendorInvoiceEntryDetailsAction(updatedData));
    }

    dispatch(formChangedAction({
      ...formChangedData,
      vendorInvoiceEntryDetailsAdd: true
    }))

    setPoModal(false);
    setSelectAll(false);
  }

  const handleCheckboxChange = (rowData) => {
    if (selectedRows.includes(rowData)) {
      setSelectedRows(selectedRows.filter(row => row !== rowData));
    } else {
      setSelectedRows([...selectedRows, rowData]);
    }
  };

  const getPoDetailList = async () => {
    const request = {
      PoNo: vendorInvoiceEntryHeaderDetails.poNo
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-po-detail-list', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })

    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        dispatch(purchaseOrderProductDetailsAction(response.data.data));        
      }
    }
    else {
      dispatch(purchaseOrderProductDetailsAction([]))
    }
  }

  const handleFieldChange = async (e, index) => {
    const { name, value } = e.target;
    var vendorInvoiceEntry = [...rowData];
    vendorInvoiceEntry[index] = {
      ...vendorInvoiceEntry[index],
      [name]: value
    };
    dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry));

    if (e.target.name == "invoiceQty") {
        var totalAmount = (e.target.value !== "" ?parseFloat(e.target.value): 0) * (vendorInvoiceEntry[index].invoiceRate ? parseFloat(vendorInvoiceEntry[index].invoiceRate) : parseFloat(vendorInvoiceEntry[index].poRate))
        vendorInvoiceEntry[index].productAmount = isNaN(totalAmount) ? 0 : totalAmount.toString();

        let cgstAmt = (parseFloat(totalAmount) * (parseFloat(vendorInvoiceEntry[index].cgstPer) !== "" ? parseFloat(vendorInvoiceEntry[index].cgstPer) : 0) )/100
        vendorInvoiceEntry[index].cgstAmt = isNaN(cgstAmt) ? 0 : cgstAmt.toString(); 
        let sgstAmt = (parseFloat(totalAmount) * (parseFloat(vendorInvoiceEntry[index].sgstPer) !== "" ? parseFloat(vendorInvoiceEntry[index].sgstPer) : 0) )/100
        vendorInvoiceEntry[index].sgstAmt = isNaN(sgstAmt) ? 0 : sgstAmt.toString(); 
        let productGrandAmt = (totalAmount > 0 ? parseFloat(totalAmount) : 0)  + (parseFloat(cgstAmt) > 0 ? cgstAmt : 0)  + (parseFloat(sgstAmt)  > 0 ? sgstAmt: 0)
        vendorInvoiceEntry[index].productGrandAmt = isNaN(productGrandAmt) ? 0 : productGrandAmt.toString(); 
          let totalCGST = 0;
          let totalSGST = 0;
     
          let totalProductGrandAmount = 0;
          for (let i = 0; i < vendorInvoiceEntry.length; i++) {
            totalCGST += parseFloat(vendorInvoiceEntry[i].cgstAmt);
            totalSGST += parseFloat(vendorInvoiceEntry[i].sgstAmt);
            totalProductGrandAmount += parseFloat(vendorInvoiceEntry[i].productGrandAmt);
          }
      
        let gstTotalAmt =  totalCGST + (totalSGST ? totalSGST : 0)
        let invoiceGrandAmt = (totalProductGrandAmount > 0 ? parseFloat(totalProductGrandAmount) : 0)
        dispatch(vendorInvoiceEntryHeaderDetailsAction({
          ...vendorInvoiceEntryHeaderDetails,
          gstTotalAmt: gstTotalAmt,
          invoiceGrandAmt : invoiceGrandAmt
        })) 

        dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry))
    }

    if (e.target.name == "invoiceRate") {
      let amount  = 0
      if (vendorInvoiceEntry[index].invoiceQty) {
        amount = parseFloat(e.target.value) * parseFloat(vendorInvoiceEntry[index].invoiceQty);
        vendorInvoiceEntry[index].productAmount = isNaN(amount) ? 0 : amount.toString();
      }
      else if (parseFloat(vendorInvoiceEntry[index].productAmount) > 0) {
        amount = parseFloat(vendorInvoiceEntry[index].productAmount) / parseFloat(e.target.value);
        vendorInvoiceEntry[index].invoiceQty = isNaN(amount) ? 0 : amount.toString();
      }

      let cgstAmt =  (parseFloat(amount) * (parseFloat(vendorInvoiceEntry[index].cgstPer) !== "" ? parseFloat(vendorInvoiceEntry[index].cgstPer) : 0) )/100
      vendorInvoiceEntry[index].cgstAmt = isNaN(cgstAmt) ? 0 : cgstAmt.toString(); 
      let sgstAmt = (parseFloat(amount) * (parseFloat(vendorInvoiceEntry[index].sgstPer) !== "" ? parseFloat(vendorInvoiceEntry[index].sgstPer) : 0) )/100
      vendorInvoiceEntry[index].sgstAmt = isNaN(sgstAmt) ? 0 : sgstAmt.toString(); 
      let productGrandAmt = parseFloat(amount)  + (cgstAmt > 0 ? cgstAmt : 0)  + (sgstAmt  > 0 ? sgstAmt: 0)
      vendorInvoiceEntry[index].productGrandAmt = isNaN(productGrandAmt) ? 0 : productGrandAmt.toString(); 
        let totalCGST = 0;
        let totalSGST = 0;
        let totalProductGrandAmount = 0;
        for (let i = 0; i < vendorInvoiceEntry.length; i++) {
          totalCGST += parseFloat(vendorInvoiceEntry[i].cgstAmt);
          totalSGST += parseFloat(vendorInvoiceEntry[i].sgstAmt);
          totalProductGrandAmount += parseFloat(vendorInvoiceEntry[i].productGrandAmt);
        }
 
      let gstTotalAmt =  (totalCGST ? totalCGST : 0) + (totalSGST ? totalSGST : 0)
      let invoiceGrandAmt = (totalProductGrandAmount > 0 ? parseFloat(totalProductGrandAmount) : 0)
      dispatch(vendorInvoiceEntryHeaderDetailsAction({
        ...vendorInvoiceEntryHeaderDetails,
        gstTotalAmt: gstTotalAmt,
        invoiceGrandAmt : invoiceGrandAmt
      })) 

      dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry))
    }

    if (e.target.name == "productAmount") {
        var totalQuantity = parseFloat(e.target.value) / (vendorInvoiceEntry[index].invoiceRate ?  parseFloat(vendorInvoiceEntry[index].invoiceRate) : parseFloat(vendorInvoiceEntry[index].poRate))
        vendorInvoiceEntry[index].invoiceQty = isNaN(totalQuantity) ? 0 : totalQuantity.toString();

        let cgstAmt = (parseFloat(e.target.value) * (parseFloat(vendorInvoiceEntry[index].cgstPer) !== "" ? parseFloat(vendorInvoiceEntry[index].cgstPer) : 0) )/100
        vendorInvoiceEntry[index].cgstAmt = isNaN(cgstAmt) ? 0 : cgstAmt.toString(); 
        let sgstAmt = (parseFloat(e.target.value) * (parseFloat(vendorInvoiceEntry[index].sgstPer) !== "" ? parseFloat(vendorInvoiceEntry[index].sgstPer) : 0) )/100
        vendorInvoiceEntry[index].sgstAmt = isNaN(sgstAmt) ? 0 : sgstAmt.toString(); 
        let productGrandAmt = (e.target.value !== "" ? parseFloat(e.target.value) : 0) + (cgstAmt > 0 ? cgstAmt : 0)  + (sgstAmt  > 0 ? sgstAmt: 0)
        vendorInvoiceEntry[index].productGrandAmt = isNaN(productGrandAmt) ? 0 : productGrandAmt.toString(); 
          let totalCGST = 0;
          let totalSGST = 0;
          let totalProductGrandAmount = 0 ;
          for (let i = 0; i < vendorInvoiceEntry.length; i++) {
            totalCGST += parseFloat(vendorInvoiceEntry[i].cgstAmt);
            totalSGST += parseFloat(vendorInvoiceEntry[i].sgstAmt);
            totalProductGrandAmount += parseFloat(vendorInvoiceEntry[i].productGrandAmt);
          }
   
        let gstTotalAmt =  (totalCGST ? totalCGST : 0) + (totalSGST ? totalSGST : 0)
        let invoiceGrandAmt = (totalProductGrandAmount > 0 ? parseFloat(totalProductGrandAmount) : 0)
        dispatch(vendorInvoiceEntryHeaderDetailsAction({
          ...vendorInvoiceEntryHeaderDetails,
          gstTotalAmt: gstTotalAmt,
          invoiceGrandAmt : invoiceGrandAmt
        })) 

        dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry))
      }

    if(e.target.name == "cgstPer"){ 
      if(vendorInvoiceEntry[index].productAmount){
      var cgstAmt =  (parseFloat(vendorInvoiceEntry[index].productAmount)* parseFloat(e.target.value))/100
      vendorInvoiceEntry[index].cgstAmt = isNaN(cgstAmt) ? 0 : cgstAmt.toString(); 
      var productGrandAmt = (vendorInvoiceEntry[index].productAmount > 0 ? parseFloat(vendorInvoiceEntry[index].productAmount ):0) + (cgstAmt > 0 ? cgstAmt : 0) + ( vendorInvoiceEntry[index].sgstAmt ? parseFloat(vendorInvoiceEntry[index].sgstAmt): 0 )
      vendorInvoiceEntry[index].productGrandAmt = isNaN(productGrandAmt) ? 0 : productGrandAmt.toString(); 
        let totalCGST = 0;
        let totalSGST = 0;
        let totalProductGrandAmount = 0;
        for (let i = 0; i < vendorInvoiceEntry.length; i++) {
          totalCGST += parseFloat(vendorInvoiceEntry[i].cgstAmt);
          totalSGST += parseFloat(vendorInvoiceEntry[i].sgstAmt);
          totalProductGrandAmount += parseFloat(vendorInvoiceEntry[i].productGrandAmt);
        }
 
      let gstTotalAmt =  totalCGST + (totalSGST ? totalSGST : 0)
      let invoiceGrandAmt = (totalProductGrandAmount > 0 ? parseFloat(totalProductGrandAmount) : 0)
      dispatch(vendorInvoiceEntryHeaderDetailsAction({
        ...vendorInvoiceEntryHeaderDetails,
        gstTotalAmt: gstTotalAmt,
        invoiceGrandAmt : invoiceGrandAmt
      })) 
      dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry))
      }
    }

    if(e.target.name == "sgstPer"){
      if(vendorInvoiceEntry[index].productAmount){
      var sgstAmt = (parseFloat(vendorInvoiceEntry[index].productAmount)  * parseFloat(e.target.value))/100
      vendorInvoiceEntry[index].sgstAmt = isNaN(sgstAmt) ? 0 : sgstAmt.toString(); 
      var calculatedProductGrandAmt = (vendorInvoiceEntry[index].productAmount > 0 ? parseFloat(vendorInvoiceEntry[index].productAmount) : 0) + (sgstAmt > 0 ? sgstAmt : 0) + ( vendorInvoiceEntry[index].cgstAmt ? parseFloat(vendorInvoiceEntry[index].cgstAmt): 0)
      vendorInvoiceEntry[index].productGrandAmt = isNaN(calculatedProductGrandAmt) ? 0 : calculatedProductGrandAmt.toString(); 
      let totalCGST = 0;
      let totalSGST = 0;
      let totalProductGrandAmount = 0;
      for (let i = 0; i < vendorInvoiceEntry.length; i++) {
        totalCGST += parseFloat(vendorInvoiceEntry[i].cgstAmt);
        totalSGST += parseFloat(vendorInvoiceEntry[i].sgstAmt);
        totalProductGrandAmount += parseFloat(vendorInvoiceEntry[i].productGrandAmt);
      }
      let gstTotalAmt =  (totalCGST ? totalCGST : 0) + totalSGST
    let invoiceGrandAmt = (totalProductGrandAmount > 0 ? parseFloat(totalProductGrandAmount) : 0)
    dispatch(vendorInvoiceEntryHeaderDetailsAction({
      ...vendorInvoiceEntryHeaderDetails,
      gstTotalAmt: gstTotalAmt,
      invoiceGrandAmt: invoiceGrandAmt
    })) 
      dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry))
      }
    }

    if (vendorInvoiceEntryDetails[index].encryptedInvoiceDetailCode) {
      dispatch(formChangedAction({
        ...formChangedData,
        vendorInvoiceEntryDetailsUpdate: true,
        vendorInvoiceEntryHeaderDetailUpdate: true
      }))
    } else {
      dispatch(formChangedAction({
        ...formChangedData,
        vendorInvoiceEntryDetailsAdd: true
      }))
    }
  }

  const ModalPreview = (encryptedInvoiceDetailCode) => {
    setModalShow(true);
    setParamsData({ encryptedInvoiceDetailCode });
  }

  const deleteVendorInvoiceDetail = () => {
    if (!paramsData)
      return false;

    var objectIndex = vendorInvoiceEntryDetailsReducer.vendorInvoiceEntryDetails.findIndex(x => x.encryptedInvoiceDetailCode == paramsData.encryptedInvoiceDetailCode);
    vendorInvoiceEntryDetailsReducer.vendorInvoiceEntryDetails.splice(objectIndex, 1);

    var deleteInvoiceDetailCode = localStorage.getItem("DeleteInvoiceDetailCodes");

    if (paramsData.encryptedInvoiceDetailCode) {
      var deleteInvoiceEntryDetails = deleteInvoiceDetailCode ? deleteInvoiceDetailCode + "," + paramsData.encryptedInvoiceDetailCode : paramsData.encryptedInvoiceDetailCode;
      localStorage.setItem("DeleteInvoiceDetailCodes", deleteInvoiceEntryDetails);
    }

    for (let i = 0; i < vendorInvoiceEntryDetails.length; i++) {
      let totalCGST = 0;
      let totalSGST = 0;
      for (let i = 0; i < vendorInvoiceEntryDetails.length; i++) {
        totalCGST += parseFloat(vendorInvoiceEntryDetails[i].cgstAmt);
        totalSGST += parseFloat(vendorInvoiceEntryDetails[i].sgstAmt);
      }

      let gstTotalAmt = totalCGST + (totalSGST ? totalSGST : 0)
      // let invoiceGrandAmt = (vendorInvoiceEntryHeaderDetails.invoiceAmount > 0 ? parseFloat(vendorInvoiceEntryHeaderDetails.invoiceAmount) : 0)
      dispatch(vendorInvoiceEntryHeaderDetailsAction({
        ...vendorInvoiceEntryHeaderDetails,
        gstTotalAmt: gstTotalAmt,
        // invoiceGrandAmt: invoiceGrandAmt
      }))
    }

    const totalInvoiceGrandAmount = vendorInvoiceEntryDetails.length > 1
    ? vendorInvoiceEntryDetails.reduce((acc, obj) => {
      const invoiceGrandAmount = obj.productGrandAmt !== "" ? parseFloat(obj.productGrandAmt) : 0;
      return acc + (isNaN(invoiceGrandAmount) ? 0 : invoiceGrandAmount);
    }, 0)
    : vendorInvoiceEntryDetails.length === 1
      ? parseFloat(vendorInvoiceEntryDetails[0].productGrandAmt)
      : 0;
    
      
      dispatch(vendorInvoiceEntryHeaderDetailsAction({
        ...vendorInvoiceEntryHeaderDetails,

        // gstTotalAmt: gstTotalAmt,
        invoiceAmount: isNaN(totalInvoiceGrandAmount) ? 0 : totalInvoiceGrandAmount,
        invoiceGrandAmt : isNaN(totalInvoiceGrandAmount) ? 0 : totalInvoiceGrandAmount
      }))


    toast.success("Vendor invoice entry detail deleted successfully", {
      theme: 'colored'
    });

    dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntryDetails))

    dispatch(formChangedAction({
      ...formChangedData,
      vendorInvoiceEntryDetailsDelete: true,
      vendorInvoiceEntryHeaderDetailUpdate : true,
    }));

    setModalShow(false);
  }

  return (
    <>
      {modalShow && paramsData &&
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
            <h4>Are you sure, you want to delete this Vendor Invoice Detail?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteVendorInvoiceDetail()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }
      {
        poModal &&
        <Modal
          show={poModal}
          onHide={() => setPoModal(false)}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">PO Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="max-five-rows">
            <Form className="details-form" id="OemDetailsForm" >
              <Row>
                {
                  purchaseOrderProductDetailsReducer && purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.length > 0 ?
                    <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                      <thead className='custom-bg-200'>
                        <tr>
                          <th>S.No</th>
                          <th>Select <Form.Check type="checkbox" id="vendorListChkbox" >
                            <Form.Check.Input
                              type="checkbox"
                              name="selectAll"
                              style={{ width: '15px', height: '15px' }}
                              onChange={handleHeaderCheckboxChange}
                              checked={selectAll}
                            />
                          </Form.Check>
                          </th>
                          <th>Product Category</th>
                          <th>Product</th>
                          <th>Variety</th>
                          <th>Brand</th>
                          <th>Unit</th>
                          <th>Quantity</th>
                          <th>Rate</th>
                          {/* <th>Tax Basis</th>
                          <th>Tax Rate</th>
                          <th>Tax Amount</th> */}
                          <th>CGST Per</th>
                          <th>CGST Amount</th>
                          <th>SGST Per</th>
                          <th>SGST Amount</th>
                          <th>Product Grand Amount</th>
                          <th>Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.map((data, index) =>
                            <tr>
                              <td>{index + 1}</td>
                              <td key={index}>
                                <Form.Check type="checkbox" className="mb-1">
                                  <Form.Check.Input
                                    type="checkbox"
                                    name="singleChkBox"
                                    style={{ width: '20px', height: '20px' }}
                                    onChange={() => handleCheckboxChange(data)}
                                    checked={selectAll || selectedRows.includes(data) || (vendorInvoiceEntryDetails.length > 0 && vendorInvoiceEntryDetails.some(entry => (entry.productCode).includes(data.productCode)))}
                                  />
                                </Form.Check>
                              </td>
                              <td>{data.productCategoryName}</td>
                              <td>{data.productName}</td>
                              <td>{data.varietyName}</td>
                              <td>{data.brandName}</td>
                              <td>{data.unitName}</td>
                              <td>{data.quantity}</td>
                              <td>{data.poRate}</td>
                              {/* <td>{data.taxBasis}</td>
                              <td>{data.taxRate}</td>
                              <td>{data.taxAmount}</td> */}
                              <td>{data.cgstPer}</td>
                              <td>{data.cgstAmt}</td>
                              <td>{data.sgstPer}</td>
                              <td>{data.sgstAmt}</td>
                              <td>{data.productGrandAmt}</td>
                              <td>{data.poAmt}</td>
                            </tr>
                          )
                        }
                      </tbody>
                    </Table>
                    :
                    <h5>No record found</h5>
                }
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => handleSelectedItem()}  >Add</Button>
            <Button variant="danger" onClick={() => onCancelClick()} >Cancel</Button>
          </Modal.Footer>
        </Modal >
      }

      <Card className="h-100 mb-2">
        <FalconCardHeader
          title="Vendor Invoice Entry Details"
          titleTag="h6"
          className="py-2"
          light
          endEl={
            <Flex>
              {
                (vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C') ? null
                  :
                  <div >
                    <Button
                      variant="primary"
                      size="sm"
                      className="btn-reveal"
                      type="button"
                      onClick={() => handleAddItem()}
                    >
                      Add Items
                    </Button>
                  </div>
              }
            </Flex>
          }
        />

        {
          vendorInvoiceEntryDetails && vendorInvoiceEntryDetails.length > 0 &&
          <Card.Body className="position-relative pb-0 p3px mr-table-card">
            <Form
              noValidate
              validated={formHasError || (vendorInvoiceEntryErr.vendorInvoiceEntryDetailErr && vendorInvoiceEntryErr.vendorInvoiceEntryDetailErr.invalidVendorInvoiceEntryDetail)}
              className="details-form"
              id="AddMaterialReceipteDetailsForm"
            >
              <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                <thead className='custom-bg-200'><tr>
                  {columnsArray.map((column, index) => {
                    if (!vendorInvoiceEntryHeaderDetails.poNo && (column == "Product Line")) {
                      return null;
                    }
                    if (!vendorInvoiceEntryHeaderDetails.poNo && (column == "Product Category")) {
                      return null;
                    }
                    if (!vendorInvoiceEntryHeaderDetails.poNo && (column == "PO. Qty")) {
                      return null;
                    }
                    if (!vendorInvoiceEntryHeaderDetails.poNo && (column == "PO. Rate")) {
                      return null;
                    }
                    if(vendorInvoiceEntryHeaderDetails.poNo && (column == "Rate")) {
                      return null;
                    }
                    if (column === 'Delete' && (vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')) {
                      return null;
                    }

                    return (
                      <th className="text-left" key={index}>
                        {column}
                      </th>
                    );
                  })}
                </tr>
                </thead>
                <tbody id="tbody" className="details-form">
                  {rowData.map((vendorInvoiceEntryDetails, index) => (
                    vendorInvoiceEntryHeaderDetails.poNo ?
                      <tr key={index}>
                        <td>
                          {index + 1}
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="productLine"
                            placeholder="Product Line"
                            value={vendorInvoiceEntryDetails.productLineName}
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="productCategoryName"
                            placeholder="Product Category"
                            value={vendorInvoiceEntryDetails.productCategoryName}
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="itemDescription"
                            placeholder="Product"
                            value={vendorInvoiceEntryDetails.itemDescription}
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="unitCode"
                            placeholder="Unit"
                            value={vendorInvoiceEntryDetails.unitName}
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="quantity"
                            placeholder="Po. Qty"
                            value={vendorInvoiceEntryDetails.quantity}
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="poRate"
                            placeholder="Po. Rate"
                            value={vendorInvoiceEntryDetails.poRate}
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="description"
                            placeholder="Description"
                            value={vendorInvoiceEntryDetails.description ? vendorInvoiceEntryDetails.description : ""}
                            onChange={(e) => handleFieldChange(e, index)}
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                            maxLength={250}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="invoiceQty"
                            placeholder="Qty"
                            maxLength={5}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.invoiceQty ? vendorInvoiceEntryDetails.invoiceQty : ""}
                            onKeyPress={handleNumericInputKeyPress}
                            required
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                          />
                        </td>
                        {/* <td key={index}>
                          <EnlargableTextbox
                            name="invoiceRate"
                            placeholder="Rate"
                            onChange={(e) => handleFieldChange(e, index)}
                            maxLength={5}
                            value={vendorInvoiceEntryDetails.invoiceRate ? vendorInvoiceEntryDetails.invoiceRate : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;

                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                          />
                        </td> */}
                        <td key={index}>
                          <EnlargableTextbox
                            name="productAmount"
                            placeholder="Product Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.productAmount ? vendorInvoiceEntryDetails.productAmount : ""}
                            onKeyPress={handleNumericInputKeyPress}
                            required
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="cgstPer"
                            placeholder="CGST %"
                            maxLength={5}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.cgstPer ? vendorInvoiceEntryDetails.cgstPer : ""}
                            onKeyPress={handlePercentageKeyPress}
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C') || vendorInvoiceEntryDetails.taxIncluded == true}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="cgstAmt"
                            placeholder="CGST Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.cgstAmt ? vendorInvoiceEntryDetails.cgstAmt : ""}
                            onKeyPress={handleNumericInputKeyPress}
                            required
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="sgstPer"
                            placeholder="SGST %"
                            maxLength={5}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.sgstPer ? vendorInvoiceEntryDetails.sgstPer : ""}
                            onKeyPress={handlePercentageKeyPress}
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode  && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C') || vendorInvoiceEntryDetails.taxIncluded == true}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="sgstAmt"
                            placeholder="SGST Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.sgstAmt ? vendorInvoiceEntryDetails.sgstAmt : ""}
                            onKeyPress={handleNumericInputKeyPress}
                            required
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="productGrandAmt"
                            placeholder="Product Grand Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.productGrandAmt ? vendorInvoiceEntryDetails.productGrandAmt : ""}
                            onKeyPress={handleNumericInputKeyPress}
                            required
                            disabled
                          />
                        </td>
                        {
                          (vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid")|| vendorInvoiceEntryHeaderDetails.vendorType == 'C') ?
                            null
                            :
                            <td key={index}>
                              <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(vendorInvoiceEntryDetails.encryptedInvoiceDetailCode) }} />
                            </td>
                        }
                      </tr>
                      :
                      <tr key={index}>
                        <td>
                          {index + 1}
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="itemDescription"
                            placeholder="Product Name"
                            value={vendorInvoiceEntryDetails.itemDescription}
                            onChange={(e) => handleFieldChange(e, index)}
                            required
                            disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid")}
                            maxLength={50}
                          />
                        </td>
                        <td>                  
                         <Form.Select
                          type="text"
                          name="unitCode"
                          className="form-control select"
                          onChange={(e) => handleFieldChange(e, index)}
                          value={vendorInvoiceEntryDetails.unitCode ? vendorInvoiceEntryDetails.unitCode : ""}
                          disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid")}
                          required
                        >
                          <option value=''>Select </option>
                          {unitList.map((option, index) => (
                            <option key={index} value={option.value}>{option.key}</option>
                          ))}
                        </Form.Select>
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="description"
                            placeholder="Description"
                            value={vendorInvoiceEntryDetails.description}
                            onChange={(e) => handleFieldChange(e, index)}
                            disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid")}
                            maxLength={250}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="invoiceQty"
                            placeholder="Qty"
                            maxLength={5}
                            value={vendorInvoiceEntryDetails.invoiceQty ? vendorInvoiceEntryDetails.invoiceQty : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => handleFieldChange(e, index)}
                            required
                            disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid")}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="invoiceRate"
                            placeholder="Rate"
                            maxLength={5}
                            value={vendorInvoiceEntryDetails.invoiceRate ? vendorInvoiceEntryDetails.invoiceRate : ""}
                            onKeyPress={handleNumericInputKeyPress}
                            onChange={(e) => handleFieldChange(e, index)}
                            required
                            disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid")}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="productAmount"
                            placeholder="Product Amount"
                            maxLength={13}
                            value={vendorInvoiceEntryDetails.productAmount ? vendorInvoiceEntryDetails.productAmount : ""}
                            onKeyPress={handleNumericInputKeyPress}
                            onChange={(e) => handleFieldChange(e, index)}
                            required
                            disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid")}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="cgstPer"
                            placeholder="CGST %"
                            maxLength={5}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.cgstPer ? vendorInvoiceEntryDetails.cgstPer : ""}
                            onKeyPress={handlePercentageKeyPress}
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="cgstAmt"
                            placeholder="CGST Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.cgstAmt ? vendorInvoiceEntryDetails.cgstAmt : ""}
                            onKeyPress={handleNumericInputKeyPress}
                            required
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="sgstPer"
                            placeholder="SGST %"
                            maxLength={5}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.sgstPer ? vendorInvoiceEntryDetails.sgstPer : ""}
                            onKeyPress={handlePercentageKeyPress}
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode  && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="sgstAmt"
                            placeholder="SGST Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.sgstAmt ? vendorInvoiceEntryDetails.sgstAmt : ""}
                            onKeyPress={handleNumericInputKeyPress}
                            required
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="productGrandAmt"
                            placeholder="Product Grand Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.productGrandAmt ? vendorInvoiceEntryDetails.productGrandAmt : ""}
                            onKeyPress={handleNumericInputKeyPress}
                            required
                            disabled
                          />
                        </td>
                        {
                          vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Partially Paid" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Fully Paid") ?
                            null
                            :
                            <td key={index}>
                              <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(vendorInvoiceEntryDetails.encryptedInvoiceDetailCode) }} />
                            </td>
                        }
                      </tr>
                  ))}
                </tbody>
              </Table>
            </Form>
          </Card.Body>}
      </Card>
    </>
  )
}

export default AddVendorInvoiceDetail