import React, { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap';

export const AddCollectionCentre = () => {
    const [formHasError, setFormError] = useState(false);

    return (
        <>
            <Form noValidate validated={formHasError} className="details-form" id='AddCollectionCentreDetails'>
                <Row>
                    <Col className="me-3 ms-3">
                        <Row className="mb-3">
                            <Form.Label>Collection Centre Code</Form.Label>
                            <Form.Control id="txtCollectionCentreCode" name="collectionCentreCode" placeholder="Collection Centre Code" disabled />
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Collection Centre Name</Form.Label>
                            <Form.Control id="txtCollectionCentreName" name="collectionCentreName" placeholder="Collection Centre Name" />
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Collection Centre Short Name</Form.Label>
                            <Form.Control id="txtCollectionCentreShortName" name="collectionCentreShortName" placeholder="Collection Centre Short Name" />
                        </Row>
                    </Col>

                    <Col className="me-3 ms-3">
                        <Row className="mb-3">
                            <Form.Label>Distribution Centre</Form.Label>
                            <Form.Select id="txtDistributionCentre" name="distributionCentreCode" >
                                <option value=''>Select Distribution</option>
                            </Form.Select>
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Collection Centre Type</Form.Label>
                            <Form.Select id="txtCollectionCentreType" name="collectionCentreType" >
                                <option value=''>Select</option>
                                <option value="Owned">Owned</option>
                                <option value="Franchise">Franchise</option>
                            </Form.Select>
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Collection Type</Form.Label>
                            <Form.Select id="txtCollectionType" name="collectionType" >
                                <option value=''>Select</option>
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </Form.Select>
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
                            <Form.Control id="txtAddress" as='textarea' name="address" placeholder="Address" rows={1} />
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

export default AddCollectionCentre