import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { paymentDetailsAction, paymentHeaderAction } from 'actions';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';

const PoDetailList = () => {
  const [productModal, setProductModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [invoiceDetailModal, setInvoiceDetailModal] = useState([]);
  const [unitList, setUnitList] = useState([])

  const dispatch = useDispatch();

  const columnsArray = [
    "S.No",
    "Product Name",
    "Unit",
    "Quantity",
    "Rate",
    "Amount",
    'CGST %',
    'CGST Amount',
    'SGST %',
    'SGST Amount',
    'Product Grand Amount',
    "Paid Amount",
    "Balance Amount",
    "View"
  ];

  const paymentHeaderDetailsReducer = useSelector((state) => state.rootReducer.paymentHeaderReducer)
  var paymentHeaderDetails = paymentHeaderDetailsReducer.paymentHeaderDetail;

  const paymentDetailsReducer = useSelector((state) => state.rootReducer.paymentDetailReducer)
  var paymentDetails = paymentDetailsReducer.paymentDetails;

  const paymentErrorReducer = useSelector((state) => state.rootReducer.paymentErrorReducer)
  const paymentErr = paymentErrorReducer.paymentError;

  useEffect(() => {
    if (paymentDetailsReducer.paymentDetails.length > 0) {
      setRowData(paymentDetails);
    } else {
      setRowData([]);
    }

    const invoicePaidAmount = paymentDetails.length >= 1
      ? paymentDetails.reduce((acc, obj) => {
        const paidAmount = obj.paidAmount !== "" ? parseFloat(obj.paidAmount) : 0;
        return acc + (isNaN(paidAmount) ? 0 : paidAmount);
      }, 0)
      : paymentDetails.length === 1
        ? parseFloat(paymentDetails[0].poAmt)
        : 0;

    let balanceAmount
    if (paymentHeaderDetails.invoiceAmount) {
      balanceAmount = paymentHeaderDetails.invoiceAmount - invoicePaidAmount
    }

    dispatch(paymentHeaderAction({
      ...paymentHeaderDetails,
      invoicePaidAmount: isNaN(invoicePaidAmount) ? 0 : invoicePaidAmount,
      balanceAmount: isNaN(balanceAmount) ? 0 : balanceAmount
    }));

    if (paymentDetails && paymentDetails.length > 0) {
      getUnitList()
    }

  }, [paymentDetails, paymentHeaderDetails.invoiceAmount])

  const handleViewItem = (encryptedInvoiceDetailCode, index) => {
    setProductModal(true);
    var paymentDetail = paymentDetails.find(data => data.encryptedInvoiceDetailCode == encryptedInvoiceDetailCode);
    setInvoiceDetailModal({...paymentDetail, index:index})
  }

  const onCancelClick = () => {
    setProductModal(false);
  }

  const handleFieldChange = async (e, index) => {
    const { name, value } = e.target;
    var paymentDetailEntry = [...rowData];
    let balanceAmount = paymentDetailEntry[index].productGrandAmt - value
    paymentDetailEntry[index] = {
      ...paymentDetailEntry[index],
      [name]: value,
      balanceAmount: balanceAmount,
      unitName: unitList.find(unit => unit.value === paymentDetailEntry[index].unitCode)?.key || '',
    };
    dispatch(paymentDetailsAction(paymentDetailEntry));

    if(e.target.name == "cgstPer"){ 
      if(paymentDetailEntry[index].productAmount || paymentDetailEntry[index].invoiceRate){
      var cgstAmt =  (parseFloat(paymentDetailEntry[index].productAmount)* parseFloat(e.target.value))/100
      paymentDetailEntry[index].cgstAmt = isNaN(cgstAmt) ? 0 : cgstAmt.toString(); 
      var productGrandAmt = (paymentDetailEntry[index].productAmount > 0 ? parseFloat(paymentDetailEntry[index].productAmount ):0) + (cgstAmt > 0 ? cgstAmt : 0) + ( paymentDetailEntry[index].sgstAmt ? parseFloat(paymentDetailEntry[index].sgstAmt): 0 )
      paymentDetailEntry[index].productGrandAmt = isNaN(productGrandAmt) ? 0 : productGrandAmt.toString(); 
      paymentDetailEntry[index].balanceAmount = parseFloat(paymentDetailEntry[index].productGrandAmt) - (paymentDetailEntry[index].paidAmount ? parseFloat(paymentDetailEntry[index].paidAmount) : 0)
      dispatch(paymentDetailsAction(paymentDetailEntry))

      let gstTotalAmt = 0
      if(paymentDetailEntry[index].paidAmount){
       gstTotalAmt = (paymentHeaderDetails.gstTotalAmt ? parseFloat(paymentHeaderDetails.gstTotalAmt) : 0) + cgstAmt + (paymentDetailEntry[index].sgstAmt ? parseFloat(paymentDetailEntry[index].sgstAmt) : 0)
      }

      const totalInvoiceAmount = paymentDetailEntry.length > 1
      ? paymentDetailEntry.reduce((acc, obj) => {
          const invoiceAmount = obj.productGrandAmt !== "" ? parseFloat(obj.productGrandAmt) : 0;
          return acc + (isNaN(invoiceAmount) ? 0 : invoiceAmount);
      }, 0)
      : paymentDetailEntry.length === 1
          ? parseFloat(paymentDetailEntry[0].productGrandAmt)
          : 0;
          dispatch(paymentHeaderAction({
            ...paymentHeaderDetails,
            invoiceAmount: isNaN(totalInvoiceAmount) ? 0 : totalInvoiceAmount,
            gstTotalAmt: isNaN(gstTotalAmt) ? 0 : gstTotalAmt > 0 ? gstTotalAmt : paymentHeaderDetails.gstTotalAmt
        }))
      }
    }

    if(e.target.name == "sgstPer"){
      if(paymentDetailEntry[index].productAmount || paymentDetailEntry[index].invoiceRate){
      var sgstAmt = (parseFloat(paymentDetailEntry[index].productAmount)  * parseFloat(e.target.value))/100
      paymentDetailEntry[index].sgstAmt = isNaN(sgstAmt) ? 0 : sgstAmt.toString(); 
      var calculatedProductGrandAmt = (paymentDetailEntry[index].productAmount > 0 ? parseFloat(paymentDetailEntry[index].productAmount) : 0) + (sgstAmt > 0 ? sgstAmt : 0) + ( paymentDetailEntry[index].cgstAmt ? parseFloat(paymentDetailEntry[index].cgstAmt): 0)
      paymentDetailEntry[index].productGrandAmt = isNaN(calculatedProductGrandAmt) ? 0 : calculatedProductGrandAmt.toString(); 
      paymentDetailEntry[index].balanceAmount = parseFloat(paymentDetailEntry[index].productGrandAmt) - (paymentDetailEntry[index].paidAmount ? parseFloat(paymentDetailEntry[index].paidAmount) : 0)
      dispatch(paymentDetailsAction(paymentDetailEntry))
      let gstTotalAmt = 0
      if(paymentDetailEntry[index].paidAmount){
       gstTotalAmt = (paymentHeaderDetails.gstTotalAmt ? parseFloat(paymentHeaderDetails.gstTotalAmt) : 0) + (paymentDetailEntry[index].sgstAmt ? parseFloat(paymentDetailEntry[index].sgstAmt) : 0) + sgstAmt
      }
 
      const totalInvoiceAmount = paymentDetailEntry.length > 1
      ? paymentDetailEntry.reduce((acc, obj) => {
          const invoiceAmount = obj.productGrandAmt !== "" ? parseFloat(obj.productGrandAmt) : 0;
          return acc + (isNaN(invoiceAmount) ? 0 : invoiceAmount);
      }, 0)
      : paymentDetailEntry.length === 1
          ? parseFloat(paymentDetailEntry[0].productGrandAmt)
          : 0;
          dispatch(paymentHeaderAction({
            ...paymentHeaderDetails,
            invoiceAmount: isNaN(totalInvoiceAmount) ? 0 : totalInvoiceAmount,
            gstTotalAmt: isNaN(gstTotalAmt) ? 0 : gstTotalAmt > 0 ? gstTotalAmt : paymentHeaderDetails.gstTotalAmt
        }))
      }
    }
   
    if (e.target.name == "paidAmount" && paymentDetailEntry[index].taxIncluded == false) {
      let gstTotalAmt = (paymentHeaderDetails.gstTotalAmt ? parseFloat(paymentHeaderDetails.gstTotalAmt) : 0) + (paymentDetailEntry[index].cgstAmt ? parseFloat(paymentDetailEntry[index].cgstAmt) : 0) + (paymentDetailEntry[index].sgstAmt ? parseFloat(paymentDetailEntry[index].sgstAmt) : 0)
      dispatch(paymentHeaderAction({
        ...paymentHeaderDetails,
        gstTotalAmt: isNaN(gstTotalAmt) ? 0 : gstTotalAmt
      }))
    }

    if(paymentDetailEntry[index].paidAmount){
      $('#btnSave').attr('disabled', false);
    }
    else{
      $("#btnSave").attr('disabled', true);
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

  return (
    <>
      {
        paymentDetails && paymentDetails.length > 0 &&
        <Card className="h-100 mb-2 mt-2">
          <FalconCardHeader
            title="Po Details"
            titleTag="h6"
            className="py-2"
            light
          />
          <Card.Body className="position-relative pb-0 p3px cp-table-card">
            <Form
              noValidate
              validated={(paymentErr.paidAmountErr && paymentErr.paidAmountErr.invalidPaidAmount)}
              className="details-form"
              id="AddCropPurchaseDetails"
            >
              {
                paymentDetails && paymentDetails.length > 0 &&
                <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                  <thead className='custom-bg-200'>
                    <tr>
                      {columnsArray.map((column, index) => {
                        if (column === 'Action') {
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
                    {rowData.map((paymentDetails, index) => (
                      <tr key="">
                        <td>
                          {index + 1}
                        </td>
                        <td key="">
                          <EnlargableTextbox
                            name="productName"
                            placeholder="Product Name"
                            value={paymentDetails.productName ? paymentDetails.productName : paymentDetails.itemDescription}
                            disabled
                          />
                        </td>
                        <td key="">
                          <EnlargableTextbox
                            name="unit"
                            placeholder="Unit"
                            maxLength={13}
                            value={paymentDetails.unitName}
                            required
                            disabled
                          />
                        </td>
                        <td key="">
                          <EnlargableTextbox
                            name="quantity"
                            placeholder="Quantity"
                            value={paymentDetails.invoiceQty}
                            disabled
                          />
                        </td>
                        <td key="">
                          <EnlargableTextbox
                            name="rate"
                            placeholder="Rate"
                            value={paymentDetails.invoiceRate}
                            disabled
                          />
                        </td>
                        <td key="">
                          <EnlargableTextbox
                            name="amount"
                            placeholder="Amount"
                            value={paymentDetails.productAmount}
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="cgstPer"
                            placeholder="CGST %"
                            maxLength={4}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={paymentDetails.cgstPer ? paymentDetails.cgstPer : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled={paymentDetails.taxIncluded == true || paymentDetails.status == "Fully Paid"}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="cgstAmt"
                            placeholder="CGST Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={paymentDetails.cgstAmt ? paymentDetails.cgstAmt : ""}
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
                            value={paymentDetails.sgstPer ? paymentDetails.sgstPer : ""}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;
                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            disabled={paymentDetails.taxIncluded == true || paymentDetails.status == "Fully Paid"}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="sgstAmt"
                            placeholder="SGST Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={paymentDetails.sgstAmt ? paymentDetails.sgstAmt : ""}
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
                            name="productGrandAmt"
                            placeholder="Product Grand Amount"
                            maxLength={13}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={paymentDetails.productGrandAmt ? paymentDetails.productGrandAmt : ""}
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
                        <td key="">
                          <EnlargableTextbox
                            name="paidAmount"
                            placeholder="Paid Amount"
                            value={paymentDetails.paidAmount}
                            onChange={(e) => handleFieldChange(e, index)}
                            disabled={paymentDetails.status == "Fully Paid"}
                          />
                        </td>
                        <td key="">
                          <EnlargableTextbox
                            name="balanceAmount"
                            placeholder="Balance Amount"
                            value={paymentDetails.balanceAmount}
                            disabled
                          />
                        </td>
                        <td key="">
                          <Button
                            variant="primary"
                            size="sm"
                            className="btn-reveal"
                            type="button"
                            onClick={() => handleViewItem(paymentDetails.encryptedInvoiceDetailCode, index + 1)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              }
            </Form>
          </Card.Body>
        </Card>
      }
      {
        productModal &&
        <Modal
          show={productModal}
          onHide={() => setProductModal(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Invoice Detail</Modal.Title>
          </Modal.Header>
          <Modal.Body className="max-five-rows">
            <Form
              noValidate
              className="details-form"
            >
              <Row>
                <Table
                  style={{ paddingLeft: 0 }}
                  striped bordered responsive className="text-nowrap tab-page-table">
                  <thead className='custom-bg-200'>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        Sr. No
                      </td>
                      <td>
                      {invoiceDetailModal.index}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Invoice No
                      </td>
                      <td>
                        {paymentHeaderDetails.invoiceNo}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Po No
                      </td>
                      <td>
                        {paymentHeaderDetails.poNo}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Quantity
                      </td>
                      <td>
                        {invoiceDetailModal.invoiceQty}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Unit
                      </td>
                      <td>
                        km
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Amount
                      </td>
                      <td>
                        {invoiceDetailModal.productAmount}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Paid Amount
                      </td>
                      <td>
                        {invoiceDetailModal.paidAmount}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Balance Amount
                      </td>
                      <td>
                        {invoiceDetailModal.balanceAmount}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => onCancelClick()} >Cancel</Button>
          </Modal.Footer>
        </Modal >
      }
    </>
  )
}

export default PoDetailList