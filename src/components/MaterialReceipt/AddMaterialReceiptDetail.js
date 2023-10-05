import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { purchaseOrderProductDetailsAction } from 'actions';

const AddMaterialReceiptDetail = () => {

    const dispatch = useDispatch();
    const [formHasError, setFormError] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [poModal, setPoModal] = useState(false);

    const materialReceiptDetailsReducer = useSelector((state) => state.rootReducer.materialReceiptDetailsReducer)
    var materialReceiptData = materialReceiptDetailsReducer.materialReceiptDetails;

    const materialReceiptHeaderReducer = useSelector((state) => state.rootReducer.materialReceiptHeaderReducer)
    var materialReceiptHeaderData = materialReceiptHeaderReducer.materialReceiptHeaderDetails;

    let purchaseOrderProductDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderProductDetailsReducer)
    let purchaseOrderProductDetailsList = purchaseOrderProductDetailsReducer.purchaseOrderProductDetails;

    const columnsArray = [
        'S.No',
        'Product Category',
        'Product',
        'Variety',
        'Brand',
        'Unit',
        'Qty',
        'Receive Qty',
        'Rejected Qty',
        'Delete'
    ];

    const handleAddItem = () => {
        setPoModal(true);
        // if (materialReceiptHeaderData.poNo) {
        //     setPoModal(true);
        //     getPoDetailList()
        // } else {
        //     toast.error("Select PO Number", {
        //         theme: 'colored'
        //     });
        // }
    }

    const getPoDetailList = async () => {
        const request = {
            PoNo: materialReceiptHeaderData.poNo
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-po-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                dispatch(purchaseOrderProductDetailsAction(response.data.data))
            }
        }
        else {
            dispatch(purchaseOrderProductDetailsAction([]))
        }
    }

    const onCancelClick = () => {
        setPoModal(false);
    }

    return (
        <>

            {
                poModal &&
                <Modal
                    show={poModal}
                    onHide={() => setPoModal(false)}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">PO Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="max-five-rows">
                        <Form className="details-form" id="OemDetailsForm" >
                            <Row>
                                {/* <Col className="me-3 ms-3" md="4">
                                    <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                        <Form.Label column sm="2">
                                            Search
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control id="txtSearch" name="search" placeholder="Search" maxLength={45} />
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col className="me-2 ms-3" md="4">
                                    <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                        <Col sm="8">
                                            <Form.Select
                                                type="text"
                                                name="productCategoryCode"
                                                onChange={handleProductCategoryChange}
                                                value={productCategory}
                                                className="form-control"
                                            >
                                                <option value=''>Select Product Category</option>
                                                {productCategoryList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col className="me-2 ms-3" md="3">
                                    <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                        <Col sm="8">
                                            <Form.Select
                                                type="text"
                                                name="productCode"
                                                onChange={handleProductChange}
                                                value={product}
                                                className="form-control"
                                            >
                                                <option value=''>Select Product</option>
                                                {productMasterList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </Col> */}

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
                                            <th>Product Category</th>
                                            <th>Product</th>
                                            <th>Variety</th>
                                            <th>Brand</th>
                                            <th>Unit</th>
                                            <th>Quantity</th>
                                            <th>Rate</th>
                                            <th>Tax Basis</th>
                                            <th>Tax Rate</th>
                                            <th>Tax Amount</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.map((data, index) =>
                                                <tr>
                                                    <td key={index}>
                                                        <Form.Check type="checkbox" className="mb-1">
                                                            <Form.Check.Input
                                                                type="checkbox"
                                                                name="singleChkBox"
                                                                style={{ width: '20px', height: '20px' }}
                                                                onChange={() => handleCheckboxChange(data)}
                                                                checked={selectAll || selectedRows.includes(data)}
                                                            />
                                                        </Form.Check>
                                                    </td>
                                                    <td>{data.productCategoryName}</td>
                                                    <td>{data.productName}</td>
                                                    <td>{data.varietyName}</td>
                                                    <td>{data.brandName}</td>
                                                    <td>{data.unitName}</td>
                                                    <td>{data.quantity}</td>
                                                    <td>{data.poRate}</td>
                                                    <td>{data.taxBasis}</td>
                                                    <td>{data.taxRate}</td>
                                                    <td>{data.taxAmount}</td>
                                                    <td>{data.poAmt}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => handleSelectedItem()} >Add</Button>
                        <Button variant="danger" onClick={() => onCancelClick()} >Cancel</Button>
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
                                    Add Items
                                </Button>
                            </div>
                        </Flex>
                    }
                />
                <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
                    <Form
                        noValidate
                        // validated={formHasError || (purchaseOrderErr.poProductDetailsErr && purchaseOrderErr.poProductDetailsErr.invalidPoProductDetail)}
                        className="details-form"
                        id="AddMaterialReceipteDetailsForm"
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
                                {rowData.map((materialReceiptDetailData, index) => (
                                    <tr key={index}>
                                        <td>
                                            {index + 1}
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="productCategoryName"
                                                placeholder="Product Category"
                                                value={materialReceiptDetailData.productCategoryName}
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="productName"
                                                placeholder="Product"
                                                value={materialReceiptDetailData.productName}
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="varietyName"
                                                value={materialReceiptDetailData.varietyName}
                                                placeholder="Variety"
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="brandName"
                                                value={materialReceiptDetailData.brandName}
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
                                                value={materialReceiptDetailData.unitCode}
                                            >
                                                <option value=''>Select </option>
                                                {/* {quantityUnitList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))} */}
                                            </Form.Select>
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="quantity"
                                                placeholder="Quantity"
                                                maxLength={5}
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                value={materialReceiptDetailData.quantity}
                                                required
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="receivedQuantity"
                                                placeholder="Received Qty"
                                                maxLength={10}
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                value={poProductDetailData.poRate}
                                                required
                                                disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="rejectedQuantity"
                                                placeholder="Rejected Quantity"
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                value={materialReceiptDetailData.vendorRate}
                                                maxLength={10}
                                            />
                                        </td>

                                        <td key={index}>
                                            <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(poProductDetailData.encryptedPoDetailId) }} />
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

export default AddMaterialReceiptDetail