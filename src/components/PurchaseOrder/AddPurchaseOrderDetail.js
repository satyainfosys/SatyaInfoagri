import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import $ from "jquery";

const AddPurchaseOrderDetail = () => {

    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <Form>
                <Row>
                    <Col className="me-3 ms-3" md="3">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Vendor Name
                            </Form.Label>
                            <Col sm="8">
                                <Form.Select id="txtVendorName" name="vendorName"  >
                                    <option value=''>Select Vendor</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Address
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtAddress" name="poAddress" placeholder="Address" disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Pincode
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPOPincode" name="poPincode" placeholder="Pincode" disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                State
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtState" name="state" placeholder="State" disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Country
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtCountry" name="country" placeholder="Country" disabled />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col className="me-3 ms-3" md="4">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                PO Number
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPONumber" name="poNumber" placeholder="PO Number" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                PO Date
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control type='date' id="txtPODate" name="poDate" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                PO Amount
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPOAmount" name="poAmount" placeholder="PO Amount" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                PO Status
                            </Form.Label>
                            <Col sm="8">
                                <Form.Select id="txtStatus" name="poStatus" >
                                    <option value="Draft">Draft</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Hold">Hold</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
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
                                <Form.Control id="txtGstNo" name="gstNo" placeholder="GST No" disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Pan No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPanNo" name="panNo" placeholder="PAN No" disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Tin No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtTinNo" name="tinNo" placeholder="TIN No" disabled />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default AddPurchaseOrderDetail