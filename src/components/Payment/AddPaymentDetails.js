import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row, Button, Modal, Table, Card } from 'react-bootstrap';
import axios from 'axios';
import FalconCardBody from 'components/common/FalconCardBody';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { paymentDetailsAction } from 'actions';

const AddPaymentDetails = () => {
  const [formHasError, setFormError] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [companyMasterList, setCompanyMasterList] = useState([]);
  const [vendorAndFarmerList, setVendorAndFarmerList] = useState();
  const dispatch = useDispatch();
  const paymentDetailsReducer = useSelector((state) => state.rootReducer.paymentDetailReducer)
  var paymentDetails = paymentDetailsReducer.paymentDetails;
  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  let isFormChanged = Object.values(formChangedData).some(value => value === true);

  useEffect(() => {
    getCompany()
  }, []);

  const handleFieldChange = e => {
    if (e.target.name === 'companyCode' && e.target.value) {
      var companyDetail = companyMasterList.find(company => company.encryptedCompanyCode == e.target.value);
      getVendorAndFarmerList(companyDetail.encryptedCompanyCode)
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
      if (companyResponse.data && companyResponse.data.data.length > 0) {
        setCompanyMasterList(companyResponse.data.data);
        if (localStorage.getItem('CompanyCode')) {
          var companyDetails = companyResponse.data.data.find(company => company.companyCode == localStorage.getItem('CompanyCode'));
          companyData.push({
            key: companyDetails.companyName,
            value: companyDetails.encryptedCompanyCode,
            label: companyDetails.companyName
          })
          setCompanyList(companyDetails.encryptedCompanyCode);
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

  const getVendorAndFarmerList = async (encryptedCompanyCode) => {
    const request = {
      EncryptedCompanyCode: encryptedCompanyCode
    }
    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-and-farmer-list', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    });
    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        setVendorAndFarmerList(response.data.data);
      } else {
        setVendorAndFarmerList([])
      }
    }
  }



  return (
    <>
      <Card className="mb-1">
        <Card.Body className='p5px'>
          <Row className="justify-content">
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
          </Row>
        </Card.Body>
      </Card >
      <Row >
        <Col lg={2} className="no-pd-card no-right-pad">
          <FalconComponentCard className="farmer-card-row1">
            <FalconCardBody >
              <Form noValidate className="details-form" id='ClientUserDetailsForm'>
                <Row>
                  <Col className="me-3 ms-3">
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Col sm="12">
                        <Form.Control id="txtSearchVendor" name="searchVendor" placeholder="Search Vendor" maxLength={45}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Col>
                    </Form.Group>
                    <ul type="none">
                    {/* {vendorAndFarmerList.map((data) => ( */}
                       {/* <li onClick={() => handleVendorAndFarmerDetail(data.code, data.name)}><font size="2">{data.name}</font></li> */}
                      <li><font size="2">vendor101</font></li>
                      <li><font size="2">vendor102</font></li>
                    {/* ))} */}
                    </ul>
                  </Col>
                </Row>
              </Form>
            </FalconCardBody>
          </FalconComponentCard>
        </Col>
        <Col lg={4} className="no-pd-card no-right-pad">
          <FalconComponentCard className="farmer-card-row1">
            <FalconCardBody >
              <Form noValidate className="details-form" id='ClientUserDetailsForm'>
                <Row>
                  <Col className="me-3 ms-3">
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Form.Label column sm="4">
                        Name
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtVendorName" placeholder="Name" name="vendorCode" value={paymentDetails.vendorName} disabled >
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
            </FalconCardBody>
          </FalconComponentCard>
        </Col>
        <Col lg={4} className="no-pd-card no-right-pad">
          <FalconComponentCard className="farmer-card-row1">
            <FalconCardBody>
              <Form noValidate className="details-form" id='ClientUserDetailsForm'>
                <Row>
                  <Col className="me-3 ms-3">
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Form.Label column sm="4">
                        Invoice No
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtInvoiceNo" placeholder="Invoice No" name="invoiceNo" disabled >
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Form.Label column sm="4">
                        Invoice Date
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtInvoiceDate" placeholder="Invoice Date" name="invoiceDate" disabled >
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword" >
                      <Form.Label column sm="4">
                        Invoice Amount
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtInvoiceAmount" name="invoiceAmount" placeholder="Invoice Amount" disabled />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Form.Label column sm="4">
                        Paid Amount<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtPaidAmount" name="paidAmount" placeholder="Paid Amount" />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Form.Label column sm="4">
                        Balance Amount
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtBalanceAmount" name="balanceAmount" placeholder="Balance Amount" disabled />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </FalconCardBody>
          </FalconComponentCard>
        </Col>
        <Col lg={2} className="no-pd-card ">
          <FalconComponentCard className="farmer-card-row1">
            <FalconCardBody >
              <Form noValidate className="details-form" id='ClientUserDetailsForm'>
                <Row>
                  <Col className="me-3 ms-3">
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Col sm="12">
                        <Form.Control id="txtSearchInvoice" name="searchInvoice" placeholder="Search Invoice" maxLength={45}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Col>
                    </Form.Group>
                    <ul type="none">
                      <li><font size="2">VendorNo111</font></li>
                      <li><font size="2">VendorNo222</font></li>
                    </ul>
                  </Col>
                </Row>
              </Form>
            </FalconCardBody>
          </FalconComponentCard>
        </Col>
      </Row>
    </>
  )
}

export default AddPaymentDetails