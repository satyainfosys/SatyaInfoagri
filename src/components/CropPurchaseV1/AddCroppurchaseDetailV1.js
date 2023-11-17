import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import { formChangedAction, materialReceiptDetailsAction } from 'actions';
import axios from 'axios';

const AddCroppurchaseDetailV1 = () => {

    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const [formHasError, setFormError] = useState(false);
    const [productCategoryList, setProductCategoryList] = useState([]);
    const [productCategoryDataList, setProductCategoryDataList] = useState([]);
    const [productMasterList, setProductMasterList] = useState([]);
    const [unitList, setUnitList] = useState([])
    const [paramsData, setParamsData] = useState({});
    const [modalShow, setModalShow] = useState(false);
    let oldMaterialStatus = localStorage.getItem("OldMaterialStatus");

    const emptyRow = {
        id: rowData.length + 1,
        encryptedMaterialReceiptId: localStorage.getItem("EncryptedMaterialReceiptId"),
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
        productLineCode: '',
        productCategoryCode: '',
        productCode: '',
        varietyName: '',
        brandName: '',
        quantity: '',
        grade: '',
        inOrg: '',
        rate: '',
        addUser: localStorage.getItem("LoginUserName"),
        modifyUser: localStorage.getItem("LoginUserName"),
    }

    const materialReceiptDetailsReducer = useSelector((state) => state.rootReducer.materialReceiptDetailsReducer)
    var materialReceiptData = materialReceiptDetailsReducer.materialReceiptDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const materialReceiptHeaderReducer = useSelector((state) => state.rootReducer.materialReceiptHeaderReducer)
    var materialReceiptHeaderData = materialReceiptHeaderReducer.materialReceiptHeaderDetails;

    const materialReceiptErrorReducer = useSelector((state) => state.rootReducer.materialReceiptErrorReducer)
    const materialDataErr = materialReceiptErrorReducer.materialReceiptError;

    const columnsArray = [
        'S.No',
        'Product Category',
        'Product',
        'Variety',
        'Brand',
        'Unit',
        'Qty',
        // 'Grade',
        // 'O/I',
        'Rate',
        'Amount',
        'Delete'
    ];

    useEffect(() => {
        if (unitList.length <= 0) {
            getUnitList();
        }

        if (materialReceiptDetailsReducer.materialReceiptDetails.length > 0) {
            setRowData(materialReceiptData);
        } else {
            setRowData([]);
        }

        setTimeout(function () {
            setProductMasterValue();
        }, 50)

        if (productCategoryList.length <= 0) {
            getProductCategoryList();
        }

    }, [materialReceiptData, materialReceiptDetailsReducer])

    const getUnitList = async () => {

        let requestData = {
            UnitType: "W"
        }
        let response = await axios.post(process.env.REACT_APP_API_URL + '/unit-list', requestData)
        let unitListData = [];

        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(units => {
                    unitListData.push({
                        key: units.unitName,
                        value: units.unitCode
                    })
                })
                setUnitList(unitListData);
            }
        }
        else {
            setUnitList([]);
        }
    }

    const setProductMasterValue = () => {
        materialReceiptData.map((row, index) => {
            getProductMasterList(row.productCategoryCode, index);
        })
    }

    const validateAddCropPurchaseDetails = () => {
        let isValid = true;

        if (materialReceiptData && materialReceiptData.length > 0) {
            materialReceiptData.forEach((row, index) => {
                if (!row.productLineCode || !row.productCategoryCode || !row.productCode || !row.receivedQuantity || !row.rate || !row.amount) {
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

    const handleAddItem = () => {
        if (validateAddCropPurchaseDetails()) {
            materialReceiptData.unshift(emptyRow);
            dispatch(materialReceiptDetailsAction(materialReceiptData));
            setProductMasterList(prevProductList => [...prevProductList, []]);
        }
    }

    const getProductCategoryList = async () => {

        let productCategoryData = [];
        let productCategoryResponse = await axios.get(process.env.REACT_APP_API_URL + '/product-category-master-list', {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (productCategoryResponse.data.status == 200) {
            if (productCategoryResponse.data && productCategoryResponse.data.data.length > 0) {
                setProductCategoryDataList(productCategoryResponse.data.data);
                productCategoryResponse.data.data.forEach(productCategory => {
                    productCategoryData.push({
                        key: productCategory.productCategoryName,
                        value: productCategory.productCategoryCode
                    })
                })
            }
            setProductCategoryList(productCategoryData);
        } else {
            setProductCategoryList([]);
        }


    }

    const getProductMasterList = async (productCategoryCode, index) => {
        const request = {
            pageNumber: 1,
            pageSize: 1,
            ProductCategoryCode: productCategoryCode
        }

        let productData = [];
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-product-master-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(product => {
                    productData.push({
                        key: product.productName,
                        value: product.code
                    })
                })
            }
            setProductMasterList(prevProductList => {
                const newProductList = [...prevProductList];
                newProductList[index] = productData;
                return newProductList;
            })
        } else {
            setProductMasterList(prevProductList => {
                const newProductList = [...prevProductList];
                newProductList[index] = productData;
                return newProductList;
            })
        }
    }

    const handleFieldChange = async (e, index) => {
        const { name, value } = e.target;
        var materialReceipt = [...rowData];
        materialReceipt[index][name] = value;
        materialReceipt = Object.keys(rowData).map(key => {
            return rowData[key];
        })
        dispatch(materialReceiptDetailsAction(materialReceipt));

        if (name == 'productCategoryCode') {
            const data = productCategoryDataList.find(item => item.productCategoryCode == value);
            materialReceipt[index].productLineCode = data.productLineCode;
            materialReceipt[index].productCode = '';
            value && getProductMasterList(value, index);
        }

        if (e.target.name == "receivedQuantity") {
            if (materialReceipt[index].rate) {
                var totalAmount = parseFloat(e.target.value) * parseFloat(materialReceipt[index].rate)
                materialReceipt[index].amount = totalAmount.toString();
                dispatch(materialReceiptDetailsAction(materialReceipt))
            }
        }

        if (e.target.name == "rate") {
            if (materialReceipt[index].receivedQuantity) {
                var totalAmount = parseFloat(e.target.value) * parseFloat(materialReceipt[index].receivedQuantity);
                materialReceipt[index].amount = totalAmount.toString();
                dispatch(materialReceiptDetailsAction(materialReceipt))
            }
        }

        if (materialReceipt[index].encryptedMaterialReceiptDetailId) {
            dispatch(formChangedAction({
                ...formChangedData,
                materialReceiptDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                materialReceiptDetailAdd: true
            }))
        }
    }

    const ModalPreview = (encryptedMaterialReceiptDetailId) => {
        setModalShow(true);
        setParamsData({ encryptedMaterialReceiptDetailId });
    }

    const deleteMaterialReceiptDetail = () => {
        if (!paramsData)
            return false;

        var objectIndex = materialReceiptDetailsReducer.materialReceiptDetails.findIndex(x => x.encryptedMaterialReceiptDetailId == paramsData.encryptedMaterialReceiptDetailId);
        materialReceiptDetailsReducer.materialReceiptDetails.splice(objectIndex, 1);

        var deleteMaterialReceiptDetailId = localStorage.getItem("DeleteCropPurchaseDetailIds");

        if (paramsData.encryptedMaterialReceiptDetailId) {
            var deleteMaterialReceiptDetail = deleteMaterialReceiptDetailId ? deleteMaterialReceiptDetailId + "," + paramsData.encryptedMaterialReceiptDetailId : paramsData.encryptedMaterialReceiptDetailId;
            localStorage.setItem("DeleteCropPurchaseDetailIds", deleteMaterialReceiptDetail);
        }

        toast.success("Material details deleted successfully", {
            theme: 'colored'
        });

        dispatch(materialReceiptDetailsAction(materialReceiptData))

        dispatch(formChangedAction({
            ...formChangedData,
            materialReceiptDetailDelete: true
        }));

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
                        <h4>Are you sure, you want to delete this Crop purchase detail?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button variant="danger" onClick={() => deleteMaterialReceiptDetail()}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            }

            <Card className="h-100 mb-2">
                <FalconCardHeader
                    title="Crop Purchase Details"
                    titleTag="h6"
                    className="py-2"
                    light
                    endEl={
                        <Flex>
                            {
                                materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved" ?
                                    null
                                    :
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
                            }
                        </Flex>
                    }
                />

                {
                    materialReceiptData && materialReceiptData.length > 0 &&
                    <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
                        <Form
                            noValidate
                            validated={formHasError || (materialDataErr.materialReceiptDetailErr && materialDataErr.materialReceiptDetailErr.invalidMaterialReceiptDetail)}
                            className="details-form"
                            id="AddCropPurchaseDetails"
                        >
                            <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                <thead className='custom-bg-200'>
                                    {rowData &&
                                        (<tr>
                                            {columnsArray.map((column, index) => {
                                                if (column === 'Delete' && materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved") {
                                                    return null;
                                                }
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
                                                    value={materialReceiptDetailData.unitCode ? materialReceiptDetailData.unitCode : ""}
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
                                                    name="receivedQuantity"
                                                    placeholder="Quantity"
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
                                                    disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                                    required
                                                />
                                            </td>

                                            {/* <td key={index}>
                                            <EnlargableTextbox
                                                name="grade"
                                                placeholder="Grade"
                                                maxLength={5}
                                                onChange={(e) => handleFieldChange(e, index)}
                                                value={materialReceiptDetailData.grade ? materialReceiptDetailData.grade : ""}
                                            />
                                        </td> */}

                                            {/* <td key={index}>
                                            <EnlargableTextbox
                                                name="inOrg"
                                                placeholder="Organic Inorgani"
                                                onChange={(e) => handleFieldChange(e, index)}
                                                value={materialReceiptDetailData.inOrg ? materialReceiptDetailData.inOrg : ""}
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
                                        </td> */}

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="rate"
                                                    placeholder="Rate"
                                                    maxLength={13}
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
                                                    maxLength={13}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={materialReceiptDetailData.amount ? materialReceiptDetailData.amount : ""}
                                                    disabled
                                                    required
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
                }
            </Card>
        </>
    )
}

export default AddCroppurchaseDetailV1