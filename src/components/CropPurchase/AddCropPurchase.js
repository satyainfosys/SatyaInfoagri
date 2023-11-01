import React, { useState, useEffect } from 'react';
import { Col, Form, Row, Button, Modal, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

export const AddCropPurchase = () => {

    const dispatch = useDispatch();
    const [farmerModal, setFarmerModal] = useState(false);
    const [farmerDetailsList, setFarmerDetailsList] = useState([]);

    const onSelectFarmerClick = async () => {
        setFarmerModal(true);
        getFarmerDetailsList();
    }

    const getFarmerDetailsList = async () => {
        const requestData = {
            pageNumber: 1,
            pageSize: 10,
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/farmer-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });

        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                setFarmerDetailsList(response.data.data)
            }
        }
        else {
            setFarmerDetailsList([]);
        }
    }

    return (
        <>
            {
                farmerModal &&
                <Modal
                    show={farmerModal}
                    onHide={() => setFarmerModal(false)}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Farmers</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="max-five-rows">
                        <Form className="details-form" id="FarmerDetails" >
                            <Row>
                                <Col className="me-3 ms-3" md="4">
                                    <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                        <Form.Label column sm="2">
                                            Search
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control id="txtSearch" name="search" placeholder="Search" maxLength={45} />
                                        </Col>
                                    </Form.Group>
                                </Col>

                                {
                                    farmerDetailsList && farmerDetailsList.length > 0 ?
                                        <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                            <thead className='custom-bg-200'>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Phone Number</th>
                                                    <th>Father Name</th>
                                                    <th>Select</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    farmerDetailsList.map((data, index) =>
                                                        <tr>
                                                            <td>{data.farmerName}</td>
                                                            <td>{data.mobile ? data.mobile : "-"}</td>
                                                            <td>{data.farmerFatherName}</td>
                                                            <td><Button variant="success" onClick={() => setFarmerModal(false)} >Select</Button></td>
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
                </Modal>
            }
            <Form>
                <Row>
                    <Col md="4">
                        <Button variant="success" onClick={() => onSelectFarmerClick()} >Select Farmer</Button>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Material Receipt No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtMaterialReceiptNo" name="materialReceiptId" placeholder="Material Receipt No" disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Farmer Name
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtFarmerName" name="farmerName" placeholder="Farmer Name" disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Farmer Father Name
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtAddress" name="address" placeholder="Address" disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Phone Number
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtMaterialReceiptNo" name="materialReceiptId" placeholder="Material Receipt No" disabled />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col md="4">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Vendor Name
                            </Form.Label>
                            <Col sm="8">
                                <Form.Select id="txtVendorName" name="vendorCode" >
                                    <option value=''>Select Vendor</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Address
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtAddress" name="address" placeholder="Address" disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Pincode
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPincode" name="pinCode" placeholder="Pincode" disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                State
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtState" name="state" placeholder="State" disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Country
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtCountry" name="country" placeholder="Country" disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Challan No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtChallanNo" name="challanNo" placeholder="Challan No" />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col md="4">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Delivery Date
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control type='date' id="txtMaterialReceiptDate" name="materialReceiptDate" />
                            </Col>
                        </Form.Group>

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

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Person Name
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPersonName" name="personName" placeholder="Person Name" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Material Status
                            </Form.Label>
                            <Col sm="8">
                                <Form.Select id="txtMaterialStatus" name="materialStatus" >
                                    <option value="Draft">Draft</option>
                                    <option value="Approved">Approved</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default AddCropPurchase;