import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Card, Row, Col, Table } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { productCatalogueDetailsAction } from 'actions';


const AddDemandDetail = () => {

  const dispatch = useDispatch();
  const [vendorModal, setVendorModal] = useState(false);
  useEffect(() => {
  }, [])

  const columnsArray = [
    'S.No',
    'Product Category',
    'Product',
    'Variety',
    'Brand',
    'Unit',
    'Delivered Quantity',
    'Quantity',
    'Rate',
    'Amt',
    'CGST %',
    'CGST Amount',
    'SGST %',
    'SGST Amount',
    'Khasra',
    'Sowing',
    'Harvesting',
    'Product Grand Amount',
    'Delete',
  ];

  let productCatalogueDetailsReducer = useSelector((state) => state.rootReducer.productCatalogueDetailsReducer)
  let productCatalogueList = productCatalogueDetailsReducer.productCatalogueDetails;

  const handleAddItem = () => {
    setVendorModal(true)
    getProductCatalogueMasterList();
  }

  const getProductCatalogueMasterList = async (searchText, productCategoryCode, productCode, isManualFilter = false) => {
    const requestData = {
      EncryptedCompanyCode: localStorage.getItem('EncryptedCompanyCode'),
      searchText: "",
      ProductCategoryCode: "",
      ProductCode: ""
    }

    const response = await axios.post(process.env.REACT_APP_API_URL + '/get-product-catalogue-master-list', requestData, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })
    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        dispatch(productCatalogueDetailsAction(response.data.data));
      }
    }
    else {
      dispatch(productCatalogueDetailsAction([]));
    }
  }
  const onCancelClick = async () => {
    setVendorModal(false);
  }
  
  return (
    <>
      {vendorModal && (
        <Modal
          show={vendorModal}
          onHide={() => setVendorModal(false)}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Product
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="max-five-rows">
            <Form className="details-form" id="OemDetailsForm">
              <Row>
                <Col className="me-3 ms-3" md="4">
                  <Form.Group
                    as={Row}
                    className="mb-2"
                    controlId="formPlaintextPassword"
                  >
                    <Form.Label column sm="2">
                      Search
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        id="txtSearch"
                        name="search"
                        placeholder="Search"
                        maxLength={45}
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col className="me-2 ms-3" md="4">
                  <Form.Group
                    as={Row}
                    className="mb-2"
                    controlId="formPlaintextPassword"
                  >
                    <Col sm="8">
                      <Form.Select
                        type="text"
                        name="productCategoryCode"
                        className="form-control"
                      >
                        <option value="">Select Product Category</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>
                <Col className="me-2 ms-3" md="3">
                  <Form.Group
                    as={Row}
                    className="mb-2"
                    controlId="formPlaintextPassword"
                  >
                    <Col sm="8">
                      <Form.Select
                        type="text"
                        name="productCode"
                        className="form-control"
                      >
                        <option value="">Select Product</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>

                {productCatalogueDetailsReducer.productCatalogueDetails.length >
                0 ? (
                  <Table
                    striped
                    bordered
                    responsive
                    id="TableList"
                    className="no-pb text-nowrap tab-page-table"
                  >
                    <thead className="custom-bg-200">
                      <tr>
                        <th>S.No</th>
                        <th>
                          Select{' '}
                          <Form.Check type="checkbox" id="vendorListChkbox">
                            <Form.Check.Input
                              type="checkbox"
                              name="selectAll"
                              style={{ width: '15px', height: '15px' }}
                            />
                          </Form.Check>
                        </th>
                        <th>OEM Name</th>
                        <th>Product Category</th>
                        <th>Product</th>
                        <th>Variety</th>
                        <th>Brand</th>
                        <th>Type</th>
                        <th>Unit</th>
                        <th>Rate</th>
                        <th>Org/Inorg</th>
                        <th>Season</th>
                        <th>Area</th>
                        <th>Sowing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productCatalogueDetailsReducer.productCatalogueDetails.map(
                        (data, index) => (
                          <>
                          <tr>
                            <td>{index + 1}</td>
                            <td key={index}>
                              <Form.Check type="checkbox" className="mb-1">
                                <Form.Check.Input
                                  type="checkbox"
                                  name="singleChkBox"
                                  style={{ width: '20px', height: '20px' }}
                                  // onChange={() => handleCheckboxChange(data)}
                                  // checked={
                                  //   selectAll || selectedRows.includes(data)
                                  // }
                                />
                              </Form.Check>
                            </td>
                            <td>{data.oemName}</td>
                            <td>{data.productCategoryName}</td>
                            <td>{data.productName}</td>
                            <td>{data.varietyName}</td>
                            <td>{data.brandName}</td>
                            <td>{data.type}</td>
                            <td>{data.unitName}</td>
                            <td>{data.vendorRate}</td>
                            <td>{data.orgInorg}</td>
                            <td>{data.season}</td>
                            <td>{data.area}</td>
                            <td>{data.sowing}</td>
                          </tr>
                          </>
                        )
                      )}
                    </tbody>
                  </Table>
                ) : (
                  <h5>No record found</h5>
                )}
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success">Add</Button>
            <Button variant="danger" onClick={() => onCancelClick()}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Card className="h-100 mb-2">
        <FalconCardHeader
          title="Product Details"
          titleTag="h6"
          className="py-2"
          light
          endEl={
            <Flex>
              <div>
                <Button
                  variant="primary"
                  size="sm"
                  className="btn-reveal"
                  type="button"
                  onClick={() => handleAddItem()}
                >
                  Add Item
                </Button>
              </div>
            </Flex>
          }
        />

        <Card.Body className="position-relative pb-0 p3px cp-table-card">
          <Form
            noValidate
            className="details-form"
            id="AddPoProductDetailsForm"
          >
            <Table
              striped
              bordered
              responsive
              id="TableList"
              className="no-pb text-nowrap tab-page-table"
            >
              <thead className="custom-bg-200">
                <tr>
                  {columnsArray.map((column, index) => {
                    // if (column === 'Delete') {
                    //   return null;
                    // }
                    return (
                      <th className="text-left" key={index}>
                        {column}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody id="tbody" className="details-form">
                <tr>
                  <td>1</td>

                  <td>
                    <EnlargableTextbox
                      name="productCategoryName"
                      placeholder="Product Category"
                      disabled
                    />
                  </td>

                  <td>
                    <EnlargableTextbox
                      name="productName"
                      placeholder="Product"
                      disabled
                    />
                  </td>

                  <td>
                    <EnlargableTextbox
                      name="varietyName"
                      placeholder="Variety"
                      disabled
                    />
                  </td>

                  <td>
                    <EnlargableTextbox
                      name="brandName"
                      placeholder="Brand"
                      disabled
                    />
                  </td>

                  <td>
                    <Form.Select
                      type="text"
                      name="unitCode"
                      className="form-control select"
                      required
                    >
                      <option value="">Select </option>
                    </Form.Select>
                  </td>

                  <td>
                    <EnlargableTextbox
                      name="deliveredQuantity"
                      placeholder="Delivered Quantity"
                      maxLength={5}
                      required
                      onKeyPress={e => {
                        const keyCode = e.which || e.keyCode;
                        const keyValue = String.fromCharCode(keyCode);
                        const regex = /^[^A-Za-z]+$/;

                        if (!regex.test(keyValue)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </td>

                  <td>
                    <EnlargableTextbox
                      name="quantity"
                      placeholder="Quantity"
                      maxLength={5}
                      required
                      onKeyPress={e => {
                        const keyCode = e.which || e.keyCode;
                        const keyValue = String.fromCharCode(keyCode);
                        const regex = /^[^A-Za-z]+$/;

                        if (!regex.test(keyValue)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </td>

                  <td>
                    <EnlargableTextbox
                      name="rate"
                      placeholder="Rate"
                      maxLength={10}
                      required
                      onKeyPress={e => {
                        const keyCode = e.which || e.keyCode;
                        const keyValue = String.fromCharCode(keyCode);
                        const regex = /^[^A-Za-z]+$/;

                        if (!regex.test(keyValue)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </td>

                  <td>
                    <EnlargableTextbox
                      name="amt"
                      placeholder="Amount"
                      maxLength={13}
                      required
                      onKeyPress={e => {
                        const keyCode = e.which || e.keyCode;
                        const keyValue = String.fromCharCode(keyCode);
                        const regex = /^[^A-Za-z]+$/;

                        if (!regex.test(keyValue)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </td>
                  <td>
                    <EnlargableTextbox
                      name="cgstPer"
                      placeholder="CGST %"
                      maxLength={5}
                      onKeyPress={e => {
                        const keyCode = e.which || e.keyCode;
                        const keyValue = String.fromCharCode(keyCode);
                        const regex = /^[0-9.\b]+$/;
                        const value = e.target.value + keyValue;
                        if (!regex.test(value)) {
                          e.preventDefault();
                        }
                        const [integerPart, decimalPart] = value.split('.');
                        if (
                          integerPart.length > 2 ||
                          (decimalPart && decimalPart.length > 2)
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </td>
                  <td>
                    <EnlargableTextbox
                      name="cgstAmt"
                      placeholder="CGST Amount"
                      maxLength={13}
                      onKeyPress={e => {
                        const keyCode = e.which || e.keyCode;
                        const keyValue = String.fromCharCode(keyCode);
                        const regex = /^[^A-Za-z]+$/;
                        if (!regex.test(keyValue)) {
                          e.preventDefault();
                        }
                      }}
                      required
                      disabled
                    />
                  </td>
                  <td>
                    <EnlargableTextbox
                      name="sgstPer"
                      placeholder="SGST %"
                      maxLength={5}
                      onKeyPress={e => {
                        const keyCode = e.which || e.keyCode;
                        const keyValue = String.fromCharCode(keyCode);
                        const regex = /^[0-9.\b]+$/;
                        const value = e.target.value + keyValue;
                        if (!regex.test(value)) {
                          e.preventDefault();
                        }
                        const [integerPart, decimalPart] = value.split('.');
                        if (
                          integerPart.length > 2 ||
                          (decimalPart && decimalPart.length > 2)
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </td>
                  <td>
                    <EnlargableTextbox
                      name="sgstAmt"
                      placeholder="SGST Amount"
                      maxLength={13}
                      onKeyPress={e => {
                        const keyCode = e.which || e.keyCode;
                        const keyValue = String.fromCharCode(keyCode);
                        const regex = /^[^A-Za-z]+$/;
                        if (!regex.test(keyValue)) {
                          e.preventDefault();
                        }
                      }}
                      required
                      disabled
                    />
                  </td>
                  <td>
                    <EnlargableTextbox
                      name="khasra"
                      placeholder="Khasra"
                      maxLength={13}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="date"
                      name="validFrom"
                      placeholder="Select date"
                      // className="form-control col-12 col-sm-6 col-md-4"
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="date"
                      name="validFrom"
                      placeholder="Select date"
                      // className="form-control col-12 col-sm-6 col-md-4"
                    />
                  </td>
                  <td>
                    <EnlargableTextbox
                      name="productGrandAmt"
                      placeholder="Product Grand Amount"
                      maxLength={13}
                      onKeyPress={e => {
                        const keyCode = e.which || e.keyCode;
                        const keyValue = String.fromCharCode(keyCode);
                        const regex = /^[^A-Za-z]+$/;
                        if (!regex.test(keyValue)) {
                          e.preventDefault();
                        }
                      }}
                      required
                      disabled
                    />
                  </td>
                  {
                    <td>
                      <FontAwesomeIcon icon={'trash'} className="fa-2x" />
                    </td>
                  }
                </tr>
              </tbody>
            </Table>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default AddDemandDetail