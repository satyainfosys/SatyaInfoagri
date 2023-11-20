import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Moment from "moment";
import { Spinner, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { distributionCentreListAction, tabInfoAction } from 'actions';

const tabArray = ['Crop Purchase List', 'Add Crop Purchase']

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'poNo', Header: 'PO No.' },
    { accessor: 'poDate', Header: 'PO Date' },
    { accessor: 'poAmount', Header: 'PO Amount' },
    { accessor: 'farmerName', Header: 'Farmer Name' },
    { accessor: 'farmerFatherName', Header: 'Farmer Father Name' },
    { accessor: 'farmerPhoneNumber', Header: 'Farmer Phone Name' },
    { accessor: 'poStatus', Header: 'PO Status' },
    { accessor: 'print', Header: 'Print' }
]

const CropPurchase = () => {

    const dispatch = useDispatch();
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [activeTabName, setActiveTabName] = useState();
    const [companyList, setCompanyList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [generateReportModal, setGenerateReportModal] = useState(false);

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add Crop Purchase"]').attr('disabled', true);
        // localStorage.removeItem("EncryptedMaterialReceiptId");
        getCompany();
        // localStorage.removeItem("EncryptedPoNo");
        // localStorage.removeItem("EncryptedCompanyCode");
        // if (purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved") {
        //     $("#btnSave").attr('disabled', true);
        // }
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
                // fetchPurchaseOrderList(1, perPage, companyResponse.data.data[0].encryptedCompanyCode);
                fetchDistributionCentreList(e.target.value);
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
        // fetchPurchaseOrderList(1, perPage, e.target.value);
        fetchDistributionCentreList(e.target.value);
    }

    // const fetchPurchaseOrderList = async (page, size = perPage, encryptedCompanyCode) => {

    //     let token = localStorage.getItem('Token');

    //     const listFilter = {
    //         pageNumber: page,
    //         pageSize: size,
    //         EncryptedCompanyCode: encryptedCompanyCode
    //     }

    //     setIsLoading(true);
    //     let response = await axios.post(process.env.REACT_APP_API_URL + '/get-po-header-list', listFilter, {
    //         headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
    //     })

    //     if (response.data.status == 200) {
    //         setIsLoading(false);
    //         setListData(response.data.data);
    //     } else {
    //         setIsLoading(false);
    //         setListData([])
    //     }
    // }

    const fetchDistributionCentreList = async (encryptedCompanyCode) => {
        const request = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
            EncryptedCompanyCode: encryptedCompanyCode
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-distribution-centre-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        let distributionCentreListData = [];
        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(distributionCentre => {
                    distributionCentreListData.push({
                        key: distributionCentre.distributionName,
                        value: distributionCentre.distributionCentreCode
                    })
                })
            }
            dispatch(distributionCentreListAction(distributionCentreListData));
        }
    }

    $('[data-rr-ui-event-key*="Crop Purchase List"]').off('click').on('click', function () {
        // let isDiscard = $('#btnDiscard').attr('isDiscard');
        // if (isDiscard != 'true' && isFormChanged) {
        //     setModalShow(true);
        //     setTimeout(function () {
        //         $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
        //     }, 50);
        // } else {
        //     $("#btnNew").show();
        //     $("#btnSave").hide();
        //     $("#btnCancel").hide();
        //     $('[data-rr-ui-event-key*="Add PO"]').attr('disabled', true);
        //     $('[data-rr-ui-event-key*="Add Term"]').attr('disabled', true);
        //     clearPurchaseOrderReducers();
        //     dispatch(purchaseOrderDetailsAction(undefined));
        //     dispatch(vendorProductCatalogueDetailsAction([]));
        //     localStorage.removeItem("EncryptedPoNo");
        //     localStorage.removeItem("OldPoStatus");
        // }
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add Crop Purchase"]').attr('disabled', true);
    })

    $('[data-rr-ui-event-key*="Add Crop Purchase"]').off('click').on('click', function () {
        setActiveTabName("Add PO")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
    })

    const newDetails = () => {
        if (localStorage.getItem("EncryptedCompanyCode")) {
            $('[data-rr-ui-event-key*="Add Crop Purchase"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add Crop Purchase"]').trigger('click');
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
            $('[data-rr-ui-event-key*="Crop Purchase List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            window.location.href = '/dashboard';
            // clearPurchaseOrderReducers();
            // dispatch(purchaseOrderDetailsAction(undefined));
            // dispatch(vendorProductCatalogueDetailsAction([]));
            // localStorage.removeItem("EncryptedPoNo");
            // localStorage.removeItem("DeletePoProductDetailIds");
            // localStorage.removeItem("DeletePoTermDetailIds");
            // localStorage.removeItem("EncryptedCompanyCode");
            // localStorage.removeItem("CompanyName");
        }
    }

    const discardChanges = () => {
        $('#btnDiscard').attr('isDiscard', 'true');
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else {
            $('[data-rr-ui-event-key*="Crop Purchase List"]').trigger('click');
        }

        setModalShow(false);
    }

    const handleButtonClick = () => {
        setGenerateReportModal(true);
    }

    return (
        <>
            {isLoading ? (
                <Spinner
                    className="position-absolute start-50 loader-color"
                    animation="border"
                />
            ) : null}

            {
                generateReportModal &&
                <Modal
                    show={generateReportModal}
                    onHide={() => setGenerateReportModal(false)}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Purchase Report</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="details-form" id="FarmerDetails" >
                            <Row>
                                <Col className="me-3 ms-3" md="5">
                                    <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                        <Form.Label column sm="2">
                                            Start Date
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control type='date' id="txtStartDate" name="startDate" />
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col className="me-3 ms-3" md="4">
                                    <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                        <Form.Label column sm="2">
                                            End Date
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control type='date' id="txtEndDate" name="endDate" />
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" id='btnGenerateReport'>Generate Report</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="CropPurchase"
                // saveDetails={materialReceiptHeaderData.encryptedMaterialReceiptId ? updateCropPurchaseDetails : addCropPurchaseDetails}
                newDetails={newDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
                tableFilterOptions={companyList}
                tableFilterName={'Company'}
                supportingMethod1={handleFieldChange}
                supportingButtonClick={handleButtonClick}
            />
        </>
    )
}

export default CropPurchase