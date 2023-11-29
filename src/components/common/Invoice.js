import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import IconButton from 'components/common/IconButton';
import axios from 'axios';
import { useParams } from "react-router-dom";

const Invoice = () => {
    const { id } = useParams();
    const { poNo } = useParams();
    const [materialHeaderData, setMaterialHeaderData] = useState();
    const [tableData, setTableData] = useState([]);
    const [subTotal, setSubTotal] = useState();
    const [totalAmount, setTotalAmount] = useState();
    const [taxableValue, setTaxableValue] = useState();

    useEffect(() => {
        if (poNo) {
            getPurchaseOrderDetail();
            getPurchaseOrderDetailList();
        } else {
            getMaterialReceiptHeaderData();
            getMaterialReceiptDetailList();
        }

        setTimeout(() => {
            window.print();
        }, 1000);
    }, [])


    const getMaterialReceiptHeaderData = async () => {
        const request = {
            encryptedMaterialReceiptId: id
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-material-receipt-header', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            setMaterialHeaderData(response.data.data)
        }
        else {
            setMaterialHeaderData()
        }
    }

    const getMaterialReceiptDetailList = async () => {
        const request = {
            encryptedMaterialReceiptId: id
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-material-receipt-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                setTableData(response.data.data)

                const total = response.data.data.reduce((acc, item) => {
                    const subAmount = parseFloat(item.amount);
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

    const getPurchaseOrderDetail = async () => {
        const request = {
            encryptedPoNo: poNo
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-po-header-detail', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            setMaterialHeaderData(response.data.data)
        }
        else {
            setMaterialHeaderData()
        }
    }

    const getPurchaseOrderDetailList = async () => {
        const request = {
            encryptedPoNo: poNo
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-po-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                setTableData(response.data.data)

                const total = response.data.data.reduce((acc, item) => {
                    const subAmount = parseFloat(item.poAmt);
                    if (!isNaN(subAmount)) {
                        return acc + subAmount;
                    }
                    return acc;
                }, 0);

                const taxableAmount = response.data.data.reduce((acc, item) => {
                    const taxAmount = parseFloat(item.taxAmount);
                    if (!isNaN(taxAmount)) {
                        return acc + taxAmount;
                    }
                    return acc;
                }, 0)

                setSubTotal(total - taxableAmount);

                setTaxableValue(taxableAmount);

                setTotalAmount(total);

                setTotalAmount(response.data.data.reduce((acc, item) => acc + parseFloat(item.poAmt), 0));
            }
        } else {
            setTableData([])
        }
    }


    return (
        <>
            {
                materialHeaderData &&
                <>
                    <Card className="mb-3">
                        <Card.Body>
                            <Row className="justify-content-between align-items-center">
                                <Col md>
                                    <h5 className="mb-2 mb-md-0">#{materialHeaderData.poNo ? materialHeaderData.poNo : materialHeaderData.materialReceiptId}</h5>
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
                                    <h5>{materialHeaderData.companyName}</h5>
                                    <p className="fs--1 mb-0">
                                        {materialHeaderData.companyAddress}
                                    </p>
                                    {
                                        materialHeaderData.companyContactDetail &&
                                        <p className="fs--1 mb-0">Contact: {materialHeaderData.companyContactDetail}</p>
                                    }
                                </Col>

                                {
                                    materialHeaderData.materialReceiptId &&
                                    <Col sm="4" className="ms-auto">
                                        <div className="table-responsive">
                                            <Table borderless size="sm" className="fs--1 table">
                                                <tbody>
                                                    <tr>
                                                        <th className="text-sm-end">Material Receipt No: </th>
                                                        <td>{materialHeaderData.materialReceiptId}</td>
                                                    </tr>
                                                    {
                                                        materialHeaderData.challanNo &&
                                                        <tr>
                                                            <th className="text-sm-end">Challan No:</th>
                                                            <td>{materialHeaderData.challanNo}</td>
                                                        </tr>
                                                    }
                                                    <tr>
                                                        <th className="text-sm-end">Receipt Date:</th>
                                                        <td>{materialHeaderData.materialReceiptDate}</td>
                                                    </tr>

                                                    {
                                                        materialHeaderData.poAmt &&
                                                        <tr className="alert alert-success fw-bold">
                                                            <th className="text-sm-end">PO Amount:</th>
                                                            <td>{materialHeaderData.poAmt.toLocaleString('en-IN')} Rs.</td>
                                                        </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Col>
                                }

                                {
                                    materialHeaderData.poNo && (
                                        <>
                                            <Col sm="4" className="ms-auto">
                                                <div className="table-responsive">
                                                    <Table borderless size="sm" className="fs--1 table">
                                                        <tbody>
                                                            <tr>
                                                                <th className="text-sm-end">{materialHeaderData.farmerCode ? "Material Receipt No: " : "PO No: "}</th>
                                                                <td>{materialHeaderData.poNo}</td>
                                                            </tr>
                                                            {
                                                                materialHeaderData.challanNo &&
                                                                <tr>
                                                                    <th className="text-sm-end">Challan No:</th>
                                                                    <td>{materialHeaderData.challanNo}</td>
                                                                </tr>
                                                            }

                                                            <tr>
                                                                <th className="text-sm-end">{materialHeaderData.farmerCode ? "Purchase Date" : "PO Date:"}</th>
                                                                <td>{materialHeaderData.poDate}</td>
                                                            </tr>

                                                            {
                                                                materialHeaderData.poAmt &&
                                                                <tr className="alert alert-success fw-bold">
                                                                    <th className="text-sm-end">{materialHeaderData.farmerCode ? "Total Amount" : "PO Amount:"}</th>
                                                                    <td>{materialHeaderData.poAmt.toLocaleString('en-IN')} Rs.</td>
                                                                </tr>
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </Col>
                                        </>
                                    )
                                }

                                <Col xs={12}>
                                    <hr />
                                </Col>
                            </Row>
                            <Row className="align-items-center">
                                {
                                    materialHeaderData.farmerCode &&

                                    <Col>
                                        <h6 className="text-">Farmer Detail</h6>
                                        <h5>{materialHeaderData.farmerName}</h5>
                                        <p className="fs--1">
                                            {materialHeaderData.farmerAddress}
                                        </p>
                                        {
                                            materialHeaderData.farmerContactDetail &&
                                            <p className="fs--1">
                                                Contact No: <a href={`tel:${materialHeaderData.farmerContactDetail}`}>{materialHeaderData.farmerContactDetail}</a>
                                            </p>
                                        }
                                    </Col>
                                }

                                {
                                    materialHeaderData.vendorCode &&
                                    <Col>
                                        <h6 className="text-">Supplier / Vendor Name </h6>
                                        <h5>{materialHeaderData.vendorName}</h5>
                                        <p className="fs--1">
                                            {materialHeaderData.vendorAddress}
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
                                            <th className="border-0 text-start">HSN/Acct code</th>
                                            <th className="border-0 text-start">Qty.</th>
                                            <th className="border-0 text-start">Unit</th>
                                            <th className="border-0 text-start">Rate</th>
                                            <th className="border-0 text-start">Total</th>
                                            <th className="border-0 text-start">Discount</th>
                                            <th className="border-0 text-start">Taxable Value</th>
                                            <th className="border-0 text-start">CGST</th>
                                            <th className="border-0 text-start">SGST</th>
                                            <th className="border-0 text-start">IGST</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((item, index) =>
                                            <tr>
                                                <td className="align-middle text-start">{index + 1}</td>
                                                <td className="align-middle text-start">
                                                    <h6 className="mb-0 text-nowrap">
                                                        {item.productCategoryName}
                                                    </h6>
                                                    <p className="mb-0 text-start">{item.productName}</p>
                                                </td>
                                                <td className="align-middle text-start">{"{HSN}"}</td>
                                                <td className="align-middle text-start">{item.quantity ? item.quantity : item.receivedQuantity}</td>
                                                <td className="align-middle text-start">{item.unitName}</td>
                                                <td className="align-middle text-start">{item.poRate ? item.poRate : item.rate}</td>
                                                <td className="align-middle text-start">{item.poAmt ? item.poAmt : item.amount}</td>
                                                <td className="align-middle text-start">{"{Discount}"}</td>
                                                {
                                                    item.poNo ?
                                                        <td className="align-middle text-start">{item.taxAmount ? item.taxAmount : "0"}</td>
                                                        :
                                                        <td className="align-middle text-start">{"{Taxable Value}"}</td>
                                                }
                                                <td className="align-middle text-start">{"{CGST}"}</td>
                                                <td className="align-middle text-start">{"{SGST}"}</td>
                                                <td className="align-middle text-start">{"{IGST}"}</td>
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
                                                <td className="fw-semi-bold">{subTotal.toLocaleString('en-IN')} Rs.</td>
                                            </tr>
                                            <tr>
                                                <th className="text-900">Tax:</th>
                                                <td className="fw-semi-bold">{taxableValue ? taxableValue.toLocaleString('en-IN') : "0"} Rs.</td>
                                            </tr>
                                            <tr className="border-top">
                                                <th className="text-900">Total:</th>
                                                <td className="fw-semi-bold">{totalAmount.toLocaleString('en-IN')} Rs.</td>
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

export default Invoice