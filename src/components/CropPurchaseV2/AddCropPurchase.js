import React, { useState, useEffect } from 'react';
import { Col, Form, Row, Button, Modal, Table, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Moment from "moment";
import axios from 'axios';
import IconButton from 'components/common/IconButton';
import FalconComponentCard from 'components/common/FalconComponentCard';

const AddCropPurchase = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [farmerModal, setFarmerModal] = useState(false);
    const [farmerDetailsList, setFarmerDetailsList] = useState([]);
    const [collectionCentreList, setCollectionCentreList] = useState([]);

    let oldMaterialStatus = localStorage.getItem("OldMaterialStatus");

    const distributionCentreListReducer = useSelector((state) => state.rootReducer.distributionCentreListReducer)
    const distributionList = distributionCentreListReducer.distributionCentreList

    useEffect(() => {
        // if (purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved") {
        //     $("#btnSave").attr('disabled', true);
        // }
    }, [])

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

    // const onFarmerSelect = (farmerCode) => {
    //     const farmerDetail = farmerDetailsList.find(farmer => farmer.farmerCode == farmerCode);
    //     dispatch(materialReceiptHeaderDetailsAction({
    //         ...materialReceiptHeaderData,
    //         farmerCode: farmerDetail.farmerCode,
    //         farmerName: farmerDetail.farmerName,
    //         farmerFatherName: farmerDetail.farmerFatherName,
    //         farmerPhoneNumber: farmerDetail.farmerPhoneNumber
    //     }))
    //     setFarmerModal(false);

    //     if (materialReceiptHeaderData.encryptedMaterialReceiptId) {
    //         dispatch(formChangedAction({
    //             ...formChangedData,
    //             materialReceiptHeaderDetailUpdate: true
    //         }))
    //     } else {
    //         dispatch(formChangedAction({
    //             ...formChangedData,
    //             materialReceiptHeaderDetailAdd: true
    //         }))
    //     }
    // }

    const getCollectionCentre = async (distributionCentreCode) => {
        const requestData = {
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
            DistributionCode: distributionCentreCode
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-collection-centre-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        let collectionCentreData = [];
        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(collectionCentre => {
                    collectionCentreData.push({
                        key: collectionCentre.collectionCentreName,
                        value: collectionCentre.collectionCentreCode
                    })
                })
            }
            setCollectionCentreList(collectionCentreData);
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
                                            {/* <Form.Control id="txtSearch" name="search" placeholder="Search" onChange={handleSearchChange} maxLength={45} /> */}
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
                                                            <td>{data.farmerPhoneNumber ? data.farmerPhoneNumber : "-"}</td>
                                                            <td>{data.farmerFatherName}</td>
                                                            {/* <td><Button variant="success" onClick={() => onFarmerSelect(data.farmerCode)} >Select</Button></td> */}
                                                            <td><Button variant="success" >Select</Button></td>
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
                            {/* {materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved" ?
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
                            } */}
                            <IconButton
                                variant="falcon-success"
                                size="sm"
                                icon="plus"
                                className="me-2 mb-2 mb-sm-1"
                                onClick={() => onSelectFarmerClick()}
                            >
                                {/* {materialReceiptHeaderData.farmerCode ? "Change Farmer" : "Select Farmer"} */}
                                Select Farmer
                            </IconButton>
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
                                        PO Number
                                    </Form.Label>
                                    <Col sm="8">
                                        {/* <Form.Control id="txtPONumber" name="poNo" placeholder="PO Number" value={purchaseOrderData.poNo} disabled /> */}
                                        <Form.Control id="txtPONumber" name="poNo" placeholder="PO Number" disabled />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        PO Amount
                                    </Form.Label>
                                    <Col sm="8">
                                        {/* <Form.Control id="txtPOAmount" name="poAmount" placeholder="PO Amount" onChange={handleFieldChange} value={purchaseOrderData.poAmount} maxLength={15} disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"} /> */}
                                        <Form.Control id="txtPOAmount" name="poAmount" placeholder="PO Amount" maxLength={15} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Farmer Name
                                    </Form.Label>
                                    <Col sm="8">
                                        {/* <Form.Control id="txtFarmerName" name="farmerName" placeholder="Farmer Name" value={materialReceiptHeaderData.farmerName} disabled /> */}
                                        <Form.Control id="txtFarmerName" name="farmerName" placeholder="Farmer Name" disabled />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Farmer Father Name
                                    </Form.Label>
                                    <Col sm="8">
                                        {/* <Form.Control id="txtAddress" name="farmerFatherName" placeholder="Father Name" value={materialReceiptHeaderData.farmerFatherName} disabled /> */}
                                        <Form.Control id="txtAddress" name="farmerFatherName" placeholder="Father Name" disabled />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Phone Number
                                    </Form.Label>
                                    <Col sm="8">
                                        {/* <Form.Control id="txtMaterialReceiptNo" name="farmerPhoneNumber" placeholder="Phone Number" value={materialReceiptHeaderData.farmerPhoneNumber} disabled /> */}
                                        <Form.Control id="txtMaterialReceiptNo" name="farmerPhoneNumber" placeholder="Phone Number" disabled />
                                    </Col>
                                </Form.Group>
                            </Col>

                            <Col className="me-3 ms-3" md="4">
                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        PO Date
                                    </Form.Label>
                                    <Col sm="8">
                                        {/* <Form.Control type='date' id="txtPODate" name="poDate" value={Moment(purchaseOrderData.poDate).format("YYYY-MM-DD")} onChange={handleFieldChange} disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"} />
                                        {Object.keys(purchaseOrderErr.poDateErr).map((key) => {
                                            return <span className="error-message">{purchaseOrderErr.poDateErr[key]}</span>
                                        })} */}
                                        <Form.Control type='date' id="txtPODate" name="poDate" />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        PO Status
                                    </Form.Label>
                                    <Col sm="8">
                                        {/* <Form.Select id="txtStatus" name="poStatus" onChange={handleFieldChange} value={purchaseOrderData.poStatus} > */}
                                        <Form.Select id="txtStatus" name="poStatus" >
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
                                        {/* <Form.Control id="txtDeliverLocation" name="deliveryLocation" placeholder="Delivery Location" onChange={handleFieldChange} value={purchaseOrderData.deliveryLocation} disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"} /> */}
                                        <Form.Control id="txtDeliverLocation" name="deliveryLocation" placeholder="Delivery Location" />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        DC Name
                                    </Form.Label>
                                    <Col sm="8">
                                        {/* <Form.Select id="txtDistributionCentre" name="distributionCentreCode" onChange={handleFieldChange} value={purchaseOrderData.distributionCentreCode} disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"} > */}
                                        <Form.Select id="txtDistributionCentre" name="distributionCentreCode" >
                                            <option value=''>Select Distribution</option>
                                            {distributionList &&
                                                distributionList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm={4}>
                                        Collection Centre
                                    </Form.Label>
                                    <Col sm={8}>
                                        {/* <Form.Select id="txtCollectionCentre" name="collectionCentreCode" onChange={handleFieldChange} value={purchaseOrderData.collectionCentreCode} disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}> */}
                                        <Form.Select id="txtCollectionCentre" name="collectionCentreCode">
                                            <option value=''>Select Collection Centre</option>
                                            {collectionCentreList &&
                                                collectionCentreList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))
                                            }
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

export default AddCropPurchase