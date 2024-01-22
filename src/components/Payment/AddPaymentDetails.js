import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row, Button, Modal, Table, Card } from 'react-bootstrap';
import axios from 'axios';
import IconButton from 'components/common/IconButton';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { paymentDetailsAction } from 'actions';

const AddPaymentDetails = () => {
  const [formHasError, setFormError] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [companyName, setCompanyName] = useState();
  const [vendorList, setVendorList] = useState([]);
  const [vendorModal, setVendorModal] = useState(false);
  const dispatch = useDispatch();
  const paymentDetailsReducer = useSelector((state) => state.rootReducer.paymentDetailReducer)
  var paymentDetails = paymentDetailsReducer.paymentDetails;
  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  let isFormChanged = Object.values(formChangedData).some(value => value === true);

  useEffect(() => {
    getCompany()
  }, []);

  const onSelectVendorClick = async () => {
    setVendorModal(true);
    getVendorMasterList();
  }

  const handleFieldChange = e => {
    if (e.target.name == "vendorCode" && e.target.value) {
      const vendorDetail = vendorList.find(vendor => vendor.vendorCode == e.target.value);
      dispatch(paymentDetailsAction({
        ...paymentDetails,
        vendorCode: e.target.value,
        companyCode: localStorage.getItem('companyCode'),
        address: vendorDetail.vendorAddress,
        pinCode: vendorDetail.vendorPincode,
        state: vendorDetail.stateName,
        country: vendorDetail.countryName,
        vendorName: vendorDetail.vendorName,
        poNo: '',
        poDate: '',
        poStatus: '',
        deliveryLocation: ''
      }))
    }
    else if (e.target.name == "vendorCode" && !e.target.value) {
      dispatch(paymentDetailsAction({
        ...paymentDetails,
        vendorCode: e.target.value,
        address: '',
        pinCode: '',
        state: '',
        country: '',
        vendorName: '',
        poNo: '',
        poDate: '',
        poStatus: '',
        deliveryLocation: ''
      }))
    }
  }

  const getCompany = async () => {
    let companyData = [];
    const companyRequest = {
      EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
    }

    let companyResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-client-companies', companyRequest, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    });

    if (companyResponse.data.status == 200) {
      // setCompanyMasterList(companyResponse.data.data);
      if (companyResponse.data && companyResponse.data.data.length > 0) {
        if (localStorage.getItem('CompanyCode')) {
          var companyDetail = companyResponse.data.data.find(company => company.companyCode == localStorage.getItem('CompanyCode'));
          setCompanyName(companyDetail.companyName);
        }
        if (localStorage.getItem('CompanyCode')) {
          var companyDetails = companyResponse.data.data.find(company => company.companyCode == localStorage.getItem('CompanyCode'));
          companyData.push({
            key: companyDetails.companyName,
            value: companyDetails.encryptedCompanyCode,
            label: companyDetails.companyName
          })
          setCompanyList(companyData);
          getVendorMasterList(companyData)
        }
        else {
          companyResponse.data.data.forEach(company => {
            companyData.push({
              key: company.companyName,
              value: company.encryptedCompanyCode,
              label: company.companyName
            })
          })
          setCompanyList(companyData)
        }
      }
    } else {
      setCompanyList([])
    }
  }

  const getVendorMasterList = async () => {
    const requestData = {
      pageNumber: 1,
      pageSize: 1,
      EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode")
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-master-list', requestData, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })
    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        setVendorList(response.data.data)
      }
    } else {
      setVendorList([])
    }
  }

  // const getFarmerDetail = async (card) => {
  //   const requestData = {
  //     CardNo: card,
  //     EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode")
  //   }

  //   let response = await axios.post(process.env.REACT_APP_API_URL + '/get-farmer-detail', requestData, {
  //     headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
  //   })

  //   if (response.data.status == 200) {
  //     dispatch(purchaseOrderDetailsAction({
  //       ...purchaseOrderData,
  //       farmerCode: response.data.data.farmerCode,
  //       farmerName: response.data.data.farmerName,
  //       farmerFatherName: response.data.data.farmerFatherName,
  //       farmerPhoneNumber: response.data.data.farmerPhoneNumber,
  //       farmerVillage: response.data.data.village + ", " + response.data.data.districtName + ", " + response.data.data.stateName,
  //       cardNo: response.data.data.cardNo
  //     }))
  //   }
  //   else {
  //     if (response.data.status == 205) {
  //       toast.error("Provided card number is inactive", {
  //         theme: 'colored'
  //       });
  //     } else {
  //       toast.error(response.data.message, {
  //         theme: 'colored'
  //       });
  //     }

  //     dispatch(purchaseOrderDetailsAction({
  //       ...purchaseOrderData,
  //       farmerCode: "",
  //       farmerName: "",
  //       farmerFatherName: "",
  //       farmerPhoneNumber: "",
  //       farmerVillage: ""
  //     }))
  //   }
  // }

  return (
    <>

      {
        vendorModal &&
        <Modal
          show={vendorModal}
          onHide={() => setVendorModal(false)}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Vendor</Modal.Title>
          </Modal.Header>

          <Modal.Body className="max-five-rows">
            <Form className="details-form" id="FarmerDetails" >
              <Row>
                <Col className="me-3 ms-3" md="4">
                  <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                    <Form.Label column sm="2">
                      Search
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control id="txtSearch" name="search" placeholder="Search"
                        // onChange={handleSearchChange} maxLength={45}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Col>
                  </Form.Group>
                </Col>

                {
                  vendorList && vendorList.length > 0 ?
                    <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                      <thead className='custom-bg-200'>
                        <tr>
                          <th>Vendor Code</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone Number</th>
                          <th>Address</th>
                          <th>Pin Code</th>
                          <th>State</th>
                          <th>Country</th>
                          <th>Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          vendorList.map((data, index) =>
                            <tr>
                              <td>{data.vendorCode}</td>
                              <td>{data.vendorName}</td>
                              <td>{data.vendorEmail ? data.vendorEmail : "-"}</td>
                              <td>{data.vendorPhoneNumber ? data.vendorPhoneNumber : "-"}</td>
                              <td>{data.Address}</td>
                              <td>{data.PinCode}</td>
                              <td>{data.stateName}</td>
                              <td>{data.countryName}</td>
                              <td><Button variant="success" onClick={() => onFarmerSelect(data.farmerCode)} >Select</Button></td>
                            </tr>
                          )
                        }
                      </tbody>
                    </Table>
                    :
                    <h5>No record found</h5>
                }

              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      }

      <Card className="mb-1">
        <Card.Body className='p5px'>
          <Row className="justify-content-center">
            <Col className='col-auto no-pd-card'>
              <Form.Group as={Row} className="mt-1">
                <h5 className='col-auto'>
                  {localStorage.getItem("CompanyName")}
                </h5>
              </Form.Group>
            </Col>
            <Col className='col-auto no-pd-card'>
              <Form.Group as={Row} controlId="formPlaintextPassword">
                <Form.Label className='col-auto' column>
                  Company Name
                </Form.Label>
                <Col className='col-auto'>
                  <Form.Select id="txtCompanyCode" name="companyCode" onChange={handleFieldChange} value={paymentDetails.encryptedCompanyCode}>
                    <option value=''>Select</option>
                    {companyList.map((option, index) => (
                      <option key={index} value={option.value}>{option.key}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>
            </Col>
            <Col xs="auto">
              <IconButton
                variant="falcon-success"
                size="sm"
                icon="plus"
                className="me-2 mb-2 mb-sm-1"
                onClick={() => onSelectVendorClick()}
              >
                {paymentDetails.vendorCode ? "Change Vendor" : "Select Vendor"}
              </IconButton>
            </Col>
          </Row>
        </Card.Body>
      </Card >

      <FalconComponentCard className="no-pb mb-1">
        <FalconComponentCard.Body language="jsx">
          <Form noValidate validated={formHasError} className="details-form" id='AddMenuDetailsForm'>
            <Row>
              <Col className="me-3 ms-3" md="7">
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                  <Form.Label column sm="4">
                    Vendor Name<span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control id="txtVendorName" name="vendorCode" value={paymentDetails.vendorName} disabled >
                    </Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword" >
                  <Form.Label column sm="4">
                    Address
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control id="txtAddress" name="address" placeholder="Address" value={paymentDetails.address} disabled />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                  <Form.Label column sm="4">
                    Pincode
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control id="txtPincode" name="pinCode" placeholder="Pincode" value={paymentDetails.pinCode} disabled />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                  <Form.Label column sm="4">
                    State
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control id="txtState" name="state" placeholder="State" value={paymentDetails.state} disabled />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                  <Form.Label column sm="4">
                    Country
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control id="txtCountry" name="country" placeholder="Country" value={paymentDetails.country} disabled />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </FalconComponentCard.Body>
      </FalconComponentCard>
    </>
  )
}

export default AddPaymentDetails