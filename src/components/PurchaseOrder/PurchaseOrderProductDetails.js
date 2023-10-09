import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formChangedAction, purchaseOrderDetailsAction, purchaseOrderProductDetailsAction, vendorProductCatalogueDetailsAction } from 'actions';

const PurchaseOrderProductDetails = () => {

    const dispatch = useDispatch();
    const [formHasError, setFormError] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [vendorModal, setVendorModal] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [quantityUnitList, setQuantityUnitList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [paramsData, setParamsData] = useState({});
    const [poTaxAmount, setPoTaxAmount] = useState();
    const [productCategoryList, setProductCategoryList] = useState([]);
    const [productCategory, setProductCategory] = useState();
    const [productMasterList, setProductMasterList] = useState([]);
    const [product, setProduct] = useState();

    const purchaseOrderDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsReducer)
    var purchaseOrderData = purchaseOrderDetailsReducer.purchaseOrderDetails;

    let vendorProductCatalogueDetailsReducer = useSelector((state) => state.rootReducer.vendorProductCatalogueDetailsReducer)
    let vendorProductCatalogueList = vendorProductCatalogueDetailsReducer.vendorProductCatalogueDetails;

    let purchaseOrderProductDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderProductDetailsReducer)
    let purchaseOrderProductDetailsData = purchaseOrderProductDetailsReducer.purchaseOrderProductDetails;

    const purchaseOrderDetailsErrorReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsErrorReducer)
    const purchaseOrderErr = purchaseOrderDetailsErrorReducer.purchaseOrderDetailsError;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const columnsArray = [
        'S.No',
        'Product Category',
        'Product',
        'Variety',
        'Brand',
        'Unit',
        'Quantity',
        'PO Rate',
        'Vendor Rate',
        'Tax Basis',
        'Tax Rate',
        'Tax Amount',
        'Amt',
        'Delete',
    ];

    useEffect(() => {
        if (purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.length > 0) {
            setRowData(purchaseOrderProductDetailsData);
            setSelectedRows([]);
            if (quantityUnitList.length <= 0) {
                getUnitList("W");
            }
        } else {
            setRowData([]);
            setSelectedRows([]);
        }

        const totalPoAmount = purchaseOrderProductDetailsData.length > 1
            ? purchaseOrderProductDetailsData.reduce((acc, obj) => {
                const poAmount = obj.poAmt !== "" ? parseFloat(obj.poAmt) : 0;
                return acc + poAmount;
            }, 0)
            : purchaseOrderProductDetailsData.length === 1
                ? parseFloat(purchaseOrderProductDetailsData[0].poAmt)
                : 0;

        dispatch(purchaseOrderDetailsAction({
            ...purchaseOrderData,
            poAmount: totalPoAmount
        }))

        if (purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved") {
            $("#btnSave").attr('disabled', true);
        }

        if (productCategoryList.length <= 0) {
            getProductCategoryList();
        }

    }, [purchaseOrderProductDetailsData, purchaseOrderProductDetailsReducer])

    const handleAddItem = () => {
        setVendorModal(true)
        getVendorProductCatalogueMasterList();
    }

    const getVendorProductCatalogueMasterList = async (searchText, productCategoryCode, productCode) => {
        const requestData = {
            vendorCode: purchaseOrderData.vendorCode,
            searchText: searchText,
            ProductCategoryCode: productCategoryCode ? productCategoryCode : productCategory,
            ProductCode: productCode ? productCode : product
        }

        const response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-product-catalogue-master-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                dispatch(vendorProductCatalogueDetailsAction(response.data.data));
            }
        }
        else {
            dispatch(vendorProductCatalogueDetailsAction([]));
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
            const updatedData = [...vendorProductCatalogueList]
            dispatch(purchaseOrderProductDetailsAction(updatedData));
        } else {
            const updatedData = purchaseOrderProductDetailsData.concat(selectedRows);
            dispatch(purchaseOrderProductDetailsAction(updatedData));
        }
        dispatch(formChangedAction({
            ...formChangedData,
            purchaseOrderProductDetailsAdd: true
        }))

        setVendorModal(false);
        setSelectAll(false);
    }

    const getUnitList = async (type) => {

        let requestData = {
            UnitType: type
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
                setQuantityUnitList(unitListData)
            }
        }
        else {
            setQuantityUnitList([]);
        }
    }

    const calculateTaxAmount = async (taxBasis, taxRate, quantity, rate) => {
        if (taxBasis == "Percentage") {
            const totalAmount = quantity * rate
            const calculatedTaxAmount = totalAmount * taxRate / 100
            setPoTaxAmount(calculatedTaxAmount.toString());
            return calculatedTaxAmount;
        }

        return 0;
    }

    const handleFieldChange = async (e, index) => {
        const { name, value } = e.target;
        var purchaseOrderProductDetail = [...rowData];
        purchaseOrderProductDetail[index] = {
            ...purchaseOrderProductDetail[index],
            [name]: value
        };

        dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))

        if (e.target.name == "quantity") {
            if (purchaseOrderProductDetail[index].poRate) {
                if (purchaseOrderProductDetail[index].taxBasis == "Percentage" && purchaseOrderProductDetail[index].taxRate) {
                    var poTaxAmount = await calculateTaxAmount("Percentage", parseFloat(purchaseOrderProductDetail[index].taxRate), parseFloat(e.target.value), parseFloat(purchaseOrderProductDetail[index].poRate))
                    const calculatedPoAmount = parseFloat(e.target.value) * parseFloat(purchaseOrderProductDetail[index].poRate) + parseFloat(poTaxAmount)
                    purchaseOrderProductDetail[index].taxAmount = poTaxAmount.toString();
                    purchaseOrderProductDetail[index].poAmt = calculatedPoAmount.toString();
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
                else if (purchaseOrderProductDetail[index].taxBasis == "Lumpsum" && purchaseOrderProductDetail[index].taxRate) {
                    const calculatedPoAmount = parseFloat(e.target.value) * parseFloat(purchaseOrderProductDetail[index].poRate) + parseFloat(purchaseOrderProductDetail[index].taxRate)
                    purchaseOrderProductDetail[index].taxAmount = purchaseOrderProductDetail[index].taxRate;
                    purchaseOrderProductDetail[index].poAmt = calculatedPoAmount.toString();
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
                else {
                    const calculatedPoAmount = parseFloat(e.target.value) * parseFloat(purchaseOrderProductDetail[index].poRate)
                    purchaseOrderProductDetail[index].poAmt = calculatedPoAmount.toString();
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
            }
        }

        if (e.target.name == "poRate") {
            if (purchaseOrderProductDetail[index].quantity) {
                if (purchaseOrderProductDetail[index].taxBasis == "Percentage" && purchaseOrderProductDetail[index].taxRate) {
                    var poTaxAmount = await calculateTaxAmount("Percentage", parseFloat(purchaseOrderProductDetail[index].taxRate), parseFloat(purchaseOrderProductDetail[index].quantity), parseFloat(e.target.value))
                    const calculatedPoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(e.target.value) + parseFloat(poTaxAmount);
                    purchaseOrderProductDetail[index].taxAmount = poTaxAmount.toString();
                    purchaseOrderProductDetail[index].poAmt = calculatedPoAmount.toString();
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
                else if (purchaseOrderProductDetail[index].taxBasis == "Lumpsum" && purchaseOrderProductDetail[index].taxRate) {
                    const calculatedPoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(e.target.value) + parseFloat(purchaseOrderProductDetail[index].taxRate)
                    purchaseOrderProductDetail[index].taxAmount = purchaseOrderProductDetail[index].taxRate;
                    purchaseOrderProductDetail[index].poAmt = calculatedPoAmount.toString();
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
                else {
                    const calculatedPoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(e.target.value)
                    purchaseOrderProductDetail[index].poAmt = calculatedPoAmount.toString();
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
            }
            else if (parseFloat(purchaseOrderProductDetail[index].poAmt) > 0) {
                if (purchaseOrderProductDetail[index].taxAmount) {
                    const calculatedQuantity = (parseFloat(purchaseOrderProductDetail[index].poAmt) - parseFloat(purchaseOrderProductDetail[index].taxAmount)) / parseFloat(e.target.value)
                    purchaseOrderProductDetail[index].quantity = calculatedQuantity.toString();
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
                else {
                    const calculatedQuantity = parseFloat(purchaseOrderProductDetail[index].poAmt) / parseFloat(e.target.value)
                    purchaseOrderProductDetail[index].quantity = calculatedQuantity.toString();
                    if (purchaseOrderProductDetail[index].taxBasis == "Percentage" && purchaseOrderProductDetail[index].taxRate) {
                        var poTaxAmount = await calculateTaxAmount("Percentage", parseFloat(purchaseOrderProductDetail[index].taxRate), calculatedQuantity, parseFloat(e.target.value));
                        purchaseOrderProductDetail[index].taxAmount = poTaxAmount.toString();
                    }
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
            }
        }

        if (e.target.name == "poAmt") {
            if (purchaseOrderProductDetail[index].poRate) {
                if (purchaseOrderProductDetail[index].taxAmount) {
                    const calculatedQuantity = (parseFloat(e.target.value) - parseFloat(purchaseOrderProductDetail[index].taxAmount)) / parseFloat(purchaseOrderProductDetail[index].poRate)
                    purchaseOrderProductDetail[index].quantity = calculatedQuantity.toString();
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
                else {
                    const calculatedQuantity = parseFloat(e.target.value) / parseFloat(purchaseOrderProductDetail[index].poRate)
                    purchaseOrderProductDetail[index].quantity = calculatedQuantity.toString();
                    if (purchaseOrderProductDetail[index].taxBasis == "Percentage" && purchaseOrderProductDetail[index].taxRate) {
                        var poTaxAmount = await calculateTaxAmount("Percentage", parseFloat(purchaseOrderProductDetail[index].taxRate), calculatedQuantity, parseFloat(purchaseOrderProductDetail[index].poRate));
                        purchaseOrderProductDetail[index].taxAmount = poTaxAmount.toString();
                    }
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
            }
        }

        if (e.target.name == "taxRate") {
            if (purchaseOrderProductDetail[index].taxBasis == "Percentage" && purchaseOrderProductDetail[index].quantity && purchaseOrderProductDetail[index].poRate) {
                if (parseFloat(e.target.value) > 0) {
                    var poTaxAmount = await calculateTaxAmount("Percentage", parseFloat(e.target.value), parseFloat(purchaseOrderProductDetail[index].quantity), parseFloat(purchaseOrderProductDetail[index].poRate))
                    const calculatePoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(purchaseOrderProductDetail[index].poRate) + parseFloat(poTaxAmount);
                    purchaseOrderProductDetail[index].poAmt = calculatePoAmount.toString();
                    purchaseOrderProductDetail[index].taxAmount = poTaxAmount.toString();
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
                else {
                    const calculatePoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(purchaseOrderProductDetail[index].poRate);
                    purchaseOrderProductDetail[index].poAmt = calculatePoAmount.toString();
                    purchaseOrderProductDetail[index].taxAmount = "";
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
            }
            else if (purchaseOrderProductDetail[index].taxBasis == "Lumpsum" && purchaseOrderProductDetail[index].quantity && purchaseOrderProductDetail[index].poRate) {
                if (parseFloat(e.target.value) > 0) {
                    purchaseOrderProductDetail[index].taxAmount = purchaseOrderProductDetail[index].taxRate;
                    const calculatePoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(purchaseOrderProductDetail[index].poRate) + parseFloat(purchaseOrderProductDetail[index].taxRate);
                    purchaseOrderProductDetail[index].poAmt = calculatePoAmount.toString();
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
                else {
                    const calculatePoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(purchaseOrderProductDetail[index].poRate);
                    purchaseOrderProductDetail[index].poAmt = calculatePoAmount.toString();
                    purchaseOrderProductDetail[index].taxAmount = "";
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
            }
        }

        if (e.target.name == "taxBasis") {
            if (e.target.value == "Percentage" && purchaseOrderProductDetail[index].quantity && purchaseOrderProductDetail[index].poRate) {
                if (parseFloat(purchaseOrderProductDetail[index].taxRate) > 0) {
                    var poTaxAmount = await calculateTaxAmount("Percentage", parseFloat(purchaseOrderProductDetail[index].taxRate), parseFloat(purchaseOrderProductDetail[index].quantity), parseFloat(purchaseOrderProductDetail[index].poRate))
                    const calculatePoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(purchaseOrderProductDetail[index].poRate) + parseFloat(poTaxAmount);
                    purchaseOrderProductDetail[index].poAmt = calculatePoAmount.toString();
                    purchaseOrderProductDetail[index].taxAmount = poTaxAmount;
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
                else {
                    const calculatePoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(purchaseOrderProductDetail[index].poRate);
                    purchaseOrderProductDetail[index].poAmt = calculatePoAmount.toString();
                    purchaseOrderProductDetail[index].taxAmount = "";
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
            }
            else if (e.target.value == "Lumpsum" && purchaseOrderProductDetail[index].quantity && purchaseOrderProductDetail[index].poRate) {
                if (parseFloat(purchaseOrderProductDetail[index].taxRate) > 0) {
                    purchaseOrderProductDetail[index].taxAmount = purchaseOrderProductDetail[index].taxRate;
                    const calculatePoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(purchaseOrderProductDetail[index].poRate) + parseFloat(purchaseOrderProductDetail[index].taxRate);
                    purchaseOrderProductDetail[index].poAmt = calculatePoAmount.toString();
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
                else {
                    const calculatePoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(purchaseOrderProductDetail[index].poRate);
                    purchaseOrderProductDetail[index].poAmt = calculatePoAmount.toString();
                    purchaseOrderProductDetail[index].taxAmount = "";
                    dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
                }
            }
            else {
                const calculatePoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(purchaseOrderProductDetail[index].poRate)
                purchaseOrderProductDetail[index].poAmt = calculatePoAmount.toString();
                dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
            }
        }

        if (purchaseOrderProductDetail[index].encryptedPoDetailId) {
            dispatch(formChangedAction({
                ...formChangedData,
                purchaseOrderProductDetailsUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                purchaseOrderProductDetailsAdd: true
            }))
        }
    }

    const ModalPreview = (encryptedPoDetailId) => {
        setModalShow(true);
        setParamsData({ encryptedPoDetailId });
    }

    const deletePoProductDetail = () => {
        if (!paramsData)
            return false;

        var objectIndex = purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.findIndex(x => x.encryptedPoDetailId == paramsData.encryptedPoDetailId);
        purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.splice(objectIndex, 1)

        var deletePoProductDetailId = localStorage.getItem("DeletePoProductDetailIds");

        if (paramsData.encryptedPoDetailId) {
            var deletePoProductDetail = deletePoProductDetailId ? deletePoProductDetailId + "," + paramsData.encryptedPoDetailId : paramsData.encryptedPoDetailId;
            localStorage.setItem("DeletePoProductDetailIds", deletePoProductDetail);
        }

        toast.success("PO product details deleted successfully", {
            theme: 'colored'
        });

        dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetailsData));

        dispatch(formChangedAction({
            ...formChangedData,
            purchaseOrderProductDetailsDelete: true
        }))

        setModalShow(false);
    }

    const handleProductCategoryChange = e => {
        setProductCategory(e.target.value);
        getVendorProductCatalogueMasterList("", e.target.value);
        getProductList(e.target.value);
    }

    const getProductCategoryList = async () => {

        let productCategoryData = [];
        let productCategoryResponse = await axios.get(process.env.REACT_APP_API_URL + '/product-category-master-list', {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (productCategoryResponse.data.status == 200) {
            if (productCategoryResponse.data && productCategoryResponse.data.data.length > 0) {
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

    const getProductList = async (productCategoryCode) => {
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
            setProductMasterList(productData);
        } else {
            setProductMasterList([]);
        }
    }

    const handleProductChange = e => {
        setProduct(e.target.value);
        getVendorProductCatalogueMasterList('', productCategory, e.target.value);
    }

    const onCancelClick = async () => {
        setVendorModal(false);
        setProductCategory();
        setProduct();
    }

    const handleHeaderCheckboxChange = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedRows([]);
        }
    };

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
                        <h4>Are you sure, you want to delete this PO Product detail?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button variant="danger" onClick={() => deletePoProductDetail()}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            }

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
                        <Modal.Title id="contained-modal-title-vcenter">Vendor Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="max-five-rows">
                        <Form className="details-form" id="OemDetailsForm" >
                            <Row>
                                <Col className="me-3 ms-3" md="4">
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
                                </Col>

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
                                            <th>OEM Name</th>
                                            <th>Product Category</th>
                                            <th>Product</th>
                                            <th>Variety</th>
                                            <th>Brand</th>
                                            <th>Type</th>
                                            <th>Unit</th>
                                            <th>Rate</th>
                                            <th>Org/Inorg</th>
                                            <th>Season</th>
                                            <th>Area</th>
                                            <th>Sowing</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            vendorProductCatalogueDetailsReducer.vendorProductCatalogueDetails.map((data, index) =>
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
                                                    <td>{data.oemName}</td>
                                                    <td>{data.productCategoryName}</td>
                                                    <td>{data.productName}</td>
                                                    <td>{data.varietyName}</td>
                                                    <td>{data.brandName}</td>
                                                    <td>{data.type}</td>
                                                    <td>{data.unitName}</td>
                                                    <td>{data.vendorRate}</td>
                                                    <td>{data.orgInorg}</td>
                                                    <td>{data.season}</td>
                                                    <td>{data.area}</td>
                                                    <td>{data.sowing}</td>
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
                            {
                                purchaseOrderData.poStatus != "Approved" &&
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
                            }
                        </Flex>
                    }
                />
                {
                    purchaseOrderProductDetailsData && purchaseOrderProductDetailsData.length > 0 &&
                    <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
                        <Form
                            noValidate
                            validated={formHasError || (purchaseOrderErr.poProductDetailsErr && purchaseOrderErr.poProductDetailsErr.invalidPoProductDetail)}
                            className="details-form"
                            id="AddPoProductDetailsForm"
                        >
                            <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                <thead className='custom-bg-200'>
                                    {rowData &&
                                        (<tr>
                                            {columnsArray.map((column, index) => {
                                                if (column === 'Delete' && purchaseOrderData.poStatus === "Approved") {
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
                                    {rowData.map((poProductDetailData, index) => (
                                        <tr key={index}>
                                            <td>
                                                {index + 1}
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="productCategoryName"
                                                    placeholder="Product Category"
                                                    value={poProductDetailData.productCategoryName}
                                                    disabled
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="productName"
                                                    placeholder="Product"
                                                    value={poProductDetailData.productName}
                                                    disabled
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="varietyName"
                                                    value={poProductDetailData.varietyName}
                                                    placeholder="Variety"
                                                    disabled
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="brandName"
                                                    value={poProductDetailData.brandName}
                                                    placeholder="Brand"
                                                    disabled
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="unitCode"
                                                    className="form-control select"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.unitCode}
                                                    required
                                                    disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}
                                                >
                                                    <option value=''>Select </option>
                                                    {quantityUnitList.map((option, index) => (
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
                                                    value={poProductDetailData.quantity}
                                                    required
                                                    disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}
                                                    onKeyPress={(e) => {
                                                        const keyCode = e.which || e.keyCode;
                                                        const keyValue = String.fromCharCode(keyCode);
                                                        const regex = /^[^A-Za-z]+$/;

                                                        if (!regex.test(keyValue)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="poRate"
                                                    placeholder="PO Rate"
                                                    maxLength={10}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.poRate}
                                                    required
                                                    disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}
                                                    onKeyPress={(e) => {
                                                        const keyCode = e.which || e.keyCode;
                                                        const keyValue = String.fromCharCode(keyCode);
                                                        const regex = /^[^A-Za-z]+$/;

                                                        if (!regex.test(keyValue)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="vendorRate"
                                                    placeholder="Vendor Rate"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.vendorRate}
                                                    maxLength={10}
                                                    disabled
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="taxBasis"
                                                    className="form-control select"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.taxBasis}
                                                    disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}
                                                >
                                                    <option value=''>Select </option>
                                                    <option value='Percentage'>Percentage </option>
                                                    <option value='Lumpsum'>Lumpsum </option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="taxRate"
                                                    placeholder="Tax Rate"
                                                    maxLength={10}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.taxRate}
                                                    disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}
                                                    onKeyPress={(e) => {
                                                        const keyCode = e.which || e.keyCode;
                                                        const keyValue = String.fromCharCode(keyCode);
                                                        const regex = /^[^A-Za-z]+$/;

                                                        if (!regex.test(keyValue)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="taxAmount"
                                                    placeholder="Tax Amount"
                                                    maxLength={13}
                                                    value={poProductDetailData.taxAmount}
                                                    disabled
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="poAmt"
                                                    placeholder="Amount"
                                                    maxLength={13}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.poAmt}
                                                    required
                                                    disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}
                                                    onKeyPress={(e) => {
                                                        const keyCode = e.which || e.keyCode;
                                                        const keyValue = String.fromCharCode(keyCode);
                                                        const regex = /^[^A-Za-z]+$/;

                                                        if (!regex.test(keyValue)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </td>

                                            {
                                                purchaseOrderData.poStatus != "Approved" &&
                                                <td key={index}>
                                                    <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(poProductDetailData.encryptedPoDetailId) }} />
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

export default PurchaseOrderProductDetails