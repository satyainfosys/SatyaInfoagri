import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { formChangedAction, productLineDetailsAction, productLineDetailsErrorAction } from 'actions';
import { toast } from 'react-toastify';

const tabArray = ['Product Line List', 'Add Product'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'productCode', Header: 'Product Code' },
    { accessor: 'productName', Header: 'Product Name' },
    { accessor: 'status', Header: 'Active Status' }
];

export const ProductLine = () => {

    const dispatch = useDispatch();
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    const fetchProductLineList = async (page, size = perPage) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
        };

        setIsLoading(true);
        await axios.post(process.env.REACT_APP_API_URL + '/get-product-list', listFilter, {
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
        fetchProductLineList(1);
        $('[data-rr-ui-event-key*="Add Product"]').attr('disabled', true);
    }, []);

    const [formHasError, setFormError] = useState(false);
    const [activeTabName, setActiveTabName] = useState();

    const productLineDetailsReducer = useSelector((state) => state.rootReducer.productLineDetailsReducer)
    var productLineData = productLineDetailsReducer.productLineDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let isFormChanged = Object.values(formChangedData).some(value => value === true);

    $('[data-rr-ui-event-key*="Product Line List"]').off('click').on('click', function () {
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
            $('[data-rr-ui-event-key*="Add Product"]').attr('disabled', true);
            $('#AddProductLineDetailForm').get(0).reset();
            clearProductLineReducers();
            dispatch(productLineDetailsAction(undefined));
        }
    })

    $('[data-rr-ui-event-key*="Add Product"]').off('click').on('click', function () {
        setActiveTabName("Add Product")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
    })

    const newDetails = () => {
        $('[data-rr-ui-event-key*="Add Product"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add Product"]').trigger('click');
        $('#btnSave').attr('disabled', false);
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if (isFormChanged) {
            setModalShow(true);
        }
        else {
            $('[data-rr-ui-event-key*="Product Line List"]').trigger('click');
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
            $('[data-rr-ui-event-key*="Product Line List"]').trigger('click');

        setModalShow(false);
    }

    const productLineValidation = () => {
        setModalShow(false);
        const productNameErr = {};

        let isValid = true;

        if (!productLineData.productName) {
            productNameErr.empty = "Enter product name";
            isValid = false;
            setFormError(true);
        }

        if (!isValid) {
            var errorObject = {
                productNameErr
            }
            dispatch(productLineDetailsErrorAction(errorObject))
        }
        return isValid;
    }

    const clearProductLineReducers = () => {
        dispatch(productLineDetailsErrorAction(undefined));
        dispatch(formChangedAction(undefined));
    }

    const updateProductLineCallback = (isAddProductLine = false) => {
        setModalShow(false);

        clearProductLineReducers();

        if (!isAddProductLine) {
            toast.success("Product details updated successfully", {
                theme: 'colored'
            })
        }

        $('#btnSave').attr('disabled', true)

        fetchProductLineList(1);

        $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
    }

    const addProductLineDetails = () => {
        if (productLineValidation()) {
            const requestData = {
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                productName: productLineData.productName,
                productShortName: productLineData.productShortName ? productLineData.productShortName : "",
                activeStatus: productLineData.status == null || productLineData.status == "Active" ? "A" : "S",
                addUser: localStorage.getItem("LoginUserName")
            }

            const keys = ["productName", "productShortName", "addUser"]
            for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
                requestData[key] = requestData[key] ? requestData[key].toUpperCase() : '';
            }

            setIsLoading(true);
            axios.post(process.env.REACT_APP_API_URL + '/add-product-detail', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    if (res.data.status == 200) {
                        setIsLoading(false)
                        setTimeout(function () {
                            dispatch(productLineDetailsAction({
                                ...productLineData,
                                encryptedProductCode: res.data.data.encryptedProductCode,
                                productCode: res.data.data.productCode
                            }))
                        }, 50);

                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updateProductLineCallback(true);
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

    const updateProductLineDetails = async () => {
        if (productLineValidation()) {
            const updateProductLineDetails = {
                encryptedProductCode: productLineData.encryptedProductCode,
                productName: productLineData.productName,
                productShortName: productLineData.productShortName ? productLineData.productShortName : "",
                activeStatus: productLineData.status == null || productLineData.status == "Active" ? "A" : "S",
                modifyUser: localStorage.getItem("LoginUserName")
            }
            const keys = ['productName', 'productShortName', 'modifyUser']
            for (const key of Object.keys(updateProductLineDetails).filter((key) => keys.includes(key))) {
                updateProductLineDetails[key] = updateProductLineDetails[key] ? updateProductLineDetails[key].toUpperCase() : '';
            }

            setIsLoading(true)
            await axios.post(process.env.REACT_APP_API_URL + '/update-product-detail', updateProductLineDetails, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    setIsLoading(false);
                    if (res.data.status == 200) {
                        updateProductLineCallback();
                    } else {
                        toast.error(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        });
                        hasError = true;
                        setModalShow(false);
                    }
                })
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
                        <Button variant="success" onClick={productLineData.encryptedProductCode ? updateProductLineDetails : addProductLineDetails}>Save</Button>
                        <Button variant="danger" id='btnDiscard' onClick={discardChanges}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                tabArray={tabArray}
                listColumnArray={listColumnArray}
                module="ProductLine"
                newDetails={newDetails}
                saveDetails={productLineData.encryptedProductCode ? updateProductLineDetails : addProductLineDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
            />
        </>
    )
}

export default ProductLine;