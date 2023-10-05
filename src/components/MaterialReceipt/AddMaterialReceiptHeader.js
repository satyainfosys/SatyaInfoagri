import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Moment from "moment";
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';

const AddMaterialReceiptHeader = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [vendorList, setVendorList] = useState([]);
    const [vendorMasterList, setVendorMasterList] = useState([]);


    const materialReceiptHeaderReducer = useSelector((state) => state.rootReducer.materialReceiptHeaderReducer)
    var materialReceiptHeaderData = materialReceiptHeaderReducer.materialReceiptHeaderDetails;

    const handleVendorClick = async () => {
        getVendorMasterList();
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

    return (
        <>
            <Form>
                <Row>
                    <Col className="me-3 ms-3" md="4">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Material Receipt No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtMaterialReceiptNo" name="materialReceiptId" placeholder="Material Receipt No" value={materialReceiptHeaderData.materialReceiptId} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Vendor Name
                            </Form.Label>
                            {/* {
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
                            } */}
                            <Col sm="8">
                                <Form.Select id="txtVendorName" name="vendorCode" value={materialReceiptHeaderData.vendorCode} onClick={() => handleVendorClick()} >
                                    <option value=''>Select Vendor</option>
                                    {vendorList.map((option, index) => (
                                        <option key={index} value={option.value}>{option.key}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Address
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtAddress" name="address" placeholder="Address" value={materialReceiptHeaderData.address} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Pincode
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPincode" name="pinCode" placeholder="Pincode" value={materialReceiptHeaderData.pinCode} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                State
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtState" name="state" placeholder="State" value={materialReceiptHeaderData.state} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Country
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtCountry" name="country" placeholder="Country" value={materialReceiptHeaderData.country} disabled />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col className="me-3 ms-3" md="4">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                PO Number
                            </Form.Label>
                            <Col sm="8">
                                <Form.Select id="txtPoNumber" name="poNo" value={materialReceiptHeaderData.poNo} >
                                    <option value=''>Select PO</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                PO Date
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control type='date' id="txtPODate" name="poDate" value={Moment(materialReceiptHeaderData.poDate).format("YYYY-MM-DD")} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                PO Status
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPOStatus" name="poStatus" placeholder="PO Status" value={materialReceiptHeaderData.poStatus} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Delivery Location
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtDeliveryLocation" name="deliveryLocation" placeholder="Delivery Location" value={materialReceiptHeaderData.deliveryLocation} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Challan No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtChallanNo" name="challanNo" placeholder="Challan No" value={materialReceiptHeaderData.challanNo} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Delivery Date
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control type='date' id="txtMaterialReceiptDate" name="materialReceiptDate" value={Moment(materialReceiptHeaderData.materialReceiptDate).format("YYYY-MM-DD")} />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col className="me-3 ms-3" md="3">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Gst No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtGstNo" name="gstNo" placeholder="GST No" value={materialReceiptHeaderData.gstNo} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Pan No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPanNo" name="panNo" placeholder="PAN No" value={materialReceiptHeaderData.panNo} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Tin No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtTinNo" name="tinNo" placeholder="TIN No" value={materialReceiptHeaderData.tinNo} disabled />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default AddMaterialReceiptHeader