import React, { useState, useEffect } from 'react'
import TabPage from 'components/common/TabPage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import $ from "jquery";
import { toast } from 'react-toastify';
import { formChangedAction, purchaseOrderDetailsAction, purchaseOrderDetailsErrAction, purchaseOrderProductDetailsAction, purchaseOrderTermDetailsAction, tabInfoAction, vendorProductCatalogueDetailsAction } from 'actions';
import Moment from "moment";

const tabArray = ['PO List', 'Add PO', 'Add Term']

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'poNo', Header: 'PO No.' },
    { accessor: 'poDate', Header: 'PO Date' },
    { accessor: 'poAmount', Header: 'PO Amount' },
    { accessor: 'vendorName', Header: 'Vendor Name' },
    { accessor: 'poStatus', Header: 'PO Status' }
]

const PurchaseOrder = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [activeTabName, setActiveTabName] = useState();
    const [formHasError, setFormError] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add PO"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Add Term"]').attr('disabled', true);
        getCompany();
    }, [])

    const purchaseOrderDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsReducer)
    var purchaseOrderData = purchaseOrderDetailsReducer.purchaseOrderDetails;

    let purchaseOrderProductDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderProductDetailsReducer)
    let purchaseOrderProductDetailsList = purchaseOrderProductDetailsReducer.purchaseOrderProductDetails;

    let purchaseOrderTermDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderTermDetailsReducer)
    let purchaseOrderTermList = purchaseOrderTermDetailsReducer.purchaseOrderTermDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let isFormChanged = Object.values(formChangedData).some(value => value === true);

    const getCompany = async () => {
        let companyData = [];
        const companyRequest = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
        }

        let companyResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-client-companies', companyRequest, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });

        if (companyResponse.data.status == 200) {
            if (companyResponse.data && companyResponse.data.data.length > 0) {
                companyResponse.data.data.forEach(company => {
                    companyData.push({
                        key: company.companyName,
                        value: company.encryptedCompanyCode,
                        label: company.companyName
                    })
                })
            }
            setCompanyList(companyData)
            if (companyResponse.data.data.length == 1) {
                fetchPurchaseOrderList(1, perPage, companyResponse.data.data[0].encryptedCompanyCode);
                localStorage.setItem("CompanyName", companyResponse.data.data[0].companyName)
                localStorage.setItem("EncryptedCompanyCode", companyResponse.data.data[0].encryptedCompanyCode);
            }
        } else {
            setCompanyList([])
        }
    }

    const handleFieldChange = e => {
        localStorage.setItem("EncryptedCompanyCode", e.target.value);
        const selectedOption = e.target.options[e.target.selectedIndex];
        const selectedKey = selectedOption.dataset.key || selectedOption.label;
        localStorage.setItem("CompanyName", selectedKey)
        fetchPurchaseOrderList(1, perPage, e.target.value);
    }

    const fetchPurchaseOrderList = async (page, size = perPage, encryptedCompanyCode) => {

        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedCompanyCode: encryptedCompanyCode
        }

        setIsLoading(true);
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-po-header-list', listFilter, {
            headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
        })

        if (response.data.status == 200) {
            setIsLoading(false);
            setListData(response.data.data);
        } else {
            setIsLoading(false);
            setListData([])
        }
    }

    $('[data-rr-ui-event-key*="PO List"]').off('click').on('click', function () {
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
            $('[data-rr-ui-event-key*="Add PO"]').attr('disabled', true);
            $('[data-rr-ui-event-key*="Add Term"]').attr('disabled', true);
            clearPurchaseOrderReducers();
            dispatch(purchaseOrderDetailsAction(undefined));
            dispatch(vendorProductCatalogueDetailsAction([]));
            localStorage.removeItem("EncryptedPoNo");
        }
    })

    $('[data-rr-ui-event-key*="Add PO"]').off('click').on('click', function () {
        setActiveTabName("Add PO")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        $('[data-rr-ui-event-key*="Add Term"]').attr('disabled', false);

        if (purchaseOrderProductDetailsList.length <= 0 &&
            !(localStorage.getItem("DeletePurchaseOrderProductDetailIds"))) {
            getPurchaseOrderProductDetailsList()
        }

        if (purchaseOrderTermList.length <= 0 &&
            !(localStorage.getItem("DeletePurchaseOrderTermDetailIds"))) {
            getPurchaseOrderTermDetailsList();
        }
    })

    $('[data-rr-ui-event-key*="Add Term"]').off('click').on('click', function () {
        setActiveTabName("Add Term")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
    })

    const newDetails = () => {

        if (localStorage.getItem("EncryptedCompanyCode")) {
            $('[data-rr-ui-event-key*="Add PO"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add PO"]').trigger('click');
            $('[data-rr-ui-event-key*="Add Term"]').attr('disabled', false);
            $('#btnSave').attr('disabled', false);
            dispatch(tabInfoAction({ title1: `${localStorage.getItem("CompanyName")}` }))
        } else {
            toast.error("Please select company first", {
                theme: 'colored',
                autoClose: 5000
            });
        }
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            $('[data-rr-ui-event-key*="PO List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            window.location.href = '/dashboard';
            clearPurchaseOrderReducers();
            dispatch(purchaseOrderDetailsAction(undefined));
            dispatch(vendorProductCatalogueDetailsAction([]));
            localStorage.removeItem("EncryptedPoNo");
            localStorage.removeItem("DeletePoProductDetailIds");
            localStorage.removeItem("DeletePoTermDetailIds");
            localStorage.removeItem("EncryptedCompanyCode");
            localStorage.removeItem("CompanyName");
        }
    }

    const discardChanges = () => {
        $('#btnDiscard').attr('isDiscard', 'true');
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else {
            $('[data-rr-ui-event-key*="PO List"]').trigger('click');
        }

        setModalShow(false);
    }

    const getPurchaseOrderProductDetailsList = async () => {
        const request = {
            EncryptedPoNo: localStorage.getItem("EncryptedPoNo")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-po-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(purchaseOrderProductDetailsAction(response.data.data));
            }
        }
    }

    const getPurchaseOrderTermDetailsList = async () => {
        const request = {
            EncryptedPoNo: localStorage.getItem("EncryptedPoNo")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-po-term-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(purchaseOrderTermDetailsAction(response.data.data))
            }
        }
    }

    const clearPurchaseOrderReducers = () => {
        dispatch(formChangedAction(undefined));
        dispatch(purchaseOrderProductDetailsAction([]));
        dispatch(purchaseOrderTermDetailsAction([]));
        dispatch(purchaseOrderDetailsErrAction(undefined));
        localStorage.removeItem("DeletePoProductDetailIds");
        localStorage.removeItem("DeletePoTermDetailIds");
    }

    const purchaseOrderValidation = () => {
        setModalShow(false);

        const vendorErr = {};
        const poDateErr = {};
        // const poAmountErr = {};
        const poProductDetailsErr = {};

        let isValid = true;

        if (!purchaseOrderData.vendorCode) {
            vendorErr.empty = "Select vendor";
            isValid = false;
            setFormError(true);
        }

        if (!purchaseOrderData.poDate) {
            poDateErr.empty = "Select PO date";
            isValid = false;
            setFormError(true);
        }

        if (purchaseOrderProductDetailsList.length < 1) {
            poProductDetailsErr.poProductDetailEmpty = "At least one purchase order product detail required";
            setTimeout(() => {
                toast.error(poProductDetailsErr.poProductDetailEmpty, {
                    theme: 'colored'
                });
            }, 1000);
            isValid = false;
        }
        else if (purchaseOrderProductDetailsList && purchaseOrderProductDetailsList.length > 0) {
            purchaseOrderProductDetailsList.forEach((row, index) => {
                if (!row.unitCode || !row.quantity || !row.poRate || !row.poAmt) {
                    poProductDetailsErr.invalidPoProductDetail = "Fill the required fields in purchase order product detail";
                    isValid = false;
                    setFormError(true);
                }
            })
        }

        if (!isValid) {
            var errorObject = {
                vendorErr,
                poDateErr,
                poProductDetailsErr
            }

            dispatch(purchaseOrderDetailsErrAction(errorObject))
        }

        return isValid;
    }

    const updatePurchaseOrderCallback = (isAddPurchaseOrder = false) => {
        setModalShow(false);

        if (!isAddPurchaseOrder) {
            toast.success("Purchase order details updated successfully", {
                time: 'colored'
            })
        }

        $('#btnSave').attr('disabled', true)

        clearPurchaseOrderReducers();

        fetchPurchaseOrderList(1, perPage, localStorage.getItem("EncryptedCompanyCode"));

        $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
    }

    const addPurchaseOrderDetails = () => {
        if (purchaseOrderValidation()) {
            const requestData = {
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                distributionCentreCode: purchaseOrderData.distributionCentreCode ? purchaseOrderData.distributionCentreCode : "",
                collectionCentreCode: purchaseOrderData.collectionCentreCode ? purchaseOrderData.collectionCentreCode : "",
                vendorCode: purchaseOrderData.vendorCode,
                poDate: Moment(purchaseOrderData.poDate).format("YYYY-MM-DD"),
                poAmount: parseFloat(purchaseOrderData.poAmount),
                poStatus: purchaseOrderData.poStatus ? purchaseOrderData.poStatus : "Draft",
                gstNo: purchaseOrderData.gstNo ? purchaseOrderData.gstNo : "",
                activeStatus: "A",
                purchaseOrderProductDetails: purchaseOrderProductDetailsList,
                purchaseOrderTermDetails: purchaseOrderTermList,
                addUser: localStorage.getItem("LoginUserName")
            }

            const keys = ['addUser']
            for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
                requestData[key] = requestData[key] ? requestData[key].toUpperCase() : "";
            }

            const poTermDetailKeys = ['poTerms', 'addUser']
            var index = 0;
            for (var obj in requestData.purchaseOrderTermDetails) {
                var poTermDetailObject = requestData.purchaseOrderTermDetails[obj];

                for (const key of Object.keys(poTermDetailObject).filter((key) => poTermDetailKeys.includes(key))) {
                    poTermDetailObject[key] = poTermDetailObject[key] ? poTermDetailObject[key].toUpperCase() : "";
                }

                requestData.purchaseOrderTermDetails[index] = poTermDetailObject;
                index++;
            }

            setIsLoading(true);
            axios.post(process.env.REACT_APP_API_URL + '/add-po-header-detail', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    if (res.data.status == 200) {
                        setIsLoading(false)
                        setTimeout(function () {
                            dispatch(purchaseOrderDetailsAction({
                                ...purchaseOrderData,
                                encryptedPoNo: res.data.data.encryptedPoNo,
                                poNo: res.data.data.poNo
                            }))
                        }, 50);
                        localStorage.setItem("EncryptedPoNo", res.data.data.encryptedPoNo);
                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updatePurchaseOrderCallback(true);
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
                        <h5>Do you want to save changes?</h5>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* <Button variant="success" onClick={vendorMasterData.encryptedVendorCode ? updateVendorMasterDetails : addVendorMasterDetails}>Save</Button> */}
                        <Button variant="success" onClick={addPurchaseOrderDetails}>Save</Button>
                        <Button variant="danger" id='btnDiscard' onClick={discardChanges}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="PurchaseOrder"
                // saveDetails={vendorMasterData.encryptedVendorCode ? updateVendorMasterDetails : addVendorMasterDetails}
                saveDetails={addPurchaseOrderDetails}
                newDetails={newDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
                tableFilterOptions={companyList}
                tableFilterName={'Company'}
                supportingMethod1={handleFieldChange}
            />
        </>

    )
}

export default PurchaseOrder