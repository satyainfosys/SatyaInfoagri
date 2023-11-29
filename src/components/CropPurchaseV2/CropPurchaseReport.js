import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Form } from 'react-bootstrap';
import IconButton from 'components/common/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import Moment from "moment";
import axios from 'axios';


const CropPurchaseReport = () => {

    const dispatch = useDispatch();
    let totalAmountSum = 0;
    const [cropPurchaseData, setCropPurchaseData] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [totalAmount, setTotalAmount] = useState(0);

    let companyCode = "";
    let fromDate = "";
    let toDate = "";


    const cropPurchaseReportReducer = useSelector((state) => state.rootReducer.cropPurchaseReportReducer)
    var cropPurchaseReportData = cropPurchaseReportReducer.cropPurchaseReportList;

    useEffect(() => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);

        companyCode = url.searchParams.get('encryptedCompanyCode');
        fromDate = url.searchParams.get('startDate');
        toDate = url.searchParams.get('endDate');

        setStartDate(url.searchParams.get('startDate'));
        setEndDate(url.searchParams.get('endDate'));

        // getCropPurchaseReport();
    }, [])

    // const getCropPurchaseReport = async () => {
    //     debugger
    //     const requestData = {
    //         encryptedCompanyCode: companyCode,
    //         startDate: Moment(startDate).format("YYYY-MM-DD"),
    //         endDate: Moment(endDate).format("YYYY-MM-DD")
    //     }

    //     let response = await axios.post(process.env.REACT_APP_API_URL + '/get-crop-purchase-report', requestData, {
    //         headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    //     })

    //     if (response.data.status == 200) {
    //         if (response.data && response.data.data.length > 0) {
    //             console.log(response.data.data)
    //             setCropPurchaseData(response.data.data);
    //             totalAmountSum = response.data.data.reduce((sum, item) => sum + item.totalAmount, 0);
    //             setTotalAmount(totalAmountSum);
    //         }
    //     }
    //     else {
    //         setCropPurchaseData([]);
    //         setTimeout(function () {
    //             $('#no-inventory-message').html('No data found!');
    //         }, 500)
    //     }
    // }

    const cropPurchaseTableData = cropPurchaseData.map((item, index) => {
        return (
            <tr>
                <td className="align-middle text-start">{item.collectionCentreName ? item.collectionCentreName : "-"}</td>
                <td className="align-middle text-start">{item.farmerName + "/" + item.farmerCode}</td>
                <td className="align-middle text-start">{item.materialReceiptNo}</td>
                <td className="align-middle text-start">{item.purchaseDate}</td>
                <td className="align-middle text-start">{item.totalAmount}</td>
            </tr>
        )
    });


    return (
        <>
            <Card className="mb-3">
                <Card.Body>
                    <Row className="justify-content-between align-items-center">
                        <Col sm={6} lg={4}>
                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="2">
                                    From Date
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control id="txtStartDate" name="startDate" placeholder="From Date" value={startDate} readOnly />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col sm={6} lg={4}>
                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="2">
                                    To Date
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control id="txtEndDate" name="endDate" placeholder="To Date" value={endDate} readOnly />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col sm={6} lg={4}>
                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="2">
                                    Total Amount
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control id="txtTotalAmount" name="totalAmount" placeholder="Total Amount" value={totalAmount} readOnly />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="mb-3">
                <Card.Body>
                    <Form>
                        <Col lg className="ms-auto">
                            <div className="table-responsive">
                                <Table borderless size="sm" className="fs--1 table">
                                    <thead className="light">
                                        <tr className="bg-primary text-white dark__bg-1000">
                                            <th className="border-0 text-start">Collection Centre Name</th>
                                            <th className="border-0 text-start">Farmer Name/Code</th>
                                            <th className="border-0 text-start">Material Receipt No</th>
                                            <th className="border-0 text-start">Purchase Date</th>
                                            <th className="border-0 text-start">Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            cropPurchaseTableData && cropPurchaseTableData.length > 0 ?
                                                cropPurchaseTableData
                                                :
                                                <h4 id="no-inventory-message"></h4>
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

export default CropPurchaseReport