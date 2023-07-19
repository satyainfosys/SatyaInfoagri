import { productMasterDetailsAction } from 'actions';
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Col, Form, Row } from 'react-bootstrap';

const AddProductMaster = () => {

  const [formHasError, setFormError] = useState(false);
  const dispatch = useDispatch();

  const resetProductMasterDetailsData = () => {
    dispatch(productMasterDetailsAction({
      "encryptedProductMasterCode": '',
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

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  if (!productMasterDetailsReducer.productMasterDetails ||
    Object.keys(productMasterDetailsReducer.productMasterDetails).length <= 0) {
    resetProductMasterDetailsData();
  }

  return (
    <>
      {/* {
        productMasterData &&
      } */}
      <Form noValidate validated={formHasError} className="details-form" id='AddProductMasterDetailForm'>
        <Row>
          <Col className="me-3 ms-3" md="6">
            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
              <Form.Label column sm="3">
                Product Line
              </Form.Label>
              <Col sm="8">
                <Form.Select id="txtProductLine" name="productLineCode" value={productMasterData.productLineCode} required>
                  <option value=''>Product Line</option>
                  {/* {countryList.map((option, index) => (
                    <option key={index} value={option.value}>{option.key}</option>
                  ))} */}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
              <Form.Label column sm="3">
                Product Category
              </Form.Label>
              <Col sm="8">
                <Form.Select id="txtProductCategory" name="productCategoryCode" value={productMasterData.productCategoryCode} required>
                  <option value=''>Product Category</option>
                  {/* {countryList.map((option, index) => (
                    <option key={index} value={option.value}>{option.key}</option>
                  ))} */}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
              <Form.Label column sm="3">
                Product Name
              </Form.Label>
              <Col sm="8">
                <Form.Control id="txtProductMasterName" name="productName" maxLength={40} value={productMasterData.productName} placeholder="Product Name" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
              <Form.Label column sm="3">
                Short Name
              </Form.Label>
              <Col sm="8">
                <Form.Control id="txtProductShortName" name="productShortName" maxLength={20} value={productMasterData.productShortName} placeholder="Short Name" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
              <Form.Label column sm="3">
                Product Type
              </Form.Label>
              <Col sm="8">
                <Form.Select id="txtProductType" name="productType" value={productMasterData.productType} >
                  <option value=''>Product Type</option>
                  <option value='Horticulture Crops'>Horticulture Crops</option>
                  <option value='Plantation Crops'>Plantation Crops</option>
                  <option value='Cash Crop'>Cash Crop</option>
                  <option value='Food Crops'>Food Crops</option>
                </Form.Select>
              </Col>
            </Form.Group>

          </Col>

          <Col className="me-3 ms-3" md="5">
            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
              <Form.Label column sm="3">
                Product Season
              </Form.Label>
              <Col sm="8">
                <Form.Select id="txtProductSeason" name="productSeasonId" value={productMasterData.productSeasonId} required>
                  <option value=''>Product Season</option>
                  {/* {countryList.map((option, index) => (
                    <option key={index} value={option.value}>{option.key}</option>
                  ))} */}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
              <Form.Label column sm="3">
                Perishable Days
              </Form.Label>
              <Col sm="8">
                <Form.Control id="txtPerishableDays" name="perishableDays"
                  maxLength={3} value={productMasterData.perishableDays}
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
                <Form.Control id="txtTexanomy" name="texanomy" maxLength={25} value={productMasterData.texanomy} placeholder="Texanomy" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
              <Form.Label column sm="3">
                Botany
              </Form.Label>
              <Col sm="8">
                <Form.Control id="txtBotany" name="botany" maxLength={25} value={productMasterData.botany} placeholder="Botany" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
              <Form.Label column sm="3">
                Status
              </Form.Label>
              <Col sm="8">
                <Form.Select id="txtStatus" name="status" value={productMasterData.status} >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </Form.Select>
              </Col>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default AddProductMaster;