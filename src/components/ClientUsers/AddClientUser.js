import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { selectedProductsAction, userDetailsAction, formChangedAction } from 'actions/index';
import Treeview from 'components/common/Treeview';
import FalconComponentCard from 'components/common/FalconComponentCard';
import FalconCardBody from 'components/common/FalconCardBody';

export const AddClientUser = () => {
  const dispatch = useDispatch();
  const [treeViewItems, setTreeViewItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [distributionCentreList, setDistributionCentreList] = useState([]);
  const [collectionCentreList, setCollectionCentreList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [clientName, setClientName] = useState("");
  const [companyMasterList, setCompanyMasterList] = useState([]);

  const userDetailsReducer = useSelector((state) => state.rootReducer.userDetailsReducer)
  var userData = userDetailsReducer.userDetails;

  const userDetailsErrorReducer = useSelector((state) => state.rootReducer.userDetailsErrorReducer)
  const userError = userDetailsErrorReducer.userDetailsError;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  useEffect(() => {
    fetchClientDetail();
    fetchMenuTree();
    fetchCompanyList();
    fetchCountryList();
    getClientModuleDetail();
  }, []);

  useEffect(() => {
    dispatch(selectedProductsAction(selectedItems));
  }, [selectedItems]);

  const resetUserDetail = () => {
    dispatch(userDetailsAction({
      "encryptedClientCode": "",
      "encryptedCompanyCode": "",
      "clientName": "",
      "loginName": "",
      "loginUserName": "",
      "loginUserEmailId": "",
      "loginUserMobileNumber": "",
      "distributionCentreCode": "",
      "collCentreCode": "",
      "countryCode": "",
      "stateCode": "",
      "status": "Active"
    }))
    setSelectedItems([]);
  }

  const handleSelectedItems = () => {
    if (userDetailsReducer.userDetails && userData.treeIds && userData.treeIds.length > 0) {
      setSelectedItems(userData.treeIds)
    }
  }

  if (Object.keys(userDetailsReducer.userDetails).length == 0 && !userDetailsReducer.userDetails.encryptedSecurityUserId) {
    resetUserDetail();
  } else if (userDetailsReducer.userDetails.encryptedSecurityUserId && (!selectedItems || selectedItems.length <= 0)
    && (!formChangedData.moduleDetailAdd && !formChangedData.moduleDetailDelete)) {
    handleSelectedItems();
  }

  const fetchMenuTree = async () => {
    const request = {
      encryptedSecurityUserId: localStorage.getItem("EncryptedSecurityUserId")
    }
    setIsLoading(true);
    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-client-user-menu-tree', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })
    if (response.data.status == 200) {
      setIsLoading(false);
      if (response.data && response.data.data.length > 0) {
        setTreeViewItems(response.data.data);
      }
    }
  };

  const fetchCompanyList = async () => {
    let companyData = [];
    const companyRequest = {
      EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
    }
    let companyResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-client-companies', companyRequest, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    });
    if (companyResponse.data.status == 200) {
      if (companyResponse.data && companyResponse.data.data.length > 0) {
        setCompanyMasterList(companyResponse.data.data);
        companyResponse.data.data.forEach(company => {
          companyData.push({
            key: company.companyName,
            value: company.companyCode
          })
        })
      }
      setCompanyList(companyData)
    } else {
      setCompanyList([])
    }
  }

  const fetchClientDetail = async () => {
    const clientRequest = {
      EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
    }
    let clientResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-client', clientRequest, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    });
    if (clientResponse.data.status == 200) {
      setClientName(clientResponse.data.data.customerName);
    } else {
      setClientName();
    }
  }

  const fetchDistributionCentreList = async (encryptedCompanyCode) => {
    const request = {
      EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
      EncryptedCompanyCode: encryptedCompanyCode
    }
    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-distribution-centre-list', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })
    let distributionCentreListData = [];
    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        response.data.data.forEach(distributionCentre => {
          distributionCentreListData.push({
            key: distributionCentre.distributionName,
            value: distributionCentre.distributionCentreCode
          })
        })
      }
      setDistributionCentreList(distributionCentreListData)
    }
    else {
      setDistributionCentreList([]);
    }
  }

  const fetchCollectionCentreList = async (distributionCentreCode) => {
    const requestData = {
      EncryptedCompanyCode: userData.encryptedCompanyCode,
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
    else {
      setCollectionCentreList([]);
    }
  }

  const fetchCountryList = async () => {
    axios
      .get(process.env.REACT_APP_API_URL + '/country-list')
      .then(res => {
        if (res.data.status == 200) {
          let countryData = [];
          if (res.data && res.data.data.length > 0)
            res.data.data.forEach(country => {
              countryData.push({
                key: country.countryName,
                value: country.countryCode
              });
            });
          setCountryList(countryData);
        }
        else {
          setCountryList([]);
        }
      });
  }

  const fetchStates = async (countryCode) => {
    const request = {
      CountryCode: countryCode
    }
    axios
      .post(process.env.REACT_APP_API_URL + '/state-list', request)
      .then(res => {
        if (res.data.status == 200) {
          let stateData = [];
          if (res.data && res.data.data.length > 0)
            res.data.data.forEach(state => {
              stateData.push({
                key: state.stateName,
                value: state.stateCode
              });
            });
          setStateList(stateData);
        } else {
          setStateList([]);
        }
      });
  }

  if (userData.stateCode &&
    !$('#txtState').val()) {
    fetchStates(userData.countryCode)
  }

  if (userData.distributionCentreCode &&
    !$('#txtDistributionCentreCode').val()) {
      fetchDistributionCentreList(userData.encryptedCompanyCode)
  }

  if (userData.collCentreCode &&
    !$('#txtCollectionCentreCode').val()) {
      fetchCollectionCentreList(userData.distributionCentreCode)
  }

  const getClientModuleDetail = async () => {
    const request = {
      encryptedClientCode: localStorage.getItem("EncryptedClientCode")
    }
    let response = await axios.post(process.env.REACT_APP_API_URL + '/client-registration-authorization-list', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })
    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        response.data.data.forEach(moduleData => {
          localStorage.setItem("ModuleCode", moduleData.moduleCode);
        })
      }

    }
  }

  const handleFieldChange = e => {
    if (e.target.name === 'company') {
      var companyDetail = companyMasterList.find(company => company.companyCode == e.target.value);
      dispatch(userDetailsAction({
        ...userData,
        companyCode: e.target.value,
        encryptedCompanyCode: companyDetail ? companyDetail.encryptedCompanyCode : "",
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        clientName: clientName,
        distributionCentreCode: null,
        collCentreCode: null,
      }));
      setDistributionCentreList([]);
      setCollectionCentreList([]);
      fetchDistributionCentreList(companyDetail.encryptedCompanyCode);
    }
    else if (e.target.name === 'distributionCentreCode') {
      var distributionDetail = setDistributionCentreList.find(distribution => distribution.distributionCentreCode == e.target.value);
      dispatch(userDetailsAction({
        ...userData,
        encryptedDistributionCentreCode: distributionDetail.distributionCentreCode,
        distributionCentreCode: e.target.value,
        collCentreCode: null
      }));
      setCollectionCentreList([]);
      fetchCollectionCentreList(e.target.value);
    }
    else if (e.target.name == 'collCentreCode') {
      dispatch(userDetailsAction({
        ...userData,
        collCentreCode: e.target.value,
      }))
    }
    else if (e.target.name == 'country') {
      dispatch(userDetailsAction({
        ...userData,
        countryCode: e.target.value,
        stateCode: null
      }))
      setStateList([]);
      fetchStates(e.target.value)
    }
    else if (e.target.name == 'state') {
      dispatch(userDetailsAction({
        ...userData,
        stateCode: e.target.value,
      }))
    }
    else {
      dispatch(userDetailsAction({
        ...userData,
        [e.target.name]: e.target.value
      }))
    }

    if (userData.encryptedSecurityUserId) {
      dispatch(formChangedAction({
        ...formChangedData,
        clientUserDetailUpdate: true
      }))
    } else {
      dispatch(formChangedAction({
        ...formChangedData,
        clientUserDetailAdd: true
      }))
    }
  }

  return (
    <>
      {
        userData &&
        <Row>
          <Col lg={3} className="no-pd-card no-right-pad">
            <FalconComponentCard className="farmer-card-row1">
              <FalconCardBody className="full-tab-page-card-body">
                <Form noValidate className="details-form" id='ClientUserDetailsForm'>
                  <Row>
                    <Col className="me-3 ms-3">
                      <Row className="mb-3">
                        <Form.Label><b>Client Name: {clientName} </b></Form.Label>
                      </Row>
                      <Row className="mb-3">
                        <Form.Label>Company<span className="text-danger">*</span></Form.Label>
                        <Form.Select id="txtCompany" name="company" value={userData.companyCode} onChange={handleFieldChange}
                        >
                          <option value=''>Select Company</option>
                          {companyList.map((option, index) => (
                            <option key={index} value={option.value}>{option.key}</option>
                          ))}
                        </Form.Select>
                        {Object.keys(userError.companyErr).map((key) => {
                          return <span className="error-message">{userError.companyErr[key]}</span>
                        })}
                      </Row>
                      <Row className="mb-3">
                        <Form.Label>Distribution Centre<span className="text-danger">*</span></Form.Label>
                        <Form.Select id="txtDistributionCentreCode" name="distributionCentreCode" value={userData.distributionCentreCode} onChange={handleFieldChange}
                        >
                          <option value=''>Select Distribution Centre</option>
                          {distributionCentreList.map((option, index) => (
                            <option key={index} value={option.value}>{option.key}</option>
                          ))}
                        </Form.Select>
                        {Object.keys(userError.distributionCentreErr).map((key) => {
                          return <span className="error-message">{userError.distributionCentreErr[key]}</span>
                        })}
                      </Row>
                      <Row className="mb-3">
                        <Form.Label>Collection Centre<span className="text-danger">*</span></Form.Label>
                        <Form.Select id="txtCollectionCentreCode" name="collCentreCode" value={userData.collCentreCode}  onChange={handleFieldChange}
                        >
                          <option value=''>Select Collection Centre</option>
                          {collectionCentreList.map((option, index) => (
                            <option key={index} value={option.value}>{option.key}</option>
                          ))}
                        </Form.Select>
                        {Object.keys(userError.collectionCentreNameErr).map((key) => {
                          return <span className="error-message">{userError.collectionCentreNameErr[key]}</span>
                        })}
                      </Row>
                      <Row className="mb-3">
                        <Form.Label>User Name<span className="text-danger">*</span></Form.Label>
                        <Form.Control id="txtName" name="loginName" maxLength={20} value={userData.loginName} placeholder="User Name" required={true} onChange={handleFieldChange} />
                        {Object.keys(userError.loginNameErr).map((key) => {
                          return <span className="error-message">{userError.loginNameErr[key]}</span>
                        })}
                      </Row>
                      <Row className="mb-3">
                        <Form.Label>Login User Id<span className="text-danger">*</span></Form.Label>
                        <Form.Control id="txtUserName" name="loginUserName" maxLength={20} value={userData.loginUserName} placeholder="Login User Id" required={true} onChange={handleFieldChange} />
                        {Object.keys(userError.userNameErr).map((key) => {
                          return <span className="error-message">{userError.userNameErr[key]}</span>
                        })}
                      </Row>
                      <Row className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select id="txtStatus" name="status" value={userData.status} onChange={handleFieldChange}>
                          <option value="Active">Active</option>
                          <option value="Suspended">Suspended</option>
                        </Form.Select>
                      </Row>
                      <Row className="mb-3">
                        <Form.Label>Mobile Number<span className="text-danger">*</span></Form.Label>
                        <Form.Control id="txtMobile" name="loginUserMobileNumber" maxLength={10} value={userData.loginUserMobileNumber} className="mb-1" placeholder="Mobile Number" onChange={handleFieldChange}
                          onKeyPress={(e) => {
                            const regex = /[0-9]|\./;
                            const key = String.fromCharCode(e.charCode);
                            if (!regex.test(key)) {
                              e.preventDefault();
                            }
                          }} />
                        {Object.keys(userError.mobileNumberErr).map((key) => {
                          return <span className="error-message">{userError.mobileNumberErr[key]}</span>
                        })}
                      </Row>
                      <Row className="mb-3">
                        <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                        <Form.Control id="txtEmail" name="loginUserEmailId" maxLength={50} value={userData.loginUserEmailId} className="mb-1" placeholder="Email" onChange={handleFieldChange} />
                        {Object.keys(userError.emailErr).map((key) => {
                          return <span className="error-message">{userError.emailErr[key]}</span>
                        })}
                      </Row>
                      <Row className="mb-3">
                        <Form.Label>Country<span className="text-danger">*</span></Form.Label>
                        <Form.Select id="txtCountry" name="country" value={userData.countryCode} onChange={handleFieldChange}
                        >
                          <option value=''>Select Country</option>
                          {countryList.map((option, index) => (
                            <option key={index} value={option.value}>{option.key}</option>
                          ))}
                        </Form.Select>
                        {Object.keys(userError.countryErr).map((key) => {
                          return <span className="error-message">{userError.countryErr[key]}</span>
                        })}
                      </Row>
                      <Row className="mb-3">
                        <Form.Label>State<span className="text-danger">*</span></Form.Label>
                        <Form.Select id="txtState" name="state" value={userData.stateCode} onChange={handleFieldChange}
                        >
                          <option value=''>Select State</option>
                          {stateList.map((option, index) => (
                            <option key={index} value={option.value}>{option.key}</option>
                          ))}
                        </Form.Select>
                        {Object.keys(userError.stateErr).map((key) => {
                          return <span className="error-message">{userError.stateErr[key]}</span>
                        })}
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </FalconCardBody>
            </FalconComponentCard>
          </Col>
          <Col lg={9} className="no-pd-card col-left-pad">
            <FalconComponentCard className="farmer-card-row1">
              <FalconCardBody className="full-tab-page-card-body" language="jsx">
                <Col className="me-3 ms-3">
                  <Treeview
                    data={treeViewItems}
                    selection
                    defaultSelected={[]}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  // expanded={['1', '2', '3', '7', '18']}
                  />
                </Col>
              </FalconCardBody>
            </FalconComponentCard>
          </Col>
        </Row>
      }
    </>
  )
}
export default AddClientUser;