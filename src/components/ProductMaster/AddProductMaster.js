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

        </Row>
      </Form>
    </>
  )
}

export default AddProductMaster