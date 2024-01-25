import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { paymentDetailsAction, paymentHeaderAction } from 'actions';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';

const PoDetailList = () => {
  const [productModal, setProductModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [invoiceDetailModal, setInvoiceDetailModal] = useState([]);

  const dispatch = useDispatch();

  const columnsArray = [
    "S.No",
    "Product Name",
    "Unit",
    "Quantity",
    "Rate",
    "Amount",
    "Paid Amount",
    "Balance Amount",
    "View"
  ];

  const paymentHeaderDetailsReducer = useSelector((state) => state.rootReducer.paymentHeaderReducer)
  var paymentHeaderDetails = paymentHeaderDetailsReducer.paymentHeaderDetail;

  const paymentDetailsReducer = useSelector((state) => state.rootReducer.paymentDetailReducer)
  var paymentDetails = paymentDetailsReducer.paymentDetails;

  useEffect(() => {
    if (paymentDetailsReducer.paymentDetails.length > 0) {
      setRowData(paymentDetails);
    } else {
      setRowData([]);
    }

    const invoicePaidAmount = paymentDetails.length > 1
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
      invoicePaidAmount: invoicePaidAmount,
      balanceAmount: balanceAmount
    }));

  }, [paymentDetails, paymentDetailsReducer])

  const handleViewItem = (encryptedInvoiceDetailCode) => {
    setProductModal(true);
    var paymentDetail = paymentDetails.find(data => data.encryptedInvoiceDetailCode == encryptedInvoiceDetailCode);
    setInvoiceDetailModal(paymentDetail)
  }

  const onCancelClick = () => {
    setProductModal(false);
  }

  const handleFieldChange = async (e, index) => {
    const { name, value } = e.target;
    var paymentDetailEntry = [...rowData];
    let balanceAmount = paymentDetailEntry[index].productAmount - value
    paymentDetailEntry[index] = {
      ...paymentDetailEntry[index],
      [name]: value,
      balanceAmount: balanceAmount,
    };
    dispatch(paymentDetailsAction(paymentDetailEntry));
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
              validated=""
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
                            value={paymentDetails.productName}
                            disabled
                          />
                        </td>
                        <td key="">
                          <EnlargableTextbox
                            name="unit"
                            placeholder="Unit"
                            maxLength={13}
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
                        <td key="">
                          <EnlargableTextbox
                            name="paidAmount"
                            placeholder="Paid Amount"
                            value={paymentDetails.paidAmount}
                            onChange={(e) => handleFieldChange(e, index)}
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
                            onClick={() => handleViewItem(paymentDetails.encryptedInvoiceDetailCode)}
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
                        1
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