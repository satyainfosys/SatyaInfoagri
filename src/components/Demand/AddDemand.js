import React, { useState } from 'react';
import { Col, Form, Row, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { demandHeaderAction } from 'actions';
import { handleNumericInputKeyPress } from "./../../helpers/utils.js";
import Flex from 'components/common/Flex';

const AddDemand = () => {

  const today = new Date().toISOString().split('T')[0];
  const [farmerDetailsList, setFarmerDetailsList] = useState([]);
  const [showFarmerDropdown, setShowFarmerDropdown] = useState(true); // State variable to toggle visibility
  const [showSearchFarmerValue, setShowSearchFarmerValue] = useState("");
  const [collectionCentreList, setCollectionCentreList] = useState([]);

  const dispatch = useDispatch();

  const demandHeaderDetailsReducer = useSelector((state) => state.rootReducer.demandHeaderReducer)
  var demandHeaderDetails = demandHeaderDetailsReducer.demandHeaderDetail;

  const distributionCentreListReducer = useSelector((state) => state.rootReducer.distributionCentreListReducer)
  const distributionList = distributionCentreListReducer.distributionCentreList

  const getFarmerDetailsList = async searchText => {
    const requestData = {
      pageNumber: 1,
      pageSize: 10,
      EncryptedCompanyCode: localStorage.getItem('EncryptedCompanyCode'),
      EncryptedClientCode: localStorage.getItem('EncryptedClientCode'),
      searchText: searchText
    };

    let response = await axios.post(
      process.env.REACT_APP_API_URL + '/farmer-list',
      requestData,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('Token')).value
          }`
        }
      }
    );

    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        resetFarmerDetail();
        setFarmerDetailsList(response.data.data);
        setShowFarmerDropdown(true);
      }
    } else {
      setFarmerDetailsList([]);
      resetFarmerDetail();
    }
  };

  const resetFarmerDetail = () => {
    dispatch(
      demandHeaderAction({
        ...demandHeaderDetails,
        farmerCode: '',
        encryptedFarmerCode: '',
        farmerName: '',
        fatherName: '',
        village: '',
        phoneNumber: '',
        farmerCollCenterCode: '',
      })
    );
  };

  const handleFarmerOnChange = (e) => {
    if (e.target.value !== "") {
      const searchText = e.target.value;
      setShowSearchFarmerValue(searchText);
      getFarmerDetailsList(searchText);
    } else {
      setShowFarmerDropdown(false);
      setShowSearchFarmerValue("");
      setFarmerDetailsList([]);
    }
  }

  const handleFieldChange = e => {
    if (e.target.name == 'distributionCentreCode') {
      dispatch(
        demandHeaderAction({
          ...demandHeaderDetails,
          distributionCentreCode: e.target.value,
          collCenterCode: null
        })
      );
      setCollectionCentreList([]);
      e.target.value && getCollectionCentre(e.target.value);
    } else {
      dispatch(
        demandHeaderAction({
          ...demandHeaderDetails,
          [e.target.name]: e.target.value
        })
      );
    }
  };

  const getCollectionCentre = async (distributionCentreCode) => {
    const requestData = {
      EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
      DistributionCode: distributionCentreCode
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-collection-centre-list', requestData, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })
    let collectionCentreData = [];
    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        response.data.data.forEach(collectionCentre => {
          collectionCentreData.push({
            key: collectionCentre.collectionCentreName,
            value: collectionCentre.collectionCentreCode
          })
        })
      }
      setCollectionCentreList(collectionCentreData);
    }
  }

  const handleFarmerDetail = async (farmerCode, farmerName) => {
    var farmerDetail = farmerDetailsList.find(farmer => farmer.farmerCode == farmerCode && farmer.farmerName == farmerName);
    dispatch(demandHeaderAction({
      ...demandHeaderDetails,
      farmerCode: farmerDetail.farmerCode,
      encryptedFarmerCode : farmerDetail.encryptedFarmerCode,
      farmerName: farmerDetail.farmerName,
      fatherName: farmerDetail.farmerFatherName,
      village: farmerDetail.village,
      phoneNumber: farmerDetail.farmerPhoneNumber,
      farmerCollCenterCode: farmerDetail.farmerCollCenterCode,
    }))

    // Hide the farmer dropdown after selection
      setShowFarmerDropdown(false);
  }

  return (
    <>
      <Form>
        <Row>
          <Col md="4">
            <Form.Group
              as={Row}
              className="mb-1"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="4">
                Farmer Name
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  id="txtSearchFarmer"
                  name="searchFarmer"
                  placeholder="Search Farmer"
                  maxLength={45}
                  value={demandHeaderDetails.farmerName || showSearchFarmerValue}
                  onChange={handleFarmerOnChange}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                />

                  {(showFarmerDropdown && farmerDetailsList.length > 0) && (
                <Card className="mb-1 ">
                    <Card.Body className="vebdor-card-item custom-card-scroll">
                      {farmerDetailsList.map((farmer, index) => (
                        <div className="flex-1" key={index}>
                          <h6 className="mb-0">
                            <Link to="" style={{ color: 'black' }}
                              onClick={(e) => { e.preventDefault(); handleFarmerDetail(farmer.farmerCode, farmer.farmerName); }} 
                              >
                              {farmer.farmerName}
                            </Link>
                          </h6>
                          <div className="border-dashed border-bottom my-1" />
                        </div>
                      ))}
                    </Card.Body>
                </Card>
                  )}
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-1"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="4">
                Father Name
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  id="txtFatherName"
                  name="fatherName"
                  placeholder="FatherName"
                  value={demandHeaderDetails.fatherName}
                  disabled
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-1"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="4">
                Village
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  id="txtVillage"
                  name="poVillage"
                  placeholder="Village"
                  value={demandHeaderDetails.village}
                  disabled
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-1"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="4">
                Phone Number
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  id="txtPhoneNumber"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={demandHeaderDetails.phoneNumber}
                  disabled
                />
              </Col>
            </Form.Group>
          </Col>

          <Col md="4">
            <Form.Group
              as={Row}
              className="mb-1"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="4">
                Amount
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  id="txtDemandAmount"
                  name="demandAmount"
                  placeholder="Demand Amount"
                  onChange={(e) => handleFieldChange(e)}
                  value={demandHeaderDetails.demandAmount ? demandHeaderDetails.demandAmount : ""}
                  onKeyPress={handleNumericInputKeyPress}
                  maxLength={15}
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-1"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="4">
                Date
              </Form.Label>
              <Col sm="8">
              <Form.Control type='date' id="txtDemandDate" name="demandDate" max={today}
                      value={demandHeaderDetails.demandDate} onChange={handleFieldChange} />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-1"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="4">
                Delivery Date
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="date"
                  id="txtDeliveryDate"
                  name="deliveryDate"
                  min={today}
                  value={demandHeaderDetails.deliveryDate} onChange={handleFieldChange}
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-1"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="4">
                Advanced Amount
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  id="txtAdvancedAmount"
                  name="advancedAmount"
                  placeholder="Advanced Amount"
                  value={demandHeaderDetails.advancedAmount} onChange={handleFieldChange}
                />
              </Col>
            </Form.Group>
          </Col>

          <Col md="4">
            <Form.Group
              as={Row}
              className="mb-1"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="4">
                DC Name
              </Form.Label>
              <Col sm="8">
                  <Form.Select id="txtDistributionCentre" name="distributionCentreCode" onChange={handleFieldChange} value={demandHeaderDetails.distributionCentreCode} >
                    <option value=''>Select Distribution</option>
                    {distributionList &&
                      distributionList.map((option, index) => (
                        <option key={index} value={option.value}>{option.key}</option>
                      ))
                    }
                  </Form.Select>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-1">
              <Form.Label column sm={4}>
                Collection Centre
              </Form.Label>
              <Col sm={8}>
                  <Form.Select id="txtCollectionCentre" name="collCenterCode" onChange={handleFieldChange} value={demandHeaderDetails.collCenterCode}>
                    <option value=''>Select Collection Centre</option>
                    {collectionCentreList &&
                      collectionCentreList.map((option, index) => (
                        <option key={index} value={option.value}>{option.key}</option>
                      ))
                    }
                  </Form.Select>
                </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-1"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="4">
                Status
              </Form.Label>
              <Col sm="8">
                <Form.Select id="txtStatus" name="demandStatus" value={demandHeaderDetails.demandStatus} onChange={handleFieldChange}>
                  <option value="Draft">Draft</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Col>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default AddDemand