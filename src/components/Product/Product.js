import TabPage from 'components/common/TabPage';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formChangedAction, productDetailsAction, productDetailsErrorAction } from 'actions';
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
        const moduleNameErr = {}

        let isValid = true;
        if (!productData.moduleName) {
            moduleNameErr.empty = "Enter product name";
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
            const requestData = {
                moduleName: productData.moduleName,
                moduleStatus: productData.status == null || productData.status == "Active" ? "A" : "S",
                addUser: localStorage.getItem("LoginUserName"),
                treeIds: selectedProductItems
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
                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updateProductCallback(true);
                        $('[data-rr-ui-event-key*="Product List"]').click();
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
        if (productValidation()) {
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
                        }
                        // if (!clientContactDetailChanged.contactDetailsChanged && !transactionDetailChanged.transactionDetailChanged)
                        else {
                            // addModuleDetail();
                            //deleteModuleDetail();
                            updateProductCallback();
                        }
                    })
            }
        }
    }

    const addModuleDetail = async () => {
        if (productData.encryptedModuleCode) {
            var loopBreaked = false;

            const moduleDetails = {
                encryptedModuleCode: localStorage.getItem('EncryptedResponseModuleCode'),
                encryptedTreeId: "CfDJ8Eep9uQzpLJDkIGqUwlCnuMS7sa2zXWxSqLNw7o1nHE_6lxa0ODVBQsL3quadCye52biD5W_RhSkHH3ED0kM7K8ZiP32aUmj2hWRbgdAcXH3Bf2ZnGhf2zV94WbaeLEGyw",
                addUser: localStorage.getItem('LoginUserName')
            }
            if (!loopBreaked) {
                const keys = ['addUser']
                for (const key of Object.keys(moduleDetails).filter((key) => keys.includes(key))) {
                    moduleDetails[key] = moduleDetails[key] ? moduleDetails[key].toUpperCase() : '';
                }
                const addSecurityModuleDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-security-module-detail', moduleDetails, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                });

                if (addSecurityModuleDetailResponse.data.status != 200) {
                    toast.error(addSecurityModuleDetailResponse.data.message, {
                        theme: 'colored',
                        autoClose: 10000
                    });
                    loopBreaked = true;
                } else {
                    updateProductCallback();
                }
            }
        }
    }

    const deleteModuleDetail = async () => {
        var loopBreaked = false;
        const deleteContactDetailId = ["CfDJ8Eep9uQzpLJDkIGqUwlCnuM8GoKjUZKztSgfulk-V2dNORIMZ4AcNjN0OJ6IfWoEC8RKBV8kinVJErNsJQcI1NqPxMRuDBl7ChJqXuDslQBPnV9bALJVdfg_Zu1BpLxN2w"];
        const data = { encryptedModuleDetailIds: deleteContactDetailId }
        const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

        const deleteModuleDetailResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-security-module-detail', { headers, data });

        if (deleteModuleDetailResponse.data.status != 200) {
            toast.error(deleteModuleDetailResponse.data.message, {
                theme: 'colored',
                autoClose: 10000
            });
            loopBreaked = true;
        } else {
            updateProductCallback();
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