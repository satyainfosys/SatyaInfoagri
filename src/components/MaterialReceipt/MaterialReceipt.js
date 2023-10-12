import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import $ from "jquery";
import { toast } from 'react-toastify';
import Moment from "moment";
import { formChangedAction, materialReceiptDetailsAction, materialReceiptErrorAction, materialReceiptHeaderDetailsAction, tabInfoAction, vendorMasterDetailsListAction } from 'actions';

const tabArray = ["Material List", "Add Material"]

const listColumnArray = [
    { accessor: 's1', Header: 'S.No' },
    { accessor: 'materialReceiptId', Header: 'Material Receipt No' },
    { accessor: 'vendorName', Header: 'Vendor Name' },
    { accessor: 'materialReceiptDate', Header: 'Delivery Date' },
    { accessor: 'personName', Header: 'Person Name' },
]

const MaterialReceipt = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [activeTabName, setActiveTabName] = useState();
    const [formHasError, setFormError] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add Material"]').attr('disabled', true);
        localStorage.removeItem("EncryptedMaterialReceiptId");
        getCompany();
    }, [])

    const materialReceiptHeaderReducer = useSelector((state) => state.rootReducer.materialReceiptHeaderReducer)
    var materialReceiptHeaderData = materialReceiptHeaderReducer.materialReceiptHeaderDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const materialReceiptDetailsReducer = useSelector((state) => state.rootReducer.materialReceiptDetailsReducer)
    var materialReceiptList = materialReceiptDetailsReducer.materialReceiptDetails;

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
                fetchMaterialReceiptHeaderList(1, perPage, companyResponse.data.data[0].encryptedCompanyCode);
                getVendorMasterList(companyResponse.data.data[0].encryptedCompanyCode)
                localStorage.setItem("CompanyName", companyResponse.data.data[0].companyName)
                localStorage.setItem("EncryptedCompanyCode", companyResponse.data.data[0].encryptedCompanyCode);
            }
        } else {
            setCompanyList([])
        }
    }

    const getVendorMasterList = async () => {
        const requestData = {
            pageNumber: 1,
            pageSize: 1,
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-master-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                dispatch(vendorMasterDetailsListAction(response.data.data))
            }
        } else {
            dispatch(vendorMasterDetailsListAction([]))
        }
    }

    const handleFieldChange = e => {
        localStorage.setItem("EncryptedCompanyCode", e.target.value);
        const selectedOption = e.target.options[e.target.selectedIndex];
        const selectedKey = selectedOption.dataset.key || selectedOption.label;
        localStorage.setItem("CompanyName", selectedKey)
        fetchMaterialReceiptHeaderList(1, perPage, e.target.value);
        getVendorMasterList(e.target.value);
    }

    const fetchMaterialReceiptHeaderList = async (page, size = perPage, encryptedCompanyCode) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedCompanyCode: encryptedCompanyCode
        }

        setIsLoading(true);
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-material-receipt-header-list', listFilter, {
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

    $('[data-rr-ui-event-key*="Material List"]').off('click').on('click', function () {
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
            $('[data-rr-ui-event-key*="Add Material"]').attr('disabled', true);
            clearMaterialReceiptReducers();
            localStorage.removeItem("EncryptedMaterialReceiptId");
            dispatch(materialReceiptHeaderDetailsAction(undefined));
        }
    })

    $('[data-rr-ui-event-key*="Add Material"]').off('click').on('click', function () {
        setActiveTabName("Add Material")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();

        if (materialReceiptList.length <= 0) {
            getMaterialReceiptDetailList();
        }
    })

    const newDetails = () => {
        if (localStorage.getItem("EncryptedCompanyCode")) {
            $('[data-rr-ui-event-key*="Add Material"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add Material"]').trigger('click');
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
            $('[data-rr-ui-event-key*="Material List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            window.location.href = '/dashboard';
            dispatch(materialReceiptHeaderDetailsAction(undefined));
            dispatch(vendorMasterDetailsListAction([]));
            localStorage.removeItem("EncryptedMaterialReceiptId");
            localStorage.removeItem("EncryptedCompanyCode");
            localStorage.removeItem("CompanyName");
        }
    }

    const discardChanges = () => {
        $('#btnDiscard').attr('isDiscard', 'true');
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else {
            $('[data-rr-ui-event-key*="Material List"]').trigger('click');
        }

        setModalShow(false);
    }

    const getMaterialReceiptDetailList = async () => {
        const request = {
            encryptedMaterialReceiptId: localStorage.getItem("EncryptedMaterialReceiptId")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-material-receipt-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(materialReceiptDetailsAction(response.data.data));
            }
        }
    }

    const clearMaterialReceiptReducers = () => {
        dispatch(formChangedAction(undefined));
        dispatch(materialReceiptDetailsAction([]));
        dispatch(materialReceiptErrorAction(undefined));
    }

    const materialReceiptValidation = () => {
        setModalShow(false);

        const vendorErr = {};
        const materialReceiptDetailErr = {};

        let isValid = true;

        if (!materialReceiptHeaderData.vendorCode) {
            vendorErr.empty = "Select vendor";
            isValid = false;
        }

        if (materialReceiptList.length < 1) {
            materialReceiptDetailErr.materialReceiptDetailEmpty = "At least one material details required";
            setTimeout(() => {
                toast.error(materialReceiptDetailErr.materialReceiptDetailEmpty, {
                    theme: 'colored'
                });
            }, 1000);
            isValid = false;
        }
        else if (materialReceiptList && materialReceiptList.length > 0) {
            materialReceiptList.forEach((row, index) => {
                if (!row.productLineCode || !row.productCategoryCode || !row.productCode || !row.receivedQuantity) {
                    materialReceiptDetailErr.invalidMaterialReceiptDetail = "Fill the required fields"
                    isValid = false;
                }
            })
        }

        if (!isValid) {
            var errorObject = {
                vendorErr,
                materialReceiptDetailErr
            }

            dispatch(materialReceiptErrorAction(errorObject))
        }

        return isValid;
    }

    const updateMaterialReceiptCallback = (isAddMaterialReceipt = false) => {
        setModalShow(false);

        if (!isAddMaterialReceipt) {
            toast.success("Material receipt details updated successfully", {
                time: 'colored'
            })
        }

        $('#btnSave').attr('disabled', true)

        clearMaterialReceiptReducers();

        fetchMaterialReceiptHeaderList(1, perPage, localStorage.getItem("EncryptedCompanyCode"));

        $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
    }

    const addMaterialReceiptDetails = () => {
        if (materialReceiptValidation()) {
            const requestData = {
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                vendorCode: materialReceiptHeaderData.vendorCode,
                poNo: materialReceiptHeaderData.poNo ? materialReceiptHeaderData.poNo : "",
                materialReceiptDate: materialReceiptHeaderData.materialReceiptDate ?
                    Moment(materialReceiptHeaderData.materialReceiptDate).format("YYYY-MM-DD") : Moment().format("YYYY-MM-DD"),
                personName: materialReceiptHeaderData.personName ? materialReceiptHeaderData.personName : "",
                challanNo: materialReceiptHeaderData.challanNo ? materialReceiptHeaderData.challanNo : "",
                activeStatus: "A",
                addUser: localStorage.getItem("LoginUserName"),
                materialStatus: materialReceiptHeaderData.materialStatus && materialReceiptHeaderData.materialStatus == "Approved" ? "A" : "D",
                materialReceiptDetails: materialReceiptList
            }

            const keys = ["addUser", "personName"]
            for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
                requestData[key] = requestData[key] ? requestData[key].toUpperCase() : "";
            }

            const materialReceiptDetailKeys = ['addUser']
            var index = 0;
            for (var obj in requestData.materialReceiptDetails) {
                var materialReceiptObject = requestData.materialReceiptDetails[obj];

                for (const key of Object.keys(materialReceiptObject).filter((key) => materialReceiptDetailKeys.includes(key))) {
                    materialReceiptObject[key] = materialReceiptObject[key] ? materialReceiptObject[key].toUpperCase() : "";
                }

                requestData.materialReceiptDetails[index] = materialReceiptObject;
                index++;
            }

            setIsLoading(true);
            axios.post(process.env.REACT_APP_API_URL + '/add-material-receipt-header', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    if (res.data.status == 200) {
                        setIsLoading(false)
                        setTimeout(function () {
                            dispatch(materialReceiptHeaderDetailsAction({
                                ...materialReceiptHeaderData,
                                encryptedMaterialReceiptId: res.data.data.encryptedMaterialReceiptId,
                                materialReceiptId: res.data.data.materialReceiptId
                            }))
                        }, 50);
                        localStorage.setItem("EncryptedMaterialReceiptId", res.data.data.encryptedMaterialReceiptId);
                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updateMaterialReceiptCallback(true);
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

    const updateMaterialReceiptDetails = async () => {
        if (materialReceiptValidation()) {
            if (!formChangedData.materialReceiptHeaderDetailUpdate &&
                !(formChangedData.materialReceiptDetailAdd || formChangedData.materialReceiptDetailUpdate || formChangedData.materialReceiptDetailDelete)) {
                return;
            }

            var deleteMaterialReceiptDetailIds = localStorage.getItem("DeleteMaterialReceiptDetailIds");

            const updateRequestData = {
                encryptedMaterialReceiptId: localStorage.getItem("EncryptedMaterialReceiptId"),
                encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
                vendorCode: materialReceiptHeaderData.vendorCode,
                poNo: materialReceiptHeaderData.poNo ? materialReceiptHeaderData.poNo : "",
                materialReceiptDate: materialReceiptHeaderData.materialReceiptDate ?
                    Moment(materialReceiptHeaderData.materialReceiptDate).format("YYYY-MM-DD") : Moment().format("YYYY-MM-DD"),
                personName: materialReceiptHeaderData.personName ? materialReceiptHeaderData.personName : "",
                challanNo: materialReceiptHeaderData.challanNo ? materialReceiptHeaderData.challanNo : "",
                materialStatus: materialReceiptHeaderData.materialStatus && materialReceiptHeaderData.materialStatus == "Approved" ? "A" : "D",
                modifyUser: localStorage.getItem("LoginUserName"),
            }

            const keys = ["modifyUser", "personName"]
            for (const key of Object.keys(updateRequestData).filter((key) => keys.includes(key))) {
                updateRequestData[key] = updateRequestData[key] ? updateRequestData[key].toUpperCase() : "";
            }

            var hasError = false;
            if (formChangedData.materialReceiptHeaderDetailUpdate) {
                setIsLoading(true);
                await axios.post(process.env.REACT_APP_API_URL + '/update-material-receipt-header', updateRequestData, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                })
                    .then(res => {
                        setIsLoading(false);
                        if (res.data.status !== 200) {
                            toast.error(res.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                        }
                    })
            }

            if (!hasError) {
                clearMaterialReceiptReducers();
                updateMaterialReceiptCallback();
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
                        <h5>Do you want to save changes?</h5>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={materialReceiptHeaderData.encryptedMaterialReceiptId ? updateMaterialReceiptDetails : addMaterialReceiptDetails}>Save</Button>
                        <Button variant="danger" id='btnDiscard' onClick={discardChanges}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="MaterialReceipt"
                saveDetails={materialReceiptHeaderData.encryptedMaterialReceiptId ? updateMaterialReceiptDetails : addMaterialReceiptDetails}
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

export default MaterialReceipt