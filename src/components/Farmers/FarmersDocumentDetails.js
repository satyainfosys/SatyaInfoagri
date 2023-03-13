import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

export const FarmersDocumentDetails = () => {
  return (
    <>
      <Form className="details-form">
        <Row>
          <Col className="me-3 ms-3">
            <Row className="mb-3">
              <Form.Label>Original Farmer From</Form.Label>
              <Form.Control
                type="File"
                id="fileOriginalFarmerFrom"
                name="OriginalFarmerFrom"
                placeholder="Choose File"
                disabled
              />
            </Row>
            <Row className="mb-3">
              <Form.Label>Id Proof Type</Form.Label>
              <Form.Select id="txtIdProofType" name="idProofType">
                <option value="select">Select</option>
              </Form.Select>
            </Row>
            <Row className="mb-3">
              <Form.Control
                type="text"
                id="txtIdProofNo"
                name="idProofNo"
                placeholder="ID Proof No"
              />
            </Row>
          </Col>
          <Col className="me-3 ms-3"></Col>
        </Row>
      </Form>
    </>
  );
};

export default FarmersDocumentDetails;
