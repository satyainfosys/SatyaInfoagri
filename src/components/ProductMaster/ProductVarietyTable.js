import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Row, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { formChangedAction, productVarietyDetailsAction } from 'actions';

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
        productLineCode: localStorage.getItem("ProductLineCode") ? localStorage.getItem("ProductLineCode") : '',
        productCategoryCode: localStorage.getItem("ProductCategoryCode") ? localStorage.getItem("ProductCategoryCode") : '',
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

    const productMasterDetailsErrorReducer = useSelector((state) => state.rootReducer.productMasterDetailsErrorReducer)
    var productMasterError = productMasterDetailsErrorReducer.productMasterDetailsError;

    useEffect(() => {
        if (productVarietyDetailReducer.productVarietyDetails.length > 0) {
            setRowData(productVarietyDetailsData);
        }
    }, [productVarietyDetailsData, productVarietyDetailReducer])

    const validateProductVarietyForm = () => {
        let isValid = true;

        if (productVarietyDetailsData && productVarietyDetailsData.length > 0) {
            productVarietyDetailsData.forEach((row, index) => {
                if (!row.productVarietyName) {
                    isValid = false;
                    setFormError(true);
                }
            });
        }

        if (isValid) {
            setFormError(false);
        }

        return isValid;
    }

    const handleAddRow = () => {
        if (validateProductVarietyForm()) {
            productVarietyDetailsData.unshift(emptyRow);
            dispatch(productVarietyDetailsAction(productVarietyDetailsData));
        }
    };

    const handleFieldChange = (e, index) => {
        const { name, value } = e.target;
        var productVarietyDetails = [...rowData];
        productVarietyDetails[index][name] = value;
        productVarietyDetails = Object.keys(rowData).map(key => {
            return rowData[key];
        })
        dispatch(productVarietyDetailsAction(productVarietyDetails));

        if (productVarietyDetails[index].encryptedProductVarietyCode) {
            dispatch(formChangedAction({
                ...formChangedData,
                productVarietyDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                productVarietyDetailAdd: true
            }))
        }
    }

    const ModalPreview = (encryptedProductVarietyCode, productVarietyNameToBeDelete) => {
        setModalShow(true);
        setParamsData({ encryptedProductVarietyCode, productVarietyNameToBeDelete });
    }

    const deleteProductVarietyDetails = () => {
        if (!paramsData)
            return false;

        var objectIndex = productVarietyDetailReducer.productVarietyDetails.findIndex(x => x.productVarietyName == paramsData.productVarietyNameToBeDelete);
        productVarietyDetailReducer.productVarietyDetails.splice(objectIndex, 1);

        var deleteProductVarietyCode = localStorage.getItem("DeleteProductVarietyCodes");

        if (paramsData.encryptedProductVarietyCode) {
            var deleteProductVarietyCodes = deleteProductVarietyCode ? deleteProductVarietyCode + "," + paramsData.encryptedProductVarietyCode : paramsData.encryptedProductVarietyCode;
            localStorage.setItem("DeleteProductVarietyCodes", deleteProductVarietyCodes);

            dispatch(formChangedAction({
            ...formChangedData,
            productVarietyDetailDelete: true
        }))
        }

        toast.success("Product variety details deleted successfully", {
            theme: 'colored'
        });

        dispatch(productVarietyDetailsAction(productVarietyDetailsData));        

        setModalShow(false);
    }

    return (
        <>
            {modalShow && paramsData &&
                <Modal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Are you sure, you want to delete this product variety detail?</h5>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button variant="danger" onClick={() => deleteProductVarietyDetails()}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            }

            <Card className="h-100 mb-2">
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
                {
                    productVarietyDetailsData && productVarietyDetailsData.length > 0 &&
                    <Card.Body className="position-relative pb-0 p3px big-card-table">
                        <Form
                            noValidate
                            validated={formHasError || (productMasterError.productVarietyNameErr && productMasterError.productVarietyNameErr.invalidProductVariety)}
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
                                                    onChange={(e) => handleFieldChange(e, index)}
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
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Short Name"
                                                    className="form-control"
                                                    maxLength={10}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="perishableDays"
                                                    value={productVarietyDetailData.perishableDays}
                                                    onChange={(e) => handleFieldChange(e, index)}
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
                                                    value={productVarietyDetailData.activeStatus}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    className="form-control"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Suspended">Suspended</option>
                                                </Form.Select>
                                            </td>

                                            <td>
                                                <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(productVarietyDetailData.encryptedProductVarietyCode, productVarietyDetailData.productVarietyName) }} />
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

export default ProductVarietyTable