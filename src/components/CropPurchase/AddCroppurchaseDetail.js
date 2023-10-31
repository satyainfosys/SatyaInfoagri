import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';

const AddCroppurchaseDetail = () => {

    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const [formHasError, setFormError] = useState(false);


    const emptyRow = {
        id: rowData.length + 1,
        encryptedMaterialReceiptId: localStorage.getItem("EncryptedMaterialReceiptId"),
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
        productLineCode: '',
        productCategoryCode: '',
        productCode: '',
        quantity: '',
        grade: '',
        inOrg: '',
        rate: '',
        addUser: localStorage.getItem("LoginUserName"),
        modifyUser: localStorage.getItem("LoginUserName"),
    }

    const columnsArray = [
        'S.No',
        'Product Category',
        'Product',
        'Qty',
        'Grade',
        'O/I',
        'Rate',
        'Delete'
    ];

    return (
        <>
            <Card className="h-100 mb-2">
                <FalconCardHeader
                    title="Material Details"
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
                                // onClick={() => handleAddItem()}
                                >
                                    Add Items
                                </Button>
                            </div>
                        </Flex>
                    }
                />

                <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
                    <Form
                        noValidate
                        // validated={formHasError || (materialDataErr.materialReceiptDetailErr && materialDataErr.materialReceiptDetailErr.invalidMaterialReceiptDetail)}
                        className="details-form"
                        id="AddCropPurchaseDetails"
                    >
                        <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                            <thead className='custom-bg-200'>
                                {rowData &&
                                    (<tr>
                                        {columnsArray.map((column, index) => {
                                            // if (column === 'Delete' && materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved") {
                                            //     return null;
                                            // }

                                            // if (column === 'Rate' && materialReceiptHeaderData.poNo) {
                                            //     return null;
                                            // }

                                            // if (column === 'Amount' && materialReceiptHeaderData.poNo) {
                                            //     return null;
                                            // }
                                            return (
                                                <th className="text-left" key={index}>
                                                    {column}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                    )}
                            </thead>
                            <tbody id="tbody" className="details-form">
                                {rowData.map((materialReceiptDetailData, index) => (
                                    <tr key={index}>
                                        <td>
                                            {index + 1}
                                        </td>

                                        <td key={index}>
                                            <Form.Select
                                                type="text"
                                                name="productCategoryCode"
                                                onChange={(e) => handleFieldChange(e, index)}
                                                value={materialReceiptDetailData.productCategoryCode}
                                                className="form-control"
                                                required
                                                disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                            >
                                                <option value=''>Select</option>
                                                {productCategoryList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))}
                                            </Form.Select>
                                        </td>

                                        <td key={index}>
                                            <Form.Select
                                                type="text"
                                                name="productCode"
                                                onChange={(e) => handleFieldChange(e, index)}
                                                value={materialReceiptDetailData.productCode}
                                                className="form-control"
                                                required
                                                disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                            >
                                                <option value=''>Select</option>
                                                {productMasterList[index] && productMasterList[index].map((option, mapIndex) => (
                                                    <option key={mapIndex} value={option.value}>{option.key}</option>
                                                ))}
                                            </Form.Select>
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="varietyName"
                                                value={materialReceiptDetailData.varietyName}
                                                onChange={(e) => handleFieldChange(e, index)}
                                                placeholder="Variety"
                                                maxLength={20}
                                                disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="brandName"
                                                value={materialReceiptDetailData.brandName}
                                                onChange={(e) => handleFieldChange(e, index)}
                                                placeholder="Brand"
                                                maxLength={20}
                                                disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                            />
                                        </td>

                                        <td key={index}>
                                            <Form.Select
                                                type="text"
                                                name="unitCode"
                                                className="form-control select"
                                                onChange={(e) => handleFieldChange(e, index)}
                                                value={materialReceiptDetailData.unitCode}
                                                disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                            >
                                                <option value=''>Select </option>
                                                {unitList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))}
                                            </Form.Select>
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="quantity"
                                                placeholder="Quantity"
                                                maxLength={5}
                                                onChange={(e) => handleFieldChange(e, index)}
                                                value={materialReceiptDetailData.quantity}
                                                onKeyPress={(e) => {
                                                    const keyCode = e.which || e.keyCode;
                                                    const keyValue = String.fromCharCode(keyCode);
                                                    const regex = /^[^A-Za-z]+$/;

                                                    if (!regex.test(keyValue)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="receivedQuantity"
                                                placeholder="Received Qty"
                                                maxLength={5}
                                                onChange={(e) => handleFieldChange(e, index)}
                                                value={materialReceiptDetailData.receivedQuantity ? materialReceiptDetailData.receivedQuantity : ""}
                                                onKeyPress={(e) => {
                                                    const keyCode = e.which || e.keyCode;
                                                    const keyValue = String.fromCharCode(keyCode);
                                                    const regex = /^[^A-Za-z]+$/;

                                                    if (!regex.test(keyValue)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                required
                                                disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="rate"
                                                placeholder="Rate"
                                                maxLength={5}
                                                onChange={(e) => handleFieldChange(e, index)}
                                                value={materialReceiptDetailData.rate ? materialReceiptDetailData.rate : ""}
                                                onKeyPress={(e) => {
                                                    const keyCode = e.which || e.keyCode;
                                                    const keyValue = String.fromCharCode(keyCode);
                                                    const regex = /^[^A-Za-z]+$/;

                                                    if (!regex.test(keyValue)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                required
                                                disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="amount"
                                                placeholder="Amount"
                                                maxLength={5}
                                                onChange={(e) => handleFieldChange(e, index)}
                                                value={materialReceiptDetailData.amount ? materialReceiptDetailData.amount : ""}
                                                disabled
                                                required
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="rejectedQuantity"
                                                placeholder="Rejected Quantity"
                                                onChange={(e) => handleFieldChange(e, index)}
                                                value={materialReceiptDetailData.rejectedQuantity ? materialReceiptDetailData.rejectedQuantity : ""}
                                                onKeyPress={(e) => {
                                                    const keyCode = e.which || e.keyCode;
                                                    const keyValue = String.fromCharCode(keyCode);
                                                    const regex = /^[^A-Za-z]+$/;

                                                    if (!regex.test(keyValue)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                maxLength={5}
                                                disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                            />
                                        </td>

                                        {
                                            materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved" ?
                                                null
                                                :
                                                <td key={index}>
                                                    <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(materialReceiptDetailData.encryptedMaterialReceiptDetailId) }} />
                                                </td>
                                        }
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

export default AddCroppurchaseDetail