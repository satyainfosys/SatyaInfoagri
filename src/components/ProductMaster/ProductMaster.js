import React, { useState, useEffect } from 'react'
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { productMasterDetailsAction } from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import $ from "jquery";

const tabArray = ['Product Master List', 'Add Product Master'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'code', Header: 'Code' },
    { accessor: 'productLine', Header: 'Product Line' },
    { accessor: 'productCategory', Header: 'Product Category' },
    { accessor: 'productName', Header: 'Product Name' },
    { accessor: 'status', Header: 'Active Status' }
];

const ProductMaster = () => {

    const dispatch = useDispatch();
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(false);
    const [formHasError, setFormError] = useState(false);
    const [activeTabName, setActiveTabName] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [productLineList, setProductLineList] = useState([]);
    const [productCategoryList, setProductCategoryList] = useState([]);

    const fetchProductMasterList = async (page, size = perPage, encryptedProductLineCode, encryptedProductCategoryCode) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            encryptedProductLineCode: encryptedProductLineCode ? encryptedProductLineCode : '',
            encryptedProductCategoryCode: encryptedProductCategoryCode ? encryptedProductCategoryCode : ''
        };

        setIsLoading(true);
        await axios.post(process.env.REACT_APP_API_URL + '/get-product-master-list', listFilter, {
            headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
        })
            .then(res => {
                setIsLoading(false);
                if (res.data.status == 200) {
                    setListData(res.data.data);
                } else {
                    setListData([])
                }
            });
    }

    useEffect(() => {
        fetchProductMasterList(1);
        $('[data-rr-ui-event-key*="Add Product Master"]').attr('disabled', true);
        getProductLineList();
    }, []);


    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let isFormChanged = Object.values(formChangedData).some(value => value === true);

    $('[data-rr-ui-event-key*="Product Master List"]').off('click').on('click', function () {
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add Product Master"]').attr('disabled', true);
        // $('#AddProductLineDetailForm').get(0).reset();
        dispatch(productMasterDetailsAction(undefined));
    })

    $('[data-rr-ui-event-key*="Add Product Master"]').off('click').on('click', function () {
        setActiveTabName("Add Product Master")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
    })

    const newDetails = () => {
        if (localStorage.getItem("EncryptedProductLineCode") && localStorage.getItem("EncryptedProductCategoryCode")) {
            $('[data-rr-ui-event-key*="Add Product Master"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add Product Master"]').trigger('click');
            $('#btnSave').attr('disabled', false);
            localStorage.removeItem("EncryptedProductMasterCode");
        }
        else if (!localStorage.getItem("EncryptedProductLineCode")) {
            toast.error("Please select product line first", {
                theme: 'colored',
                autoClose: 5000
            });
        }
        else if (!localStorage.getItem("EncryptedProductCategoryCode")) {
            toast.error("Please select product category first", {
                theme: 'colored',
                autoClose: 5000
            });
        }
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if (isFormChanged) {
            setModalShow(true);
        }
        else {
            $('[data-rr-ui-event-key*="Product Master List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true);
        }
        else {
            window.location.href = '/dashboard';
        }
    }

    const getProductLineList = async () => {
        let productLineData = [];

        let productLineResponse = await axios.get(process.env.REACT_APP_API_URL + '/product-line-list', {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });

        if (productLineResponse.data.status == 200) {
            if (productLineResponse.data && productLineResponse.data.data.length > 0) {
                productLineResponse.data.data.forEach(productLine => {
                    productLineData.push({
                        key: productLine.productLineName,
                        value: productLine.encrypteProductLineCode,
                        label: productLine.productLineName,
                    })
                })
            }
            setProductLineList(productLineData)
        } else {
            setProductLineList([])
        }
    }

    const handleProductLineChange = e => {
        setProductCategoryList([]);
        localStorage.setItem("EncryptedProductLineCode", e.target.value);
        fetchProductMasterList(1, perPage, e.target.value)
        fetchProductCategoryList(e.target.value)
    }

    const fetchProductCategoryList = async (encryptedProductLineCode) => {
        let productCategoryData = [];

        const request = {
            EncryptedProductCode: encryptedProductLineCode
        }

        let productCategoryResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-product-category-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (productCategoryResponse.data.status == 200) {
            if (productCategoryResponse.data && productCategoryResponse.data.data.length > 0) {
                productCategoryResponse.data.data.forEach(productCategory => {
                    productCategoryData.push({
                        key: productCategory.productCategoryName,
                        value: productCategory.encryptedProductCategoryCode
                    })
                })
            }
            setProductCategoryList(productCategoryData)
        } else {
            setProductCategoryList([])
        }
    }

    const handleProductCategoryChange = e => {
        let encryptedProductLineCode = localStorage.getItem("EncryptedProductLineCode");
        localStorage.setItem("EncryptedProductCategoryCode", e.target.value)
        fetchProductMasterList(1, perPage, encryptedProductLineCode, e.target.value)
    }

    return (
        <>
            {isLoading ? (
                <Spinner
                    className="position-absolute start-50 loader-color"
                    animation="border"
                />
            ) : null}

            <TabPage
                listData={listData}
                tabArray={tabArray}
                listColumnArray={listColumnArray}
                module="ProductMaster"
                newDetails={newDetails}
                // saveDetails={productLineData.encryptedProductCode ? updateProductLineDetails : addProductLineDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
                tableFilterOptions={productLineList}
                tableFilterName={'Product Line'}
                supportingMethod1={handleProductLineChange}
                tableFilterOptions1={productCategoryList}
                tableFilterName1={'Product Category'}
                supportingMethod2={handleProductCategoryChange}
            />
        </>
    )
}

export default ProductMaster