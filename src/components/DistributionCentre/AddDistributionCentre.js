import React, { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap';

export const AddDistributionCentre = () => {

    const [formHasError, setFormError] = useState(false);

    return (
        <>
            <Form noValidate validated={formHasError} className="details-form" id='AddCollectionCentreDetails'>
                <Row>
                    <Col className="me-3 ms-3">
                        <Row className="mb-3">
                            <Form.Label>Distribution Centre Code</Form.Label>
                            <Form.Control id="txtDistributionCentreCode" name="distributionCentreCode" placeholder="Distribution Centre Code" disabled />
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Distribution Centre Name</Form.Label>
                            <Form.Control id="txtDistributionCentreName" name="distributionCentreName" placeholder="Distribution Centre Name" />
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Distribution Centre Short Name</Form.Label>
                            <Form.Control id="txtDistributionCentreShortName" name="distributionShortName" placeholder="Distribution Centre Short Name" />
                        </Row>
                    </Col>

                    <Col className="me-3 ms-3">
                        <Row className="mb-3">
                            <Form.Label>State Name</Form.Label>
                            <Form.Select id="txtState" name="state" >
                                <option value="">Select State</option>
                            </Form.Select>
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control id="txtAddress" as='textarea' name="address" placeholder="Address" rows="5" />
                        </Row>
                    </Col>

                    <Col className="me-3 ms-3">
                        <Row className="mb-3">
                            <Form.Label>Cold Storage</Form.Label>
                            <Form.Select id="txtColdStorage" name="coldStorage" >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Processing Unit</Form.Label>
                            <Form.Select id="txtProcessingUnit" name="processingUnit" >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select id="txtStatus" name="status" >
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                            </Form.Select>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default AddDistributionCentre