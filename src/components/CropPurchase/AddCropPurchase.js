import React, { useState, useEffect } from 'react';
import { Col, Form, Row, Button, Modal, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Moment from "moment";
import axios from 'axios';
import { materialReceiptHeaderDetailsAction } from 'actions';

export const AddCropPurchase = () => {

    const dispatch = useDispatch();
    const [farmerModal, setFarmerModal] = useState(false);
    const [farmerDetailsList, setFarmerDetailsList] = useState([]);
    let oldMaterialStatus = localStorage.getItem("OldMaterialStatus");

    const resetMaterialReceiptHeaderDetails = () => {
        dispatch(materialReceiptHeaderDetailsAction({
            "encryptedMaterialReceiptId": "",
            "materialReceiptId": "",
            "farmerName": "",
            "farmerFatherName": "",
            "farmerPhoneNumber": "",
            "vendorCode": "",
            "address": "",
            "pinCode": "",
            "state": "",
            "country": "",
            "poNo": "",
            "poDate": "",
            "poStatus": "",
            "deliveryLocation": "",
            "challanNo": "",
            "materialReceiptDate": Moment().format('YYYY-MM-DD'),
            "gstNo": "",
            "panNo": "",
            "tinNo": "",
            "personName": "",
            "materialStatus": "Draft"
        }))
    }

    const materialReceiptHeaderReducer = useSelector((state) => state.rootReducer.materialReceiptHeaderReducer)
    var materialReceiptHeaderData = materialReceiptHeaderReducer.materialReceiptHeaderDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const vendorMasterDetailsListReducer = useSelector((state) => state.rootReducer.vendorMasterDetailsListReducer)
    var vendorList = vendorMasterDetailsListReducer.vendorMasterListDetails;

    if (!materialReceiptHeaderReducer.materialReceiptHeaderDetails ||
        Object.keys(materialReceiptHeaderReducer.materialReceiptHeaderDetails).length <= 0) {
        resetMaterialReceiptHeaderDetails();
    }

    const onSelectFarmerClick = async () => {
        setFarmerModal(true);
        getFarmerDetailsList();
    }

    const getFarmerDetailsList = async (searchText) => {
        const requestData = {
            pageNumber: 1,
            pageSize: 10,
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
            searchText: searchText
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

    const handleSearchChange = (e) => {
        getFarmerDetailsList(e.target.value)
    }

    const handleFieldChange = e => {

        if (e.target.name == "vendorCode" && e.target.value) {
            const vendorDetail = vendorList.find(vendor => vendor.vendorCode == e.target.value);
            dispatch(materialReceiptHeaderDetailsAction({
                ...materialReceiptHeaderData,
                vendorCode: e.target.value,
                address: vendorDetail.vendorAddress,
                pinCode: vendorDetail.vendorPincode,
                state: vendorDetail.stateName,
                country: vendorDetail.countryName,
                gstNo: vendorDetail.vendorGstNo,
                panNo: vendorDetail.vendorPanNo,
                tinNo: vendorDetail.vendorTinNo,
                vendorName: vendorDetail.vendorName
            }))
        }
        else if (e.target.name == "vendorCode" && !e.target.value) {
            dispatch(materialReceiptHeaderDetailsAction({
                ...materialReceiptHeaderData,
                vendorCode: e.target.value,
                address: '',
                pinCode: '',
                state: '',
                country: '',
                gstNo: '',
                panNo: '',
                tinNo: '',
                vendorName: ''
            }))
        }
        else {
            dispatch(materialReceiptHeaderDetailsAction({
                ...materialReceiptHeaderData,
                [e.target.name]: e.target.value
            }))
        }

        // if (materialReceiptHeaderData.encryptedMaterialReceiptId) {
        //     dispatch(formChangedAction({
        //         ...formChangedData,
        //         materialReceiptHeaderDetailUpdate: true
        //     }))
        // } else {
        //     dispatch(formChangedAction({
        //         ...formChangedData,
        //         materialReceiptHeaderDetailAdd: true
        //     }))
        // }

        // if (e.target.name == "materialStatus") {
        //     if (materialReceiptHeaderData.encryptedMaterialReceiptId && (oldMaterialStatus != "Approved" && e.target.value == "Approved")) {
        //         dispatch(formChangedAction({
        //             ...formChangedData,
        //             materialReceiptDetailUpdate: true,
        //             materialReceiptHeaderDetailUpdate: true
        //         }))
        //     }
        // }
    }

    const onFarmerSelect = (farmerCode) => {
        const farmerDetail = farmerDetailsList.find(farmer => farmer.farmerCode == farmerCode);
        dispatch(materialReceiptHeaderDetailsAction({
            ...materialReceiptHeaderData,
            farmerCode: farmerDetail.farmerCode,
            farmerName: farmerDetail.farmerName,
            farmerFatherName: farmerDetail.farmerFatherName,
            farmerPhoneNumber: farmerDetail.farmerPhoneNumber
        }))
        setFarmerModal(false);
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
                                            <Form.Control id="txtSearch" name="search" placeholder="Search" onChange={handleSearchChange} maxLength={45} />
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
                                                            <td>{data.farmerPhoneNumber ? data.farmerPhoneNumber : "-"}</td>
                                                            <td>{data.farmerFatherName}</td>
                                                            <td><Button variant="success" onClick={() => onFarmerSelect(data.farmerCode)} >Select</Button></td>
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
                                <Form.Control id="txtFarmerName" name="farmerName" placeholder="Farmer Name" value={materialReceiptHeaderData.farmerName} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Farmer Father Name
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtAddress" name="farmerFatherName" placeholder="Father Name" value={materialReceiptHeaderData.farmerFatherName} disabled />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Phone Number
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtMaterialReceiptNo" name="farmerPhoneNumber" placeholder="Phone Number" value={materialReceiptHeaderData.farmerPhoneNumber} disabled />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col md="4">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Vendor Name
                            </Form.Label>
                            {
                                materialReceiptHeaderData.encryptedMaterialReceiptId ?
                                    <Col sm="8">
                                        <Form.Control id="txtVendorName" name="vendorCode" placeholder="Vendor Name" value={materialReceiptHeaderData.vendorName} disabled />
                                    </Col>
                                    :
                                    <Col sm="8">
                                        <Form.Select id="txtVendorName" name="vendorCode" value={materialReceiptHeaderData.vendorCode} onChange={handleFieldChange} >
                                            <option value=''>Select Vendor</option>
                                            {vendorList.map((vendor) => (
                                                <option key={vendor.vendorName} value={vendor.vendorCode}>
                                                    {vendor.vendorName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                            }
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

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="4">
                                Challan No
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtChallanNo" name="challanNo" placeholder="Challan No" value={materialReceiptHeaderData.challanNo} onChange={handleFieldChange} />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col md="4">
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Delivery Date
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control type='date' id="txtMaterialReceiptDate" name="materialReceiptDate"
                                    value={materialReceiptHeaderData.materialReceiptDate ?
                                        Moment(materialReceiptHeaderData.materialReceiptDate).format("YYYY-MM-DD") : Moment().format('YYYY-MM-DD')}
                                    onChange={handleFieldChange}
                                />
                            </Col>
                        </Form.Group>

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

                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Person Name
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control id="txtPersonName" name="personName" placeholder="Person Name" value={materialReceiptHeaderData.personName} onChange={handleFieldChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Material Status
                            </Form.Label>
                            <Col sm="8">
                                <Form.Select id="txtMaterialStatus" name="materialStatus" value={materialReceiptHeaderData.materialStatus} onChange={handleFieldChange} >
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