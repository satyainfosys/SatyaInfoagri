import { formChangedAction, oemProductDetailsAction } from 'actions';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { toast } from 'react-toastify';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const OemProductDetails = () => {

    const dispatch = useDispatch();
    const [formHasError, setFormError] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [oemModal, setOemModal] = useState(false);
    const [productCategoryList, setProductCategoryList] = useState([]);
    const [productMasterList, setProductMasterList] = useState([]);
    const [modalIndex, setModalIndex] = useState();
    let [modalData, setModalData] = useState({});
    const [unitList, setUnitList] = useState([]);
    const [productSeasonList, setProductSeasonList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [paramsData, setParamsData] = useState({});
    const [productCategoryDataList, setProductCategoryDataList] = useState([]);

    const emptyRow = {
        id: rowData.length + 1,
        encryptedOemMasterCode: localStorage.getItem("EncryptedOemMasterCode"),
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        productLineCode: '',
        productCategoryCode: '',
        productCode: '',
        productVarietyName: '',
        brandName: '',
        productSeasonId: '',
        area: '',
        sowing: '',
        orgIng: '',
        desiHyb: '',
        activeStatus: '',
        addUser: localStorage.getItem("LoginUserName"),
        modifyUser: localStorage.getItem("LoginUserName"),
    }

    let oemProductDetailsReducer = useSelector((state) => state.rootReducer.oemProductDetailsReducer)
    let oemProductData = oemProductDetailsReducer.oemProductDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const oemMasterDetailsErrorReducer = useSelector((state) => state.rootReducer.oemMasterDetailsErrorReducer)
    const oemMasterErr = oemMasterDetailsErrorReducer.oemMasterDetailsError;

    const columnsArray = [
        'S.No',
        'Product Category',
        'Product',
        'Variety',
        'Brand',
        'Season',
        'Area',
        'Sowing',
        'Org/Inorg',
        'Type',
        'Status',
        'Add Info'
    ];

    useEffect(() => {

        if (unitList.length <= 0) {
            getUnitList();
        }

        if (oemProductDetailsReducer.oemProductDetails.length > 0) {
            setRowData(oemProductData);
            setTimeout(function () {
                setProductMasterValue();
            }, 50)
        }

        if (productCategoryList.length <= 0) {
            getProductCategoryList();
        }

        getProductSeason();
    }, [oemProductData, oemProductDetailsReducer])


    const setProductMasterValue = () => {
        oemProductData.map((row, index) => {
            getProductMasterList(row.productCategoryCode, index);
        })
    }

    const validateOemProductCatalogueDetailsForm = () => {
        let isValid = true;

        if (oemProductData && oemProductData.length > 0) {
            oemProductData.forEach((row, index) => {
                if (!row.productCategoryCode || !row.productCode) {
                    isValid = false;
                    setFormError(true);
                }
            });
        }

        if (isValid) {
            setFormError(false);
        }

        return isValid;
    }

    const handleAddRow = async () => {
        if (validateOemProductCatalogueDetailsForm()) {
            oemProductData.unshift(emptyRow);
            dispatch(oemProductDetailsAction(oemProductData));
            setProductMasterList(prevProductList => [...prevProductList, []]);
        }
    }

    const oemDetailModalPreview = (index) => {
        setOemModal(true);
        setModalIndex(index)
        if (oemProductData[index].encryptedProductVarietyCode) {
            setModalData({
                seedQty: oemProductData[index].seedQty,
                seedUnitCode: oemProductData[index].seedUnitCode,
                maturityDays: oemProductData[index].maturityDays,
                maturityUnitCode: oemProductData[index].maturityUnitCode,
                yieldLand: oemProductData[index].yieldLand,
                landUnitCode: oemProductData[index].landUnitCode,
                yieldOutput: oemProductData[index].yieldOutput,
                yieldUnitCode: oemProductData[index].yieldUnitCode,
                nFrom: oemProductData[index].nFrom,
                nTo: oemProductData[index].nTo,
                pFrom: oemProductData[index].pFrom,
                pTo: oemProductData[index].pTo,
                kFrom: oemProductData[index].kFrom,
                kTo: oemProductData[index].kTo,
                phFrom: oemProductData[index].phFrom,
                phTo: oemProductData[index].phTo,
                tempFrom: oemProductData[index].tempFrom,
                tempTo: oemProductData[index].tempTo,
                ecFrom: oemProductData[index].ecFrom,
                ecTo: oemProductData[index].ecTo,
                organicCarbonFrom: oemProductData[index].organicCarbonFrom,
                organicCarbonTo: oemProductData[index].organicCarbonTo,
                sulphurFrom: oemProductData[index].sulphurFrom,
                sulphurTo: oemProductData[index].sulphurTo,
                ironFrom: oemProductData[index].ironFrom,
                ironTo: oemProductData[index].ironTo,
                zincFrom: oemProductData[index].zincFrom,
                zincTo: oemProductData[index].zincTo,
                copperFrom: oemProductData[index].copperFrom,
                copperTo: oemProductData[index].copperTo,
                boronFrom: oemProductData[index].boronFrom,
                boronTo: oemProductData[index].boronTo,
                manganeseFrom: oemProductData[index].manganeseFrom,
                manganeseTo: oemProductData[index].manganeseTo
            })
        }
    }

    const handleFieldChange = (e, index) => {
        const { name, value } = e.target;
        var oemDetails = [...rowData];
        oemDetails[index][name] = value;
        oemDetails = Object.keys(rowData).map(key => {
            return rowData[key];
        })

        if (name == 'productCategoryCode') {
            const data = productCategoryDataList.find(item => item.productCategoryCode == value);
            oemDetails[index].productLineCode = data.productLineCode;
            oemDetails[index].productCode = '';
            value && getProductMasterList(value, index);
        }

        dispatch(oemProductDetailsAction(oemDetails))

        if (oemDetails[index].encryptedProductVarietyCode) {
            dispatch(formChangedAction({
                ...formChangedData,
                oemProductDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                oemProductDetailAdd: true
            }))
        }
    }

    const getProductCategoryList = async () => {

        let productCategoryData = [];
        let productCategoryResponse = await axios.get(process.env.REACT_APP_API_URL + '/product-category-master-list', {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (productCategoryResponse.data.status == 200) {
            if (productCategoryResponse.data && productCategoryResponse.data.data.length > 0) {
                setProductCategoryDataList(productCategoryResponse.data.data);
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

    const handleItemInfoChange = (e) => {
        setModalData({
            ...modalData,
            [e.target.name]: e.target.value
        });

    }

    const getUnitList = async () => {

        let response = await axios.get(process.env.REACT_APP_API_URL + '/unit-list')
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

    const getProductSeason = async () => {
        let productSeasonData = [];
        let productSeasonResponse = await axios.get(process.env.REACT_APP_API_URL + '/get-product-season-list', {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });

        if (productSeasonResponse.data.status == 200) {
            if (productSeasonResponse.data && productSeasonResponse.data.data.length > 0) {
                productSeasonResponse.data.data.forEach(productSeason => {
                    productSeasonData.push({
                        key: productSeason.seasonName,
                        value: productSeason.productSeasonId
                    })
                })
            }
            setProductSeasonList(productSeasonData)
        } else {
            setProductSeasonList([]);
        }
    }

    const onModalSave = () => {
        let updatedData = { ...oemProductData[modalIndex] };
        Object.assign(updatedData, modalData);
        oemProductData[modalIndex] = updatedData;
        dispatch(oemProductDetailsAction(oemProductData));
        setModalData({});
        setOemModal(false);

        if (oemProductData[modalIndex].encryptedProductVarietyCode) {
            dispatch(formChangedAction({
                ...formChangedData,
                oemProductDetailUpdate: true
            }))
        }
        else {
            dispatch(formChangedAction({
                ...formChangedData,
                oemProductDetailAdd: true
            }))
        }
    }

    const handleKeyDown = (event) => {
        const keyCode = event.keyCode || event.which;
        if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) {
            event.preventDefault();
        }
    };

    const ModalPreview = (encryptedProductVarietyCode) => {
        setModalShow(true);
        setParamsData({ encryptedProductVarietyCode });
    }

    const deleteOemProductDetails = () => {
        if (!paramsData)
            return false;

        var objectIndex = oemProductDetailsReducer.oemProductDetails.findIndex(x => x.encryptedProductVarietyCode == paramsData.encryptedProductVarietyCode);
        oemProductDetailsReducer.oemProductDetails.splice(objectIndex, 1)

        var deleteOemProductCatalogueCode = localStorage.getItem("DeleteOemProductCatalogueCodes");

        if (paramsData.encryptedProductVarietyCode) {
            var deleteOemProductCatalogueDetail = deleteOemProductCatalogueCode ? deleteOemProductCatalogueCode + "," + paramsData.encryptedProductVarietyCode : paramsData.encryptedProductVarietyCode;
            localStorage.setItem("DeleteOemProductCatalogueCodes", deleteOemProductCatalogueDetail);
        }

        toast.success("Oem product details deleted successfully", {
            theme: 'colored'
        });

        dispatch(oemProductDetailsAction(oemProductData));

        dispatch(formChangedAction({
            ...formChangedData,
            oemProductDetailDelete: true
        }))

        setModalShow(false);
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
                        <h4>Are you sure, you want to delete this oem product detail?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button variant="danger" onClick={() => deleteOemProductDetails()}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            }

            {oemModal &&
                <Modal
                    show={oemModal}
                    onHide={() => setOemModal(false)}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">OEM - Amazon</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="max-five-rows">
                        <Form
                            noValidate
                            className="details-form"
                        >
                            <Row>
                                <div className="mb-2 d-flex justify-content-center align-items-center">Item - Item Name</div>
                                <hr></hr>
                                <Col className="me-3 ms-3 mb-3 mt-2" md="11">
                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Qty
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtQty" name="seedQty" placeholder="Quantity" onChange={handleItemInfoChange} value={modalData.seedQty} maxLength={10} onKeyPress={handleKeyDown} />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Select
                                                type="text"
                                                id="txtUnit"
                                                name="seedUnitCode"
                                                className="form-control"
                                                onChange={handleItemInfoChange}
                                                value={modalData.seedUnitCode}
                                            >
                                                <option value=''>Select</option>
                                                {unitList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Maturity Days
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtNoOfDays" name="maturityDays" placeholder="Maturity Days" onChange={handleItemInfoChange} value={modalData.maturityDays} maxLength={5} onKeyPress={handleKeyDown} />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Select
                                                type="text"
                                                id="txtUnitDays"
                                                name="maturityUnitCode"
                                                className="form-control"
                                                onChange={handleItemInfoChange}
                                                value={modalData.maturityUnitCode}
                                            >
                                                <option value=''>Select</option>
                                                {unitList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Yield Land
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtYieldLand" name="yieldLand" placeholder="Yield Land" onChange={handleItemInfoChange} value={modalData.yieldLand} maxLength={5} onKeyPress={handleKeyDown} />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Select
                                                type="text"
                                                id="txtLandUnit"
                                                name="landUnitCode"
                                                className="form-control"
                                                onChange={handleItemInfoChange}
                                                value={modalData.landUnitCode}
                                            >
                                                <option value=''>Select</option>
                                                {unitList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Yield Output
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtYieldOutput" name="yieldOutput" placeholder="Yield Output" onChange={handleItemInfoChange} value={modalData.yieldOutput} maxLength={10} onKeyPress={handleKeyDown} />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Select
                                                type="text"
                                                id="txtYieldOutputUnits"
                                                name="yieldUnitCode"
                                                className="form-control"
                                                onChange={handleItemInfoChange}
                                                value={modalData.yieldUnitCode}
                                            >
                                                <option value=''>Select</option>
                                                {unitList.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.key}</option>
                                                ))}
                                            </Form.Select>
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
                                                <Form.Control placeholder="N From" name="nFrom" onChange={handleItemInfoChange} value={modalData.nFrom} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="N To" name="nTo" onChange={handleItemInfoChange} value={modalData.nTo} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                P
                                            </td>
                                            <td>
                                                <Form.Control placeholder="P From" name="pFrom" onChange={handleItemInfoChange} value={modalData.pFrom} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="P To" name="pTo" onChange={handleItemInfoChange} value={modalData.pTo} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                K
                                            </td>
                                            <td>
                                                <Form.Control placeholder="K From" name="kFrom" onChange={handleItemInfoChange} value={modalData.kFrom} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="K To" name="kTo" onChange={handleItemInfoChange} value={modalData.kTo} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                PH
                                            </td>
                                            <td>
                                                <Form.Control placeholder="PH From" name="phFrom" onChange={handleItemInfoChange} value={modalData.phFrom} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="PH To" name="phTo" onChange={handleItemInfoChange} value={modalData.phTo} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Temp
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Temp From" name="tempFrom" onChange={handleItemInfoChange} value={modalData.tempFrom} maxLength={5} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Temp To" name="tempTo" onChange={handleItemInfoChange} value={modalData.tempTo} maxLength={5} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                EC
                                            </td>
                                            <td>
                                                <Form.Control placeholder="EC From" name="ecFrom" onChange={handleItemInfoChange} value={modalData.ecFrom} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="EC To" name="ecTo" onChange={handleItemInfoChange} value={modalData.ecTo} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Organic Carbon
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Organic Carbon From" name="organicCarbonFrom" onChange={handleItemInfoChange} value={modalData.organicCarbonFrom} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Organic Carbon To" name="organicCarbonTo" onChange={handleItemInfoChange} value={modalData.organicCarbonTo} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Sulphur
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Sulphur From" name="sulphurFrom" onChange={handleItemInfoChange} value={modalData.sulphurFrom} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Sulphur To" name="sulphurTo" onChange={handleItemInfoChange} value={modalData.sulphurTo} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Iron
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Iron From" name="ironFrom" onChange={handleItemInfoChange} value={modalData.ironFrom} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Iron To" name="ironTo" onChange={handleItemInfoChange} value={modalData.ironTo} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Zinc
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Zinc From" name="zincFrom" onChange={handleItemInfoChange} value={modalData.zincFrom} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Zinc To" name="zincTo" onChange={handleItemInfoChange} value={modalData.zincTo} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Copper
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Copper From" name="copperFrom" onChange={handleItemInfoChange} value={modalData.copperFrom} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Copper To" name="copperTo" onChange={handleItemInfoChange} value={modalData.copperTo} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Boron
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Boron From" name="boronFrom" onChange={handleItemInfoChange} value={modalData.boronFrom} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Boron To" name="boronTo" onChange={handleItemInfoChange} value={modalData.boronTo} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Manganese
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Manganese From" name="manganeseFrom" onChange={handleItemInfoChange} value={modalData.manganeseFrom} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Manganese To" name="manganeseTo" onChange={handleItemInfoChange} value={modalData.manganeseTo} maxLength={3} onKeyPress={handleKeyDown} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>

                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => onModalSave()}>Save</Button>
                        <Button variant="danger" onClick={() => { setOemModal(false) }} >Cancel</Button>
                    </Modal.Footer>
                </Modal >
            }

            <Card className="h-100 mb-2">
                <FalconCardHeader
                    title="OEM Product Details"
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
                                    onClick={handleAddRow}
                                >
                                    <i className="fa-solid fa-plus" />
                                </Button>
                            </div>
                        </Flex>
                    }
                />
                {
                    oemProductData && oemProductData.length > 0 &&
                    <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
                        <Form
                            noValidate
                            validated={formHasError || (oemMasterErr.oemProductDetailsErr && oemMasterErr.oemProductDetailsErr.invalidOemProductDetail)}
                            className="details-form"
                            id="AddOemProductDetailsForm"
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
                                    {rowData.map((oemProductData, index) => (
                                        <tr key={index}>
                                            <td>
                                                {index + 1}
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="productCategoryCode"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.productCategoryCode}
                                                    className="form-control"
                                                    required
                                                >
                                                    <option value=''>Select</option>
                                                    {productCategoryList.map((option, index) => (
                                                        <option key={index} value={option.value}>{option.key}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="productCode"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.productCode}
                                                    className="form-control"
                                                    required
                                                >
                                                    <option value=''>Select</option>
                                                    {productMasterList[index] && productMasterList[index].map((option, mapIndex) => (
                                                        <option key={mapIndex} value={option.value}>{option.key}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="productVarietyName"
                                                    value={oemProductData.productVarietyName}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Variety"
                                                    maxLength={20}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="brandName"
                                                    value={oemProductData.brandName}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Brand"
                                                    maxLength={20}
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="productSeasonId"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.productSeasonId}
                                                    className="form-control"
                                                >
                                                    <option value=''>Select</option>
                                                    {productSeasonList.map((option, index) => (
                                                        <option key={index} value={option.value}>{option.key}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="area"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.area}
                                                >
                                                    <option value=''>Select Area</option>
                                                    <option value='Hill'>Hill</option>
                                                    <option value='Plain'>Plain</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="sowing"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.sowing}
                                                >
                                                    <option value=''>Select Sowing</option>
                                                    <option value='Early'>Early</option>
                                                    <option value='Late'>Late</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="orgIng"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.orgIng}
                                                >
                                                    <option value=''>Select</option>
                                                    <option value='Organic'>Organic</option>
                                                    <option value='Inorganic'>Inorganic</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="desiHyb"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.desiHyb}
                                                >
                                                    <option value=''>Select</option>
                                                    <option value='Desi'>Desi</option>
                                                    <option value='Hybrid'>Hybrid</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="activeStatus"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.activeStatus}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Suspended">Suspended</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <FontAwesomeIcon icon={'plus'} className="fa-2x me-2"
                                                    onClick={() => oemDetailModalPreview(index)} />
                                                <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(oemProductData.encryptedProductVarietyCode) }} />
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

export default OemProductDetails