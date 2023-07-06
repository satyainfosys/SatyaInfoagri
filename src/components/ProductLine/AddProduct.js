import React, { useState, useEffect } from 'react';
import { formChangedAction, productLineDetailsAction } from 'actions';
import axios from 'axios';
import { Col, Form, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

export const AddProduct = () => {

    const [formHasError, setFormError] = useState(false);
    const dispatch = useDispatch();

    const resetProductLineDetailsData = () => {
        dispatch(productLineDetailsAction({
            "encryptedProductCode": '',
            "productCode": '',
            "productName": '',
            "productShortName": '',
            "status": 'Active'
        }))
    }

    const productLineDetailsReducer = useSelector((state) => state.rootReducer.productLineDetailsReducer)
    var productLineData = productLineDetailsReducer.productLineDetails;

    const productLineDetailsErrorReducer = useSelector((state) => state.rootReducer.productLineDetailsErrorReducer)
    const productLineError = productLineDetailsErrorReducer.productLineDetailsError;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    if (!productLineDetailsReducer.productLineDetails ||
        Object.keys(productLineDetailsReducer.productLineDetails).length <= 0) {
        resetProductLineDetailsData();
    }

    const handleFieldChange = e => {

        dispatch(productLineDetailsAction({
            ...productLineData,
            [e.target.name]: e.target.value
        }))


        if (productLineData.encryptedProductCode) {
            dispatch(formChangedAction({
                ...formChangedData,
                productLineUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                productLineAdd: true
            }))
        }
    }

    return (
        <>
            {
                productLineData &&
                <Form noValidate validated={formHasError} className="details-form" id='AddProductLineDetailForm'>
                    <Row>
                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Product Line Code</Form.Label>
                                <Form.Control id="txtProductCode" name="productcode" placeholder="Product Line Code" value={productLineData.productCode} disabled />
                            </Row>
                        </Col>
                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Product Name<span className="text-danger">*</span></Form.Label>
                                <Form.Control id="txtProductName" name="productName" placeholder="Product Name" maxLength={45} value={productLineData.productName} onChange={handleFieldChange} />
                                {Object.keys(productLineError.productNameErr).map((key) => {
                                        return <span className="error-message">{productLineError.productNameErr[key]}</span>
                                    })}
                            </Row>
                        </Col>
                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Short Name</Form.Label>
                                <Form.Control id="txtProductShortName" name="productShortName" placeholder="Short Name" maxLength={10} value={productLineData.productShortName} onChange={handleFieldChange} />
                            </Row>
                        </Col>
                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select id="txtStatus" name="status" value={productLineData.status} onChange={handleFieldChange}>
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                </Form.Select>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            }
        </>
    )
}

export default AddProduct;