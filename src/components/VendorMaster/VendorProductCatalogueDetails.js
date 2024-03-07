import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { toast } from 'react-toastify';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Moment from "moment";
import { handleNumericInputKeyPress } from "./../../helpers/utils.js"
import { formChangedAction, oemProductDetailsAction, vendorProductCatalogueDetailsAction } from 'actions';

export const VendorProductCatalogueDetails = () => {

    const dispatch = useDispatch();
    const [formHasError, setFormError] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [oemModal, setOemModal] = useState(false);
    const [oemProductCatalogueModal, setOemProductCatalogueModal] = useState(false);
    const [quantityUnitList, setQuantityUnitList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [modalData, setModalData] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [paramsData, setParamsData] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [productCategoryList, setProductCategoryList] = useState([]);
    const [productCategory, setProductCategory] = useState();

    let vendorProductCatalogueDetailsReducer = useSelector((state) => state.rootReducer.vendorProductCatalogueDetailsReducer)
    let vendorProductCatalogueData = vendorProductCatalogueDetailsReducer.vendorProductCatalogueDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let oemProductDetailsReducer = useSelector((state) => state.rootReducer.oemProductDetailsReducer)
    let oemProductList = oemProductDetailsReducer.oemProductDetails;

    const vendorMasterDetailsErrorReducer = useSelector((state) => state.rootReducer.vendorMasterDetailsErrorReducer)
    const vendorMasterErr = vendorMasterDetailsErrorReducer.vendorMasterDetailsError;

    const columnsArray = [
        'S.No',
        'Product Category',
        'Product',
        'Variety',
        'Brand',
        'Season',
        'Quantity',
        'Unit',
        'Rate',
        'Amt',
        'OEM Rate',
        'From Date',
        'To Date',
        'Status',
        'Delete',
        'Show'
    ];

    useEffect(() => {
        if (vendorProductCatalogueDetailsReducer.vendorProductCatalogueDetails.length > 0) {
            setRowData(vendorProductCatalogueData);
            setSelectedRows([]);
            if (quantityUnitList.length <= 0) {
                getUnitList("W")
            }
        } else {
            setRowData([]);
            setSelectedRows([]);
        }

        if (oemProductDetailsReducer.oemProductDetails.length <= 0) {
            getOemCatalogueMasterList();
        }

        if (productCategoryList.length <= 0) {
            getProductCategoryList();
        }
    }, [vendorProductCatalogueData, vendorProductCatalogueDetailsReducer])

    const handleAddItem = async () => {
        setOemModal(true);
        getOemCatalogueMasterList();   
    }

    const oemProductCatalogueModalPreview = async (index, oemProductCatalogueCode) => {
        setOemProductCatalogueModal(true);

        const oemProductData = oemProductList.find(item => item.oemProductCatalogueCode === oemProductCatalogueCode);

        if (oemProductData !== null) {
            setModalData({
                oemName: oemProductData.oemName,
                varietyName: oemProductData.varietyName,
                seedQuantity: oemProductData.seedQuantity,
                seedUnitCode: oemProductData.seedUnitCode,
                maturityDays: oemProductData.maturityDays,
                maturityUnitCode: oemProductData.maturityUnitCode,
                yieldLand: oemProductData.yieldLand,
                landUnitCode: oemProductData.landUnitCode,
                yieldOutput: oemProductData.yieldOutput,
                yieldUnitCode: oemProductData.yieldUnitCode,
                nFrom: oemProductData.nFrom,
                nTo: oemProductData.nTo,
                pFrom: oemProductData.pFrom,
                pTo: oemProductData.pTo,
                kFrom: oemProductData.kFrom,
                kTo: oemProductData.kTo,
                phFrom: oemProductData.phFrom,
                phTo: oemProductData.phTo,
                tempFrom: oemProductData.tempFrom,
                tempTo: oemProductData.tempTo,
                ecFrom: oemProductData.ecFrom,
                ecTo: oemProductData.ecTo,
                organicCarbonFrom: oemProductData.organicCarbonFrom,
                organicCarbonTo: oemProductData.organicCarbonTo,
                sulphurFrom: oemProductData.sulphurFrom,
                sulphurTo: oemProductData.sulphurTo,
                ironFrom: oemProductData.ironFrom,
                ironTo: oemProductData.ironTo,
                zincFrom: oemProductData.zincFrom,
                zincTo: oemProductData.zincTo,
                copperFrom: oemProductData.copperFrom,
                copperTo: oemProductData.copperTo,
                boronFrom: oemProductData.boronFrom,
                boronTo: oemProductData.boronTo,
                manganeseFrom: oemProductData.manganeseFrom,
                manganeseTo: oemProductData.manganeseTo
            })
        }
    }

    const getUnitList = async (type) => {

        let requestData = {
            UnitType: type
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
                setQuantityUnitList(unitListData)
            }
        }
        else {
            setQuantityUnitList([]);
        }
    }

    const handleFieldChange = (e, index) => {
        const { name, value } = e.target;
        var vendorProductCatalogueDetail = [...rowData];
        vendorProductCatalogueDetail[index] = {
            ...vendorProductCatalogueDetail[index],
            [name]: value,
        };

        dispatch(vendorProductCatalogueDetailsAction(vendorProductCatalogueDetail))

        if (vendorProductCatalogueDetail[index].quantity && vendorProductCatalogueDetail[index].vendorRate) {
            const calculatedAmount = parseFloat(vendorProductCatalogueDetail[index].quantity) * parseFloat(vendorProductCatalogueDetail[index].vendorRate)
            vendorProductCatalogueDetail[index].vendorAmount = calculatedAmount.toString();
            dispatch(vendorProductCatalogueDetailsAction(vendorProductCatalogueDetail))
        } else {
            vendorProductCatalogueDetail[index].vendorAmount = "0"
        }

        if (vendorProductCatalogueDetail[index].encryptedVendorProductCatalogueCode) {
            dispatch(formChangedAction({
                ...formChangedData,
                vendorProductCatalogueDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                vendorProductCatalogueDetailAdd: true
            }))
        }
    }

    const getOemCatalogueMasterList = async (searchText, productCategoryCode, isManualFilter = false) => {
        const requestData = {
            SearchText: searchText,
            ProductCategoryCode: isManualFilter ? productCategoryCode : productCategory
        }

        const response = await axios.post(process.env.REACT_APP_API_URL + '/get-oem-product-catalogue-master-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                dispatch(oemProductDetailsAction(response.data.data));
            }
        } else {
            dispatch(oemProductDetailsAction([]));
        }
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
            const updatedData = [...oemProductList]
            dispatch(vendorProductCatalogueDetailsAction(updatedData));
        } else {
            const updatedData = [...selectedRows, ...vendorProductCatalogueData];
            dispatch(vendorProductCatalogueDetailsAction(updatedData));
        }
        dispatch(formChangedAction({
            ...formChangedData,
            vendorProductCatalogueDetailAdd: true
        }))

        setOemModal(false);
        setSelectAll(false);
        setProductCategory();
    }

    const handleSearchChange = (e) => {
        getOemCatalogueMasterList(e.target.value);
    }

    const ModalPreview = (encryptedVendorProductCatalogueCode) => {
        setModalShow(true);
        setParamsData({ encryptedVendorProductCatalogueCode });
    }

    const deleteVendorProductCatalogueDetails = () => {
        if (!paramsData)
            return false;

        var objectIndex = vendorProductCatalogueDetailsReducer.vendorProductCatalogueDetails.findIndex(x => x.encryptedVendorProductCatalogueCode == paramsData.encryptedVendorProductCatalogueCode);
        vendorProductCatalogueDetailsReducer.vendorProductCatalogueDetails.splice(objectIndex, 1)

        var deleteVendorProductCatalogueCode = localStorage.getItem("DeleteVendorProductCatalogueCodes");

        if (paramsData.encryptedVendorProductCatalogueCode) {
            var deleteVendorProductCatalogueDetail = deleteVendorProductCatalogueCode ? deleteVendorProductCatalogueCode + "," + paramsData.encryptedVendorProductCatalogueCode : paramsData.encryptedVendorProductCatalogueCode;
            localStorage.setItem("DeleteVendorProductCatalogueCodes", deleteVendorProductCatalogueDetail);
        }

        toast.success("Vendor product catalogue details deleted successfully", {
            theme: 'colored'
        });

        dispatch(vendorProductCatalogueDetailsAction(vendorProductCatalogueData));

        dispatch(formChangedAction({
            ...formChangedData,
            vendorProductCatalogueDetailDelete: true
        }))

        setModalShow(false);
    }

    const handleHeaderCheckboxChange = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedRows([]);
        }
    };

    const getProductCategoryList = async () => {

        let productCategoryData = [];
        let productCategoryResponse = await axios.get(process.env.REACT_APP_API_URL + '/product-category-master-list', {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (productCategoryResponse.data.status == 200) {
            if (productCategoryResponse.data && productCategoryResponse.data.data.length > 0) {
                productCategoryResponse.data.data.forEach(productCategory => {
                    productCategoryData.push({
                        key: productCategory.productCategoryName,
                        value: productCategory.productCategoryCode
                    })
                })
            }
            setProductCategoryList(productCategoryData);
        } else {
            setProductCategoryList([]);
        }
    }

    const handleProductCategoryChange = e => {
        setProductCategory(e.target.value);
        getOemCatalogueMasterList("", e.target.value, true);
    }

    return (
        <>

            {modalShow && paramsData &&
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
                        <h4>Are you sure, you want to delete this vendor product catalogue detail?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button variant="danger" onClick={() => deleteVendorProductCatalogueDetails()}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            }

            {oemModal &&
                <Modal
                    show={oemModal}
                    onHide={() => setOemModal(false)}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">OEM Detail</Modal.Title>
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
                                            <Form.Control id="txtSearch" name="search" placeholder="Search" onChange={handleSearchChange} maxLength={45} />
                                        </Col>
                                    </Form.Group>
                                </Col>

                                <Col className="me-3 ms-3" md="7">
                                    <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Product Category
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Select
                                                type="text"
                                                name="productCategoryCode"
                                                onChange={handleProductCategoryChange}
                                                value={productCategory}
                                                className="form-control"
                                            >
                                                <option value=''>Select</option>
                                                {productCategoryList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </Col>

                                {
                                    oemProductDetailsReducer && oemProductDetailsReducer.oemProductDetails.length > 0 ?
                                        <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                            <thead className='custom-bg-200'>
                                                <tr>
                                                    <th>Select <Form.Check type="checkbox" id="contactListChkBox" >
                                                        <Form.Check.Input
                                                            type="checkbox"
                                                            name="selectAll"
                                                            style={{ width: '15px', height: '15px' }}
                                                            onChange={handleHeaderCheckboxChange}
                                                            checked={selectAll}
                                                        />
                                                    </Form.Check>
                                                    </th>
                                                    <th>OEM Name</th>
                                                    <th>Category</th>
                                                    <th>Product</th>
                                                    <th>Variety</th>
                                                    <th>Brand</th>
                                                    <th>Season</th>
                                                    <th>Area</th>
                                                    <th>Sowing</th>
                                                    <th>Org/Inorg</th>
                                                    <th>Type</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    oemProductDetailsReducer.oemProductDetails.map((data, index) =>
                                                        <tr>
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
                                                            <td>{data.oemName}</td>
                                                            <td>{data.productCategoryName}</td>
                                                            <td>{data.productName}</td>
                                                            <td>{data.varietyName}</td>
                                                            <td>{data.brandName}</td>
                                                            <td>{data.season}</td>
                                                            <td>{data.area}</td>
                                                            <td>{data.sowing}</td>
                                                            <td>{data.orgInorg}</td>
                                                            <td>{data.type}</td>
                                                            <td>{data.activeStatus}</td>
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
                        <Button variant="success" onClick={() => handleSelectedItem()} >Add</Button>
                        <Button variant="danger" onClick={() => { setOemModal(false), setProductCategory() }} >Cancel</Button>
                    </Modal.Footer>
                </Modal >
            }

            {oemProductCatalogueModal &&
                <Modal
                    show={oemProductCatalogueModal}
                    onHide={() => { setOemProductCatalogueModal(false), setModalData({}) }}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">OEM - {modalData.oemName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="max-five-rows">
                        <Form
                            noValidate
                            className="details-form"
                        >
                            <Row>
                                {modalData.varietyName &&
                                    <>
                                        <div className="mb-2 d-flex justify-content-center align-items-center">{modalData.varietyName}</div>
                                        <hr></hr>
                                    </>
                                }
                                <Col className="me-3 ms-3 mb-3 mt-2" md="11">
                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Qty
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtQty" name="seedQuantity" placeholder="Quantity" value={modalData.seedQuantity} disabled />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control id="txtQty" name="seedUnitCode" placeholder="Unit" value={modalData.seedUnitCode} disabled />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Maturity Days
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtNoOfDays" name="maturityDays" placeholder="Maturity Days" value={modalData.maturityDays} disabled />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control id="txtUnitDays" name="maturityUnitCode" placeholder="Unit" value={modalData.maturityUnitCode} disabled />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Yield Land
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtYieldLand" name="yieldLand" placeholder="Yield Land" value={modalData.yieldLand} disabled />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control id="txtLandUnit" name="landUnitCode" placeholder="Unit" value={modalData.landUnitCode} disabled />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Yield Output
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtYieldOutput" name="yieldOutput" placeholder="Yield Output" value={modalData.yieldOutput} disabled />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control id="txtYieldOutputUnits" name="yieldUnitCode" placeholder="Unit" value={modalData.yieldUnitCode} disabled />
                                        </Col>
                                    </Form.Group>
                                </Col>

                                <Table
                                    style={{ paddingLeft: 0 }}
                                    striped bordered responsive className="text-nowrap tab-page-table">
                                    <thead className='custom-bg-200'>
                                        <tr>
                                            <th>Soil Ingredients</th>
                                            <th>From</th>
                                            <th>To</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                N
                                            </td>
                                            <td>
                                                <Form.Control placeholder="N From" name="nFrom" value={modalData.nFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="N To" name="nTo" value={modalData.nTo} disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                P
                                            </td>
                                            <td>
                                                <Form.Control placeholder="P From" name="pFrom" value={modalData.pFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="P To" name="pTo" value={modalData.pTo} disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                K
                                            </td>
                                            <td>
                                                <Form.Control placeholder="K From" name="kFrom" value={modalData.kFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="K To" name="kTo" value={modalData.kTo} disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                PH
                                            </td>
                                            <td>
                                                <Form.Control placeholder="PH From" name="phFrom" value={modalData.phFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="PH To" name="phTo" value={modalData.phTo} disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Temp
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Temp From" name="tempFrom" value={modalData.tempFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Temp To" name="tempTo" value={modalData.tempTo} disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                EC
                                            </td>
                                            <td>
                                                <Form.Control placeholder="EC From" name="ecFrom" value={modalData.ecFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="EC To" name="ecTo" value={modalData.ecTo} disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Organic Carbon
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Organic Carbon From" name="organicCarbonFrom" value={modalData.organicCarbonFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Organic Carbon To" name="organicCarbonTo" value={modalData.organicCarbonTo} disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Sulphur
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Sulphur From" name="sulphurFrom" value={modalData.sulphurFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Sulphur To" name="sulphurTo" value={modalData.sulphurTo} disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Iron
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Iron From" name="ironFrom" value={modalData.ironFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Iron To" name="ironTo" value={modalData.ironTo} disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Zinc
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Zinc From" name="zincFrom" value={modalData.zincFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Zinc To" name="zincTo" value={modalData.zincTo} disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Copper
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Copper From" name="copperFrom" value={modalData.copperFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Copper To" name="copperTo" value={modalData.copperTo} disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Boron
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Boron From" name="boronFrom" value={modalData.boronFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Boron To" name="boronTo" value={modalData.boronTo} disabled />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Manganese
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Manganese From" name="manganeseFrom" value={modalData.manganeseFrom} disabled />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Manganese To" name="manganeseTo" value={modalData.manganeseTo} disabled />
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>

                            </Row>
                        </Form>
                    </Modal.Body>
                </Modal >
            }

            <Card className="h-100 mb-2">
                <FalconCardHeader
                    title="Vendor Product Catalogue"
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
                                    Add Item
                                </Button>
                            </div>
                        </Flex>
                    }
                />
                {
                    vendorProductCatalogueData && vendorProductCatalogueData.length > 0 &&
                    <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
                        <Form
                            noValidate
                            validated={vendorMasterErr.vendorProductCatalogueDetailErr && (vendorMasterErr.vendorProductCatalogueDetailErr.invalidVendorProductCatalogueDetail ||
                                vendorMasterErr.vendorProductCatalogueDetailErr.invalidDate)}
                            className="details-form"
                            id="AddVendorProductCatalogueDetailsForm"
                        >
                            <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                <thead className='custom-bg-200'>
                                    {rowData && <tr>
                                        {columnsArray.map((column, index) => (
                                            <th className="text-left" key={index}>
                                                {column}
                                            </th>
                                        ))}
                                    </tr>}
                                </thead>
                                <tbody id="tbody" className="details-form">
                                    {rowData.map((vendorProductCatalogueData, index) => (
                                        <tr key={index}>
                                            <td>
                                                {index + 1}
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="productCategoryName"
                                                    value={vendorProductCatalogueData.productCategoryName}
                                                    placeholder="Product Category"
                                                    disabled
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="productName"
                                                    value={vendorProductCatalogueData.productName}
                                                    placeholder="Product"
                                                    disabled
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="varietyName"
                                                    value={vendorProductCatalogueData.varietyName}
                                                    placeholder="Variety"
                                                    disabled
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="brandName"
                                                    value={vendorProductCatalogueData.brandName}
                                                    placeholder="Brand"
                                                    disabled
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="season"
                                                    value={vendorProductCatalogueData.season}
                                                    placeholder="Season"
                                                    disabled
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="quantity"
                                                    value={vendorProductCatalogueData.quantity ? vendorProductCatalogueData.quantity : ""}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Quantity"
                                                    maxLength={5}
                                                    onKeyPress={handleNumericInputKeyPress}
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="unitCode"
                                                    className="form-control select"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={vendorProductCatalogueData.unitCode ? vendorProductCatalogueData.unitCode : ''}
                                                >
                                                    <option value=''>Select </option>
                                                    {quantityUnitList.map((option, index) => (
                                                        <option key={index} value={option.value}>{option.key}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="vendorRate"
                                                    // className="enlargeText"
                                                    value={vendorProductCatalogueData.vendorRate ? vendorProductCatalogueData.vendorRate : ''}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Vendor Rate"
                                                    maxLength={13}
                                                    onKeyPress={handleNumericInputKeyPress}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="vendorAmount"
                                                    // className="enlargeText"
                                                    value={vendorProductCatalogueData.vendorAmount ? vendorProductCatalogueData.vendorAmount : ''}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Amount"
                                                    maxLength={13}
                                                    disabled
                                                />
                                            </td>
                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="oemRate"
                                                    value={vendorProductCatalogueData.oemRate ? vendorProductCatalogueData.oemRate : ''}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="OEM Rate"
                                                    maxLength={13}
                                                    onKeyPress={handleNumericInputKeyPress}
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Control
                                                    type='date'
                                                    name="validFrom"
                                                    placeholder="Select date"
                                                    // className="form-control col-12 col-sm-6 col-md-4"
                                                    value={vendorProductCatalogueData.validFrom ? Moment(vendorProductCatalogueData.validFrom).format("YYYY-MM-DD") : ""}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    required={vendorMasterErr.vendorProductCatalogueDetailErr && (vendorMasterErr.vendorProductCatalogueDetailErr.invalidVendorProductCatalogueDetail ||
                                                        vendorMasterErr.vendorProductCatalogueDetailErr.invalidDate)}
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Control
                                                    type='date'
                                                    name="validTo"
                                                    placeholder="Select date"
                                                    value={vendorProductCatalogueData.validTo ? Moment(vendorProductCatalogueData.validTo).format("YYYY-MM-DD") : ""}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    required={vendorMasterErr.vendorProductCatalogueDetailErr && (vendorMasterErr.vendorProductCatalogueDetailErr.invalidVendorProductCatalogueDetail ||
                                                        vendorMasterErr.vendorProductCatalogueDetailErr.invalidDate)}
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="activeStatus"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={vendorProductCatalogueData.activeStatus}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Suspended">Suspended</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(vendorProductCatalogueData.encryptedVendorProductCatalogueCode) }} />
                                            </td>

                                            <td key={index}>
                                                <FontAwesomeIcon icon={'plus'} className="fa-2x me-2"
                                                    onClick={() => oemProductCatalogueModalPreview(index, vendorProductCatalogueData.oemProductCatalogueCode)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Form>
                    </Card.Body>
                }
            </Card>
        </>

    )
}

export default VendorProductCatalogueDetails;