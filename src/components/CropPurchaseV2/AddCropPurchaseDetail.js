import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import axios from 'axios';
import { formChangedAction, purchaseOrderProductDetailsAction } from 'actions';

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

    let oldMaterialStatus = localStorage.getItem("OldMaterialStatus");

    const purchaseOrderDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsReducer)
    var purchaseOrderData = purchaseOrderDetailsReducer.purchaseOrderDetails;

    let purchaseOrderProductDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderProductDetailsReducer)
    let purchaseOrderProductDetailsData = purchaseOrderProductDetailsReducer.purchaseOrderProductDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const columnsArray = [
        'S.No',
        'Item Name',
        'Grade',
        'I/O',
        'Unit',
        'Pack',
        'Cerate',
        'Rate',
        'Wt',
        'Final Amt',
        'Action',
    ];

    useEffect(() => {

        if (purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.length > 0) {
            setRowData(purchaseOrderProductDetailsData);
            setSelectedRows([]);
            getUnitList();
        } else {
            setRowData([]);
            setSelectedRows([]);
        }

        // setTimeout(function () {
        //     setProductMasterValue();
        // }, 50)

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

    // const setProductMasterValue = () => {
    //     purchaseOrderProductDetailsData.map((row, index) => {
    //         getProductMasterList(row.productCategoryCode, index);
    //     })
    // }

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
            SearchText: searchText ? searchText : searchValue,
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
                materialStatus: "Not Received"
            }));

            const updatedRows = [...updatedData, ...purchaseOrderProductDetailsData];
            dispatch(purchaseOrderProductDetailsAction(updatedRows));
        } else {
            const updatedRows = selectedRows.map(item => ({
                ...item,
                materialStatus: "Not Received"
            }));

            const updatedData = [...updatedRows, ...purchaseOrderProductDetailsData];
            dispatch(purchaseOrderProductDetailsAction(updatedData));
        }

        dispatch(formChangedAction({
            ...formChangedData,
            purchaseOrderProductDetailsAdd: true
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

    return (
        <>

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
                                            <Form.Control id="txtSearch" name="search" placeholder="Search" maxLength={45} onChange={handleSearchChange} />
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
                    </Modal.Footer>
                </Modal >
            }

            <Card className="h-100 mb-2">
                <FalconCardHeader
                    title="Crop Purchase Details"
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
                        // validated={formHasError || (materialDataErr.materialReceiptDetailErr && materialDataErr.materialReceiptDetailErr.invalidMaterialReceiptDetail)}
                        className="details-form"
                        id="AddCropPurchaseDetails"
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
                                                name="productName"
                                                placeholder="Product"
                                                value={poProductDetailData.productName}
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <Form.Select
                                                type="text"
                                                name="productCode"
                                                className="form-control"
                                                required
                                            // disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                            >
                                                <option value=''>Select</option>
                                            </Form.Select>
                                        </td>

                                        <td key={index}>
                                            <Form.Select
                                                type="text"
                                                name="cropType"
                                                className="form-control select"
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                // value={materialReceiptDetailData.unitCode ? materialReceiptDetailData.unitCode : ""}
                                                // disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}
                                                required
                                            >
                                                <option value=''>Select </option>
                                                <option value='Organic'>Organic </option>
                                                <option value='Inorganic'>Inorganic </option>
                                            </Form.Select>
                                        </td>

                                        <td key={index}>
                                            <Form.Select
                                                type="text"
                                                name="unitCode"
                                                className="form-control select"
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            // value={purchaseOrderData.unitCode ? purchaseOrderData.unitCode : ""}
                                            // disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}
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
                                                placeholder="Pack"
                                                maxLength={5}
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                // value={materialReceiptDetailData.receivedQuantity ? materialReceiptDetailData.receivedQuantity : ""}
                                                onKeyPress={(e) => {
                                                    const keyCode = e.which || e.keyCode;
                                                    const keyValue = String.fromCharCode(keyCode);
                                                    const regex = /^[^A-Za-z]+$/;

                                                    if (!regex.test(keyValue)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                // disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                                required
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="cerate"
                                                placeholder="Cerate"
                                                maxLength={13}
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                // value={materialReceiptDetailData.rate ? materialReceiptDetailData.rate : ""}
                                                onKeyPress={(e) => {
                                                    const keyCode = e.which || e.keyCode;
                                                    const keyValue = String.fromCharCode(keyCode);
                                                    const regex = /^[^A-Za-z]+$/;

                                                    if (!regex.test(keyValue)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                required
                                            // disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="poRate"
                                                placeholder="Rate"
                                                maxLength={13}
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                // value={materialReceiptDetailData.rate ? materialReceiptDetailData.rate : ""}
                                                onKeyPress={(e) => {
                                                    const keyCode = e.which || e.keyCode;
                                                    const keyValue = String.fromCharCode(keyCode);
                                                    const regex = /^[^A-Za-z]+$/;

                                                    if (!regex.test(keyValue)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                required
                                            // disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="wt"
                                                placeholder="WT"
                                                maxLength={13}
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                // value={materialReceiptDetailData.amount ? materialReceiptDetailData.amount : ""}
                                                onKeyPress={(e) => {
                                                    const keyCode = e.which || e.keyCode;
                                                    const keyValue = String.fromCharCode(keyCode);
                                                    const regex = /^[^A-Za-z]+$/;

                                                    if (!regex.test(keyValue)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                required
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="poAmt"
                                                placeholder="Amount"
                                                maxLength={13}
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                // value={materialReceiptDetailData.amount ? materialReceiptDetailData.amount : ""}
                                                onKeyPress={(e) => {
                                                    const keyCode = e.which || e.keyCode;
                                                    const keyValue = String.fromCharCode(keyCode);
                                                    const regex = /^[^A-Za-z]+$/;

                                                    if (!regex.test(keyValue)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                required
                                            />
                                        </td>

                                        {/* {
                                            materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved" ?
                                                null
                                                :
                                                <td key={index}>
                                                    <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(materialReceiptDetailData.encryptedMaterialReceiptDetailId) }} />
                                                </td>                                                
                                        } */}

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

export default AddCropPurchaseDetail