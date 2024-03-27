import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table, Form } from 'react-bootstrap';
import IconButton from 'components/common/IconButton';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DemandCollectionReport = () => {
  const { demandNo } = useParams();
  const [demandHeaderData, setDemandHeaderData] =
    useState({});
  const [tableData, setTableData] = useState([]);
  const [subTotal, setSubTotal] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [taxableValue, setTaxableValue] = useState();

  useEffect(() => {
    if (demandNo) {
      getDemandHeaderDetail();
    }
    setTimeout(() => {
      window.print();
    }, 2000);
  }, []);

  const getDemandHeaderDetail = async () => {
    const request = {
      encryptedDemandNo: demandNo
    };

    let response = await axios.post(
      process.env.REACT_APP_API_URL + '/get-demand-header-detail',
      request,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('Token')).value
          }`
        }
      }
    );

    if (response.data.status == 200) {
      const demandNo = response?.data?.data?.demandNo;
      setDemandHeaderData(response.data.data);
      getDemandProductDetailList(demandNo);
    } else {
      setDemandHeaderData();
    }
  };

  const getDemandProductDetailList = async demandNo => {
    const request = {
      demandNo: demandNo
    };

    let response = await axios.post(
      process.env.REACT_APP_API_URL + '/get-demand-product-detail-list',
      request,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('Token')).value
          }`
        }
      }
    );

    if (response.data.status == 200) {
      if (response.data.data && response.data.data.length > 0) {
        setTableData(response.data.data);

        const total = response.data.data.reduce((acc, item) => {
          const subAmount = parseFloat(item.demandAmount);
          if (!isNaN(subAmount)) {
            return acc + subAmount;
          }
          return acc;
        }, 0);

        const CGSTAmount = response.data.data.reduce((acc, item) => {
          const cgstAmount = parseFloat(item.cgstAmt);
          if (!isNaN(cgstAmount)) {
            return acc + cgstAmount;
          }
          return acc;
        }, 0);

        const SGSTAmount = response.data.data.reduce((acc, item) => {
          const sgstAmount = parseFloat(item.sgstAmt);
          if (!isNaN(sgstAmount)) {
            return acc + sgstAmount;
          }
          return acc;
        }, 0);


        setTaxableValue(parseFloat(CGSTAmount) + parseFloat(SGSTAmount));
        setSubTotal(total);

        setTotalAmount(total + CGSTAmount + SGSTAmount); 
      }
    } else {
      setTableData([]);
    }
  };

  return (
    <>
      {demandHeaderData && (
        <>
          <Card className="mb-3">
            <Card.Body>
              <Row className="justify-content-between align-items-center">
                <Col xs="auto">
                  <h6 className="mb-2 mb-md-0">#{demandHeaderData.demandNo}</h6>
                </Col>
                <Col xs="auto" className="text-center">
                  <Form.Label className="text-align-center">
                    <h4>
                      <u>
                        <b>Demand Collection Report</b>
                      </u>
                    </h4>
                  </Form.Label>
                </Col>
                <Col xs="auto">
                  <IconButton
                    variant="falcon-default"
                    size="sm"
                    icon="print"
                    iconClassName="me-1"
                    className="me-1 mb-2 mb-sm-0 hide-on-print"
                    onClick={() => window.print()}
                  >
                    Print
                  </IconButton>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Row className="align-items-center text-center mb-3">
                <Col sm={6} className="text-sm-start">
                  {demandHeaderData?.companyLogoURL && <img src={demandHeaderData.companyLogoURL} id='imgCompanyLogo' className='img-thumbnail shadow-sm logo-photo p3px' /> }
                  <h5>{demandHeaderData.companyName}</h5>
                  <p className="fs--1 mb-0">
                    {demandHeaderData.companyAddress}
                  </p>
                  {demandHeaderData.comapnyAddress2 &&
                  <p className="fs--1 mb-0">{demandHeaderData.comapnyAddress2}</p>
                  }
                  <p className="fs--1 mb-0">
                    {demandHeaderData.country} {demandHeaderData.state} - {demandHeaderData.pinCode}
                  </p>
                </Col>

                {demandHeaderData.demandNo && (
                  <Col sm="4" className="ms-auto">
                    <div className="table-responsive">
                      <Table borderless size="sm" className="fs--1 table">
                        <tbody>
                          <tr>
                            <th className="text-sm-end">Demand No: </th>
                            <td>{demandHeaderData.demandNo}</td>
                          </tr>
                          <tr>
                            <th className="text-sm-end">Demand Date:</th>
                            <td>{demandHeaderData.demandDate}</td>
                          </tr>
                          {totalAmount > 0 && (
                            <tr className="alert alert-success fw-bold">
                              <th className="text-sm-end">Total Amount</th>
                              <td>{totalAmount.toLocaleString('en-IN')} Rs.</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                )}
                <Col xs={12}>
                  <hr />
                </Col>
              </Row>
              <Row className="align-items-center">
                {demandHeaderData.farmerCode && (
                  <Col>
                    <h6 className="text-">Supplier / Farmer Name </h6>
                    <h5>{demandHeaderData.farmerName}</h5>
                    <p className="fs--1">{demandHeaderData.farmerAddress}</p>
                  </Col>
                )}
              </Row>

              <div className="mt-4">
                <Table striped responsive className="border-bottom" size="sm">
                  <thead className="light">
                    <tr className="bg-primary text-white dark__bg-1000">
                      <th className="border-0 text-start">S.No</th>
                      <th className="border-0 text-start">Description</th>
                      <th className="border-0 text-start">Qty.</th>
                      <th className="border-0 text-start">Rate</th>
                      <th className="border-0 text-start">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr>
                        <td className="align-middle text-start">{index + 1}</td>
                        {item.productCategoryCode && item.productCode ? (
                          <td className="align-middle text-start">
                            <h6 className="mb-0 text-nowrap">
                              {item.productCategoryName}
                            </h6>
                            <p className="mb-0 text-start">
                              {item.productName}
                            </p>
                          </td>
                        ) : (
                          <td className="align-middle text-start">
                            <h6 className="mb-0 text-nowrap">
                              {item.itemDescription}
                            </h6>
                          </td>
                        )}
                        <td className="align-middle text-start">
                          {item.demandQty ? item.demandQty : '-'}
                        </td>
                        <td className="align-middle text-start">
                          {item.demandRate ? parseFloat(item.demandRate).toLocaleString('en-IN') : '-'}
                        </td>
                        <td className="align-middle text-start">
                          {item.demandAmount ? parseFloat(item.demandAmount).toLocaleString(
                            'en-IN'
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <Row className="justify-content-end">
                <Col xs="auto">
                  <Table borderless size="sm" className="fs--1 text-end">
                    <tbody>
                      <tr>
                        <th className="text-900">Sub Total:</th>
                        <td className="fw-semi-bold">
                          {subTotal && subTotal.toLocaleString('en-IN')} Rs.
                        </td>
                      </tr>
                      <tr>
                        <th className="text-900">Tax:</th>
                        <td className="fw-semi-bold">
                          {taxableValue
                            ? taxableValue.toLocaleString('en-IN')
                            : '0'}{' '}
                          Rs.
                        </td>
                      </tr>
                      <tr className="border-top">
                        <th className="text-900">Total:</th>
                        <td className="fw-semi-bold">
                          {totalAmount && totalAmount.toLocaleString('en-IN')}{' '}
                          Rs.
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
};

export default DemandCollectionReport;
