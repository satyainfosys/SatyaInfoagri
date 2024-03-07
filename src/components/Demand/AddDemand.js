import React, { useState } from 'react';
import { Col, Form, Row, Card } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { demandHeaderAction } from 'actions';
const AddDemand = () => {

  const [farmerDetailsList, setFarmerDetailsList] = useState([]);

  const dispatch = useDispatch();

  const demandHeaderDetailsReducer = useSelector((state) => state.rootReducer.demandHeaderReducer)
  var demandHeaderDetails = demandHeaderDetailsReducer.demandHeaderDetail;

  const getFarmerDetailsList = async (searchText) => {
    const requestData = {
      pageNumber: 1,
      pageSize: 10,
      EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
      EncryptedClientCode:localStorage.getItem("EncryptedClientCode"),
      searchText: searchText
  }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/farmer-list', requestData, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    });

    if (response.data.status == 200) {
        if (response.data && response.data.data.length > 0) {
            setFarmerDetailsList(response.data.data)
        }
    }
    else {
        setFarmerDetailsList([]);
    }
}

const handleFarmerOnChange = (e) => {
  if (e.target.value !== "") {
    const searchText = e.target.value;
    getFarmerDetailsList(searchText);
    // const regex = new RegExp(searchText, 'i');
    // const filteredList = vendorAndFarmerList && vendorAndFarmerList.filter(data => regex.test(data.name));
    // setFarmerDetails(filteredList);
  }
  else {
    setFarmerDetailsList([]);
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
    farmerCollCenterCode: farmerDetail.state,
    amount: "",
    demandDate: "",
    deliveryDate: "",
    advancedAmt: "",
    distributionCenterCode: "",
    distributionCenterName: "",
    collCenterCode: "",
    collCenterName:"",
    demandStatus: "",
  }))
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
                  onChange={handleFarmerOnChange}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                />

                  {farmerDetailsList.length > 0 && (
                <Card className="mb-1 ">
                  <Card.Header
                    as={Flex}
                    alignItems="center"
                    justifyContent="between"
                    className="bg-light"
                  >
                    <h5 className="mb-0">Farmers</h5>
                  </Card.Header>
                    <Card.Body className="vebdor-card-item custom-card-scroll">
                      {farmerDetailsList.map((farmer, index) => (
                        <div className="flex-1" key={index}>
                          <h6 className="mb-0">
                            <Link to="" style={{ color: 'black' }}
                              onClick={(e) => { e.preventDefault(); handleFarmerDetail(farmer.farmerCode, farmer.farmerName); }} >
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
                <Form.Control
                  type="date"
                  id="txtDemandDate"
                  name="demandDate"
                />
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
                <Form.Select
                  id="txtDistributionCentre"
                  name="distributionCentreCode"
                >
                  <option value="">Select Distribution</option>
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-1">
              <Form.Label column sm={4}>
                Collection Centre
              </Form.Label>
              <Col sm={8}>
                <Form.Select
                  id="txtCollectionCentre"
                  name="collectionCentreCode"
                >
                  <option value="">Select Collection Centre</option>
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
                <Form.Select id="txtStatus" name="demandStatus">
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