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
    const [oemModal, setOemModal] = useState(false);
    const [oemProductCatalogueModal, setOemProductCatalogueModal] = useState(false);

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
        'Delete',
        'Show'
    ];

    useEffect(() => {
        if (vendorProductCatalogueDetailsReducer.vendorProductCatalogueDetails.length > 0) {
            setRowData(vendorProductCatalogueData);
        }
    }, [vendorProductCatalogueData, vendorProductCatalogueDetailsReducer])

    const handleAddItem = async () => {
        setOemModal(true);
    }

    const oemProductCatalogueModalPreview = async () => {
        setOemProductCatalogueModal(true);
    }

    return (
        <>
            {oemModal &&
                <Modal
                    show={oemModal}
                    onHide={() => setOemModal(false)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">OEM Detail</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="max-five-rows">
                        <Form className="details-form" id="OemDetailsForm" >
                            <Row>
                                <Col className="me-3 ms-3 mb-3 mt-2" md="11">
                                    <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                        <Form.Label column sm="1">
                                            Search
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtSearch" name="search" placeholder="Search" maxLength={45} />
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                    <thead className='custom-bg-200'>
                                        <tr>
                                            <th>Select</th>
                                            <th>OEM Name</th>
                                            <th>Product</th>
                                            <th>Variety</th>
                                            <th>Brand</th>
                                            <th>Season</th>
                                            <th>Area</th>
                                            <th>Sowing</th>
                                            <th>Org/Inorg</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Form.Check type="checkbox" id="contactListChkBox" className="mb-1">
                                                    <Form.Check.Input
                                                        type="checkbox"
                                                        name="Same as client"
                                                        style={{ width: '20px', height: '20px' }}
                                                    />
                                                </Form.Check>
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" >Add</Button>
                        <Button variant="danger" onClick={() => { setOemModal(false) }} >Cancel</Button>
                    </Modal.Footer>
                </Modal >
            }

            {oemProductCatalogueModal &&
                <Modal
                    show={oemProductCatalogueModal}
                    onHide={() => setOemProductCatalogueModal(false)}
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
                            className="details-form"
                        >
                            <Row>
                                <Col className="me-3 ms-3 mb-3 mt-2" md="11">
                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Qty
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtQty" name="seedQty" placeholder="Quantity" disabled />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control id="txtQty" name="seedUnitCode" placeholder="Unit" disabled />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Maturity Days
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtNoOfDays" name="maturityDays" placeholder="Maturity Days" disabled />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control id="txtUnitDays" name="maturityUnitCode" placeholder="Unit" disabled />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Maturity Days
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtYieldLand" name="yieldLand" placeholder="Yield Land" disabled />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control id="txtLandUnit" name="landUnitCode" placeholder="Unit" disabled />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Maturity Days
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtYieldOutput" name="yieldOutput" placeholder="Yield Output" disabled />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control id="txtYieldOutputUnits" name="yieldUnitCode" placeholder="Unit" disabled />
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
                                                <Form.Control placeholder="N From" name="nFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="N To" name="nTo" disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                P
                                            </td>
                                            <td>
                                                <Form.Control placeholder="P From" name="pFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="P To" name="pTo" disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                K
                                            </td>
                                            <td>
                                                <Form.Control placeholder="K From" name="kFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="K To" name="kTo" disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                PH
                                            </td>
                                            <td>
                                                <Form.Control placeholder="PH From" name="phFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="PH To" name="phTo" disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Temp
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Temp From" name="tempFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Temp To" name="tempTo" disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                EC
                                            </td>
                                            <td>
                                                <Form.Control placeholder="EC From" name="ecFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="EC To" name="ecTo" disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Organic Carbon
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Organic Carbon From" name="organicCarbonFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Organic Carbon To" name="organicCarbonTo" disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Sulphur
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Sulphur From" name="sulphurFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Sulphur To" name="sulphurTo" disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Iron
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Iron From" name="ironFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Iron To" name="ironTo" disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Zinc
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Zinc From" name="zincFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Zinc To" name="zincTo" disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Copper
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Copper From" name="copperFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Copper To" name="copperTo" disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Boron
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Boron From" name="boronFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Boron To" name="boronTo" disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Manganese
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Manganese From" name="manganeseFrom" disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Manganese To" name="manganeseTo" disabled />
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>

                            </Row>
                        </Form>
                    </Modal.Body>
                </Modal >
            }

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
                                    onClick={handleAddItem}
                                >
                                    Add Item
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
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="productName"
                                                value={vendorProductCatalogueData.productName}
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                placeholder="Product"
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="varietyName"
                                                value={vendorProductCatalogueData.varietyName}
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                placeholder="Variety"
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="brandName"
                                                value={vendorProductCatalogueData.brandName}
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                placeholder="Brand"
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="season"
                                                value={vendorProductCatalogueData.season}
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                placeholder="Season"
                                                disabled
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
                                            <FontAwesomeIcon icon={'trash'} className="fa-2x" />
                                        </td>

                                        <td key={index}>
                                            <FontAwesomeIcon icon={'plus'} className="fa-2x me-2"
                                                onClick={() => oemProductCatalogueModalPreview(vendorProductCatalogueData.encryptedOemProductCatalogueCode)} />
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

export default VendorProductCatalogueDetails