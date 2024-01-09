import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import axios from 'axios';
import { formChangedAction, purchaseOrderDetailsAction, purchaseOrderProductDetailsAction } from 'actions';

const AddCropPurchaseDetail = () => {

    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const [formHasError, setFormError] = useState(false);
    const [productCategoryList, setProductCategoryList] = useState([]);
    const [productMasterList, setProductMasterList] = useState([]);
    const [unitList, setUnitList] = useState([])
    const [paramsData, setParamsData] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [productModal, setProductModal] = useState(false);
    const [productLineList, setProductLineList] = useState(false);
    const [productCategory, setProductCategory] = useState();
    const [product, setProduct] = useState();
    const [searchValue, setSearchValue] = useState();
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [gradeList, setGradeList] = useState([]);
    const [productData, setProductData] = useState("");
    let oldPoStatus = localStorage.getItem("OldPoStatus");
    let isSearch = false;

    const purchaseOrderDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsReducer)
    var purchaseOrderData = purchaseOrderDetailsReducer.purchaseOrderDetails;

    let purchaseOrderProductDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderProductDetailsReducer)
    let purchaseOrderProductDetailsData = purchaseOrderProductDetailsReducer.purchaseOrderProductDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const purchaseOrderDetailsErrorReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsErrorReducer)
    const purchaseOrderErr = purchaseOrderDetailsErrorReducer.purchaseOrderDetailsError;

    const columnsArray = [
        'S.No',
        'Product Name',
        'Grade',
        'I/O',
        'Unit',
        'Pack',
        'Carate',
        'Qty.',
        'Rate',
        'Final Amt',
        'Action',
    ];

    useEffect(() => {

        if (purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.length > 0) {
            setRowData(purchaseOrderProductDetailsData);
            setSelectedRows([]);
            if (unitList.length <= 0) {
                getUnitList("W");
            }
            if (gradeList.length <= 0) {
                getGradeList();
            }
        } else {
            setRowData([]);
            setSelectedRows([]);
        }

        const totalPoAmount = purchaseOrderProductDetailsData.length > 1
            ? purchaseOrderProductDetailsData.reduce((acc, obj) => {
                const poAmount = obj.poAmt !== "" ? parseFloat(obj.poAmt) : 0;
                return acc + (isNaN(poAmount) ? 0 : poAmount);
            }, 0)
            : purchaseOrderProductDetailsData.length === 1
                ? parseFloat(purchaseOrderProductDetailsData[0].poAmt)
                : 0;

        dispatch(purchaseOrderDetailsAction({
            ...purchaseOrderData,
            poAmount: isNaN(totalPoAmount) ? 0 : totalPoAmount
        }))

        if (productCategoryList.length <= 0) {
            getProductCategoryList();
        }

        if (purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved") {
            $("#btnSave").attr('disabled', true);
        }

    }, [purchaseOrderProductDetailsData, purchaseOrderProductDetailsReducer])

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
        taxBasis: '',
        taxRate: '',
        taxAmount: '',
        poAmt: '',
        addUser: localStorage.getItem("LoginUserName"),
        modifyUser: localStorage.getItem("LoginUserName"),
    }

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

    const getProductCategoryList = async () => {
        let productCategoryResponse = await axios.get(process.env.REACT_APP_API_URL + '/product-category-master-list', {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (productCategoryResponse.data.status == 200) {
            if (productCategoryResponse.data && productCategoryResponse.data.data.length > 0) {
                setProductCategoryList(productCategoryResponse.data.data);
            }
        } else {
            setProductCategoryList([]);
        }
    }

    const getProductMasterList = async (productCategoryCode) => {
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

    const handleAddItem = () => {
        setProductModal(true);
        getProductLineMasterList();
    }

    const getProductLineMasterList = async (searchText, productCategoryCode, productCode, isManualFilter = false) => {
        const requestData = {
            SearchText: isSearch ? searchText : searchValue,
            ProductCategoryCode: isManualFilter ? productCategoryCode : productCategory,
            ProductCode: isManualFilter ? productCode : product
        }

        const response = await axios.post(process.env.REACT_APP_API_URL + '/get-product-line-master-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                setProductLineList(response.data.data)
            }
        }
        else {
            setProductLineList([]);
        }
    }

    const handleProductCategoryChange = async (e) => {
        setProductCategory(e.target.value);
        handleAPICall(e.target.value);
    }

    const handleAPICall = async (categoryCode) => {
        await getProductLineMasterList("", categoryCode, "", true);
        await getProductMasterList(categoryCode);
    }

    const handleProductChange = e => {
        setProduct(e.target.value);
        getProductLineMasterList('', productCategory, e.target.value, true);
    }

    const onProductModalClose = async () => {
        setProductModal(false);
        setProductCategory();
        setProduct();
        setSearchValue();
    }

    const handleSearchChange = (e) => {
        isSearch = true;
        setSearchValue(e.target.value)        
        getProductLineMasterList(e.target.value)
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
            const updatedData = productLineList.map(item => ({
                ...item,
                materialStatus: "Not Received",
                cropType: "Inorganic",
                carate: "1"
            }));

            const updatedRows = [...updatedData, ...purchaseOrderProductDetailsData];
            dispatch(purchaseOrderProductDetailsAction(updatedRows));
        } else {
            const updatedRows = selectedRows.map(item => ({
                ...item,
                materialStatus: "Not Received",
                cropType: "Inorganic",
                carate: "1"
            }));

            const updatedData = [...updatedRows, ...purchaseOrderProductDetailsData];
            dispatch(purchaseOrderProductDetailsAction(updatedData));
        }

        dispatch(formChangedAction({
            ...formChangedData,
            cropPurchaseProductDetailsAdd: true
        }))

        setSelectAll(false);
        setProductModal(false);
        setProductCategory();
        setProduct();
        setSearchValue();
    }

    const handleHeaderCheckboxChange = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedRows([]);
        }
    };

    const handleFieldChange = (e, index) => {
        const { name, value } = e.target;
        var purchaseOrderProductDetail = [...rowData];
        purchaseOrderProductDetail[index] = {
            ...purchaseOrderProductDetail[index],
            [name]: value
        };

        dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))

        if (e.target.name == "quantity") {
            if (purchaseOrderProductDetail[index].poRate) {
                const calculatedPoAmount = parseFloat(e.target.value) * parseFloat(purchaseOrderProductDetail[index].poRate);
                purchaseOrderProductDetail[index].poAmt = isNaN(calculatedPoAmount) ? 0 : calculatedPoAmount.toString();
                dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
            }
        }

        if (e.target.name == "poRate") {
            if (purchaseOrderProductDetail[index].quantity) {
                const calculatedPoAmount = parseFloat(purchaseOrderProductDetail[index].quantity) * parseFloat(e.target.value)
                purchaseOrderProductDetail[index].poAmt = isNaN(calculatedPoAmount) ? 0 : calculatedPoAmount.toString();
                dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
            }
            else if (parseFloat(purchaseOrderProductDetail[index].poAmt) > 0) {
                const calculatedQuantity = parseFloat(purchaseOrderProductDetail[index].poAmt) / parseFloat(e.target.value)
                purchaseOrderProductDetail[index].quantity = isNaN(calculatedQuantity) ? 0 : calculatedQuantity.toString();
                dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
            }
        }

        if (e.target.name == "poAmt") {
            if (purchaseOrderProductDetail[index].poRate) {
                const calculatedQuantity = parseFloat(e.target.value) / parseFloat(purchaseOrderProductDetail[index].poRate)
                purchaseOrderProductDetail[index].quantity = isNaN(calculatedQuantity) ? 0 : calculatedQuantity.toString();
            }
            dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetail))
        }

        if (purchaseOrderProductDetail[index].encryptedPoDetailId) {
            dispatch(formChangedAction({
                ...formChangedData,
                cropPurchaseProductDetailsUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                cropPurchaseProductDetailsAdd: true
            }))
        }
    }

    const getGradeList = async () => {
        let gradeData = [];

        const requestData = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/grade-master-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(grade => {
                    gradeData.push({
                        key: grade.gradeName,
                        value: grade.gradeCode
                    });
                });
            }
            setGradeList(gradeData);
        }
        else {
            setGradeList([]);
        }
    }

    const ModalPreview = (encryptedPoDetailId, productCode) => {
        setModalShow(true);
        setParamsData({ encryptedPoDetailId });
        setProductData(productCode)
    }
    
    const deleteCropPurchaseDetail = () => {
        if (!paramsData)
            return false;
        
        var object = purchaseOrderProductDetailsData.find(x => x.productCode == productData);

        var objectIndex = purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.findIndex(x => x.encryptedPoDetailId == paramsData.encryptedPoDetailId);
        purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.splice(objectIndex, 1)
    

        var deleteCropPurchaseDetailId = localStorage.getItem("DeleteCropPurchaseIds");
        var deleteInvoiceDetails = localStorage.getItem("DeleteInvoiceDetails");    

        if (paramsData.encryptedPoDetailId) {
            var deleteCropPurchaseDetail = deleteCropPurchaseDetailId ? deleteCropPurchaseDetailId + "," + paramsData.encryptedPoDetailId : paramsData.encryptedPoDetailId;
            var deleteInvoiceDetail = deleteInvoiceDetails != null ? deleteInvoiceDetails + "," + object.productCode : object.productCode;
            localStorage.setItem("DeleteCropPurchaseIds", deleteCropPurchaseDetail);
            localStorage.setItem("DeleteInvoiceDetails", deleteInvoiceDetail);
        }

        toast.success("Crop purhase details deleted successfully", {
            theme: 'colored'
        });

        dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetailsData));

        dispatch(formChangedAction({
            ...formChangedData,
            cropPurchaseProductDetailsDelete: true
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
                        <h4>Are you sure, you want to delete this Crop purchase detail?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button variant="danger" onClick={() => deleteCropPurchaseDetail()}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            }

            {
                productModal &&
                <Modal
                    show={productModal}
                    onHide={() => onProductModalClose()}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Product Line</Modal.Title>
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
                                            <Form.Control id="txtSearch" name="search" placeholder="Search" maxLength={45}
                                                onChange={handleSearchChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
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
                                                {productCategoryList.map((category) => (
                                                    <option key={category.productCategoryName} value={category.productCategoryCode}>
                                                        {category.productCategoryName}
                                                    </option>
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
                                {
                                    (productLineList && productLineList.length > 0) ?
                                        <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                            <thead className='custom-bg-200'>
                                                <tr>
                                                    <th>S.No</th>
                                                    <th>Select
                                                        <Form.Check type="checkbox" id="vendorListChkbox" >
                                                            <Form.Check.Input
                                                                type="checkbox"
                                                                name="selectAll"
                                                                style={{ width: '15px', height: '15px' }}
                                                                onChange={handleHeaderCheckboxChange}
                                                                checked={selectAll}
                                                            />
                                                        </Form.Check>
                                                    </th>
                                                    <th>Product Line</th>
                                                    <th>Product Category</th>
                                                    <th>Product</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    productLineList.map((data, index) =>
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
                                                            <td>{data.productLineName}</td>
                                                            <td>{data.productCategoryName}</td>
                                                            <td>{data.productName}</td>
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
                        <Button variant="success" onClick={() => handleSelectedItem()}>Add</Button>
                        <Button variant="danger" onClick={() => onProductModalClose()} >Cancel</Button>
                    </Modal.Footer>
                </Modal >
            }

            <Card className="h-100">
                <FalconCardHeader
                    title="Crop Purchase Details"
                    titleTag="h6"
                    className="py-2"
                    light
                    endEl={
                        <Flex>
                            <div >
                                {
                                    purchaseOrderData.encryptedPoNo && (purchaseOrderData.poStatus == "Approved" || purchaseOrderData.poStatus == "P" || purchaseOrderData.poStatus == "F") ?
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
                                                Add Item
                                            </Button>
                                        </div>
                                }
                            </div>
                        </Flex>
                    }
                />

                {
                    purchaseOrderProductDetailsData && purchaseOrderProductDetailsData.length > 0 &&
                    <Card.Body className="position-relative pb-0 p3px cp-table-card">
                        <Form
                            noValidate
                            validated={formHasError || (purchaseOrderErr.poProductDetailsErr && purchaseOrderErr.poProductDetailsErr.invalidPoProductDetail)}
                            className="details-form"
                            id="AddCropPurchaseDetails"
                        >
                            <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                <thead className='custom-bg-200'>
                                    {rowData &&
                                        (<tr>
                                            {columnsArray.map((column, index) => {
                                                if (column === 'Action' && purchaseOrderData.encryptedPoNo && (purchaseOrderData.poStatus == "Approved" || purchaseOrderData.poStatus == "P" || purchaseOrderData.poStatus == "F")) {
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
                                                    name="productName"
                                                    placeholder="Product"
                                                    value={poProductDetailData.productName}
                                                    disabled
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="gradeCode"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.gradeCode ? poProductDetailData.gradeCode : ""}
                                                    disabled={purchaseOrderData.encryptedPoNo && (purchaseOrderData.poStatus == "Approved" || purchaseOrderData.poStatus == "P" || purchaseOrderData.poStatus == "F")}
                                                    required
                                                >
                                                    <option value=''>Select</option>
                                                    {gradeList.map((option, index) => (
                                                        <option key={index} value={option.value}>{option.key}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="cropType"
                                                    className="form-control select"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.cropType ? poProductDetailData.cropType : ""}
                                                    disabled={purchaseOrderData.encryptedPoNo && (purchaseOrderData.poStatus == "Approved" || purchaseOrderData.poStatus == "P" || purchaseOrderData.poStatus == "F")}
                                                    required
                                                >
                                                    <option value='Inorganic'>Inorganic </option>
                                                    <option value='Organic'>Organic </option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="unitCode"
                                                    className="form-control select"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.unitCode ? poProductDetailData.unitCode : ""}
                                                    disabled={purchaseOrderData.encryptedPoNo && (purchaseOrderData.poStatus == "Approved" || purchaseOrderData.poStatus == "P" || purchaseOrderData.poStatus == "F")}
                                                    required
                                                >
                                                    <option value=''>Select </option>
                                                    {unitList.map((option, index) => (
                                                        <option key={index} value={option.value}>{option.key}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="pack"
                                                    placeholder="Pack"
                                                    maxLength={5}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.pack ? poProductDetailData.pack : ""}
                                                    onKeyPress={(e) => {
                                                        const keyCode = e.which || e.keyCode;
                                                        const keyValue = String.fromCharCode(keyCode);
                                                        const regex = /^[^A-Za-z]+$/;

                                                        if (!regex.test(keyValue)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    disabled={purchaseOrderData.encryptedPoNo && (purchaseOrderData.poStatus == "Approved" || purchaseOrderData.poStatus == "P" || purchaseOrderData.poStatus == "F")}
                                                    required
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="carate"
                                                    placeholder="Carate"
                                                    maxLength={13}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.carate ? poProductDetailData.carate : ""}
                                                    onKeyPress={(e) => {
                                                        const keyCode = e.which || e.keyCode;
                                                        const keyValue = String.fromCharCode(keyCode);
                                                        const regex = /^[^A-Za-z]+$/;

                                                        if (!regex.test(keyValue)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    disabled={purchaseOrderData.encryptedPoNo && (purchaseOrderData.poStatus == "Approved" || purchaseOrderData.poStatus == "P" || purchaseOrderData.poStatus == "F")}
                                                    required
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="quantity"
                                                    placeholder="Qty."
                                                    maxLength={13}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.quantity ? poProductDetailData.quantity : ""}
                                                    onKeyPress={(e) => {
                                                        const keyCode = e.which || e.keyCode;
                                                        const keyValue = String.fromCharCode(keyCode);
                                                        const regex = /^[^A-Za-z]+$/;

                                                        if (!regex.test(keyValue)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    required
                                                    disabled={purchaseOrderData.encryptedPoNo && (purchaseOrderData.poStatus == "Approved" || purchaseOrderData.poStatus == "P" || purchaseOrderData.poStatus == "F")}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="poRate"
                                                    placeholder="Rate"
                                                    maxLength={13}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.poRate ? poProductDetailData.poRate : ""}
                                                    onKeyPress={(e) => {
                                                        const keyCode = e.which || e.keyCode;
                                                        const keyValue = String.fromCharCode(keyCode);
                                                        const regex = /^[^A-Za-z]+$/;

                                                        if (!regex.test(keyValue)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    required
                                                    disabled={purchaseOrderData.encryptedPoNo && (purchaseOrderData.poStatus == "Approved" || purchaseOrderData.poStatus == "P" || purchaseOrderData.poStatus == "F")}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="poAmt"
                                                    placeholder="Amount"
                                                    maxLength={13}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={poProductDetailData.poAmt ? poProductDetailData.poAmt : ""}
                                                    onKeyPress={(e) => {
                                                        const keyCode = e.which || e.keyCode;
                                                        const keyValue = String.fromCharCode(keyCode);
                                                        const regex = /^[^A-Za-z]+$/;

                                                        if (!regex.test(keyValue)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    required
                                                    disabled={purchaseOrderData.encryptedPoNo && (purchaseOrderData.poStatus == "Approved" || purchaseOrderData.poStatus == "P" || purchaseOrderData.poStatus == "F")}
                                                />
                                            </td>

                                            {
                                                purchaseOrderData.encryptedPoNo && (purchaseOrderData.poStatus == "Approved" || purchaseOrderData.poStatus == "P" || purchaseOrderData.poStatus == "F") ?
                                                    null
                                                    :
                                                    <td key={index}>
                                                        {
                                                            poProductDetailData.materialStatus === "Not Received" ?
                                                                <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(poProductDetailData.encryptedPoDetailId, poProductDetailData.productCode) }} />
                                                                :
                                                                poProductDetailData.materialStatus
                                                        }
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

export default AddCropPurchaseDetail