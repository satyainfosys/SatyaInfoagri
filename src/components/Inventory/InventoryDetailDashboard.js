import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row, Button, Modal, Table } from 'react-bootstrap';


export const InventoryDetailDashboard = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            {isLoading ? (
                <Spinner
                    className="position-absolute start-50 loader-color"
                    animation="border"
                />
            ) : null}

            <Form className="details-form" id="InventoryDetailDashboard">
                <Row>
                    <Row className='mb-3'>
                        <Col className="me-2 ms-2">
                            <Form.Group as={Row} className="mb-1" controlId="formHorizontalEmail">
                                <Form.Label column sm={4}>
                                    Company
                                </Form.Label>
                                <Col sm={7}>
                                    <Form.Select id="txtCompanyCode" name="vendorCode">
                                        <option value=''>Select</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col className="me-1 ms-1">
                            <Form.Group as={Row} className="mb-1" controlId="formHorizontalEmail">
                                <Form.Label column sm={4}>
                                    Start Date
                                </Form.Label>
                                <Col sm={7}>
                                    <Form.Control type='date' id="dtStartDate" name="startDate" />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col className="me-1 ms-1">
                            <Form.Group as={Row} className="mb-1" controlId="formHorizontalEmail">
                                <Form.Label column sm={3}>
                                    End Date
                                </Form.Label>
                                <Col sm={7}>
                                    <Form.Control type='date' id="dtEndDate" name="endDate" />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col className="me-1 ms-1">
                            <Form.Group as={Row} className="mb-1" controlId="formHorizontalEmail">
                                <Form.Label column sm={5}>
                                    Product Category
                                </Form.Label>
                                <Col sm={7}>
                                    <Form.Select id="txtCategoryCode" name="productCategoryCode">
                                        <option value=''>Select</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col className="me-0 ms-1">
                            <Button variant="success" >Search</Button>
                        </Col>
                    </Row>

                    <Row style={{ paddingLeft: 9 }}>
                        <Table striped bordered responsive>
                            <thead className='custom-bg-200'>
                                <tr>
                                    <th>Product Line</th>
                                    <th>Product Category</th>
                                    <th>Product</th>
                                    <th>Grade</th>
                                    <th>O/I</th>
                                    <th>Available Qty</th>
                                    <th>Unit</th>
                                    <th>AVG Price</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                        </Table>
                    </Row>
                </Row>
            </Form>
        </>
    )
}
