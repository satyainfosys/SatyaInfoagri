import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import axios from 'axios';
import { purchaseOrderProductDetailsAction } from 'actions';

const AddCropPurchaseDetail = () => {

    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);
    const [formHasError, setFormError] = useState(false);
    const [productCategoryList, setProductCategoryList] = useState([]);
    const [productMasterList, setProductMasterList] = useState([]);
    const [unitList, setUnitList] = useState([])
    const [paramsData, setParamsData] = useState({});
    const [modalShow, setModalShow] = useState(false);

    let oldMaterialStatus = localStorage.getItem("OldMaterialStatus");

    const purchaseOrderDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsReducer)
    var purchaseOrderData = purchaseOrderDetailsReducer.purchaseOrderDetails;

    let purchaseOrderProductDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderProductDetailsReducer)
    let purchaseOrderProductDetailsData = purchaseOrderProductDetailsReducer.purchaseOrderProductDetails;

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
        'Amt',
        'Delete',
    ];

    useEffect(() => {
        if (unitList.length <= 0) {
            getUnitList();
        }

        if (purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.length > 0) {
            setRowData(purchaseOrderProductDetailsData);
        } else {
            setRowData([]);
        }

        setTimeout(function () {
            setProductMasterValue();
        }, 50)

        if (productCategoryList.length <= 0) {
            getProductCategoryList();
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

    const setProductMasterValue = () => {
        purchaseOrderProductDetailsData.map((row, index) => {
            getProductMasterList(row.productCategoryCode, index);
        })
    }

    const getProductCategoryList = async () => {

        let productCategoryData = [];
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

    const handleAddItem = () => {
        purchaseOrderProductDetailsData.unshift(emptyRow);
        dispatch(purchaseOrderProductDetailsAction(purchaseOrderProductDetailsData));
        setProductMasterList(prevProductList => [...prevProductList, []]);
    }

    return (
        <>
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
                                            // if (column === 'Delete' && purchaseOrderData.poStatus === "Approved") {
                                            //     return null;
                                            // }
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
                                            <Form.Select
                                                type="text"
                                                name="productCategoryCode"
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                // value={materialReceiptDetailData.productCategoryCode}
                                                className="form-control"
                                                required
                                            // disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
                                            >
                                                <option value=''>Select</option>
                                                {productCategoryList.map((category) => (
                                                    <option key={category.productCategoryName} value={category.productCategoryCode}>
                                                        {category.productCategoryName}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </td>

                                        <td key={index}>
                                            <Form.Select
                                                type="text"
                                                name="productCode"
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                // value={materialReceiptDetailData.productCode}
                                                className="form-control"
                                                required
                                            // disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
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
                                                // value={materialReceiptDetailData.varietyName}
                                                // onChange={(e) => handleFieldChange(e, index)}
                                                placeholder="Variety"
                                                disabled
                                            />
                                        </td>

                                        <td key={index}>
                                            <EnlargableTextbox
                                                name="brandName"
                                                // value={materialReceiptDetailData.brandName}
                                                // onChange={(e) => handleFieldChange(e, index)}
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
                                            // value={materialReceiptDetailData.unitCode ? materialReceiptDetailData.unitCode : ""}
                                            // disabled={materialReceiptHeaderData.encryptedMaterialReceiptId && oldMaterialStatus == "Approved"}
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