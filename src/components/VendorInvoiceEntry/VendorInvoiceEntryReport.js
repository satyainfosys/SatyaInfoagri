import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Form } from 'react-bootstrap';
import IconButton from 'components/common/IconButton';
import axios from 'axios';
import { useParams } from "react-router-dom";

const VendorInvoiceEntryReport = () => {
  const { invoiceHeaderCode } = useParams();
  const [vendorInvoiceEntryHeaderData, setVendorInvoiceEntryHeaderData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [subTotal, setSubTotal] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [taxableValue, setTaxableValue] = useState();

  useEffect(() => {
    if (invoiceHeaderCode) {
      getVendorInvoiceHeaderData();
      getVendorInvoiceDetailList();
    }

    setTimeout(() => {
      window.print();
    }, 1000);
  }, [])


  const getVendorInvoiceHeaderData = async () => {
    const request = {
      encryptedInvoiceHeaderCode: invoiceHeaderCode
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-invoice-entry-header', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })

    if (response.data.status == 200) {
      setVendorInvoiceEntryHeaderData(response.data.data)
    }
    else {
      setVendorInvoiceEntryHeaderData()
    }
  }

  const getVendorInvoiceDetailList = async () => {
    const request = {
      encryptedInvoiceHeaderCode: invoiceHeaderCode
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-invoice-entry-detail-list', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })

    if (response.data.status == 200) {
      if (response.data.data && response.data.data.length > 0) {
        setTableData(response.data.data)

        const total = response.data.data.reduce((acc, item) => {
          const subAmount = parseFloat(item.productAmount);
          if (!isNaN(subAmount)) {
            return acc + subAmount;
          }
          return acc;
        }, 0);

        setSubTotal(total);

        setTotalAmount(total);
      }
    } else {
      setTableData([])
    }
  }

  return (
    <>
      {
        vendorInvoiceEntryHeaderData &&
        <>
          <Card className="mb-3">
            <Card.Body>
              <Row className="justify-content-between align-items-center">
                <Col md>
                  <h5 className="mb-2 mb-md-0">#{vendorInvoiceEntryHeaderData.invoiceNo}</h5>
                </Col>
                <Col xs={6}>
                  <Form.Label><h4><u><b>Vendor Invoice Entry Report</b></u></h4></Form.Label>
                </Col>
                <Col xs="auto">
                  <IconButton
                    variant="falcon-default"
                    size="sm"
                    icon="print"
                    iconClassName="me-1"
                    className="me-1 mb-2 mb-sm-0 hide-on-print"
                    onClick={() => window.print()}
                  >
                    Print
                  </IconButton>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Row className="align-items-center text-center mb-3">
                <Col sm={6} className="text-sm-start">
                  <h6 className="mb-3">From</h6>
                  <h5>{vendorInvoiceEntryHeaderData.companyName}</h5>
                  <p className="fs--1 mb-0">
                    {vendorInvoiceEntryHeaderData.companyAddress}
                  </p>
                </Col>

                {
                  vendorInvoiceEntryHeaderData.invoiceHeaderCode &&
                  <Col sm="4" className="ms-auto">
                    <div className="table-responsive">
                      <Table borderless size="sm" className="fs--1 table">
                        <tbody>
                          <tr>
                            <th className="text-sm-end">Invoice No: </th>
                            <td>{vendorInvoiceEntryHeaderData.invoiceNo}</td>
                          </tr>
                          <tr>
                            <th className="text-sm-end">Invoice Date:</th>
                            <td>{vendorInvoiceEntryHeaderData.invoiceDate}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                }
                <Col xs={12}>
                  <hr />
                </Col>
              </Row>
              <Row className="align-items-center">
                {
                  vendorInvoiceEntryHeaderData.vendorCode &&
                  <Col>
                    <h6 className="text-">Supplier / Vendor Name </h6>
                    <h5>{vendorInvoiceEntryHeaderData.vendorName}</h5>
                    <p className="fs--1">
                      {vendorInvoiceEntryHeaderData.vendorAddress}
                    </p>
                  </Col>
                }
              </Row>

              <div className="mt-4">
                <Table striped responsive className="border-bottom" size='sm'>
                  <thead className="light">
                    <tr className="bg-primary text-white dark__bg-1000">
                      <th className="border-0 text-start">S.No</th>
                      <th className="border-0 text-start">Description</th>
                      <th className="border-0 text-start">Qty.</th>
                      <th className="border-0 text-start">Rate</th>
                      <th className="border-0 text-start">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) =>
                      <tr>
                        <td className="align-middle text-start">{index + 1}</td>
                        {
                          item.productCategoryCode && item.productCode ?
                            <td className="align-middle text-start">
                              <h6 className="mb-0 text-nowrap">
                                {item.productCategoryName}
                              </h6>
                              <p className="mb-0 text-start">{item.productName}</p>
                            </td>
                            :
                            <td className="align-middle text-start">
                              <h6 className="mb-0 text-nowrap">
                                {item.itemDescription}
                              </h6>
                            </td>
                        }
                        <td className="align-middle text-start">{item.invoiceQty}</td>
                        <td className="align-middle text-start">{parseFloat(item.invoiceRate).toLocaleString('en-IN')}</td>
                        <td className="align-middle text-start">{parseFloat(item.productAmount).toLocaleString('en-IN')}</td>

                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              <Row className="justify-content-end">
                <Col xs="auto">
                  <Table borderless size="sm" className="fs--1 text-end">
                    <tbody>
                      <tr>
                        <th className="text-900">Sub Total:</th>
                        <td className="fw-semi-bold">{subTotal && subTotal.toLocaleString('en-IN')} Rs.</td>
                      </tr>
                      <tr>
                        <th className="text-900">Tax:</th>
                        <td className="fw-semi-bold">{taxableValue ? taxableValue.toLocaleString('en-IN') : "0"} Rs.</td>
                      </tr>
                      <tr className="border-top">
                        <th className="text-900">Total:</th>
                        <td className="fw-semi-bold">{totalAmount && totalAmount.toLocaleString('en-IN')} Rs.</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      }
    </>
  )
}

export default VendorInvoiceEntryReport