import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { handleNumericInputKeyPress } from '../../helpers/utils.js';
import { formChangedAction, materialReceiptDetailsAction, purchaseOrderProductDetailsAction,materialReceiptHeaderDetailsAction } from 'actions';

const AddMaterialReceiptDetail = () => {

    const dispatch = useDispatch();
    const [formHasError, setFormError] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [poModal, setPoModal] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [paramsData, setParamsData] = useState({});
    const [productCategoryList, setProductCategoryList] = useState([]);
    const [productCategoryDataList, setProductCategoryDataList] = useState([]);
    const [productMasterList, setProductMasterList] = useState([]);
    const [unitList, setUnitList] = useState([])
    let oldMaterialStatus = localStorage.getItem("OldMaterialStatus");



    const emptyRow = {
        id: rowData.length + 1,
        encryptedMaterialReceiptId: localStorage.getItem("EncryptedMaterialReceiptId"),
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
        productLineCode: '',
        productCategoryCode: '',
        productCode: '',
        receivedQuantity: '',
        rejectQuantity: '',
        varietyName: '',
        brandName: '',
        unitCode: '',
        rate: '',
        amount: '',
        addUser: localStorage.getItem("LoginUserName"),
        modifyUser: localStorage.getItem("LoginUserName"),
    }

    const materialReceiptDetailsReducer = useSelector((state) => state.rootReducer.materialReceiptDetailsReducer)
    var materialReceiptData = materialReceiptDetailsReducer.materialReceiptDetails;

    const materialReceiptHeaderReducer = useSelector((state) => state.rootReducer.materialReceiptHeaderReducer)
    var materialReceiptHeaderData = materialReceiptHeaderReducer.materialReceiptHeaderDetails;

    let purchaseOrderProductDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderProductDetailsReducer)
    let purchaseOrderProductDetailsList = purchaseOrderProductDetailsReducer.purchaseOrderProductDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

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
        'Receive Qty',
        'Rate',
        'Amount',
        'Rejected Qty',
        'Delete'
    ];

    useEffect(() => {

        if (unitList.length <= 0) {
            getUnitList();
        }

        if (materialReceiptDetailsReducer.materialReceiptDetails.length > 0) {
            setRowData(materialReceiptData);
            setSelectedRows([]);
        } else {
            setRowData([]);
            setSelectedRows([]);
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

    const validateMaterialReceiptDetailForm = () => {
        let isValid = true;

        if (materialReceiptData && materialReceiptData.length > 0) {
            materialReceiptData.forEach((row, index) => {
                if (!row.productLineCode || !row.productCategoryCode || !row.productCode || !row.receivedQuantity) {
                    isValid = false;
                    setFormError(true);
                }
                else if (!row.poDetailId) {
                    if (!row.rate || !row.amount) {
                        isValid = false;
                        setFormError(true);
                    }
                }
            });
        }

        if (isValid) {
            setFormError(false);
        }

        return isValid;
    }

    const handleAddItem = () => {
        if (materialReceiptHeaderData.poNo) {
            setPoModal(true);
            getPoDetailList()
        } else {
            if (validateMaterialReceiptDetailForm()) {
                materialReceiptData.unshift(emptyRow);
                dispatch(materialReceiptDetailsAction(materialReceiptData));
                setProductMasterList(prevProductList => [...prevProductList, []]);
            }
        }
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

    const handleCheckboxChange = (rowData) => {
        if (selectedRows.includes(rowData)) {
            setSelectedRows(selectedRows.filter(row => row !== rowData));
        } else {
            setSelectedRows([...selectedRows, rowData]);
        }
    };

    const handleSelectedItem = () => {
        if (selectAll) {
            const updatedData = [...purchaseOrderProductDetailsList]
            dispatch(materialReceiptDetailsAction(updatedData));
        } else {
            const updatedData = [...selectedRows, ...materialReceiptData];
            dispatch(materialReceiptDetailsAction(updatedData));
        }

        setPoModal(false);
        setSelectAll(false);
    }

    const handleFieldChange = async (e, index) => {
        const { name, value } = e.target;
        var materialReceipt = [...rowData];
        materialReceipt[index] = {
            ...materialReceipt[index],
            [name]: value
        };

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

            let receivedPoQty = 0;

            for (let i = 0; i < materialReceipt.length; i++) {
                receivedPoQty += materialReceipt[i].receivedQuantity ? parseFloat(materialReceipt[i].receivedQuantity) : 0;
            }

            dispatch(materialReceiptHeaderDetailsAction({
                ...materialReceiptHeaderData,
                receivedPoQty: receivedPoQty
            }))
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
                materialReceiptDetailUpdate: true, 
                materialReceiptHeaderDetailUpdate : true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                materialReceiptDetailAdd: true
            }))
        }
    }

    const onCancelClick = () => {
        setPoModal(false);
    }

    const handleHeaderCheckboxChange = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedRows([]);
        }
    };

    const ModalPreview = (encryptedMaterialReceiptDetailId) => {
        setModalShow(true);
        setParamsData({ encryptedMaterialReceiptDetailId });
    }

    const deleteMaterialReceiptDetail = () => {
        if (!paramsData)
            return false;

        var objectIndex = materialReceiptDetailsReducer.materialReceiptDetails.findIndex(x => x.encryptedMaterialReceiptDetailId == paramsData.encryptedMaterialReceiptDetailId);
        materialReceiptDetailsReducer.materialReceiptDetails.splice(objectIndex, 1);

        var deleteMaterialReceiptDetailId = localStorage.getItem("DeleteMaterialReceiptDetailIds");

        if (paramsData.encryptedMaterialReceiptDetailId) {
            var deleteMaterialReceiptDetail = deleteMaterialReceiptDetailId ? deleteMaterialReceiptDetailId + "," + paramsData.encryptedMaterialReceiptDetailId : paramsData.encryptedMaterialReceiptDetailId;
            localStorage.setItem("DeleteMaterialReceiptDetailIds", deleteMaterialReceiptDetail);
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
                        <h4>Are you sure, you want to delete this Material detail?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button variant="danger" onClick={() => deleteMaterialReceiptDetail()}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            }

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
                                {
                                    purchaseOrderProductDetailsReducer && purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.length > 0 ?
                                        <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                            <thead className='custom-bg-200'>
                                                <tr>
                                                    <th>S.No</th>
                                                    <th>Select <Form.Check type="checkbox" id="vendorListChkbox" >
                                                        <Form.Check.Input
                                                            type="checkbox"
                                                            name="selectAll"
                                                            style={{ width: '15px', height: '15px' }}
                                                            onChange={handleHeaderCheckboxChange}
                                                            checked={selectAll}
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
                                                            <td>{index + 1}</td>
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
                                        :
                                        <h5>No record found</h5>
                                }
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
                    title="Material Details"
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
                    <Card.Body className="position-relative pb-0 p3px mr-table-card">
                        <Form
                            noValidate
                            validated={formHasError || (materialDataErr.materialReceiptDetailErr && materialDataErr.materialReceiptDetailErr.invalidMaterialReceiptDetail)}
                            className="details-form"
                            id="AddMaterialReceipteDetailsForm"
                        >
                            <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                <thead className='custom-bg-200'>
                                    {rowData &&
                                        (<tr>
                                            {columnsArray.map((column, index) => {
                                                if (column === 'Delete' && materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved") {
                                                    return null;
                                                }

                                                if (column === 'Rate' && materialReceiptHeaderData.poNo) {
                                                    return null;
                                                }

                                                if (column === 'Amount' && materialReceiptHeaderData.poNo) {
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
                                        materialReceiptHeaderData.poNo ?
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
                                                    <EnlargableTextbox
                                                        name="unitName"
                                                        placeholder="Unit"
                                                        value={materialReceiptDetailData.unitName}
                                                        disabled
                                                    />
                                                </td>

                                                <td key={index}>
                                                    <EnlargableTextbox
                                                        name="quantity"
                                                        placeholder="Quantity"
                                                        maxLength={5}
                                                        onChange={(e) => handleFieldChange(e, index)}
                                                        value={materialReceiptDetailData.quantity}
                                                        onKeyPress={handleNumericInputKeyPress}
                                                        required
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
                                                        onKeyPress={handleNumericInputKeyPress}
                                                        required
                                                        disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                                    />
                                                </td>

                                                {/* <td key={index}>
                                                    <EnlargableTextbox
                                                        name="rate"
                                                        placeholder="Rate"
                                                        maxLength={5}
                                                        onChange={(e) => handleFieldChange(e, index)}
                                                        value={materialReceiptDetailData.poRate ? materialReceiptDetailData.poRate : ""}
                                                        onKeyPress={(e) => {
                                                            const keyCode = e.which || e.keyCode;
                                                            const keyValue = String.fromCharCode(keyCode);
                                                            const regex = /^[^A-Za-z]+$/;

                                                            if (!regex.test(keyValue)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        required
                                                        disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && materialReceiptHeaderData.materialStatus == "Approved"}
                                                    />
                                                </td>

                                                <td key={index}>
                                                    <EnlargableTextbox
                                                        name="amount"
                                                        placeholder="Amount"
                                                        maxLength={5}
                                                        onChange={(e) => handleFieldChange(e, index)}
                                                        value={materialReceiptDetailData.poAmount ? materialReceiptDetailData.poAmount : ""}
                                                        disabled
                                                        required
                                                    />
                                                </td> */}

                                                <td key={index}>
                                                    <EnlargableTextbox
                                                        name="rejectedQuantity"
                                                        placeholder="Rejected Quantity"
                                                        onChange={(e) => handleFieldChange(e, index)}
                                                        value={materialReceiptDetailData.rejectedQuantity ? materialReceiptDetailData.rejectedQuantity : ""}
                                                        onKeyPress={handleNumericInputKeyPress}
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
                                            :
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
                                                        onKeyPress={handleNumericInputKeyPress}
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
                                                        onKeyPress={handleNumericInputKeyPress}
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
                                                        onKeyPress={handleNumericInputKeyPress}
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
                                                        onKeyPress={handleNumericInputKeyPress}
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
                }
            </Card>
        </>
    )
}

export default AddMaterialReceiptDetail