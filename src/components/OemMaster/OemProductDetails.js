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
    const [rowData, setRowData] = useState([]);
    const [oemModal, setOemModal] = useState(false);
    const [productLineList, setProductLineList] = useState([]);
    const [productCategoryList, setProductCategoryList] = useState([]);
    const [productMasterList, setProductMasterList] = useState([]);
    const [modalIndex, setModalIndex] = useState();
    let [modalData, setModalData] = useState({});

    const emptyRow = {
        id: rowData.length + 1,
        encryptedOemMasterCode: localStorage.getItem("EncryptedOemMasterCode"),
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        productLineCode: '',
        productCategoryCode: '',
        productCode: '',
        item: '',
        productVarietyName: '',
        brandName: '',
        season: '',
        area: '',
        sowing: '',
        fertilizer: '',
        type: '',
        activeStatus: '',
        addUser: localStorage.getItem("LoginUserName"),
        modifyUser: localStorage.getItem("LoginUserName"),
    }

    let oemProductDetailsReducer = useSelector((state) => state.rootReducer.oemProductDetailsReducer)
    let oemProductData = oemProductDetailsReducer.oemProductDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const columnsArray = [
        'S.No',
        'Product Line',
        'Product Category',
        'Product',
        'Item',
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
        if (oemProductDetailsReducer.oemProductDetails.length > 0) {
            setRowData(oemProductData);
        }

        if (productLineList.length <= 0) {
            getProductLine();
        }
    }, [oemProductData, oemProductDetailsReducer])

    const getProductLine = async () => {
        let productLineData = [];

        let productLineResponse = await axios.get(process.env.REACT_APP_API_URL + '/product-line-list', {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });

        if (productLineResponse.data.status == 200) {
            if (productLineResponse.data && productLineResponse.data.data.length > 0) {
                productLineResponse.data.data.forEach(productLine => {
                    productLineData.push({
                        key: productLine.productLineName,
                        value: productLine.productLineCode,
                        label: productLine.productLineName,
                    })
                })
            }
            setProductLineList(productLineData)
        } else {
            setProductLineList([])
        }
    }

    const handleAddRow = async () => {
        oemProductData.unshift(emptyRow);
        dispatch(oemProductDetailsAction(oemProductData));
        setProductCategoryList(prevCategoryList => [...prevCategoryList, []]);
        setProductMasterList(prevProductList => [...prevProductList, []]);
    }

    const oemDetailModalPreview = (index) => {
        setOemModal(true);
        setModalIndex(index)
    }

    const handleFieldChange = (e, index) => {
        const { name, value } = e.target;
        var oemDetails = [...rowData];
        oemDetails[index][name] = value;
        oemDetails = Object.keys(rowData).map(key => {
            return rowData[key];
        })

        if (name == 'productLineCode') {
            oemDetails[index].productCategoryCode = '';
            value && getProductCategoryList(value, index);
        }

        if (name == 'productCategoryCode') {
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

    const getProductCategoryList = async (productLineCode, index) => {
        const request = {
            ProductLineCode: productLineCode
        }

        let productCategoryData = [];
        let productCategoryResponse = await axios.post(process.env.REACT_APP_API_URL + '/product-category-master-list', request, {
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
            setProductCategoryList(prevCategoryList => {
                const newCategoryList = [...prevCategoryList];
                newCategoryList[index] = productCategoryData;
                return newCategoryList;
            });
        }
        else {
            setProductCategoryList(prevCategoryList => {
                const newCategoryList = [...prevCategoryList];
                newCategoryList[index] = productCategoryData;
                return newCategoryList;
            })
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

    const onModalSave = () => {
        let updatedData = { ...oemProductData[modalIndex] };
        Object.assign(updatedData, modalData);
        oemProductData[modalIndex] = updatedData;
        dispatch(oemProductDetailsAction(oemProductData));
        setModalData({});
        setOemModal(false);
    }

    return (
        <>
            {
                oemModal &&
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
                            // validated={modalError}
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
                                            <Form.Control id="txtQty" name="quantity" placeholder="Quantity" onChange={handleItemInfoChange} value={modalData.quantity} />
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
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Maturity Days
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtNoOfDays" name="maturityDays" placeholder="Maturity Days" onChange={handleItemInfoChange} value={modalData.maturityDays} />
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
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Yield Land
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtYieldLand" name="yieldLand" placeholder="Yield Land" onChange={handleItemInfoChange} value={modalData.yieldLand} />
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
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                                        <Form.Label column sm="3">
                                            Yield Output
                                        </Form.Label>
                                        <Col sm="4">
                                            <Form.Control id="txtYieldOutput" name="yieldOutput" placeholder="Yield Output" onChange={handleItemInfoChange} value={modalData.yieldOutput} />
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
                                                <Form.Control placeholder="N From" name />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="N To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                P
                                            </td>
                                            <td>
                                                <Form.Control placeholder="P From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="P To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                K
                                            </td>
                                            <td>
                                                <Form.Control placeholder="K From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="K To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                PH
                                            </td>
                                            <td>
                                                <Form.Control placeholder="PH From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="PH To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Temp
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Temp From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Temp To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                EC
                                            </td>
                                            <td>
                                                <Form.Control placeholder="EC From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="EC To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Organic Carbon
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Organic Carbon From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Organic Carbon To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Sulphur
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Sulphur From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Sulphur To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Iron
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Iron From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Iron To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Zinc
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Zinc From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Zinc To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Copper
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Copper From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Copper To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Boron
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Boron From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Boron To" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Manganese
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Manganese From" />
                                            </td>
                                            <td>
                                                <Form.Control placeholder="Manganese To" />
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
                            // validated={formHasError || (farmerError.familyErr && farmerError.familyErr.invalidFamilyDetail)}
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
                                                    name="productLineCode"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.productLineCode}
                                                    className="form-control"
                                                    required
                                                >
                                                    <option value=''>Select</option>
                                                    {productLineList.map((option, index) => (
                                                        <option key={index} value={option.value}>{option.key}</option>
                                                    ))}
                                                </Form.Select>
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
                                                    {productCategoryList[index] && productCategoryList[index].map((option, mapIndex) => (
                                                        <option key={mapIndex} value={option.value}>{option.key}</option>
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
                                                    id="txtItem"
                                                    name="item"
                                                    value={oemProductData.item}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Item"
                                                    maxLength={20}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    id="txtVariety"
                                                    name="productVarietyName"
                                                    value={oemProductData.productVarietyName}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Variety"
                                                    maxLength={20}
                                                />
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    id="txtBrand"
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
                                                    id="txtSeason"
                                                    name="season"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.season}
                                                    className="form-control"
                                                >
                                                    <option value=''>Select</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtArea"
                                                    name="area"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.area}
                                                >
                                                    <option value=''>Select Area</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtSowing"
                                                    name="sowing"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.sowing}
                                                >
                                                    <option value=''>Select Sowing</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtFertilizer"
                                                    name="fertilizer"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.fertilizer}
                                                >
                                                    <option value=''>Select Fertilier</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtType"
                                                    name="type"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={oemProductData.type}
                                                >
                                                    <option value=''>Select Type</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtType"
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
                                                <FontAwesomeIcon icon={'plus'} className="fa-2x"
                                                    onClick={() => oemDetailModalPreview(index)} />
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