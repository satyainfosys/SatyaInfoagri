import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row, Button, Modal, Table, Card } from 'react-bootstrap';
import axios from 'axios';
import FalconCardBody from 'components/common/FalconCardBody';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { paymentDetailsAction, paymentHeaderAction } from 'actions';
import { Link } from 'react-router-dom';
import Flex from 'components/common/Flex';

const AddPaymentDetails = () => {
  const [companyList, setCompanyList] = useState([]);
  const [companyMasterList, setCompanyMasterList] = useState([]);
  const [vendorAndMasterDetail, setVendorAndMasterDetail] = useState([]);
  const [vendorAndFarmerList, setVendorAndFarmerList] = useState();
  const [invoiceData, setInvoiceData] = useState({});
  const [invoiceList, setInvoiceList] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [perPage, setPerPage] = useState(15);
  const [unitList, setUnitList] = useState([])

  const dispatch = useDispatch();

  let paymentDetailsReducer = useSelector((state) => state.rootReducer.paymentDetailReducer)
  let paymentDetails = paymentDetailsReducer.paymentDetails;

  const paymentHeaderDetailsReducer = useSelector((state) => state.rootReducer.paymentHeaderReducer)
  var paymentHeaderDetails = paymentHeaderDetailsReducer.paymentHeaderDetail;

  const resetInvoiceEntryHeaderDetails = () => {
    dispatch(paymentHeaderAction({
      "name": "",
      "address": "",
      "pinCode": "",
      "state": "",
      "country": "",
      "invoiceNo": "",
      "invoiceDate": "",
      "invoiceAmount": "",
      "invoicePaidAmount": "",
      "balanceAmount": ""
    }))
  }

  useEffect(() => {
    getCompany()
    getUnitList()
  }, []);

  // if (!paymentHeaderDetailsReducer.paymentHeaderDetail ||
  //   Object.keys(paymentHeaderDetailsReducer.paymentHeaderDetail).length <= 0) {
  //   resetInvoiceEntryHeaderDetails();
  // }

  const handleFieldChange = e => {
    if (e.target.name === 'companyCode' && e.target.value) {
      var companyDetail = companyMasterList.find(company => company.encryptedCompanyCode == e.target.value);
      getVendorAndFarmerList(companyDetail.encryptedCompanyCode)
      localStorage.setItem("EncryptedCompanyCode",companyDetail.encryptedCompanyCode)
    }
    else if (e.target.name === 'invoicePaidAmount' && e.target.value) {
      if (paymentHeaderDetails.invoiceAmount == parseFloat(e.target.value)) {
        let updatedPaymentDetails = [...paymentDetails];
        for (let i = 0; i < updatedPaymentDetails.length; i++) {
          updatedPaymentDetails[i] = {
            ...updatedPaymentDetails[i],
            paidAmount: updatedPaymentDetails[i].productAmount,
            balanceAmount: 0
          };
        }
        dispatch(paymentDetailsAction(updatedPaymentDetails));
      }
      let balanceAmount = paymentHeaderDetails.invoiceAmount - e.target.value
      dispatch(paymentHeaderAction({
        ...paymentHeaderDetails,
        invoicePaidAmount: e.target.value,
        balanceAmount: balanceAmount,
      }))
    }
    else if(e.target.name === 'invoicePaidAmount')
    {
        let updatedPaymentDetails = [...paymentDetails];
        for (let i = 0; i < updatedPaymentDetails.length; i++) {
          updatedPaymentDetails[i] = {
            ...updatedPaymentDetails[i],
            paidAmount: "",
          };
        }
        dispatch(paymentDetailsAction(updatedPaymentDetails));
        dispatch(paymentHeaderAction({
          ...paymentHeaderDetails,
          invoicePaidAmount:"",
          balanceAmount: paymentHeaderDetails.invoiceAmount ,
        }))
    }
    else {
      dispatch(paymentHeaderAction({
        ...paymentHeaderDetails,
        [e.target.name]: e.target.value
      }))
    }
  }

  const handleVendorAndFarmerDetail = async (code, name) => {
    var companyDetail = vendorAndFarmerList.find(data => data.code == code && data.name == name);
    dispatch(paymentHeaderAction({
      ...paymentHeaderDetails,
      code: companyDetail.code,
      name: companyDetail.name,
      address: companyDetail.address,
      pinCode: companyDetail.pinCode,
      state: companyDetail.state,
      country: companyDetail.country
    }))
    fetchVendorInvoiceEntryHeaderList(1, perPage, paymentHeaderDetails.encryptedCompanyCode, code);
  }

  const handleInvoiceDetail = async (invoiceNo) => {
    var invoiceDetail = invoiceList.find(data => data.invoiceNo == invoiceNo);
    dispatch(paymentHeaderAction({
      ...paymentHeaderDetails,
      encryptedInvoiceHeaderCode: invoiceDetail.encryptedInvoiceHeaderCode,
      invoiceNo: invoiceDetail.invoiceNo,
      invoiceDate: invoiceDetail.invoiceDate,
      invoiceAmount: invoiceDetail.invoiceAmount,
      invoicePaidAmount: invoiceDetail.invoicePaidAmount,
      poNo: invoiceDetail.poNo,
    }))
    getInvoiceDetailList(invoiceDetail.invoiceNo)
    const fullyPaid = paymentDetails.every(item => item.paymentStatus === 'F');
    dispatch(paymentHeaderAction({
      ...paymentHeaderDetails,
      fullyPaid: fullyPaid,
    }))

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
          setCompanyList(companyData);
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

  const getVendorAndFarmerList = async (encryptedCompanyCode, searchText) => {
    const request = {
      EncryptedCompanyCode: encryptedCompanyCode,
      searchText: searchText
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

  const handleVendorAndFarmerOnChange = (e) => {
    if (e.target.value) {
      const searchText = e.target.value;
      const regex = new RegExp(searchText, 'i');
      const filteredList = vendorAndFarmerList && vendorAndFarmerList.filter(data => regex.test(data.name));
      setVendorAndMasterDetail(filteredList);
    }
    else {
      setVendorAndMasterDetail([]);
    }
  }

  const handleInvoiceOnChange = (e) => {
    if (e.target.value) {
      const searchText = e.target.value;
      const regex = new RegExp(searchText, 'i');
      const filteredList = invoiceList && invoiceList.filter(data => regex.test(data.invoiceNo));
      setInvoiceData(filteredList);
    }
    else {
      setInvoiceData([]);
    }
  }

  const fetchVendorInvoiceEntryHeaderList = async (page, size = perPage, encryptedCompanyCode, code) => {
    let token = localStorage.getItem('Token');

    const listFilter = {
      pageNumber: page,
      pageSize: size,
      EncryptedCompanyCode:localStorage.getItem("EncryptedCompanyCode"),
      code: code
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-invoice-entry-header-list', listFilter, {
      headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
    })

    if (response.data.status == 200) {
      setInvoiceList(response.data.data);
    } else {
      setInvoiceList([])
    }
  }

  const getUnitList = async () => {
    let requestData = {
      UnitType: "W"
    }
    let response = await axios.post(process.env.REACT_APP_API_URL + '/unit-list', requestData)
    let unitListData = [];

    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        response.data.data.forEach(units => {
          unitListData.push({
            key: units.unitName,
            value: units.unitCode
          })
        })
        setUnitList(unitListData);
      }
    }
    else {
      setUnitList([]);
    }
  }

  const getInvoiceDetailList = async (invoiceNo) => {
    const request = {
      InvoiceNo: invoiceNo
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-invoice-entry-detail-list', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })

    if (response.data.status == 200) {
      if (response.data.data && response.data.data.length > 0) {
        setInvoiceDetails(response.data.data)
        let netAmount = 0;
        const invoiceDetails = response.data.data.map(detail => {
          const unit = unitList.find(u => u.value === detail.unitCode);
          const unitName = unit ? unit.key : '';
          netAmount += parseFloat(detail.productAmount); 
          let balanceAmount = detail.productAmount - detail.paidAmount
          return {
            ...detail,
            unitName: unitName,
            balanceAmount: balanceAmount,
          };
        });

        const updatedInvoiceDetails =invoiceDetails.map(detail => {
          return {
            ...detail,
            netAmount: netAmount,
          };
        });

        dispatch(paymentDetailsAction(updatedInvoiceDetails))
      } else {
        setInvoiceDetails([])
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
                  <Form.Select id="txtCompanyCode" name="companyCode" onChange={handleFieldChange} value={paymentHeaderDetails.encryptedCompanyCode}>
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
          <Card className='mb-3'>
            <Card.Body className="fs--1">
              <Flex>
                <div className="ms-2 flex-1">
                  <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                    <Col sm="12">
                      <Form.Control id="txtSearchVendor" name="searchVendor" placeholder="Search Vendor" maxLength={45} onChange={handleVendorAndFarmerOnChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Col>
                  </Form.Group>
                </div>
              </Flex>
            </Card.Body>
          </Card>
          {
            vendorAndMasterDetail && vendorAndMasterDetail.length > 0 &&
            <Card className="mb-3">
              <Card.Header
                as={Flex}
                alignItems="center"
                justifyContent="between"
                className="bg-light"
              >
                <h5 className="mb-0">Vendors</h5>
              </Card.Header>
              <Card.Body>
                {vendorAndMasterDetail.map((item) => (
                  <div className="flex-1 ms-2">
                    <h6 className="mb-0">
                      <Link to="" style={{ color: 'black' }} onClick={(e) => { e.preventDefault(); handleVendorAndFarmerDetail(item.code, item.name); }} >{item.name}</Link>
                    </h6>
                    <div className="border-dashed border-bottom my-3" />
                  </div>
                ))}
              </Card.Body>
            </Card>
          }
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
                        <Form.Control id="txtName" placeholder="Name" name="name" value={paymentHeaderDetails.name} disabled >
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword" >
                      <Form.Label column sm="4">
                        Address
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtAddress" name="address" placeholder="Address" value={paymentHeaderDetails.address} disabled />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Form.Label column sm="4">
                        Pincode
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtPincode" name="pinCode" placeholder="Pincode" value={paymentHeaderDetails.pinCode} disabled />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Form.Label column sm="4">
                        State
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtState" name="state" placeholder="State" value={paymentHeaderDetails.state} disabled />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Form.Label column sm="4">
                        Country
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtCountry" name="country" placeholder="Country" value={paymentHeaderDetails.country} disabled />
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
                        <Form.Control id="txtInvoiceNo" placeholder="Invoice No" name="invoiceNo" value={paymentHeaderDetails.invoiceNo} disabled >
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Form.Label column sm="4">
                        Invoice Date
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtInvoiceDate" placeholder="Invoice Date" name="invoiceDate" value={paymentHeaderDetails.invoiceDate} disabled >
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword" >
                      <Form.Label column sm="4">
                        Invoice Amount
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtInvoiceAmount" name="invoiceAmount" placeholder="Invoice Amount" value={paymentHeaderDetails.invoiceAmount} disabled />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Form.Label column sm="4">
                        Paid Amount<span className="text-danger">*</span>
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtInvoicePaidAmount" name="invoicePaidAmount" placeholder="Paid Amount" value={paymentHeaderDetails.invoicePaidAmount} onChange={handleFieldChange} disabled={paymentHeaderDetails.fullyPaid == true}
                          onKeyPress={(e) => {
                            const keyCode = e.which || e.keyCode;
                            const keyValue = String.fromCharCode(keyCode);
                            const regex = /^[0-9]*\.?[0-9]*$/;
                            if (!regex.test(keyValue)) {
                              e.preventDefault();
                            }
                          }} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                      <Form.Label column sm="4">
                        Balance Amount
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control id="txtBalanceAmount" name="balanceAmount" placeholder="Balance Amount" value={paymentHeaderDetails.balanceAmount} disabled />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </FalconCardBody>
          </FalconComponentCard>
        </Col>
        <Col lg={2} className="no-pd-card ">
          <Card className='mb-3'>
            <Card.Body className="fs--1">
              <Flex>
                <div className="ms-2 flex-1">
                  <Form.Group as={Row} className="mb-1" controlId="formPlaintextPassword">
                    <Col sm="12">
                      <Form.Control id="txtSearchInvoice" name="searchInvoice" placeholder="Search Invoice" maxLength={45} onChange={handleInvoiceOnChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Col>
                  </Form.Group>
                </div>
              </Flex>
            </Card.Body>
          </Card>
          {
            invoiceData && invoiceData.length > 0 &&
            <Card className="mb-3">
              <Card.Header
                as={Flex}
                alignItems="center"
                justifyContent="between"
                className="bg-light"
              >
                <h5 className="mb-0">Invoice</h5>
              </Card.Header>
              <Card.Body>
                {invoiceData.length > 0 && invoiceData.map((item) => (
                  <div className="flex-1 ms-2">
                    <h6 className="mb-0">
                      <Link style={{ color: 'black' }} onClick={(e) => { e.preventDefault(); handleInvoiceDetail(item.invoiceNo); }}>{item.invoiceNo}</Link>
                    </h6>
                    <div className="border-dashed border-bottom my-3" />
                  </div>
                ))}
              </Card.Body>
            </Card>
          }
        </Col>
      </Row>
    </>
  )
}

export default AddPaymentDetails