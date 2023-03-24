import { farmerDetailsAction } from 'actions';
import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

export const FarmersDocumentDetails = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const resetFarmerData = () => {
    dispatch(farmerDetailsAction({
      "farmerIDType": "",
      "farmerIdNo": ""
    }))
  }

  const farmerDetailsReducer = useSelector((state) => state.rootReducer.farmerDetailsReducer)
  var farmerData = farmerDetailsReducer.farmerDetails;

  if (!farmerDetailsReducer.farmerDetails ||
    farmerDetailsReducer.farmerDetails.length <= 0) {
    resetFarmerData();
  }

  const handleFieldChange = (e) => {
    dispatch(farmerDetailsAction({
      ...farmerData,
      [e.target.name]: e.target.value
    }));

    if (e.target.name == "farmerForm") {
      dispatch(farmerDetailsAction({
        ...farmerData,
        farmerForm: e.target.files[0],
        farmerFormURL: URL.createObjectURL(e.target.files[0])
      }))
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner
          className="position-absolute start-50 loader-color"
          animation="border"
        />
      ) : null}
      {farmerData &&
        <Form className="details-form" id='AddDocumentDetailsForm'>
          <Row>
            <Col className="me-3 ms-3">
              <Row className="mb-3">
                <Form.Label>Original Farmer From</Form.Label>
                {
                  farmerData && farmerData.farmerFormURL ? (
                    <img src={farmerData.farmerFormURL} className="w-25" alt='Farmer'></img>
                  ) : null
                }
                <Form.Control
                  type="File"
                  id="fileOriginalFarmerFrom"
                  name="farmerForm"
                  placeholder="Choose File"
                  onChange={handleFieldChange}
                />
              </Row>
              <Row className="mb-3">
                <Form.Label>Id Proof Type</Form.Label>
                <Form.Select id="txtIdProofType" name="farmerIDType" onChange={handleFieldChange} value={farmerData.farmerIDType}>
                  <option value=''>Select</option>
                  <option value='Voter ID'>Voter ID</option>
                  <option value='Driving License'>Driving License</option>
                  <option value='PAN Card'>PAN Card</option>
                  <option value='Ration Card'>Ration Card</option>
                  <option value='Other'>Other</option>
                </Form.Select>
              </Row>
              <Row className="mb-3">
                <Form.Control
                  type="text"
                  id="txtIdProofNo"
                  name="farmerIdNo"
                  placeholder="ID Proof No"
                  onChange={handleFieldChange}
                  value={farmerData.farmerIdNo}
                />
              </Row>
            </Col>
            <Col className="me-3 ms-3"></Col>
          </Row>
        </Form>}

    </>
  );
};

export default FarmersDocumentDetails;
