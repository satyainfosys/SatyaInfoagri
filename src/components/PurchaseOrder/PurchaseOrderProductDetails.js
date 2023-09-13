import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import { useSelector, useDispatch } from 'react-redux';

const PurchaseOrderProductDetails = () => {

    const dispatch = useDispatch();
    const [formHasError, setFormError] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [vendorModal, setVendorModal] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const columnsArray = [
        'S.No',
        'Product Category',
        'Product',
        'Variety',
        'Brand',
        'Unit',
        'Quantity',
        'Vendor Rate',
        'Amt',
        'Delete',
    ];

    useEffect(() => {
    }, [])

    const handleAddItem = () => {
        setVendorModal(true)
    }

    return (
        <>
            {vendorModal &&
                <Modal
                    show={vendorModal}
                    onHide={() => setVendorModal(false)}
                    size="xl"
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
                                            <th>Select <Form.Check type="checkbox" id="vendorListChkbox" >
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    name="selectAll"
                                                    style={{ width: '15px', height: '15px' }}
                                                // onChange={handleHeaderCheckboxChange}
                                                // checked={selectAll}
                                                />
                                            </Form.Check>
                                            </th>
                                            <th>OEM Name</th>
                                            <th>Product</th>
                                            <th>Variety</th>
                                            <th>Brand</th>
                                            <th>Season</th>
                                            <th>Area</th>
                                            <th>Sowing</th>
                                            <th>Org/Inorg</th>
                                            <th>Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Form.Check type="checkbox" className="mb-1">
                                                    <Form.Check.Input
                                                        type="checkbox"
                                                        name="singleChkBox"
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
                                            {/* <td>{data.oemName}</td>
                                            <td>{data.productName}</td>
                                            <td>{data.varietyName}</td>
                                            <td>{data.brandName}</td>
                                            <td>{data.season}</td>
                                            <td>{data.area}</td>
                                            <td>{data.sowing}</td>
                                            <td>{data.orgInorg}</td>
                                            <td>{data.type}</td> */}
                                        </tr>
                                    </tbody>
                                </Table>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => handleSelectedItem()} >Add</Button>
                        <Button variant="danger" onClick={() => { setVendorModal(false) }} >Cancel</Button>
                    </Modal.Footer>
                </Modal >
            }

            <Card className="h-100 mb-2">
                <FalconCardHeader
                    title="Product Details"
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
                                    onClick={() => handleAddItem()}
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
                                {rowData.map((poProductDetailData, index) => (
                                    <tr key={index}>
                                        <td>
                                            {index + 1}
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="productCategory"
                                                placeholder="Product Category"
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="product"
                                                placeholder="Product"
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="varietyName"
                                                placeholder="Variety"
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="brandName"
                                                placeholder="Brand"
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <Form.Select
                                                type="text"
                                                name="unitCode"
                                                className="form-control select"
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            // value={vendorProductCatalogueData.unitCode}
                                            >
                                                <option value=''>Select </option>
                                            </Form.Select>
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="quantity"
                                                placeholder="Quantity"
                                                maxLength={5}
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="vendorRate"
                                                placeholder="Vendor Rate"
                                                maxLength={13}
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="amount"
                                                placeholder="Amount"
                                                maxLength={13}
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
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

export default PurchaseOrderProductDetails