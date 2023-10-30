import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row, Button, Modal, Table } from 'react-bootstrap';
import axios from 'axios';
import Moment from "moment";
import { toast } from 'react-toastify';
import { formatRange } from '@fullcalendar/react';

export const InventoryDetailDashboard = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [inventoryDetailList, setInventoryDetailList] = useState([]);
    const [productCategoryList, setProductCategoryList] = useState([]);

    const [formData, setFormData] = useState({
        companyCode: "",
        startDate: null,
        endDate: null,
        productCategoryCode: "",
    });


    useEffect(() => {     
        if (companyList.length <= 0)
            getCompany();
        if (productCategoryList.length <= 0)
            fetchProductCategoryList();
    }, [])

    const getCompany = async () => {
        let companyData = [];
        const companyRequest = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
        }

        let companyResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-client-companies', companyRequest, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });

        if (companyResponse.data.status == 200) {
            if (companyResponse.data && companyResponse.data.data.length > 0) {
                companyResponse.data.data.forEach(company => {
                    companyData.push({
                        key: company.companyName,
                        value: company.encryptedCompanyCode,
                        label: company.companyName
                    })
                })
            }
            setCompanyList(companyData)
        } else {
            setCompanyList([])
        }
    }

    const fetchProductCategoryList = async () => {

        let productCategoryData = [];
        let productCategoryResponse = await axios.get(process.env.REACT_APP_API_URL + '/product-category-master-list', {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (productCategoryResponse.data.status == 200) {
            if (productCategoryResponse.data && productCategoryResponse.data.data.length > 0) {
                productCategoryResponse.data.data.forEach(productCategory => {
                    productCategoryData.push({
                        key: productCategory.productCategoryName,
                        value: productCategory.productCategoryCode
                    })
                })
            }
            setProductCategoryList(productCategoryData);
        } else {
            setProductCategoryList([]);
        }
    }

    const handleFieldChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const validateSearchClick = () => {
        let isValid = true

        if (!formData.companyCode) {
            toast.error("Select company", {
                theme: 'colored'
            });
            isValid = false;
        }

        if (formData.startDate && !formData.endDate) {
            toast.error("Select To Date", {
                theme: 'colored'
            });
            isValid = false;
        }
        else if (formData.endDate && !formData.startDate) {
            toast.error("Select From Date", {
                theme: 'colored'
            });
            isValid = false;
        }
        else if (formData.startDate > formData.endDate || formData.endDate < formData.startDate) {
            toast.error("From Date cannot be greater than To Date", {
                theme: 'colored'
            });
            isValid = false;
        }

        return isValid;
    }

    const fetchInventoryDetailList = async (companyCode, isNull = false) => {
        if (validateSearchClick(isNull, companyCode)) {
            const requestData = {
                EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                EncryptedCompanyCode: companyCode ? companyCode : formData.companyCode,
                StartDate: formData.startDate ? Moment(formData.startDate).format("YYYY-MM-DD") : null,
                EndDate: formData.endDate ? Moment(formData.endDate).format("YYYY-MM-DD") : null,
                ProductCategoryCode: formData.productCategoryCode ? formData.productCategoryCode : ""
            }

            let response = await axios.post(process.env.REACT_APP_API_URL + '/get-inventory-detail-list', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })

            if (response.data.status == 200) {
                if (response.data && response.data.data.length > 0) {
                    setInventoryDetailList(response.data.data)
                }
            }
            else {
                setInventoryDetailList([]);
                setTimeout(function () {
                    $('#no-inventory-message').html('No data found!');
                }, 500)
            }
        }
        else {
            setInventoryDetailList([]);
        }
    }

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
                        Company<span className="text-danger">*</span>
                    </Form.Label>
                    <Col className='col-auto'>
                        <Form.Select id="txtCompanyCode" name="companyCode" onChange={handleFieldChange} value={formData.companyCode}>
                            <option value=''>Select</option>
                            {companyList.map((option, index) => (
                                <option key={index} value={option.value}>{option.key}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Form.Label column className='col-auto'>
                        From Date
                    </Form.Label>
                    <Col className='col-auto'>
                        <Form.Control type='date' id="dtStartDate" name="startDate" onChange={handleFieldChange} value={formData.startDate} max={Moment().format("YYYY-MM-DD")} />
                    </Col>
                    <Form.Label column className='col-auto'>
                        To Date
                    </Form.Label>
                    <Col className='col-auto'>
                        <Form.Control type='date' id="dtEndDate" name="endDate" onChange={handleFieldChange} value={formData.endDate} max={Moment().format("YYYY-MM-DD")} />
                    </Col>
                    <Form.Label column className='col-auto'>
                        Category
                    </Form.Label>
                    <Col className='col-auto'>
                        <Form.Select id="txtCategoryCode" name="productCategoryCode" onChange={handleFieldChange} value={formData.productCategoryCode} >
                            <option value=''>Select</option>
                            {productCategoryList.map((option, index) => (
                                <option key={index} value={option.value}>{option.key}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col className='col-auto'>
                        <Button variant="success" onClick={() => fetchInventoryDetailList()} >Search</Button>
                    </Col>
                </Row>

                {
                    inventoryDetailList && inventoryDetailList.length > 0 ?
                        <Row className="no-padding">
                            <Table striped bordered responsive className="table-sm overflow-hidden">
                                <thead className='custom-bg-200'>
                                    <tr>
                                        <th>S. No</th>
                                        <th>Product Line</th>
                                        <th>Product Category</th>
                                        <th>Product</th>
                                        <th>Grade</th>
                                        <th>O/I</th>
                                        <th>Available Qty.</th>
                                        <th>Unit</th>
                                        <th>AVG Price</th>
                                        <th>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        inventoryDetailList.map((item, index) =>
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{item.productLineName}</td>
                                                <td>{item.productCategoryName}</td>
                                                <td>{item.productName}</td>
                                                <td>{"-"}</td>
                                                <td>{"-"}</td>
                                                <td>{item.availableQty}</td>
                                                <td>{item.unitName}</td>
                                                <td>{item.avgPrice}</td>
                                                <td>{item.totalAmount}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        </Row>
                        :
                        <h4 id="no-inventory-message"></h4>
                }
            </Form>
        </>
    )
}
