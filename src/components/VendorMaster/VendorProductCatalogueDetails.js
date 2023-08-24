import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { toast } from 'react-toastify';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

export const VendorProductCatalogueDetails = () => {

    const dispatch = useDispatch();
    const [formHasError, setFormError] = useState(false);
    const [rowData, setRowData] = useState([]);

    const emptyRow = {
        id: rowData.length + 1,
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
        encryptedVendorCode: localStorage.getItem("EncryptedVendorCode"),
        encryptedProductMasterCode: localStorage.getItem("EncryptedProductMasterCode"),
        encryptedOemProductCatalogueCode: localStorage.getItem("EncryptedOemProductCatalogueCode"),
        quantity: '',
        unitCode: '',
        oemRate: '',
        companyRate: '',
        validFrom: '',
        validTo: '',
        activeStatus: '',
        addUser: localStorage.getItem("LoginUserName"),
        modifyUser: localStorage.getItem("LoginUserName"),
    }

    let vendorProductCatalogueDetailsReducer = useSelector((state) => state.rootReducer.vendorProductCatalogueDetailsReducer)
    let vendorProductCatalogueData = vendorProductCatalogueDetailsReducer.vendorProductCatalogueDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const columnsArray = [
        'S.No',
        'Product Category',
        'Product',
        'Variety',
        'Brand',
        'Season',
        'Quantity',
        'Unit',
        'Rate',
        'Amt',
        'From Date',
        'To Date',
        'Status',
        'Add Info'
    ];

    return (
        <Card className="h-100 mb-2">
            <FalconCardHeader
                title="Vendor Product Catalogue"
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
                            // onClick={handleAddRow}
                            >
                                <i className="fa-solid fa-plus" />
                            </Button>
                        </div>
                    </Flex>
                }
            />
            <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
                <Form
                    noValidate
                    // validated={formHasError || (oemMasterErr.oemProductDetailsErr && oemMasterErr.oemProductDetailsErr.invalidOemProductDetail)}
                    validated={formHasError}
                    className="details-form"
                    id="AddVendorProductCatalogueDetailsForm"
                >
                    <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                        <thead className='custom-bg-200'>
                            {rowData && <tr>
                                {columnsArray.map((column, index) => (
                                    <th className="text-left" key={index}>
                                        {column}
                                    </th>
                                ))}
                            </tr>}
                        </thead>
                        <tbody id="tbody" className="details-form">
                            {rowData.map((vendorProductCatalogueData, index) => (
                                <tr key={index}>
                                    <td>
                                        {index + 1}
                                    </td>                                   

                                    <td key={index}>
                                        <EnlargableTextbox
                                            name="productCategoryName"
                                            value={vendorProductCatalogueData.productCategoryName}
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            placeholder="Product Category"
                                            maxLength={20}
                                        />
                                    </td>

                                    <td key={index}>
                                        <EnlargableTextbox
                                            name="productName"
                                            value={vendorProductCatalogueData.productName}
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            placeholder="Product"
                                            maxLength={20}
                                        />
                                    </td>

                                    <td key={index}>
                                        <EnlargableTextbox
                                            name="varietyName"
                                            value={vendorProductCatalogueData.varietyName}
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            placeholder="Variety"
                                            maxLength={20}
                                        />
                                    </td>

                                    <td key={index}>
                                        <EnlargableTextbox
                                            name="brandName"
                                            value={vendorProductCatalogueData.brandName}
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            placeholder="Brand"
                                            maxLength={20}
                                        />
                                    </td>

                                    <td key={index}>
                                        <EnlargableTextbox
                                            name="quantity"
                                            value={vendorProductCatalogueData.quantity}
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            placeholder="Quantity"
                                            maxLength={5}
                                        />
                                    </td>

                                    <td key={index}>
                                        <Form.Select
                                            type="text"
                                            name="unitCode"
                                            className="form-control"
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            value={vendorProductCatalogueData.unitCode}
                                        >
                                            <option value=''>Select </option>
                                        </Form.Select>
                                    </td>

                                    <td key={index}>
                                        <EnlargableTextbox
                                            name="oemRate"
                                            value={vendorProductCatalogueData.oemRate}
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            placeholder="Rate"
                                            maxLength={13}
                                        />
                                    </td>

                                    <td key={index}>
                                        <EnlargableTextbox
                                            name="companyRate"
                                            value={vendorProductCatalogueData.companyRate}
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            placeholder="Amount"
                                            maxLength={13}
                                        />
                                    </td>

                                    <td key={index}>
                                        <Form.Control
                                            type='date'
                                            name="fromDate"
                                            placeholder="Select date"
                                        />
                                    </td>

                                    <td key={index}>
                                        <Form.Control
                                            type='date'
                                            name="toDate"
                                            placeholder="Select date"
                                        />
                                    </td>

                                    <td key={index}>
                                        <Form.Select
                                            type="text"
                                            name="activeStatus"
                                            className="form-control"
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            value={vendorProductCatalogueData.activeStatus}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Suspended">Suspended</option>
                                        </Form.Select>
                                    </td>

                                    <td key={index}>
                                        <FontAwesomeIcon icon={'plus'} className="fa-2x me-2"
                                            onClick={() => oemDetailModalPreview(index, oemProductData.productVarietyName)} />
                                        <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(oemProductData.encryptedProductVarietyCode) }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default VendorProductCatalogueDetails