import React, { useState, useEffect } from 'react'
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { formChangedAction, productMasterDetailsAction, productMasterDetailsErrorAction, productVarietyDetailsAction } from 'actions';
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

    const productMasterDetailsReducer = useSelector((state) => state.rootReducer.productMasterDetailsReducer)
    var productMasterData = productMasterDetailsReducer.productMasterDetails;

    const productVarietyDetailReducer = useSelector((state) => state.rootReducer.productVarietyDetailReducer)
    const productVarietyDetailsList = productVarietyDetailReducer.productVarietyDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let isFormChanged = Object.values(formChangedData).some(value => value === true);

    $('[data-rr-ui-event-key*="Product Master List"]').off('click').on('click', function () {
        let isDiscard = $('#btnDiscard').attr('isDiscard');
        if (isDiscard != 'true' && isFormChanged) {
            setModalShow(true);
            setTimeout(function () {
                $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
            }, 50);
        } else {
            $("#btnNew").show();
            $("#btnSave").hide();
            $("#btnCancel").hide();
            $('[data-rr-ui-event-key*="Add Product Master"]').attr('disabled', true);
            clearProductMasterReducers();
            dispatch(productMasterDetailsAction(undefined));
            localStorage.removeItem("EncryptedProductMasterCode");
            localStorage.removeItem("DeleteProductVarietyCodes");
        }
    })

    $('[data-rr-ui-event-key*="Add Product Master"]').off('click').on('click', function () {
        setActiveTabName("Add Product Master")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        if (productVarietyDetailsList.length <= 0 &&
            !(localStorage.getItem("DeleteProductVarietyCodes")) &&
            (localStorage.getItem("EncryptedProductMasterCode") ||
                productMasterData.encryptedProductMasterCode)) {
            getProductVarietyList();
        }
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

    const discardChanges = () => {
        $('#btnDiscard').attr('isDiscard', 'true');
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else
            $('[data-rr-ui-event-key*="Product Master List"]').trigger('click');

        setModalShow(false);
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

    const productMasterValidation = () => {
        setModalShow(false);
        const productMasterNameErr = {};
        const productVarietyNameErr = {};

        let isValid = true;

        if (!productMasterData.productName) {
            productMasterNameErr.empty = "Enter product name";
            isValid = false;
            setFormError(true);
        }

        if (productVarietyDetailsList && productVarietyDetailsList.length > 0) {
            productVarietyDetailsList.forEach((row, index) => {
                if (!row.productVarietyName) {
                    productVarietyNameErr.invalidProductVariety = "Fill the required fields"
                    isValid = false;
                    setFormError(true);
                }
            });
        }

        if (!isValid) {
            var errorObject = {
                productMasterNameErr,
                productVarietyNameErr
            }
            dispatch(productMasterDetailsErrorAction(errorObject))
        }
        return isValid;
    }

    const clearProductMasterReducers = () => {
        dispatch(productMasterDetailsErrorAction(undefined));
        dispatch(productVarietyDetailsAction([]));
        dispatch(formChangedAction(undefined));
    }

    const updateProductMasterCallback = (isAddProductMaster = false) => {
        setModalShow(false);
        let encrypteProductLineCode = localStorage.getItem("EncryptedProductLineCode");
        let encryptedProductCategoryCode = localStorage.getItem("EncryptedProductCategoryCode");
        localStorage.removeItem("DeleteProductVarietyCodes");

        if (!isAddProductMaster) {
            toast.success("Product master details updated successfully", {
                theme: 'colored'
            })
        }

        $('#btnSave').attr('disabled', true)

        clearProductMasterReducers();

        fetchProductMasterList(1, perPage, encrypteProductLineCode, encryptedProductCategoryCode);

        $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
    }

    const addProductMasterDetails = () => {
        if (productMasterValidation()) {
            const requestData = {
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                encryptedProductLineCode: localStorage.getItem("EncryptedProductLineCode"),
                encryptedProductCategoryCode: localStorage.getItem("EncryptedProductCategoryCode"),
                productName: productMasterData.productName,
                productShortName: productMasterData.productShortName ? productMasterData.productShortName : "",
                productType: productMasterData.productType == "Horticulture Crops" ? "HC" : productMasterData.productType == "Plantation Crops" ? "PC" :
                    productMasterData.productType == "Cash Crop" ? "CC" : productMasterData.productType == "Food Crops" ? "FC" : "",
                productSeasonId: productMasterData.productSeasonId ? parseInt(productMasterData.productSeasonId) : 0,
                perishableDays: productMasterData.perishableDays ? parseInt(productMasterData.perishableDays) : 0,
                texanomy: productMasterData.texanomy ? productMasterData.texanomy : "",
                botany: productMasterData.botany ? productMasterData.botany : "",
                activeStatus: productMasterData.status == null || productMasterData.status == "Active" ? "A" : "S",
                addUser: localStorage.getItem("LoginUserName"),
                productVarietyDetails: productVarietyDetailsList
            }

            const keys = ["productName", "productShortName", "texanomy", "botany", "addUser"]
            for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
                requestData[key] = requestData[key] ? requestData[key].toUpperCase() : '';
            }

            const productVarietyKeys = ['productVarietyName', 'productVarietyShortName', 'addUser']
            var index = 0;
            for (var obj in requestData.productVarietyDetails) {
                var productVarietyDetailsObj = requestData.productVarietyDetails[obj];

                for (const key of Object.keys(productVarietyDetailsObj).filter((key) => productVarietyKeys.includes(key))) {
                    productVarietyDetailsObj[key] = productVarietyDetailsObj[key] ? productVarietyDetailsObj[key].toUpperCase() : '';
                }
                requestData.productVarietyDetails[index] = productVarietyDetailsObj;
                index++;
            }

            setIsLoading(true);
            axios.post(process.env.REACT_APP_API_URL + '/add-product-master-detail', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    if (res.data.status == 200) {
                        setIsLoading(false)
                        setTimeout(function () {
                            dispatch(productMasterDetailsAction({
                                ...productMasterData,
                                encryptedProductMasterCode: res.data.data.encryptedProductMasterCode,
                                code: res.data.data.productCode
                            }))
                        }, 50);
                        localStorage.setItem("EncryptedProductMasterCode", res.data.data.encryptedProductMasterCode);
                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updateProductMasterCallback(true);
                    } else {
                        setIsLoading(false)
                        toast.error(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        });
                    }
                })
        }
    }

    const getProductVarietyList = async () => {
        const request = {
            EncryptedProductMasterCode: localStorage.getItem("EncryptedProductMasterCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-product-variety-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(productVarietyDetailsAction(response.data.data));
            }
        }
    }

    return (
        <>
            {isLoading ? (
                <Spinner
                    className="position-absolute start-50 loader-color"
                    animation="border"
                />
            ) : null}

            {modalShow &&
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
                        <h4>Do you want to save changes?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={addProductMasterDetails}>Save</Button>
                        <Button variant="danger" id='btnDiscard' onClick={discardChanges}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                tabArray={tabArray}
                listColumnArray={listColumnArray}
                module="ProductMaster"
                newDetails={newDetails}
                // saveDetails={productLineData.encryptedProductCode ? updateProductLineDetails : addProductLineDetails}
                saveDetails={addProductMasterDetails}
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