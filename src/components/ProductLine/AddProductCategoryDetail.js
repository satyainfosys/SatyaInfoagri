import { formChangedAction, productCategoryDetailAction } from 'actions';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Button, Table, Form, Modal, Card } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

export const AddProductCategoryDetail = () => {
    const dispatch = useDispatch();
    const [formHasError, setFormError] = useState(false);
    const [rowData, setRowData] = useState([]);
    const columnsArray = [
        'S.No',
        'Category Name',
        'Short Name',
        'Crop Type',
        'Season',
        'Active Status',
        'Action'
    ]
    const [modalShow, setModalShow] = useState(false);
    const [paramsData, setParamsData] = useState({});

    const emptyRow = {
        id: rowData.length + 1,
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        encryptedProductCode: localStorage.getItem("EncryptedProductCode") ? localStorage.getItem("EncryptedProductCode") : "",
        productCategoryName: '',
        productCategoryShortName: '',
        cropType: '',
        season: '',
        activeStatus: '',
        addUser: localStorage.getItem("LoginUserName"),
        modifyUser: localStorage.getItem("LoginUserName")
    }

    const productCategoryDetailReducer = useSelector((state) => state.rootReducer.productCategoryDetailReducer)
    var productCategoryDetailData = productCategoryDetailReducer.productCategoryDetails

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const productLineDetailsErrorReducer = useSelector((state) => state.rootReducer.productLineDetailsErrorReducer)
    const productLineError = productLineDetailsErrorReducer.productLineDetailsError;

    useEffect(() => {
        setRowDataValue(productCategoryDetailReducer, productCategoryDetailData);
    }, [productCategoryDetailData, productCategoryDetailReducer]);

    const setRowDataValue = (productCategoryDetailReducer, productCategoryDetailData) => {
        setRowData(productCategoryDetailReducer.productCategoryDetails.length > 0 ? productCategoryDetailData : []);
    };

    const validateProductCategoryForm = () => {
        let isValid = true;

        if (productCategoryDetailData && productCategoryDetailData.length > 0) {
            productCategoryDetailData.forEach((row, index) => {
                if (!row.productCategoryName) {
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
        if (validateProductCategoryForm()) {
            productCategoryDetailData.unshift(emptyRow);
            dispatch(productCategoryDetailAction(productCategoryDetailData));
        }
    };

    const handleFieldChange = (e, index) => {
        const { name, value } = e.target;
        var productCategoryDetails = [...rowData];
        productCategoryDetails[index][name] = value;
        productCategoryDetails = Object.keys(rowData).map(key => {
            return rowData[key];
        })
        dispatch(productCategoryDetailAction(productCategoryDetails));

        if (productCategoryDetails[index].encryptedProductCategoryCode) {
            dispatch(formChangedAction({
                ...formChangedData,
                productCategoryDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                productCategoryDetailAdd: true
            }))
        }
    }

    const ModalPreview = (encryptedProductCategoryCode) => {
        setModalShow(true);
        setParamsData({ encryptedProductCategoryCode });
    }

    const deleteProductCategoryDetails = () => {
        if (!paramsData)
            return false;

        var objectIndex = productCategoryDetailReducer.productCategoryDetails.findIndex(x => x.encryptedProductCategoryCode == paramsData.encryptedProductCategoryCode);
        productCategoryDetailReducer.productCategoryDetails.splice(objectIndex, 1)

        var deleteProductCategoryCode = localStorage.getItem("DeleteProductCategoryCodes");

        if (paramsData.encryptedProductCategoryCode) {
            var deleteProductCategoryDetail = deleteProductCategoryCode ? deleteProductCategoryCode + "," + paramsData.encryptedProductCategoryCode : paramsData.encryptedProductCategoryCode;
            localStorage.setItem("DeleteProductCategoryCodes", deleteProductCategoryDetail);
        }

        toast.success("Product category details deleted successfully", {
            theme: 'colored'
        });

        dispatch(productCategoryDetailAction(productCategoryDetailData));

        dispatch(formChangedAction({
            ...formChangedData,
            productCategoryDetailDelete: true
        }))

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
                        <h4>Are you sure, you want to delete this product category detail?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button variant="danger" onClick={() => deleteProductCategoryDetails()}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            }
            <Card className="h-100 mb-2">
                <FalconCardHeader
                    title="Product Category Details"
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
                    productCategoryDetailData && productCategoryDetailData.length > 0 &&
                    <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
                        <Form
                            noValidate
                            validated={formHasError || (productLineError.productCategoryNameErr && productLineError.productCategoryNameErr.invalidProductCategory)}
                            className="details-form"
                            id="AddProductCategoryDetailsForm"
                        >

                            <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table many-column-table">
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
                                    {rowData.map((productCategoryDetailData, index) => (
                                        <tr key={index}>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td key={index}>
                                                <EnlargableTextbox
                                                    id="txtCategoryName"
                                                    name="productCategoryName"
                                                    value={productCategoryDetailData.productCategoryName}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Category Name"
                                                    className="form-control"
                                                    maxLength={30}
                                                    required={true}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    id="txtShortName"
                                                    name="productCategoryShortName"
                                                    value={productCategoryDetailData.productCategoryShortName}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Short Name"
                                                    maxLength={10}
                                                    className="form-control"
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtCropType"
                                                    name="cropType"
                                                    value={productCategoryDetailData.cropType}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    className="form-control"
                                                >
                                                    <option value=''>Crop Type</option>
                                                    <option value="Cash Crop">Cash Crop</option>
                                                    <option value="Food Crops">Food Crops</option>
                                                    <option value="Horticulture Crop">Horticulture Crop</option>
                                                    <option value="Plantation Crop">Plantation Crop</option>
                                                    <option value="Fertilizer">Fertilizer</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtSeason"
                                                    name="season"
                                                    className="form-control"
                                                    value={productCategoryDetailData.season}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                >
                                                    <option value=''>Season</option>
                                                    <option value='Rabi'>Rabi</option>
                                                    <option value='Kharif'>Kharif</option>
                                                    <option value='Zaid'>Zaid</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    id="txtStatus"
                                                    name="activeStatus"
                                                    className="form-control"
                                                    value={productCategoryDetailData.activeStatus}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Suspended">Suspended</option>
                                                </Form.Select>
                                            </td>

                                            <td>
                                                <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(productCategoryDetailData.encryptedProductCategoryCode) }} />
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

export default AddProductCategoryDetail