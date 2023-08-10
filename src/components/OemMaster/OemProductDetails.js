import { oemProductDetailsAction } from 'actions';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { toast } from 'react-toastify';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const OemProductDetails = () => {

    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const [oemModal, setOemModal] = useState(false);

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

    useEffect(() => {
        if (oemProductDetailsReducer.oemProductDetails.length > 0) {
            setRowData(oemProductData);
        }
    }, [oemProductData, oemProductDetailsReducer])

    const handleAddRow = async () => {
        oemProductData.unshift(emptyRow);
        dispatch(oemProductDetailsAction(oemProductData));
    }

    const oemDetailModalPreview = () => {
        setOemModal(true);
    }

    return (
        <>
            {
                oemModal &&
                <Modal
                    show={oemModal}
                    onHide={() => setOemModal(false)}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">OEM - Amazon</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="max-five-rows">
                        <Form
                            noValidate
                            // validated={modalError}
                            className="details-form"
                        >
                            <Row>
                                <div className="mb-2 d-flex justify-content-center align-items-center">Item - Item Name</div>
                                <hr></hr>
                                <Col className="me-3 ms-3 mb-3 mt-2" md="11">
                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Qty
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtQty" name="quantity" placeholder="Quantity" />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Select
                                                type="text"
                                                id="txtUnit"
                                                name="unit"
                                                className="form-control"
                                            >
                                                <option value=''>Select</option>
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Maturity Days
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtNoOfDays" name="noOfDays" placeholder="Maturity Days" />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Select
                                                type="text"
                                                id="txtUnitDays"
                                                name="unitDays"
                                                className="form-control"
                                            >
                                                <option value=''>Select</option>
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Yield Land
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtYieldLand" name="yieldLand" placeholder="Yield Land" />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Select
                                                type="text"
                                                id="txtLandUnit"
                                                name="landUnits"
                                                className="form-control"
                                            >
                                                <option value=''>Select</option>
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Yield Output
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtYieldOutput" name="yieldOutput" placeholder="Yield Output" />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Select
                                                type="text"
                                                id="txtYieldOutputUnits"
                                                name="yieldOutputUnits"
                                                className="form-control"
                                            >
                                                <option value=''>Select</option>
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </Col>

                                <Table
                                    style={{ paddingLeft: 0 }}
                                    striped bordered responsive className="text-nowrap tab-page-table">
                                    <thead className='custom-bg-200'>
                                        <tr>
                                            <th>Soil Ingredients</th>
                                            <th>From</th>
                                            <th>To</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                N
                                            </td>
                                            <td>
                                                <Form.Control placeholder="N From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="N To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                P
                                            </td>
                                            <td>
                                                <Form.Control placeholder="P From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="P To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                K
                                            </td>
                                            <td>
                                                <Form.Control placeholder="K From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="K To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                PH
                                            </td>
                                            <td>
                                                <Form.Control placeholder="PH From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="PH To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Temp
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Temp From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Temp To" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>

                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" >Save</Button>
                        <Button variant="danger" onClick={() => { setOemModal(false) }} >Cancel</Button>
                    </Modal.Footer>
                </Modal >
            }

            <Card className="h-100 mb-2">
                <FalconCardHeader
                    title="OEM Product Details"
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
                                                <FontAwesomeIcon icon={'plus'} className="fa-2x"
                                                    onClick={oemDetailModalPreview} />
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