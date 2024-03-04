import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const AddDemand = () => {

  return (
    <>
      <Form>
          <Row>
            <Col md="4">
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Farmer Name
                </Form.Label>
                    <Col sm="8">
                    <Form.Control id="txtSearchFarmer" name="searchFarmer" placeholder="Search Farmer" maxLength={45} />
                    </Col>

              </Form.Group>

              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Father Name
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtFatherName" name="fatherName" placeholder="FatherName" disabled />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Village
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtVillage" name="poVillage" placeholder="Village" disabled />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Phone Number
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtPhoneNumber" name="phoneNumber" placeholder="Phone Number" disabled />
                </Col>
              </Form.Group>
            </Col>

            <Col md="4">
              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Amount
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtDemandAmount" name="demandAmount" placeholder='Demand Amount'/>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Date
                </Form.Label>
                <Col sm="8">
                  <Form.Control type='date' id="txtDemandDate" name="demandDate" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Delivery Date
                </Form.Label>
                <Col sm="8">
                  <Form.Control type='date' id="txtDeliveryDate" name="deliveryDate" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Advanced Amount
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtAdvancedAmount" name="advancedAmount" placeholder="Advanced Amount" 
                  />
                </Col>
              </Form.Group>
            </Col>

            <Col md="4">
            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  DC Name
                </Form.Label>
                <Col sm="8">
                  <Form.Select id="txtDistributionCentre" name="distributionCentreCode" >
                    <option value=''>Select Distribution</option>
                  </Form.Select>
                </Col>
              </Form.Group>
            <Form.Group as={Row} className="mb-1">
                <Form.Label column sm={4}>
                  Collection Centre
                </Form.Label>
                <Col sm={8}>
                  <Form.Select id="txtCollectionCentre" name="collectionCentreCode">
                    <option value=''>Select Collection Centre</option>
                  </Form.Select>
                </Col>
              </Form.Group>  

            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="4">
                  Status
                </Form.Label>
                <Col sm="8">
                  <Form.Select id="txtStatus" name="demandStatus" >
                    <option value="Draft">Draft</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Form>
    </>
  )
}

export default AddDemand