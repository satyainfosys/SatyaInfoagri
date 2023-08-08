import { oemProductDetailsAction } from 'actions';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Form, Modal, Card } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { toast } from 'react-toastify';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const OemProductDetails = () => {

    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);

    const emptyRow = {
        id: rowData.length + 1,
        encryptedOemMasterCode: localStorage.getItem("EncryptedOemMasterCode"),
        productLine: '',
        item: '',
        variety: '',
        brand: '',
        season: '',
        area: '',
        sowing: '',
        fertilizer: '',
        type: '',
        activeStatus: ''
    }

    let oemProductDetailsReducer = useSelector((state) => state.rootReducer.oemProductDetailsReducer)
    let oemProductData = oemProductDetailsReducer.oemProductDetails;

    const columnsArray = [
        'S.No',
        'Product Line',
        'Item',
        'Variety',
        'Brand',
        'Season',
        'Area',
        'Sowing',
        'Org/Inorg',
        'Type',
        'Status',
        'Add Info'
    ];

    const handleAddRow = async () => {
        oemProductData.unshift(emptyRow);
        dispatch(oemProductDetailsAction(oemProductData));
    }

    return (
        <>
            <Card className="h-100 mb-2">
                <FalconCardHeader
                    title="Family Details"
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
                {
                    oemProductData && oemProductData.length > 0 &&
                    <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
                        <Form
                            noValidate
                            // validated={formHasError || (farmerError.familyErr && farmerError.familyErr.invalidFamilyDetail)}
                            className="details-form"
                            id="AddOemProductDetailsForm"
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
                                    {rowData.map((oemProductData, index) => (
                                        <tr key={index}>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="productLine"
                                                    // onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.productLine}
                                                    className="form-control"
                                                >
                                                    <option value=''>Select</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    id="txtItem"
                                                    name="item"
                                                    value={oemProductData.item}
                                                    // onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Item"
                                                    maxLength={20}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    id="txtVariety"
                                                    name="variety"
                                                    value={oemProductData.variety}
                                                    // onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Variety"
                                                    maxLength={20}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    id="txtBrand"
                                                    name="brand"
                                                    value={oemProductData.brand}
                                                    // onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Brand"
                                                    maxLength={20}
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtSeason"
                                                    name="season"
                                                    // onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.season}
                                                    className="form-control"
                                                >
                                                    <option value=''>Select</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtArea"
                                                    name="area"
                                                    className="form-control"
                                                    // onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.area}
                                                >
                                                    <option value=''>Select Area</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtSowing"
                                                    name="sowing"
                                                    className="form-control"
                                                    // onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.sowing}
                                                >
                                                    <option value=''>Select Sowing</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtFertilizer"
                                                    name="fertilizer"
                                                    className="form-control"
                                                    // onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.fertilizer}
                                                >
                                                    <option value=''>Select Fertilier</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtType"
                                                    name="type"
                                                    className="form-control"
                                                    // onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.type}
                                                >
                                                    <option value=''>Select Type</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtType"
                                                    name="activeStatus"
                                                    className="form-control"
                                                    // onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.activeStatus}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Suspended">Suspended</option>
                                                </Form.Select>
                                            </td>

                                            <td>
                                                <FontAwesomeIcon icon={'plus'} className="fa-2x" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Form>
                    </Card.Body>
                }
            </Card>
        </>
    )
}

export default OemProductDetails