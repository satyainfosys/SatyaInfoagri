import React from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import FalconComponentCard from 'components/common/FalconComponentCard';

const AddVendorInvoiceHeader = () => {
  return (
    <FalconComponentCard className="no-pb mb-1">
      <FalconComponentCard.Body language="jsx">
        <Form>
          <Row>
            <Col md="4">
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Vendor Name
                </Form.Label>
                <Col sm="8">
                  <Form.Select id="txtVendorName" name="vendorCode" value="" onChange="" >
                    <option value=''>Select Vendor</option>
                  </Form.Select>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Address
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtAddress" name="address" placeholder="Address" value="" disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Pincode
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtPincode" name="pinCode" placeholder="Pincode" value="" disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  State
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtState" name="state" placeholder="State" value="" disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Country
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtCountry" name="country" placeholder="Country" value="" disabled />
                </Col>
              </Form.Group>
            </Col>
            <Col md="4">
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  PO Number
                </Form.Label>
                <Col sm="8">
                  <Form.Select id="txtPoNumber" name="poNo" onChange="" value="" >
                    <option value=''>Select PO</option>
                  </Form.Select>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  PO Date
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtPODate" name="poDate" placeholder='PO Date' value="" disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  PO Status
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtPOStatus" name="poStatus" placeholder="PO Status" value="" disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                Location
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtDeliveryLocation" name="deliveryLocation" placeholder="Delivery Location" value="" disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Status
                </Form.Label>
                <Col sm="8">
                  <Form.Select id="txtMaterialStatus" name="materialStatus" value="" onChange="">
                    <option value="Draft">Draft</option>
                    <option value="Approved">Approved</option>
                  </Form.Select>
                </Col>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Invoice No
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtInvoiceNo" name="invoiceNo" placeholder="Invoice No" value=""/>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                Amount
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtInvoiceAmount" name="invoiceAmount" placeholder="Invoice Amount" value=""/>
                </Col>
                </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Invoice Date
                </Form.Label>
                <Col sm="8">
                  <Form.Control type='date' id="txtInvoiceDate" name="invoiceDate"
                    value=""
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                Due Date
                </Form.Label>
                <Col sm="8">
                  <Form.Control type='date' id="txtInvoiceDueDate" name="invoiceDueDate"
                    value=""
                  />
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