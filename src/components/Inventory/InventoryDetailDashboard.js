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
                    <Row className='mb-1 justify-content-center'>
                                <Form.Label column className='col-auto'>
                                    Company
                                </Form.Label>
                                <Col className='col-auto'>
                                    <Form.Select id="txtCompanyCode" name="vendorCode">
                                        <option value=''>Select</option>
                                    </Form.Select>
                                </Col>
                                <Form.Label column className='col-auto'>
                                    Start Date
                                </Form.Label>
                                <Col className='col-auto'>
                                    <Form.Control type='date' id="dtStartDate" name="startDate" />
                                </Col>
                                <Form.Label column className='col-auto'>
                                    End Date
                                </Form.Label>
                                <Col  className='col-auto'>
                                    <Form.Control type='date' id="dtEndDate" name="endDate" />
                                </Col>
                                <Form.Label column className='col-auto'>
                                    Category
                                </Form.Label>
                                <Col className='col-auto'>
                                    <Form.Select id="txtCategoryCode" name="productCategoryCode">
                                        <option value=''>Select</option>
                                    </Form.Select>
                                </Col>
                        <Col className='col-auto'>
                            <Button variant="success" >Search</Button>
                        </Col>
                    </Row>

                    <Row className="no-padding">
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
            </Form>
        </>
    )
}
