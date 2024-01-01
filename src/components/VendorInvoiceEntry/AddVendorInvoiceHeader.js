import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { vendorInvoiceEntryHeaderDetailsAction, formChangedAction, vendorInvoiceEntryDetailsAction } from 'actions';

const AddVendorInvoiceHeader = () => {
  const [poList, setPoList] = useState([]);
  const [poListData, setPoListData] = useState([]);
  const dispatch = useDispatch();
  let oldInvoiceStatus = localStorage.getItem("OldInvoiceStatus");
  const resetInvoiceEntryHeaderDetails = () => {
    dispatch(vendorInvoiceEntryHeaderDetailsAction({
      "vendorCode": "",
      "vendorName": "",
      "address": "",
      "pinCode": "",
      "state": "",
      "country": "",
      "poNo": "",
      "poDate": "",
      "poStatus": "",
      "deliveryLocation": "",
      "invoiceNo": "",
      "invoiceAmount": "",
      "invoicePaidAmount": "",
      "invoiceDate": "",
      "invoiceDueDate": "",
      "invoiceStatus": "Draft"
    }))
  }

  const vendorMasterDetailsListReducer = useSelector((state) => state.rootReducer.vendorMasterDetailsListReducer)
  var vendorList = vendorMasterDetailsListReducer.vendorMasterListDetails;

  const vendorInvoiceEntryHeaderDetailsReducer = useSelector((state) => state.rootReducer.vendorInvoiceEntryHeaderDetailsReducer)
  var vendorInvoiceEntryHeaderDetails = vendorInvoiceEntryHeaderDetailsReducer.vendorInvoiceEntryHeaderDetails;

  const vendorInvoiceEntryErrorReducer = useSelector((state) => state.rootReducer.vendorInvoiceEntryErrorReducer)
  const vendorInvoiceEntryErr = vendorInvoiceEntryErrorReducer.vendorInvoiceEntryError;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  useEffect(() => {    
  }, [])

  if (!vendorInvoiceEntryHeaderDetailsReducer.vendorInvoiceEntryHeaderDetails ||
    Object.keys(vendorInvoiceEntryHeaderDetailsReducer.vendorInvoiceEntryHeaderDetails).length <= 0) {
    resetInvoiceEntryHeaderDetails();
    setPoList([]);
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
      dispatch(vendorInvoiceEntryHeaderDetailsAction({
        ...vendorInvoiceEntryHeaderDetails,
        vendorCode: e.target.value,
        companyCode: localStorage.getItem('companyCode'),
        address: vendorDetail.vendorAddress,
        pinCode: vendorDetail.vendorPincode,
        state: vendorDetail.stateName,
        country: vendorDetail.countryName,
        vendorName: vendorDetail.vendorName,
        poNo:'',
        poDate:'',
        poStatus:'',
        deliveryLocation:''
      }))
      setPoList([]);
      e.target.value && fetchPurchaseOrder(e.target.value)
    }
    else if (e.target.name == "vendorCode" && !e.target.value) {
      dispatch(vendorInvoiceEntryHeaderDetailsAction({
        ...vendorInvoiceEntryHeaderDetails,
        vendorCode: e.target.value,
        address: '',
        pinCode: '',
        state: '',
        country: '',
        vendorName: '',
        poNo:'',
        poDate:'',
        poStatus:'',
        deliveryLocation:''
      }))
      setPoList([]);
    }
    else if (e.target.name == "poNo") {
      if (e.target.value) {
        const poNumberDetail = poListData.find(po => po.poNo == e.target.value);
        dispatch(vendorInvoiceEntryHeaderDetailsAction({
          ...vendorInvoiceEntryHeaderDetails,
          poNo: e.target.value,
          poDate: poNumberDetail.poDate,
          poStatus: poNumberDetail.poStatus,
          deliveryLocation: poNumberDetail.deliveryLocation
        }))
        dispatch(vendorInvoiceEntryDetailsAction([]));
      }
      else if (!e.target.value) {
        dispatch(vendorInvoiceEntryDetailsAction([]));
        dispatch(vendorInvoiceEntryHeaderDetailsAction({
          ...vendorInvoiceEntryHeaderDetails,
          poNo: e.target.value,
          poDate: '',
          poStatus: '',
          deliveryLocation: ''
        }))
      }
    } else {
      dispatch(vendorInvoiceEntryHeaderDetailsAction({
        ...vendorInvoiceEntryHeaderDetails,
        [e.target.name]: e.target.value
      }))
    }

    if (vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode) {
      dispatch(formChangedAction({
          ...formChangedData,
          vendorInvoiceEntryHeaderDetailUpdate: true
      }))
  } else {
      dispatch(formChangedAction({
          ...formChangedData,
          vendorInvoiceEntryHeaderDetailsAdd: true
      }))
  }

  }
  const today = new Date().toISOString().split('T')[0];

  return (
    <FalconComponentCard className="no-pb mb-1">
      <FalconComponentCard.Body language="jsx">
        <Form>
          <Row>
            <Col md="4">
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Vendor Name<span className="text-danger">*</span>
                </Form.Label>
                <Col sm="8">
                  {
                    vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode ?
                      <Form.Control id="txtVendorName" name="vendorCode" placeholder="Vendor Name" value={vendorInvoiceEntryHeaderDetails.vendorName} disabled /> :
                      <Form.Select id="txtVendorName" name="vendorCode" value={vendorInvoiceEntryHeaderDetails.vendorCode} onChange={handleFieldChange} >
                        <option value=''>Select Vendor</option>
                        {vendorList.map((vendor) => (
                          <option key={vendor.vendorName} value={vendor.vendorCode}>
                            {vendor.vendorName}
                          </option>
                        ))}
                      </Form.Select>
                      } 
                  {Object.keys(vendorInvoiceEntryErr.vendorErr).map((key) => {
                    return <span className="error-message">{vendorInvoiceEntryErr.vendorErr[key]}</span>
                  })}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword" >
                <Form.Label column sm="4">
                  Address
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtAddress" name="address" placeholder="Address" value={vendorInvoiceEntryHeaderDetails.address} disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Pincode
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtPincode" name="pinCode" placeholder="Pincode" value={vendorInvoiceEntryHeaderDetails.pinCode} disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  State
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtState" name="state" placeholder="State" value={vendorInvoiceEntryHeaderDetails.state} disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Country
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtCountry" name="country" placeholder="Country" value={vendorInvoiceEntryHeaderDetails.country} disabled />
                </Col>
              </Form.Group>
            </Col>
            <Col md="4">
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  PO Number
                </Form.Label>
                <Col sm="8">
                  {
                    vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode ?
                      <Form.Control id="txtPoNumber" name="poNo" placeholder="PO number" value={vendorInvoiceEntryHeaderDetails.poNo} disabled />
                      :
                      <Form.Select id="txtPoNumber" name="poNo" value={vendorInvoiceEntryHeaderDetails.poNo} onChange={handleFieldChange} >
                        <option value=''>Select PO</option>
                        {poList.map((option, index) => (
                          <option key={index} value={option.value}>{option.key}</option>
                        ))}
                      </Form.Select>
                } 
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  PO Date
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtPODate" name="poDate" placeholder='PO Date' value={vendorInvoiceEntryHeaderDetails.poDate ? vendorInvoiceEntryHeaderDetails.poDate : ""} disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  PO Status
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtPOStatus" name="poStatus" placeholder="PO Status" value={vendorInvoiceEntryHeaderDetails.poStatus} disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Location
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtDeliveryLocation" name="deliveryLocation" placeholder="Delivery Location" value={vendorInvoiceEntryHeaderDetails.deliveryLocation} disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Status
                </Form.Label>
                <Col sm="8">
                  <Form.Select id="txtMaterialStatus" name="invoiceStatus" value={vendorInvoiceEntryHeaderDetails.invoiceStatus} onChange={handleFieldChange}  disabled={oldInvoiceStatus=="Paid"}>
                    <option value="Draft">Draft</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </Col>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Invoice No<span className="text-danger">*</span>
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtInvoiceNo" name="invoiceNo" placeholder="Invoice No" maxLength={15} value={vendorInvoiceEntryHeaderDetails.invoiceNo} onChange={handleFieldChange} disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (oldInvoiceStatus == "Approved" || oldInvoiceStatus=="Paid")} />
                  {Object.keys(vendorInvoiceEntryErr.invoiceNoErr).map((key) => {
                    return <span className="error-message">{vendorInvoiceEntryErr.invoiceNoErr[key]}</span>
                  })}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Amount<span className="text-danger">*</span>
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtInvoiceAmount" name="invoiceAmount" placeholder="Invoice Amount" maxLength={15} value={vendorInvoiceEntryHeaderDetails.invoiceAmount} onChange={handleFieldChange}  disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (oldInvoiceStatus == "Approved" || oldInvoiceStatus=="Paid")}/>
                  {Object.keys(vendorInvoiceEntryErr.invoiceAmountErr).map((key) => {
                    return <span className="error-message">{vendorInvoiceEntryErr.invoiceAmountErr[key]}</span>
                  })}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Invoice Date<span className="text-danger">*</span>
                </Form.Label>
                <Col sm="8">
                  <Form.Control type='date' id="txtInvoiceDate" name="invoiceDate" max={today}
                    value={vendorInvoiceEntryHeaderDetails.invoiceDate} onChange={handleFieldChange} disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (oldInvoiceStatus == "Approved" || oldInvoiceStatus=="Paid")}
                  />
                  {Object.keys(vendorInvoiceEntryErr.invoiceDateErr).map((key) => {
                    return <span className="error-message">{vendorInvoiceEntryErr.invoiceDateErr[key]}</span>
                  })}
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Due Date<span className="text-danger">*</span>
                </Form.Label>
                <Col sm="8">
                  <Form.Control type='date' id="txtInvoiceDueDate" name="invoiceDueDate" min={today}
                    value={vendorInvoiceEntryHeaderDetails.invoiceDueDate} onChange={handleFieldChange} disabled={vendorInvoiceEntryHeaderDetails.encryptedInvoiceHeaderCode && (oldInvoiceStatus == "Approved" || oldInvoiceStatus=="Paid")}
                  />
                  {Object.keys(vendorInvoiceEntryErr.invoiceDueDateErr).map((key) => {
                      return <span className="error-message">{vendorInvoiceEntryErr.invoiceDueDateErr[key]}</span>
                    })}
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </FalconComponentCard.Body>
    </FalconComponentCard>
  )
}

export default AddVendorInvoiceHeader