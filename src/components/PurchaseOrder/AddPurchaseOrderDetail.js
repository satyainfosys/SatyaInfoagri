import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import $ from "jquery";
import { useDispatch, useSelector } from 'react-redux';
import { formChangedAction, purchaseOrderDetailsAction } from 'actions';
import axios from 'axios';
import Moment from "moment";

const AddPurchaseOrderDetail = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [vendorList, setVendorList] = useState([]);
    const [vendorMasterList, setVendorMasterList] = useState([]);

    const resetPurchaseOrderDetailsData = () => {
        dispatch(purchaseOrderDetailsAction({
            "encryptedPoNo": "",
            "poNo": "",
            "poDate": "",
            "poAmount": "",
            "poStatus": "Draft",
            "vendorCode": "",
            "poAddress": "",
            "poPincode": "",
            "state": "",
            "country": "",
            "gstNo": "",
            "panNo": "",
            "tinNo": ""
        }))
    }

    const purchaseOrderDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsReducer)
    var purchaseOrderData = purchaseOrderDetailsReducer.purchaseOrderDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const purchaseOrderDetailsErrorReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsErrorReducer)
    const purchaseOrderErr = purchaseOrderDetailsErrorReducer.purchaseOrderDetailsError;

    useEffect(() => {
        // getVendorMasterList();
    }, [])

    if (!purchaseOrderDetailsReducer.purchaseOrderDetails ||
        Object.keys(purchaseOrderDetailsReducer.purchaseOrderDetails).length <= 0) {
        resetPurchaseOrderDetailsData();
    }

    const handleVendorClict = async () => {
        if (!vendorList || vendorList.length <= 0) {
            getVendorMasterList();
        }
    }

    const getVendorMasterList = async () => {
        let vendorData = [];

        const requestData = {
            pageNumber: 1,
            pageSize: 1,
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-master-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                setVendorMasterList(response.data.data);
                response.data.data.forEach(vendor => {
                    vendorData.push({
                        key: vendor.vendorName,
                        value: vendor.vendorCode
                    });
                });
            }
            setVendorList(vendorData);
        } else {
            setVendorList([]);
        }
    }

    const handleFieldChange = e => {
        if (e.target.name == "vendorCode") {
            const vendorDetail = vendorMasterList.find(vendor => vendor.vendorCode == e.target.value);
            dispatch(purchaseOrderDetailsAction({
                ...purchaseOrderData,
                vendorCode: e.target.value,
                poAddress: vendorDetail.vendorAddress,
                poPincode: vendorDetail.vendorPincode,
                state: vendorDetail.stateName,
                country: vendorDetail.countryName,
                gstNo: vendorDetail.vendorGstNo,
                panNo: vendorDetail.vendorPanNo,
                tinNo: vendorDetail.vendorTinNo
            }))
        } else {
            dispatch(purchaseOrderDetailsAction({
                ...purchaseOrderData,
                [e.target.name]: e.target.value
            }))
        }

        if (purchaseOrderData.encryptedPoNo) {
            dispatch(formChangedAction({
                ...formChangedData,
                purchaseOrderDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                purchaseOrderDetailAdd: true
            }))
        }
    }

    return (
        <>
            <Form>
                <Row>
                    <Col className="me-3 ms-3" md="4">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Vendor Name
                            </Form.Label>
                            {
                                purchaseOrderData.encryptedPoNo ?
                                    <Col sm="8">
                                        <Form.Control id="txtVendorName" name="vendorCode" placeholder="Vendor Name" value={purchaseOrderData.vendorName} disabled />
                                    </Col>
                                    :
                                    <Col sm="8">
                                        <Form.Select id="txtVendorName" name="vendorCode" onClick={() => handleVendorClict()} onChange={handleFieldChange} value={purchaseOrderData.vendorCode} >
                                            <option value=''>Select Vendor</option>
                                            {vendorList.map((option, index) => (
                                                <option key={index} value={option.value}>{option.key}</option>
                                            ))}
                                        </Form.Select>
                                        {Object.keys(purchaseOrderErr.vendorErr).map((key) => {
                                            return <span className="error-message">{purchaseOrderErr.vendorErr[key]}</span>
                                        })}
                                    </Col>
                            }

                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Address
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtAddress" name="poAddress" placeholder="Address" value={purchaseOrderData.poAddress} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Pincode
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPOPincode" name="poPincode" placeholder="Pincode" value={purchaseOrderData.poPincode} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                State
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtState" name="state" placeholder="State" value={purchaseOrderData.state} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Country
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtCountry" name="country" placeholder="Country" value={purchaseOrderData.country} disabled />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col className="me-3 ms-3" md="4">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                PO Number
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPONumber" name="poNo" placeholder="PO Number" value={purchaseOrderData.poNo} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                PO Date
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control type='date' id="txtPODate" name="poDate" value={Moment(purchaseOrderData.poDate).format("YYYY-MM-DD")} onChange={handleFieldChange} />
                                {Object.keys(purchaseOrderErr.poDateErr).map((key) => {
                                    return <span className="error-message">{purchaseOrderErr.poDateErr[key]}</span>
                                })}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                PO Amount
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPOAmount" name="poAmount" placeholder="PO Amount" onChange={handleFieldChange} value={purchaseOrderData.poAmount} maxLength={15} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                PO Status
                            </Form.Label>
                            <Col sm="8">
                                <Form.Select id="txtStatus" name="poStatus" onChange={handleFieldChange} value={purchaseOrderData.poStatus} >
                                    <option value="Draft">Draft</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Hold">Hold</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Delivery Location
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtDeliverLocation" name="deliveryLocation" placeholder="Delivery Location" />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col className="me-3 ms-3" md="3">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Gst No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtGstNo" name="gstNo" placeholder="GST No" value={purchaseOrderData.gstNo} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Pan No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPanNo" name="panNo" placeholder="PAN No" value={purchaseOrderData.panNo} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Tin No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtTinNo" name="tinNo" placeholder="TIN No" value={purchaseOrderData.tinNo} disabled />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default AddPurchaseOrderDetail