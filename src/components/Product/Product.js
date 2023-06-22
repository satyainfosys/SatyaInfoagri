import TabPage from 'components/common/TabPage';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formChangedAction, productDetailsAction, productDetailsErrorAction, selectedProductsAction } from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, Modal, Button } from 'react-bootstrap';

const tabArray = ['Product List', 'Product Detail'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'moduleName', Header: 'Product Name' },
    { accessor: 'status', Header: 'Active Status' }
];

export const Product = () => {

    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [formHasError, setFormError] = useState(false);
    const dispatch = useDispatch();
    const [activeTabName, setActiveTabName] = useState();


    const selectedProductsReducer = useSelector((state) => state.rootReducer.selectedProductsReducer)
    var selectedProductItems = selectedProductsReducer.selectedProducts;

    const fetchProductsList = async (page, size = perPage) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
        };

        setIsLoading(true);

        await axios
            .post(process.env.REACT_APP_API_URL + '/get-security-module-masters-list', listFilter, {
                headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
            })
            .then(res => {
                setIsLoading(false);
                if (res.data.status == 200) {
                    setListData(res.data.data);
                }
            });
    };

    useEffect(() => {
        fetchProductsList(1);
        $('[data-rr-ui-event-key*="Product Detail"]').attr('disabled', true);
    }, []);

    const productDetailsReducer = useSelector((state) => state.rootReducer.productDetailsReducer)
    const productData = productDetailsReducer.productDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let isFormChanged = Object.values(formChangedData).some(value => value === true);

    const clearProductDetailsReducer = () => {
        dispatch(productDetailsAction(undefined));
        dispatch(productDetailsErrorAction(undefined));
        dispatch(formChangedAction(undefined));
        dispatch(selectedProductsAction([]));
    }

    $('[data-rr-ui-event-key*="Product List"]').off('click').on('click', function () {
        let isDiscard = $('#btnDiscard').attr('isDiscard');
        if (isDiscard != 'true' && isFormChanged) {
            setModalShow(true);
            setTimeout(function () {
                $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
            }, 50);
        }
        else {
            $("#btnNew").show();
            $("#btnSave").hide();
            $("#btnCancel").hide();
            $('[data-rr-ui-event-key*="Product Detail"]').attr('disabled', true);
            $('#AddProductDetailsForm').get(0).reset();
            localStorage.removeItem("EncryptedResponseModuleCode");
            $("#btnDiscard").attr("isDiscard", false)
            clearProductDetailsReducer();
        }
    })

    $('[data-rr-ui-event-key*="Product Detail"]').off('click').on('click', function () {
        setActiveTabName("Product Detail")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        $('[data-rr-ui-event-key*="Product Detail"]').attr('disabled', false);
    })

    const newDetails = () => {
        $('[data-rr-ui-event-key*="Product Detail"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Product Detail"]').trigger('click');
        $('#btnSave').attr('disabled', false);
        clearProductDetailsReducer();
    };

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if (isFormChanged) {
            setModalShow(true)
        } else {
            $('[data-rr-ui-event-key*="Product List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true)
        } else {
            window.location.href = '/dashboard';
        }
    }

    const discardChanges = () => {
        $('#btnDiscard').attr('isDiscard', 'true');
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else
            $('[data-rr-ui-event-key*="List"]').trigger('click');

        setModalShow(false);
    }

    const productValidation = () => {
        const moduleNameErr = {};
        const selectModuleErr = {};

        let isValid = true;
        if (!productData.moduleName) {
            moduleNameErr.empty = "Enter product name";
            isValid = false;
            setFormError(true);
        }

        if (selectedProductItems.length < 1) {
            selectModuleErr.empty = "Please select atleast one module";
            toast.error(selectModuleErr.empty, {
                theme: 'colored',
                autoClose: 10000
            });
            isValid = false;
            setFormError(true);
        }

        if (!isValid) {
            var errorObject = {
                moduleNameErr
            }
            dispatch(productDetailsErrorAction(errorObject))
        }
        return isValid;
    }

    const updateProductCallback = (isAddUser = false) => {

        setModalShow(false);

        dispatch(productDetailsErrorAction(undefined));
        dispatch(formChangedAction(undefined));

        if (!isAddUser) {
            toast.success("Product details updated successfully!", {
                theme: 'colored'
            });
        }

        $('#btnSave').attr('disabled', true)

        fetchProductsList(1);
        $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
    }

    const addProductDetails = () => {
        if (productValidation()) {

            let uniqueTreeIds = [...new Set(selectedProductItems)]

            const requestData = {
                moduleName: productData.moduleName,
                moduleStatus: productData.status == null || productData.status == "Active" ? "A" : "S",
                addUser: localStorage.getItem("LoginUserName"),
                treeIds: uniqueTreeIds
            }

            const keys = ['moduleName', 'addUser']
            for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
                requestData[key] = requestData[key] ? requestData[key].toUpperCase() : '';
            }

            setIsLoading(true);
            axios.post(process.env.REACT_APP_API_URL + '/add-security-module-master', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    if (res.data.status == 200) {
                        setIsLoading(false);
                        setTimeout(function () {
                            dispatch(productDetailsAction({
                                ...productData,
                                encryptedModuleCode: res.data.data.encryptedModuleCode,
                                treeIds: uniqueTreeIds
                            }))
                        }, 50);
                        localStorage.setItem("EncryptedResponseModuleCode", res.data.data.encryptedModuleCode)
                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updateProductCallback(true);
                    } else {
                        setIsLoading(false);
                        toast.error(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        });
                    }
                })
        }
    }

    const updateProductDetails = async () => {
        let addModuleDetailIds = [];
        let deleteModuleDetailIds = [];

        if (productValidation()) {
            
            let uniqueTreeIds = [...new Set(selectedProductItems)]

            if (productData.treeIds && productData.treeIds.length > 0) {
                for (let i = 0; i < uniqueTreeIds.length; i++) {
                    if (!productData.treeIds.includes(uniqueTreeIds[i])) {
                        addModuleDetailIds.push(uniqueTreeIds[i]);
                    }
                }

                for (let i = 0; i < productData.treeIds.length; i++) {
                    if (!uniqueTreeIds.includes(productData.treeIds[i])) {
                        deleteModuleDetailIds.push(productData.treeIds[i]);
                    }
                }
            }else if(uniqueTreeIds.length > 0){
                addModuleDetailIds = uniqueTreeIds;
            }

            const updatedProductData = {
                encryptedModuleCode: productData.encryptedModuleCode,
                moduleName: productData.moduleName,
                moduleStatus: !productData.status || productData.status == "Active" ? "A" : "S",
                ModifyUser: localStorage.getItem("LoginUserName")
            }

            const keys = ['moduleName', 'ModifyUser']
            for (const key of Object.keys(updatedProductData).filter((key) => keys.includes(key))) {
                updatedProductData[key] = updatedProductData[key] ? updatedProductData[key].toUpperCase() : '';
            }

            var hasError = false;

            if (formChangedData.productUpdate) {
                setIsLoading(true);
                await axios.post(process.env.REACT_APP_API_URL + '/update-security-module-master', updatedProductData, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                })
                    .then(res => {
                        setIsLoading(false);
                        if (res.data.status != 200) {
                            toast.error(res.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                        }
                    })
            }

            if (!hasError && (formChangedData.moduleDetailAdd || formChangedData.moduleDetailDelete)) {
                if (!hasError && formChangedData.moduleDetailDelete) {
                    if (deleteModuleDetailIds) {
                        var deleteModuleDetailIndex = 1;

                        for (let i = 0; i < deleteModuleDetailIds.length; i++) {
                            const deleteModuleDetailId = deleteModuleDetailIds[i]
                            const data = {
                                encryptedModuleCode: localStorage.getItem("EncryptedResponseModuleCode"),
                                treeId: deleteModuleDetailId
                            }
                            const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            const deleteModuleDetailResponse =
                                await axios.delete(process.env.REACT_APP_API_URL + '/delete-security-module-detail', { headers, data });
                            if (deleteModuleDetailResponse.data.status != 200) {
                                toast.error(deleteModuleDetailResponse.data.message, {
                                    theme: 'colored',
                                    autoClose: 10000
                                });
                                hasError = true;
                                break;
                            }
                        }
                        deleteModuleDetailIndex++
                    }
                }

                var moduleDetailIndex = 1;
                for (let i = 0; i < addModuleDetailIds.length; i++) {

                    const treeId = addModuleDetailIds[i];

                    if (formChangedData.moduleDetailAdd) {
                        const requestData = {
                            encryptedModuleCode: localStorage.getItem("EncryptedResponseModuleCode"),
                            treeId: treeId,
                            addUser: localStorage.getItem("LoginUserName").toUpperCase()
                        }

                        setIsLoading(true);
                        const addModuleDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-security-module-detail', requestData, {
                            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        });
                        setIsLoading(false);
                        if (addModuleDetailResponse.data.status != 200) {
                            toast.error(addModuleDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                            break;
                        }
                    }
                    moduleDetailIndex++
                }
            }

            if (!hasError) {
                updateProductCallback();
                dispatch(productDetailsAction({
                    ...productData,
                    treeIds: uniqueTreeIds
                }))                
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
                        <Button variant="success" onClick={!productData.encryptedModuleCode ? addProductDetails : updateProductDetails}>Save</Button>
                        <Button variant="danger" id="btnDiscard" onClick={() => discardChanges()}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module='Product'
                newDetails={newDetails}
                saveDetails={!productData.encryptedModuleCode ? addProductDetails : updateProductDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
            />
        </>
    )
}
export default Product;