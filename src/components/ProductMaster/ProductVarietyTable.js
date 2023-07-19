import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Row, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { productVarietyDetailsAction } from 'actions';

const ProductVarietyTable = () => {

    const dispatch = useDispatch();
    const [formHasError, setFormError] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [paramsData, setParamsData] = useState({});

    const columnsArray = [
        'S.No',
        'Variety Name',
        'Variety Short Name',
        'Perishable Days',
        'Active Status',
        'Action'
    ]

    const emptyRow = {
        id: rowData.length + 1,
        encryptedClientCode: localStorage.getItem("EncryptedClientCode") ? localStorage.getItem("EncryptedClientCode") : '',
        encryptedProductMasterCode: localStorage.getItem("EncryptedProductMasterCode") ? localStorage.getItem("EncryptedProductMasterCode") : '',
        productVarietyName: '',
        productVarietyShortName: '',
        perishableDays: '',
        activeStatus: '',
        addUser: localStorage.getItem("LoginUserName"),
        modifyUser: localStorage.getItem("LoginUserName"),
    }

    const productVarietyDetailReducer = useSelector((state) => state.rootReducer.productVarietyDetailReducer)
    var productVarietyDetailsData = productVarietyDetailReducer.productVarietyDetails

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    useEffect(() => {
        if (productVarietyDetailReducer.productVarietyDetails.length > 0) {
            setRowData(productVarietyDetailsData);
        }

    }, [productVarietyDetailsData, productVarietyDetailReducer])

    const handleAddRow = () => {
        // if (validateProductCategoryForm()) {
        //     productCategoryDetailData.unshift(emptyRow);
        //     dispatch(productCategoryDetailAction(productCategoryDetailData));
        // }
        productVarietyDetailsData.unshift(emptyRow);
        dispatch(productVarietyDetailsAction(productVarietyDetailsData));
    };

    return (
        <>
            <Card className="h-100 big-card-body">
                <FalconCardHeader
                    title="Product Variety Details"
                    titleTag="h6"
                    className="py-2"
                    light
                    endEl={
                        <Flex>
                            <div >
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="btn-reveal"
                                    type="button"
                                    onClick={handleAddRow}
                                >
                                    <i className="fa-solid fa-plus" />
                                </Button>
                            </div>
                        </Flex>
                    }
                />
                {/* {
                    productCategoryDetailData && productCategoryDetailData.length > 0 &&                    
                } */}
                <Card.Body className="position-relative pb-0 p3px big-card-table">
                    <Form
                        noValidate
                        validated={formHasError}
                        className="details-form"
                        id="AddProductCategoryDetailsForm"
                    >

                        <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                            <thead className='custom-bg-200'>
                                <tr>
                                    {columnsArray.map((column, index) => (
                                        <th className="text-left" key={index}>
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody id="tbody" className="details-form">
                                {rowData.map((productVarietyDetailData, index) => (
                                    <tr key={index}>
                                        <td>
                                            {index + 1}
                                        </td>
                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="productVarietyName"
                                                value={productVarietyDetailData.productVarietyName}
                                                placeholder="Variety Name"
                                                className="form-control"
                                                maxLength={30}
                                                required={true}
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="productVarietyShortName"
                                                value={productVarietyDetailData.productVarietyShortName}
                                                placeholder="Short Name"
                                                className="form-control"
                                                maxLength={10}
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="perishableDays"
                                                value={productVarietyDetailData.perishableDays}
                                                placeholder="Perishable Days"
                                                className="form-control"
                                                maxLength={3}
                                                onKeyPress={(e) => {
                                                    const regex = /[0-9]|\./;
                                                    const key = String.fromCharCode(e.charCode);
                                                    if (!regex.test(key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </td>

                                        <td key={index}>
                                            <Form.Select
                                                id="txtStatus"
                                                name="activeStatus"
                                                className="form-control"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Suspended">Suspended</option>
                                            </Form.Select>
                                        </td>

                                        <td>
                                            <FontAwesomeIcon icon={'trash'} className="fa-2x" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

export default ProductVarietyTable