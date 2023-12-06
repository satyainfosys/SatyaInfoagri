import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Moment from "moment";
import { Col, Form, Row, Card } from 'react-bootstrap';
import axios from 'axios';
import { formChangedAction, materialReceiptDetailsAction, materialReceiptHeaderDetailsAction } from 'actions';
import IconButton from 'components/common/IconButton';
import FalconComponentCard from 'components/common/FalconComponentCard';

const AddMaterialReceiptHeader = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [poList, setPoList] = useState([]);
    const [poListData, setPoListData] = useState([]);
    let oldMaterialStatus = localStorage.getItem("OldMaterialStatus");

    const resetMaterialReceiptHeaderDetails = () => {
        dispatch(materialReceiptHeaderDetailsAction({
            "encryptedMaterialReceiptId": "",
            "materialReceiptId": "",
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

    const materialReceiptErrorReducer = useSelector((state) => state.rootReducer.materialReceiptErrorReducer)
    const materialDataErr = materialReceiptErrorReducer.materialReceiptError;

    useEffect(() => {
    }, [])

    if (!materialReceiptHeaderReducer.materialReceiptHeaderDetails ||
        Object.keys(materialReceiptHeaderReducer.materialReceiptHeaderDetails).length <= 0) {
        resetMaterialReceiptHeaderDetails();
    }

    const fetchPurchaseOrder = async (vendorCode) => {
        let purchaseOrderData = [];

        const request = {
            VendorCode: vendorCode
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-po-header-master-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                setPoListData(response.data.data)
                response.data.data.forEach(po => {
                    purchaseOrderData.push({
                        key: po.poNo,
                        value: po.poNo
                    })
                })
            }
            setPoList(purchaseOrderData)
        }
        else {
            setPoList([]);
        }
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
            setPoList([]);
            e.target.value && fetchPurchaseOrder(e.target.value)
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
            setPoList([]);
        }
        else if (e.target.name == "poNo") {
            if (e.target.value) {
                const poNumberDetail = poListData.find(po => po.poNo == e.target.value);
                dispatch(materialReceiptHeaderDetailsAction({
                    ...materialReceiptHeaderData,
                    poNo: e.target.value,
                    poDate: poNumberDetail.poDate,
                    poStatus: poNumberDetail.poStatus,
                    deliveryLocation: poNumberDetail.deliveryLocation
                }))
                dispatch(materialReceiptDetailsAction([]));
            }
            else if (!e.target.value) {
                dispatch(materialReceiptDetailsAction([]));
                dispatch(materialReceiptHeaderDetailsAction({
                    ...materialReceiptHeaderData,
                    poNo: e.target.value,
                    poDate: '',
                    poStatus: '',
                    deliveryLocation: ''
                }))
            }
        }
        else {
            dispatch(materialReceiptHeaderDetailsAction({
                ...materialReceiptHeaderData,
                [e.target.name]: e.target.value
            }))
        }

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

    return (
        <>
            <Card className="mb-1">
                <Card.Body className="card-header">
                    <Row className="justify-content-between align-items-center">
                        <Col sm={6} lg={4} className='no-pd-card'>
                            <h5 className="mb-2 mb-md-0">{localStorage.getItem("CompanyName")}</h5>
                        </Col>
                        <Col xs="auto">
                            {materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved" &&

                                <IconButton
                                    variant="falcon-default"
                                    size="sm"
                                    icon="print"
                                    iconClassName="me-1"
                                    className="me-1 mb-2 mb-sm-1"
                                    onClick={() => {
                                        const url = `/material-receipt/${materialReceiptHeaderData.encryptedMaterialReceiptId}`;
                                        window.open(url, '_blank');
                                    }}
                                >
                                    Print
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
                            <Col md="4">
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
                                                {Object.keys(materialDataErr.vendorErr).map((key) => {
                                                    return <span className="error-message">{materialDataErr.vendorErr[key]}</span>
                                                })}
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
                            </Col>

                            <Col md="4">
                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        PO Number
                                    </Form.Label>
                                    {
                                        materialReceiptHeaderData.encryptedMaterialReceiptId ?
                                            <Col sm="8">
                                                <Form.Control id="txtPoNumber" name="poNo" placeholder="PO number" value={materialReceiptHeaderData.poNo} disabled />
                                            </Col>
                                            :
                                            <Col sm="8">
                                                <Form.Select id="txtPoNumber" name="poNo" onChange={handleFieldChange} value={materialReceiptHeaderData.poNo} >
                                                    <option value=''>Select PO</option>
                                                    {poList.map((option, index) => (
                                                        <option key={index} value={option.value}>{option.key}</option>
                                                    ))}
                                                </Form.Select>
                                            </Col>
                                    }
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        PO Date
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control id="txtPODate" name="poDate" placeholder='PO Date' value={materialReceiptHeaderData.poDate} disabled />
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
                                        <Form.Control id="txtChallanNo" name="challanNo" placeholder="Challan No" maxLength={20} value={materialReceiptHeaderData.challanNo} onChange={handleFieldChange} disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"} />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                    <Form.Label column sm="4">
                                        Delivery Date
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
                            </Col>

                            <Col md="4">
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
                                        <Form.Control id="txtPersonName" name="personName" placeholder="Person Name" value={localStorage.getItem("Name")} maxLength={45} disabled />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="3">
                                        Material Status
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Select id="txtMaterialStatus" name="materialStatus" value={materialReceiptHeaderData.materialStatus} onChange={handleFieldChange} disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}>
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

export default AddMaterialReceiptHeader