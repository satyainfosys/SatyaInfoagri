import React, { useState, useEffect } from 'react';
import { Col, Form, Row, Button, Modal, Table, Card, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Moment from "moment";
import axios from 'axios';
import IconButton from 'components/common/IconButton';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { formChangedAction, purchaseOrderDetailsAction } from 'actions';
import { toast } from 'react-toastify';

const AddCropPurchase = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [farmerModal, setFarmerModal] = useState(false);
    const [farmerDetailsList, setFarmerDetailsList] = useState([]);
    const [collectionCentreList, setCollectionCentreList] = useState([]);
    let oldPoStatus = localStorage.getItem("OldPoStatus");

    const resetPurchaseOrderDetailsData = () => {
        dispatch(purchaseOrderDetailsAction({
            "encryptedPoNo": "",
            "poNo": "",
            "poDate": "",
            "poAmount": "",
            "poStatus": "Draft",
            "distributionCentreCode": "",
            "collectionCentreCode": "",
            "farmerCode": "",
            "farmerName": "",
            "farmerFatherName": "",
            "farmerPhoneNumber": "",
            "farmerVillage": "",
            "cardNo": ""
        }))
    }

    const distributionCentreListReducer = useSelector((state) => state.rootReducer.distributionCentreListReducer)
    const distributionList = distributionCentreListReducer.distributionCentreList

    const purchaseOrderDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsReducer)
    var purchaseOrderData = purchaseOrderDetailsReducer.purchaseOrderDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const purchaseOrderDetailsErrorReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsErrorReducer)
    const purchaseOrderErr = purchaseOrderDetailsErrorReducer.purchaseOrderDetailsError;

    useEffect(() => {
        if (purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved") {
            $("#btnSave").attr('disabled', true);
        }
    }, [])

    if (!purchaseOrderDetailsReducer.purchaseOrderDetails ||
        Object.keys(purchaseOrderDetailsReducer.purchaseOrderDetails).length <= 0) {
        resetPurchaseOrderDetailsData();
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

    const onFarmerSelect = (farmerCode) => {

        const farmerDetail = farmerDetailsList.find(farmer => farmer.farmerCode == farmerCode);
        dispatch(purchaseOrderDetailsAction({
            ...purchaseOrderData,
            farmerCode: farmerDetail.farmerCode,
            farmerName: farmerDetail.farmerName,
            farmerFatherName: farmerDetail.farmerFatherName,
            farmerPhoneNumber: farmerDetail.farmerPhoneNumber,
            farmerVillage: farmerDetail.village + ", " + farmerDetail.districtName + ", " + farmerDetail.stateName,
            cardNo: farmerDetail.cardNo
        }))
        setFarmerModal(false);

        if (purchaseOrderData.encryptedPoNo) {
            dispatch(formChangedAction({
                ...formChangedData,
                cropPurchaseDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                cropPurchaseDetailAdd: true
            }))
        }
    }

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

    const getFarmerDetail = async (card) => {
        const requestData = {
            CardNo: card,
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-farmer-detail', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            dispatch(purchaseOrderDetailsAction({
                ...purchaseOrderData,
                farmerCode: response.data.data.farmerCode,
                farmerName: response.data.data.farmerName,
                farmerFatherName: response.data.data.farmerFatherName,
                farmerPhoneNumber: response.data.data.farmerPhoneNumber,
                farmerVillage: response.data.data.village + ", " + response.data.data.districtName + ", " + response.data.data.stateName,
                cardNo: response.data.data.cardNo
            }))
        }
        else {
            if (response.data.status == 205) {
                toast.error("Provided card number is inactive", {
                    theme: 'colored'
                });
            } else {
                toast.error(response.data.message, {
                    theme: 'colored'
                });
            }

            dispatch(purchaseOrderDetailsAction({
                ...purchaseOrderData,
                farmerCode: "",
                farmerName: "",
                farmerFatherName: "",
                farmerPhoneNumber: "",
                farmerVillage: ""
            }))
        }
    }

    useEffect(() => {
        if (purchaseOrderData.cardNo && purchaseOrderData.cardNo.length === 10) {
            getFarmerDetail(purchaseOrderData.cardNo);
        }
        else if (!purchaseOrderData.encryptedPoNo) {
            dispatch(purchaseOrderDetailsAction({
                ...purchaseOrderData,
                farmerCode: "",
                farmerName: "",
                farmerFatherName: "",
                farmerPhoneNumber: "",
                farmerVillage: ""
            }))
        }
    }, [purchaseOrderData.cardNo]);

    const handleFieldChange = e => {
        if (e.target.name == "distributionCentreCode") {
            dispatch(purchaseOrderDetailsAction({
                ...purchaseOrderData,
                distributionCentreCode: e.target.value,
                collectionCentreCode: null
            }))
            setCollectionCentreList([]);
            e.target.value && getCollectionCentre(e.target.value)
        }        
        else {
            dispatch(purchaseOrderDetailsAction({
                ...purchaseOrderData,
                [e.target.name]: e.target.value
            }))
        }

        if (purchaseOrderData.encryptedPoNo) {
            dispatch(formChangedAction({
                ...formChangedData,
                cropPurchaseDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                cropPurchaseDetailAdd: true
            }))
        }

        if (e.target.name == "poStatus") {
            if (purchaseOrderData.encryptedPoNo && (oldPoStatus === "Approved" && e.target.value === "Approved")) {
                $("#btnSave").attr('disabled', true);
                dispatch(formChangedAction({
                    ...formChangedData,
                    cropPurchaseDetailUpdate: true,
                    cropPurchaseProductDetailsUpdate: true
                }))
            }
        }
    }

    const handleSearchChange = async (e) => {
        getFarmerDetailsList(e.target.value)
    }

    if (purchaseOrderData.collectionCentreCode &&
        !$('#txtCollectionCentre').val()) {
        getCollectionCentre(purchaseOrderData.distributionCentreCode);
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
                                            <Form.Control id="txtSearch" name="search" placeholder="Search"
                                                onChange={handleSearchChange} maxLength={45}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Col>

                                {
                                    farmerDetailsList && farmerDetailsList.length > 0 ?
                                        <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                            <thead className='custom-bg-200'>
                                                <tr>
                                                    <th>Farmer Code</th>
                                                    <th>Name</th>
                                                    <th>Phone Number</th>
                                                    <th>Father Name</th>
                                                    <th>Village</th>
                                                    <th>District</th>
                                                    <th>State</th>
                                                    <th>Country</th>
                                                    <th>Approval Status</th>
                                                    <th>Select</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    farmerDetailsList.map((data, index) =>
                                                        <tr>
                                                            <td>{data.farmerCode}</td>
                                                            <td>{data.farmerName}</td>
                                                            <td>{data.farmerPhoneNumber ? data.farmerPhoneNumber : "-"}</td>
                                                            <td>{data.farmerFatherName}</td>
                                                            <td>{data.village}</td>
                                                            <td>{data.districtName}</td>
                                                            <td>{data.stateName}</td>
                                                            <td>{data.countryName}</td>
                                                            {
                                                                data.approvalStatus == "Approved" ?
                                                                    <td>
                                                                        <Badge
                                                                            pill
                                                                            bg="success"
                                                                        >
                                                                            {data.approvalStatus}
                                                                        </Badge>
                                                                    </td>
                                                                    :
                                                                    data.approvalStatus == "Suspended" ?
                                                                        <td>
                                                                            <Badge
                                                                                pill
                                                                                bg="danger"
                                                                            >
                                                                                {data.approvalStatus}
                                                                            </Badge>
                                                                        </td>
                                                                        :
                                                                        data.approvalStatus == "Send for Verification" ?
                                                                            <td>
                                                                                <Badge
                                                                                    pill
                                                                                    bg="warning"
                                                                                >
                                                                                    {data.approvalStatus}
                                                                                </Badge>
                                                                            </td>
                                                                            :
                                                                            <td>
                                                                                <Badge
                                                                                    pill
                                                                                    bg="info"
                                                                                >
                                                                                    {data.approvalStatus}
                                                                                </Badge>
                                                                            </td>

                                                            }
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

            <Card className="mb-1" md>
                <Card.Body>
                    <Row className="justify-content-between align-items-center">
                        <Col sm={4} lg={2} className='no-pd-card'>
                            <h5 className="mb-2 mb-md-0">{localStorage.getItem("CompanyName")}</h5>
                        </Col>
                        <Col sm={6} lg={4} className='no-pd-card'>
                            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                <Form.Label column sm="3">
                                    DC Name
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Select id="txtDistributionCentre" name="distributionCentreCode" onChange={handleFieldChange} value={purchaseOrderData.distributionCentreCode} disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"} >
                                        <option value=''>Select Distribution</option>
                                        {distributionList &&
                                            distributionList.map((option, index) => (
                                                <option key={index} value={option.value}>{option.key}</option>
                                            ))
                                        }
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Col>

                        <Col sm={6} lg={4} className='no-pd-card'>
                            <Form.Group as={Row} className="mb-1">
                                <Form.Label column sm={4}>
                                    Collection Centre
                                </Form.Label>
                                <Col sm={6}>
                                    <Form.Select id="txtCollectionCentre" name="collectionCentreCode" onChange={handleFieldChange} value={purchaseOrderData.collectionCentreCode} disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}>
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

                        <Col xs="auto">
                            {purchaseOrderData.encryptedPoNo && oldPoStatus == "Approved" &&
                                <IconButton
                                    variant="falcon-default"
                                    size="sm"
                                    icon="print"
                                    iconClassName="me-1"
                                    className="me-1 mb-2 mb-sm-1"
                                    onClick={() => {
                                        const url = `/crop-purchase-receipt/${purchaseOrderData.encryptedPoNo}`;
                                        window.open(url, '_blank');
                                    }}
                                >
                                    Print
                                </IconButton>
                            }

                            {purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved" ?
                                null
                                :
                                <IconButton
                                    variant="falcon-success"
                                    size="sm"
                                    icon="plus"
                                    className="me-2 mb-2 mb-sm-1"
                                    onClick={() => onSelectFarmerClick()}
                                >
                                    {purchaseOrderData.farmerCode ? "Change Farmer" : "Select Farmer"}
                                </IconButton>

                            }
                        </Col>
                    </Row>
                </Card.Body>
            </Card >

            <FalconComponentCard className="no-pb mb-1">
                <FalconComponentCard.Body language="jsx">
                    <Form>
                        <Row>
                            <Col className="me-3 ms-3" md="7">
                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Card No
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control id="txtCardNo" name="cardNo" placeholder="Card No"
                                            onChange={handleFieldChange} value={purchaseOrderData.cardNo} maxLength={10}
                                            disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}
                                            autoComplete='off'
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Farmer Code
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control id="txtFarmerCode" name="farmerCode" placeholder="Farmer Code" value={purchaseOrderData.farmerCode} disabled />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Farmer Name
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control id="txtFarmerName" name="farmerName" placeholder="Farmer Name" value={purchaseOrderData.farmerName} disabled />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Father's Name
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control id="txtFarmerFatherName" name="farmerFatherName" placeholder="Father Name" value={purchaseOrderData.farmerFatherName} disabled />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Mobile No
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control id="txtMobileNumber" name="farmerPhoneNumber" value={purchaseOrderData.farmerPhoneNumber} placeholder="Mobile No" disabled />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Village/District
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control id="txtVillage" name="farmerVillage" placeholder="Village" value={purchaseOrderData.farmerVillage} disabled />
                                    </Col>
                                </Form.Group>
                            </Col>

                            <Col className="me-3 ms-3" md="4">

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Material Receipt No
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control id="txtPONumber" name="poNo" placeholder="Material Receipt No" value={purchaseOrderData.poNo} disabled />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Purchase Date<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type='date' id="txtPODate" name="poDate" value={Moment(purchaseOrderData.poDate).format("YYYY-MM-DD")} onChange={handleFieldChange}
                                            disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}
                                            max={Moment().format("YYYY-MM-DD")}
                                        />
                                        {Object.keys(purchaseOrderErr.poDateErr).map((key) => {
                                            return <span className="error-message">{purchaseOrderErr.poDateErr[key]}</span>
                                        })}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Total Amount
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control id="txtPOAmount" name="poAmount" placeholder="Total Amount" onChange={handleFieldChange} value={purchaseOrderData.poAmount} maxLength={15} disabled />
                                    </Col>
                                </Form.Group>

                                {/* <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        DC Name
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Select id="txtDistributionCentre" name="distributionCentreCode" onChange={handleFieldChange} value={purchaseOrderData.distributionCentreCode} disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"} >
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
                                        <Form.Select id="txtCollectionCentre" name="collectionCentreCode" onChange={handleFieldChange} value={purchaseOrderData.collectionCentreCode} disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}>
                                            <option value=''>Select Collection Centre</option>
                                            {collectionCentreList &&
                                                collectionCentreList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Col>
                                </Form.Group> */}

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Status
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Select id="txtStatus" name="poStatus"
                                            onChange={handleFieldChange} value={purchaseOrderData.poStatus}
                                            disabled={purchaseOrderData.encryptedPoNo && oldPoStatus == "Approved"}
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Hold">Hold</option>
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