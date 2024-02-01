import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import axios from 'axios';
import { toast } from 'react-toastify';
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
          if (!row.productLineCode || !row.productCategoryCode || !row.productCode || !row.invoiceQty || !row.invoiceRate || !row.productAmount || !row.itemDescription) {
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
      const newRows = purchaseOrderProductDetailsList.filter(row => !vendorInvoiceEntryDetails.some(existingRow => existingRow.productCode === row.productCode));

      if (newRows.length > 0) {
        updatedData = [...vendorInvoiceEntryDetails, ...newRows];
      } else {
        updatedData = vendorInvoiceEntryDetails;
      }
      dispatch(vendorInvoiceEntryDetailsAction(updatedData));
    } else {
      const uniqueRows = selectedRows.filter(row => !vendorInvoiceEntryDetails.some(existingRow => existingRow.productCode === row.productCode));
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
        dispatch(purchaseOrderProductDetailsAction(response.data.data))
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
      if (vendorInvoiceEntry[index].invoiceRate) {
        var totalAmount = parseFloat(e.target.value) * parseFloat(vendorInvoiceEntry[index].invoiceRate)
        vendorInvoiceEntry[index].productAmount = isNaN(totalAmount) ? 0 : totalAmount.toString();
        dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry))
      }
    }

    if (e.target.name == "invoiceRate") {
      if (vendorInvoiceEntry[index].invoiceQty) {
        var amount = parseFloat(e.target.value) * parseFloat(vendorInvoiceEntry[index].invoiceQty);
        vendorInvoiceEntry[index].productAmount = isNaN(amount) ? 0 : amount.toString();
        dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry))
      }
      else if (parseFloat(vendorInvoiceEntry[index].productAmount) > 0) {
        var calculatedQuantity = parseFloat(vendorInvoiceEntry[index].productAmount) / parseFloat(e.target.value);
        vendorInvoiceEntry[index].invoiceQty = isNaN(calculatedQuantity) ? 0 : calculatedQuantity.toString();
        dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry))
      }
    }

    if (e.target.name == "productAmount") {
      if (vendorInvoiceEntry[index].invoiceRate) {
        var totalQuantity = parseFloat(e.target.value) / parseFloat(vendorInvoiceEntry[index].invoiceRate)
        vendorInvoiceEntry[index].invoiceQty = isNaN(totalQuantity) ? 0 : totalQuantity.toString();
        dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry))
      }
    }

    if(e.target.name == "cgstPer"){
      if(vendorInvoiceEntry[index].poRate || vendorInvoiceEntry[index].invoiceRate){
      var cgstAmount = (((vendorInvoiceEntry[index].poRate ? parseFloat(vendorInvoiceEntry[index].poRate) : parseFloat(vendorInvoiceEntry[index].invoiceRate)) * parseFloat(e.target.value))/100)
      vendorInvoiceEntry[index].cgstAmount = isNaN(cgstAmount) ? 0 : cgstAmount.toString(); 
      var productGrandAmount = (vendorInvoiceEntry[index].poRate ? parseFloat(vendorInvoiceEntry[index].poRate) : parseFloat(vendorInvoiceEntry[index].invoiceRate)) + cgstAmount + ( vendorInvoiceEntry[index].sgstAmount ? parseFloat(vendorInvoiceEntry[index].sgstAmount): 0)
      vendorInvoiceEntry[index].productGrandAmount = isNaN(productGrandAmount) ? 0 : productGrandAmount.toString(); 
        let totalCGST = 0;
        let totalSGST = 0;
        for (let i = 0; i < vendorInvoiceEntry.length; i++) {
          totalCGST += parseFloat(vendorInvoiceEntry[i].cgstAmount);
          totalSGST += parseFloat(vendorInvoiceEntry[i].sgstAmount);
        }
      let invoiceGrandAmount = totalCGST + (totalSGST ? totalSGST : 0) + parseFloat(vendorInvoiceEntryHeaderDetails.invoiceAmount)
      dispatch(vendorInvoiceEntryHeaderDetailsAction({
        ...vendorInvoiceEntryHeaderDetails,
        invoiceGrandAmount : invoiceGrandAmount
      })) 
      dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry))
      }
    }

    if(e.target.name == "sgstPer"){
      if(vendorInvoiceEntry[index].poRate || vendorInvoiceEntry[index].invoiceRate){
      var sgstAmount = (((vendorInvoiceEntry[index].poRate ? parseFloat(vendorInvoiceEntry[index].poRate) : parseFloat(vendorInvoiceEntry[index].invoiceRate)) * parseFloat(e.target.value))/100)
      vendorInvoiceEntry[index].sgstAmount = isNaN(sgstAmount) ? 0 : sgstAmount.toString(); 
      var calculatedProductGrandAmount = (vendorInvoiceEntry[index].poRate ? parseFloat(vendorInvoiceEntry[index].poRate) : parseFloat(vendorInvoiceEntry[index].invoiceRate)) + sgstAmount + ( vendorInvoiceEntry[index].cgstAmount ? parseFloat(vendorInvoiceEntry[index].cgstAmount): 0)
      vendorInvoiceEntry[index].productGrandAmount = isNaN(calculatedProductGrandAmount) ? 0 : calculatedProductGrandAmount.toString(); 
      let totalCGST = 0;
      let totalSGST = 0;
      for (let i = 0; i < vendorInvoiceEntry.length; i++) {
        totalCGST += parseFloat(vendorInvoiceEntry[i].cgstAmount);
        totalSGST += parseFloat(vendorInvoiceEntry[i].sgstAmount);
      }
    let invoiceGrandAmount = (totalCGST ? totalCGST : 0) + totalSGST + parseFloat(vendorInvoiceEntryHeaderDetails.invoiceAmount)
    dispatch(vendorInvoiceEntryHeaderDetailsAction({
      ...vendorInvoiceEntryHeaderDetails,
      invoiceGrandAmount: invoiceGrandAmount
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

    toast.success("Vendor invoice entry detail deleted successfully", {
      theme: 'colored'
    });

    dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntryDetails))

    dispatch(formChangedAction({
      ...formChangedData,
      vendorInvoiceEntryDetailsDelete: true
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
                          <th>Tax Basis</th>
                          <th>Tax Rate</th>
                          <th>Tax Amount</th>
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
                              <td>{data.taxBasis}</td>
                              <td>{data.taxRate}</td>
                              <td>{data.taxAmount}</td>
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
                (vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C') ? null
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
                    if (column === 'Delete' && (vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')) {
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
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
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
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                          />
                        </td>
                        <td key={index}>
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
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="productAmount"
                            placeholder="Product Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.productAmount ? vendorInvoiceEntryDetails.productAmount : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="cgstPer"
                            placeholder="CGST %"
                            maxLength={4}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.cgstPer ? vendorInvoiceEntryDetails.cgstPer : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="cgstAmount"
                            placeholder="CGST Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.cgstAmount ? vendorInvoiceEntryDetails.cgstAmount : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="sgstPer"
                            placeholder="SGST %"
                            maxLength={4}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.sgstPer ? vendorInvoiceEntryDetails.sgstPer : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="sgstAmount"
                            placeholder="SGST Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.sgstAmount ? vendorInvoiceEntryDetails.sgstAmount : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="productGrandAmount"
                            placeholder="Product Grand Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.productGrandAmount ? vendorInvoiceEntryDetails.productGrandAmount : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled
                          />
                        </td>
                        {
                          (vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid")|| vendorInvoiceEntryHeaderDetails.vendorType == 'C') ?
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
                            disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid")}
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
                          disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid")}
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
                            disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid")}
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
                            disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid")}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="invoiceRate"
                            placeholder="Rate"
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
                            onChange={(e) => handleFieldChange(e, index)}
                            required
                            disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid")}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="productAmount"
                            placeholder="Product Amount"
                            maxLength={13}
                            value={vendorInvoiceEntryDetails.productAmount ? vendorInvoiceEntryDetails.productAmount : ""}
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
                            disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid")}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="cgstPer"
                            placeholder="CGST %"
                            maxLength={4}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.cgstPer ? vendorInvoiceEntryDetails.cgstPer : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="cgstAmount"
                            placeholder="CGST Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.cgstAmount ? vendorInvoiceEntryDetails.cgstAmount : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="sgstPer"
                            placeholder="SGST %"
                            maxLength={4}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.sgstPer ? vendorInvoiceEntryDetails.sgstPer : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled={(vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid") || vendorInvoiceEntryHeaderDetails.vendorType == 'C')}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="sgstAmount"
                            placeholder="SGST Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.sgstAmount ? vendorInvoiceEntryDetails.sgstAmount : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="productGrandAmount"
                            placeholder="Product Grand Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.productGrandAmount ? vendorInvoiceEntryDetails.productGrandAmount : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled
                          />
                        </td>
                        {
                          vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (vendorInvoiceEntryHeaderDetails.invoiceStatus == "Approved" || vendorInvoiceEntryHeaderDetails.invoiceStatus == "Paid") ?
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