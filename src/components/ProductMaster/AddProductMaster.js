import { formChangedAction, productMasterDetailsAction } from 'actions';
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';

const AddProductMaster = () => {

  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [productSeasonList, setProductSeasonList] = useState([]);

  const resetProductMasterDetailsData = () => {
    dispatch(productMasterDetailsAction({
      "encryptedProductMasterCode": '',
      "code": "",
      "productLineCode": "",
      "productCategoryCode": "",
      "productSeasonId": "",
      "productName": "",
      "productShortName": "",
      "productType": "",
      "perishableDays": "",
      "texanomy": "",
      "botany": "",
      "status": 'Active'
    }))
  }

  const productMasterDetailsReducer = useSelector((state) => state.rootReducer.productMasterDetailsReducer)
  var productMasterData = productMasterDetailsReducer.productMasterDetails;

  const productMasterDetailsErrorReducer = useSelector((state) => state.rootReducer.productMasterDetailsErrorReducer)
  var productMasterError = productMasterDetailsErrorReducer.productMasterDetailsError;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  if (!productMasterDetailsReducer.productMasterDetails ||
    Object.keys(productMasterDetailsReducer.productMasterDetails).length <= 0) {
    resetProductMasterDetailsData();
  }

  useEffect(() => {
    getProductSeason();
  }, []);

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

  const handleFieldChange = e => {

    dispatch(productMasterDetailsAction({
      ...productMasterData,
      [e.target.name]: e.target.value
    }))

    if (productMasterData.encryptedProductMasterCode) {
      dispatch(formChangedAction({
        ...formChangedData,
        productMasterUpdate: true
      }))
    } else {
      dispatch(formChangedAction({
        ...formChangedData,
        productMasterAdd: true
      }))
    }
  }

  return (
    <>
      {
        productMasterData &&
        <Form noValidate validated={formHasError} className="details-form" id='AddProductMasterDetailForm'>
          <Row className="mb-3">
            <Col className="me-3 ms-3" md="6">

              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="3">
                  Product Name<span className="text-danger">*</span>
                </Form.Label>
                <Col sm="2">
                  <Form.Control id="txtProductMasterCode" name="code" placeholder="Code" value={productMasterData.code} disabled />
                </Col>
                <Col sm="6">
                  <Form.Control id="txtProductMasterName" name="productName" maxLength={40} value={productMasterData.productName} onChange={handleFieldChange} placeholder="Product Name" />
                  {Object.keys(productMasterError.productMasterNameErr).map((key) => {
                    return <span className="error-message">{productMasterError.productMasterNameErr[key]}</span>
                  })}
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="3">
                  Short Name
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtProductShortName" name="productShortName" maxLength={20} value={productMasterData.productShortName} onChange={handleFieldChange} placeholder="Short Name" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="3">
                  Product Type
                </Form.Label>
                <Col sm="8">
                  <Form.Select id="txtProductType" name="productType" value={productMasterData.productType} onChange={handleFieldChange}>
                    <option value=''>Product Type</option>
                    <option value='Horticulture Crops'>Horticulture Crops</option>
                    <option value='Plantation Crops'>Plantation Crops</option>
                    <option value='Cash Crop'>Cash Crop</option>
                    <option value='Food Crops'>Food Crops</option>
                  </Form.Select>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlaintextPassword">
                <Form.Label column sm="3">
                  Product Season
                </Form.Label>
                <Col sm="8">
                  <Form.Select id="txtProductSeason" name="productSeasonId" value={productMasterData.productSeasonId} onChange={handleFieldChange}>
                    <option value=''>Product Season</option>
                    {productSeasonList.map((option, index) => (
                      <option key={index} value={option.value}>{option.key}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>

            </Col>

            <Col className="me-3 ms-3" md="5">

              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="3">
                  Perishable Days
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtPerishableDays" name="perishableDays"
                    maxLength={3}
                    value={productMasterData.perishableDays}
                    onChange={handleFieldChange}
                    placeholder="Perishable Days"
                    onKeyPress={(e) => {
                      const regex = /[0-9]|\./;
                      const key = String.fromCharCode(e.charCode);
                      if (!regex.test(key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="3">
                  Texanomy
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtTexanomy" name="texanomy" maxLength={25} value={productMasterData.texanomy} onChange={handleFieldChange} placeholder="Texanomy" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                <Form.Label column sm="3">
                  Botany
                </Form.Label>
                <Col sm="8">
                  <Form.Control id="txtBotany" name="botany" maxLength={25} value={productMasterData.botany} onChange={handleFieldChange} placeholder="Botany" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlaintextPassword">
                <Form.Label column sm="3">
                  Status
                </Form.Label>
                <Col sm="8">
                  <Form.Select id="txtStatus" name="status" value={productMasterData.status} onChange={handleFieldChange}>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </Form.Select>
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      }
    </>
  )
}

export default AddProductMaster;