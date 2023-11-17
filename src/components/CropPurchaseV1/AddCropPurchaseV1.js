import React, { useState, useEffect } from 'react';
import { Col, Form, Row, Button, Modal, Table, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Moment from "moment";
import axios from 'axios';
import { formChangedAction, materialReceiptHeaderDetailsAction } from 'actions';
import IconButton from 'components/common/IconButton';
import FalconComponentCard from 'components/common/FalconComponentCard';

export const AddCropPurchaseV1 = () => {

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

        dispatch(materialReceiptHeaderDetailsAction({
            ...materialReceiptHeaderData,
            [e.target.name]: e.target.value
        }))

        if (materialReceiptHeaderData.encryptedMaterialReceiptId) {
            dispatch(formChangedAction({
                ...formChangedData,
                materialReceiptHeaderDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                materialReceiptHeaderDetailAdd: true
            }))
        }

        if (e.target.name == "materialStatus") {
            if (materialReceiptHeaderData.encryptedMaterialReceiptId && (oldMaterialStatus != "Approved" && e.target.value == "Approved")) {
                dispatch(formChangedAction({
                    ...formChangedData,
                    materialReceiptDetailUpdate: true,
                    materialReceiptHeaderDetailUpdate: true
                }))
            }
        }
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
        
        if (materialReceiptHeaderData.encryptedMaterialReceiptId) {
            dispatch(formChangedAction({
                ...formChangedData,
                materialReceiptHeaderDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                materialReceiptHeaderDetailAdd: true
            }))
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

            <Card className="mb-1">
                <Card.Body>
                    <Row className="justify-content-between align-items-center">
                        <Col sm={6} lg={4} className='no-pd-card'>
                            <h5 className="mb-2 mb-md-0">{localStorage.getItem("CompanyName")}</h5>
                        </Col>
                        <Col xs="auto">
                            {materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved" ?
                                <IconButton
                                    variant="falcon-default"
                                    size="sm"
                                    icon="print"
                                    iconClassName="me-1"
                                    className="me-1 mb-2 mb-sm-1"
                                    onClick={() => {
                                        const url = `/crop-purchase-receipt/${materialReceiptHeaderData.encryptedMaterialReceiptId}`;
                                        window.open(url, '_blank');
                                    }}
                                >
                                    Print
                                </IconButton>
                                :
                                <IconButton
                                    variant="falcon-success"
                                    size="sm"
                                    icon="plus"
                                    className="me-2 mb-2 mb-sm-1"
                                    onClick={() => onSelectFarmerClick()}
                                >
                                    {materialReceiptHeaderData.farmerCode ? "Change Farmer" : "Select Farmer"}
                                </IconButton>
                            }
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <FalconComponentCard className="no-pb mb-1">
                <FalconComponentCard.Body language="jsx">
                    <Form>
                        <Row>
                            <Col className="me-3 ms-3" md="7">
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

                            <Col className="me-3 ms-3" md="4">
                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Receipt No
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control id="txtChallanNo" name="challanNo" placeholder="Receipt No" value={materialReceiptHeaderData.challanNo} onChange={handleFieldChange} disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Purchase Date
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type='date' id="txtMaterialReceiptDate" name="materialReceiptDate"
                                            value={materialReceiptHeaderData.materialReceiptDate ?
                                                Moment(materialReceiptHeaderData.materialReceiptDate).format("YYYY-MM-DD") : Moment().format('YYYY-MM-DD')}
                                            onChange={handleFieldChange}
                                            disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Receiver Name
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control id="txtPersonName" name="personName" placeholder="Person Name" value={localStorage.getItem("Name")} disabled />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Purchase Status
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Select id="txtMaterialStatus" name="materialStatus" value={materialReceiptHeaderData.materialStatus} onChange={handleFieldChange} disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"} >
                                            <option value="Draft">Draft</option>
                                            <option value="Approved">Approved</option>
                                        </Form.Select>
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </FalconComponentCard.Body>
            </FalconComponentCard>
        </>
    )
}

export default AddCropPurchaseV1;