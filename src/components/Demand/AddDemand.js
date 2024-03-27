import React, { useState, useCallback, useMemo, useEffect  } from 'react';
import { Col, Form, Row, Card, Table   } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { demandHeaderAction, demandProductDetailsAction, demandHeaderDetailsErrAction, formChangedAction } from 'actions';
import { handleNumericInputKeyPress } from './../../helpers/utils.js';

const AddDemand = () => {
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const dispatch = useDispatch();

  const resetDemandHeaderDetails = useCallback(() => {
    dispatch(
      demandHeaderAction({
        farmerCode: '',
        encryptedFarmerCode: '',
        farmerName: '',
        fatherName: '',
        village: '',
        phoneNumber: '',
        farmerCollCenterCode: '',
        farmerCollCenterName: '',
        demandAmount: '',
        demandDate: '',
        deliveryDate: '',
        advancedAmount: '',
        distributionCentreCode: '',
        collCenterCode: '',
        demandStatus: '',
        khasraNo : null
      })
    );
  }, [dispatch]);

  const demandHeaderDetails = useSelector((state) => state.rootReducer.demandHeaderReducer.demandHeaderDetail);

  const demandProductDetails = useSelector((state) => state.rootReducer.demandProductDetailsReducer.demandProductDetails);

  const formChangedData = useSelector((state) => state.rootReducer.formChangedReducer.formChanged);

  const demandHeaderErr = useSelector((state) => state.rootReducer.demandHeaderDetailsErrorReducer.demandHeaderDetailsError);

  const distributionList = useSelector((state) => state.rootReducer.distributionCentreListReducer.distributionCentreList);

  useEffect(() => {
    if (demandHeaderDetails.encryptedDemandNo && demandHeaderDetails.demandStatus == "Approved") {
      $("#btnSave").attr('disabled', true);
    }
    if(demandHeaderDetails.distributionCentreCode){
      getCollectionCentre(demandHeaderDetails.distributionCentreCode)
    }
  }, [demandHeaderDetails])

  useEffect(() => {
    if(localStorage.getItem('CollectionCentreCode')) {
      dispatch(
        demandHeaderAction({
          ...demandHeaderDetails,
          collCenterCode: localStorage.getItem('CollectionCentreCode')
        }))
    }
  }, [])

  if (!demandHeaderDetails ||
    Object.keys(demandHeaderDetails).length <= 0) {
    resetDemandHeaderDetails();
  }

  const [isLoading, setIsLoading] = useState(false);
  const [farmerDetailsList, setFarmerDetailsList] = useState([]);
  const [showFarmerDropdown, setShowFarmerDropdown] = useState(true);
  const [showSearchFarmerValue, setShowSearchFarmerValue] = useState("");
  const [collectionCentreList, setCollectionCentreList] = useState([]);

  const resetFarmerDetail = useCallback(() => {
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
        farmerCollCenterName: '',
        khasraNo : null,
        distributionCentreCode : '',
        collCenterCode: ''
      })
    );
  }, [dispatch, demandHeaderDetails]);

  const getFarmerDetailsList = useCallback(async (searchText) => {
    const requestData = {
      pageNumber: 1,
      pageSize: 10,
      EncryptedCompanyCode: localStorage.getItem('EncryptedCompanyCode'),
      EncryptedClientCode: localStorage.getItem('EncryptedClientCode'),
      searchText: searchText
    };

    try {
      const response = await axios.post(
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

      if (response.data.status === 200 && response.data.data.length > 0) {
        resetFarmerDetail();
        setFarmerDetailsList(response.data.data);
        setShowFarmerDropdown(true);
      } else {
        setFarmerDetailsList([]);
        resetFarmerDetail();
      }
    } catch (error) {
      console.error('Error fetching farmer details:', error);
    }
  }, [resetFarmerDetail]);

  const handleFarmerOnChange = useCallback((e) => {
    const searchText = e.target.value;
    setShowSearchFarmerValue(searchText);
    if (searchText !== "") {
      getFarmerDetailsList(searchText);
    } else {
      setShowFarmerDropdown(false);
      setShowSearchFarmerValue("");
      setFarmerDetailsList([]);
    }
  }, [getFarmerDetailsList]);

  const handleFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'distributionCentreCode') {
      dispatch(
        demandHeaderAction({
          ...demandHeaderDetails,
          distributionCentreCode: value,
          collCenterCode: null
        })
      );
      setCollectionCentreList([]);
      if (value) {
        getCollectionCentre(value);
      }
    } else if (name == "demandAmount"){
      let totalCGST = 0;
      let totalSGST = 0;
      for (let i = 0; i < demandHeaderDetails.length; i++) {
        totalCGST += parseFloat(demandHeaderDetails[i].cgstAmt);
        totalSGST += parseFloat(demandHeaderDetails[i].sgstAmt);
      }

      let gstTotalAmt = (totalCGST ? totalCGST : 0) + (totalSGST ? totalSGST : 0)
      dispatch(demandHeaderAction({
        ...demandHeaderDetails,
        gstTotalAmt: gstTotalAmt,
        demandAmount: e.target.value
      }))
    } else {
      dispatch(
        demandHeaderAction({
          ...demandHeaderDetails,
          [name]: value
        })
      );
    }

    if (demandHeaderDetails.encryptedDemandNo) {
      dispatch(formChangedAction({
        ...formChangedData,
        demandHeaderDetailUpdate: true
      }))
    } else {
      dispatch(formChangedAction({
        ...formChangedData,
        demandHeaderDetailAdd: true
      }))
    }

    if (e.target.name == "demandStatus") {
      if (demandHeaderDetails.encryptedDemandNo && e.target.value == "Approved") {
        $("#btnSave").attr('disabled', false);
      }

      if (demandHeaderDetails.encryptedDemandNo && e.target.value != "Approved") {
        $("#btnSave").attr('disabled', false);
      }

      if (demandHeaderDetails.encryptedDemandNo && e.target.value === "Approved") {
        $("#btnSave").attr('disabled', true);
        dispatch(formChangedAction(undefined));
      }
    }
  }, [dispatch, demandHeaderDetails]);

  const getCollectionCentre = useCallback(async (distributionCentreCode) => {
    const requestData = {
      EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
      DistributionCode: distributionCentreCode
    };

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + '/get-collection-centre-list', requestData, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
      });

      if (response.data.status === 200 && response.data.data.length > 0) {
        const collectionCentreData = response.data.data.map(collectionCentre => ({
          key: collectionCentre.collectionCentreName,
          value: collectionCentre.collectionCentreCode
        }));
        setCollectionCentreList(collectionCentreData);
      }
    } catch (error) {
      console.error('Error fetching collection centres:', error);
    }
  }, []);

  const handleFarmerDetail = useCallback((farmerCode, farmerName) => {
    const farmerDetail = farmerDetailsList.find(farmer => farmer.farmerCode === farmerCode && farmer.farmerName === farmerName);
    dispatch(demandHeaderAction({
      ...demandHeaderDetails,
      farmerCode: farmerDetail.farmerCode,
      encryptedFarmerCode: farmerDetail.encryptedFarmerCode,
      farmerName: farmerDetail.farmerName,
      fatherName: farmerDetail.farmerFatherName,
      village: farmerDetail.village,
      phoneNumber: farmerDetail.farmerPhoneNumber,
      farmerCollCenterCode: farmerDetail.farmerCollCenterCode,
      khasraNo : farmerDetail.khasraNos,
      distributionCentreCode : farmerDetail.distributionCentreCode,
      collCenterCode: localStorage.getItem('CollectionCentreCode'),
      farmerCollCenterName : farmerDetail.farmerCollCenterName
    }));

    // Hide the farmer dropdown after selection
    setShowFarmerDropdown(false);

    const updatedDemandProducts = demandProductDetails.map(product => ({
      ...product,
      khasra: "" 
    }));

    dispatch(demandProductDetailsAction(updatedDemandProducts));

    if (demandHeaderDetails.encryptedDemandNo) {
      dispatch(formChangedAction({
        ...formChangedData,
        demandHeaderDetailUpdate: true,
        demandProductDetailsUpdate: true,
      }))
    } else {
      dispatch(formChangedAction({
        ...formChangedData,
        demandHeaderDetailAdd: true
      }))
    }

  }, [dispatch, demandHeaderDetails, farmerDetailsList]);

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
              <Form.Label column sm="3">
                Farmer Name <span className="text-danger">*</span>
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  id="txtSearchFarmer"
                  name="searchFarmer"
                  placeholder="Search Farmer"
                  maxLength={45}
                  value={
                    demandHeaderDetails.farmerName || showSearchFarmerValue
                  }
                  onChange={handleFarmerOnChange}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  autoComplete='off'
                />
                {demandHeaderErr.farmerErr &&
                  Object.keys(demandHeaderErr.farmerErr).map(key => (
                    <span key={key} className="error-message">
                      {demandHeaderErr.farmerErr[key]}
                    </span>
                  ))}
                {showFarmerDropdown && farmerDetailsList.length > 0 && (
                  // <Card className="mb-1 ">
                  //     <Card.Body className="vebdor-card-item custom-card-scroll">
                  //       {farmerDetailsList.map((farmer, index) => (
                  //         <div className="flex-1" key={index}>
                  //           <h6 className="mb-0">
                  //             <Link to="" style={{ color: 'black' }}
                  //               onClick={(e) => { e.preventDefault(); handleFarmerDetail(farmer.farmerCode, farmer.farmerName); }}
                  //               >
                  //               {farmer.farmerName}
                  //             </Link>
                  //           </h6>
                  //           <div className="border-dashed border-bottom my-1" />
                  //         </div>
                  //       ))}
                  //     </Card.Body>
                  // </Card>

                  <Card className="mb-1">
                    <Card.Body className="farmer-card-item">
                      <div className="table-responsive">
                      <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                            <thead className='custom-bg-200'>
                          {/* <thead> */}
                            <tr>
                              <th>Farmer Name</th>
                              <th>Father's Name</th>
                              <th>District</th>
                              <th>State</th>
                              <th>Village</th>
                              <th>Phone Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            {farmerDetailsList.map((farmer, index) => (
                              <tr key={index}>
                                <td>
                                  <Link
                                    to=""
                                    style={{ color: 'black' }}
                                    onClick={e => {
                                      e.preventDefault();
                                      handleFarmerDetail(
                                        farmer.farmerCode,
                                        farmer.farmerName
                                      );
                                    }}
                                  >
                                    {farmer.farmerName}
                                  </Link>
                                </td>
                                <td>{farmer.farmerFatherName}</td>
                                <td>{farmer.districtName}</td>
                                <td>{farmer.stateName}</td>
                                <td>{farmer.village}</td>
                                <td>{farmer.farmerPhoneNumber}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
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
              <Form.Label column sm="3">
                Father Name
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  id="txtFatherName"
                  name="fatherName"
                  placeholder="FatherName"
                  value={demandHeaderDetails.fatherName}
                  disabled
                  autoComplete="off"
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-1"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="3">
                Village
              </Form.Label>
              <Col sm="9">
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
              <Form.Label column sm="3">
                Phone Number
              </Form.Label>
              <Col sm="9">
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
                  onChange={e => handleFieldChange(e)}
                  value={
                    demandHeaderDetails.demandAmount
                      ? demandHeaderDetails.demandAmount
                      : ''
                  }
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
                <Form.Control
                  type="date"
                  id="txtDemandDate"
                  name="demandDate"
                  max={today}
                  value={demandHeaderDetails.demandDate}
                  onChange={handleFieldChange}
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
                  min={today}
                  value={demandHeaderDetails.deliveryDate}
                  onChange={handleFieldChange}
                />
                {/* {demandHeaderErr.deliveryDateErr && Object.keys(demandHeaderErr.deliveryDateErr).map((key) => (
                  <span key={key} className="error-message">{demandHeaderErr.deliveryDateErr[key]}</span>
                ))} */}
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
                  value={demandHeaderDetails.advancedAmount}
                  onChange={handleFieldChange}
                />
                {demandHeaderErr.advancedAmountErr &&
                  Object.keys(demandHeaderErr.advancedAmountErr).map(key => (
                    <span key={key} className="error-message">
                      {demandHeaderErr.advancedAmountErr[key]}
                    </span>
                  ))}
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
                DC Name <span className="text-danger">*</span>
              </Form.Label>
              <Col sm="8">
                <Form.Select
                  id="txtDistributionCentre"
                  name="distributionCentreCode"
                  onChange={handleFieldChange}
                  value={demandHeaderDetails.distributionCentreCode}
                  disabled
                >
                  <option value="">Select Distribution</option>
                  {distributionList &&
                    distributionList.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.key}
                      </option>
                    ))}
                </Form.Select>
                {demandHeaderErr.distributionCentreCodeErr &&
                  Object.keys(demandHeaderErr.distributionCentreCodeErr).map(
                    key => (
                      <span key={key} className="error-message">
                        {demandHeaderErr.distributionCentreCodeErr[key]}
                      </span>
                    )
                  )}
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-1">
              <Form.Label column sm={4}>
                Collection Centre <span className="text-danger">*</span>
              </Form.Label>
              <Col sm={8}>
                <Form.Select
                  id="txtCollectionCentre"
                  name="collCenterCode"
                  onChange={handleFieldChange}
                  value={demandHeaderDetails.collCenterCode}
                  disabled
                >
                  <option value="">Select Collection Centre</option>
                  {collectionCentreList &&
                    collectionCentreList.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.key}
                      </option>
                    ))}
                </Form.Select>
                {demandHeaderErr.collCenterCodeErr &&
                  Object.keys(demandHeaderErr.collCenterCodeErr).map(key => (
                    <span key={key} className="error-message">
                      {demandHeaderErr.collCenterCodeErr[key]}
                    </span>
                  ))}
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-1">
              <Form.Label column sm={4}>
                Farmer Collection Centre <span className="text-danger">*</span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  id="txtCollectionCentre"
                  name="farmerCollCenterName"
                  onChange={handleFieldChange}
                  placeholder='Farmer Collection Centre'
                  value={demandHeaderDetails.farmerCollCenterName}
                  disabled
                >                  
                </Form.Control>
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
                <Form.Select
                  id="txtStatus"
                  name="demandStatus"
                  value={demandHeaderDetails.demandStatus}
                  onChange={handleFieldChange}
                >
                  <option value="Draft">Draft</option>
                  <option value="Approved">Approved</option>
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