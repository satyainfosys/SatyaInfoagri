import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Form } from 'react-bootstrap';
import IconButton from 'components/common/IconButton';
import { useDispatch } from 'react-redux';
import Moment from "moment";
import axios from 'axios';


const CropPurchaseReport = () => {

    let totalAmountSum = 0;
    const [cropPurchaseData, setCropPurchaseData] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [totalAmount, setTotalAmount] = useState(0);

    let companyCode = "";
    let fromDate = "";
    let toDate = "";

    useEffect(() => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);

        companyCode = url.searchParams.get('encryptedCompanyCode');
        fromDate = url.searchParams.get('startDate');
        toDate = url.searchParams.get('endDate');

        setStartDate(url.searchParams.get('startDate'));
        setEndDate(url.searchParams.get('endDate'));

        getCropPurchaseReport();
    }, [])

    const getCropPurchaseReport = async () => {
        const requestData = {
            encryptedCompanyCode: companyCode,
            startDate: Moment(fromDate).format("YYYY-MM-DD"),
            endDate: Moment(toDate).format("YYYY-MM-DD")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-crop-purchase-report', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                setCropPurchaseData(response.data.data);
                totalAmountSum = response.data.data.reduce((sum, item) => sum + item.totalAmount, 0);
                setTotalAmount(totalAmountSum);
            }
        }
        else {
            setCropPurchaseData([]);
            setTimeout(function () {
                $('#no-inventory-message').html('No data found!');
            }, 500)
        }
    }

    const cropPurchaseTableData = cropPurchaseData.map((item, index) => {
        return (
            <tr>
                <td className="align-middle text-start">{index + 1}</td>
                <td className="align-middle text-start">{item.collectionCentreName ? item.collectionCentreName : "-"}</td>
                <td className="align-middle text-start">{item.farmerName + "/" + item.farmerCode}</td>
                <td className="align-middle text-start">{item.materialReceiptNo}</td>
                <td className="align-middle text-start">{item.purchaseDate}</td>
                <td className="align-middle text-start">{item.totalAmount.toLocaleString('en-IN')} Rs</td>
            </tr>
        )
    });


    return (
        <>
            <Card className="mb-3">
                <Card.Body>
                    <Row className="justify-content-between align-items-center text-center">
                        <Form.Label><u><b>Daily Purchase Report</b></u></Form.Label>
                    </Row>
                    <Row className="justify-content-between align-items-center">
                        <Col className="me-2 ms-2">
                            <Form.Label><b>From Date: {startDate}</b></Form.Label>
                        </Col>
                        <Col className="me-2 ms-2">
                            <Form.Label><b>To Date: {endDate}</b></Form.Label>
                        </Col>
                        <Col className="me-2 ms-2">
                            <Form.Label><b>Total Amount: {totalAmount.toLocaleString('en-IN')} Rs</b></Form.Label>
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
            </Card >

            <Card className="mb-3">
                <Card.Body>
                    <Form>
                        <Col lg className="ms-auto">
                            <div className="table-responsive">
                                <Table borderless size="sm" className="fs--1 table">
                                    <thead className="light">
                                        <tr className="bg-primary text-white dark__bg-1000">
                                            <th className="border-0 text-start">S.No</th>
                                            <th className="border-0 text-start">Collection Centre Name</th>
                                            <th className="border-0 text-start">Farmer Name/Code</th>
                                            <th className="border-0 text-start">MR No</th>
                                            <th className="border-0 text-start">Date</th>
                                            <th className="border-0 text-start">Amount</th>
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