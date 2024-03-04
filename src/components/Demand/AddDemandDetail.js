import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Card, Row, Col, Table } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const AddDemandDetail = () => {
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
    'Quantity',
    'Rate',
    'Amt',
    'Product Grand Amount',
    'Delete',
  ];

  const handleAddItem = () => {
    setVendorModal(true)
  }

  const onCancelClick = async () => {
    setVendorModal(false);
  }
  
  return (
    <>
      {vendorModal &&
        <Modal
          show={vendorModal}
          onHide={() => setVendorModal(false)}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Product</Modal.Title>
          </Modal.Header>
          <Modal.Body className="max-five-rows">
            <Form className="details-form" id="OemDetailsForm" >
              <Row>
                <Col className="me-3 ms-3" md="4">
                  <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                    <Form.Label column sm="2">
                      Search
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control id="txtSearch" name="search" placeholder="Search" 
                      maxLength={45} />
                    </Col>
                  </Form.Group>
                </Col>
                <Col className="me-2 ms-3" md="4">
                  <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                    <Col sm="8">
                      <Form.Select
                        type="text"
                        name="productCategoryCode"
                        className="form-control"
                      >
                        <option value=''>Select Product Category</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>
                <Col className="me-2 ms-3" md="3">
                  <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                    <Col sm="8">
                      <Form.Select
                        type="text"
                        name="productCode"
                        className="form-control"
                      >
                        <option value=''>Select Product</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>

                <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                      <thead className='custom-bg-200'>
                        <tr>
                          <th>S.No</th>
                          <th>Select <Form.Check type="checkbox" id="vendorListChkbox" >
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
                      </tbody>
                    </Table>

              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success"
            >Add</Button>
            <Button variant="danger" onClick={() => onCancelClick()}
            >Cancel</Button>
          </Modal.Footer>
        </Modal >
      }

      <Card className="h-100 mb-2">

        <FalconCardHeader
          title="Product Details"
          titleTag="h6"
          className="py-2"
          light
          endEl={
            <Flex>
                  <div >
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
            <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
              <thead className='custom-bg-200'>
                  <tr>
                    {columnsArray.map((column) => {
                      // if (column === 'Delete') {
                      //   return null;
                      // }
                      return (
                        <th className="text-left" >
                          {column}
                        </th>
                      );
                    })}
                  </tr>
              </thead>
              <tbody id="tbody" className="details-form">
                  <tr>
                    <td>
                      1
                    </td>

                    <td >
                      <EnlargableTextbox
                        name="productCategoryName"
                        placeholder="Product Category"
                        disabled
                      />
                    </td>

                    <td >
                      <EnlargableTextbox
                        name="productName"
                        placeholder="Product"
                        disabled
                      />
                    </td>

                    <td >
                      <EnlargableTextbox
                        name="varietyName"
                        placeholder="Variety"
                        disabled
                      />
                    </td>

                    <td >
                      <EnlargableTextbox
                        name="brandName"
                        placeholder="Brand"
                        disabled
                      />
                    </td>

                    <td >
                      <Form.Select
                        type="text"
                        name="unitCode"
                        className="form-control select"
                        required
                      >
                        <option value=''>Select </option>
                      </Form.Select>
                    </td>

                    <td >
                      <EnlargableTextbox
                        name="quantity"
                        placeholder="Quantity"
                        maxLength={5}
                        required
                        onKeyPress={(e) => {
                          const keyCode = e.which || e.keyCode;
                          const keyValue = String.fromCharCode(keyCode);
                          const regex = /^[^A-Za-z]+$/;

                          if (!regex.test(keyValue)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </td>

                    <td >
                      <EnlargableTextbox
                        name="rate"
                        placeholder="Rate"
                        maxLength={10}
                        required
                        onKeyPress={(e) => {
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
                          onKeyPress={(e) => {
                            const keyCode = e.which || e.keyCode;
                            const keyValue = String.fromCharCode(keyCode);
                            const regex = /^[^A-Za-z]+$/;

                            if (!regex.test(keyValue)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </td>
                    <td >
                      <EnlargableTextbox
                        name="productGrandAmt"
                        placeholder="Product Grand Amount"
                        maxLength={13}
                        onKeyPress={(e) => {
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
  )
}

export default AddDemandDetail