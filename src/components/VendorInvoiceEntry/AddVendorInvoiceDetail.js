import React, { useState } from 'react';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddVendorInvoiceDetail = () => {
  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});
  const [poModal, setPoModal] = useState(false);

  const columnsArray = [
    'S.No',
    'Product Line',
    'Product Category',
    'Product',
    'Product Amount',
    'Delete',
  ];

  const handleAddItem = () => {
    setPoModal(true);
  }

  return (
    <>
      {modalShow && paramsData &&
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Are you sure, you want to delete this Material detail?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick="">Delete</Button>
          </Modal.Footer>
        </Modal>
      }

      <Modal
        show={poModal}
        onHide={() => setPoModal(false)}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">PO Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-five-rows">
          <Form className="details-form" id="OemDetailsForm" >
            <Row>
              <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                <thead className='custom-bg-200'>
                  <tr>
                    <th>S.No</th>
                    <th>Select <Form.Check type="checkbox" id="vendorListChkbox" >
                      <Form.Check.Input
                        type="checkbox"
                        name="selectAll"
                        style={{ width: '15px', height: '15px' }}
                        onChange=""
                        checked=""
                      />
                    </Form.Check>
                    </th>
                    <th>Product Line</th>
                    <th>Product Category</th>
                    <th>Product</th>
                    <th>Product Amount</th>
                  </tr>
                </thead>
                {/* <tbody>
                  <tr>
                    <td></td>
                  </tr>
                </tbody> */}
              </Table>
             
              <h5>No record found</h5>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick="" >Add</Button>
          <Button variant="danger" onClick="" >Cancel</Button>
        </Modal.Footer>
      </Modal >

      <Card className="h-100 mb-2">
        <FalconCardHeader
          title="Vendor Invoice Entry Details"
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
                  Add Items
                </Button>
              </div>
            </Flex>
          }
        />
        <Card.Body className="position-relative pb-0 p3px mr-table-card">
          <Form
            noValidate
            validated=""
            className="details-form"
            id="AddMaterialReceipteDetailsForm"
          >
            <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
              <thead className='custom-bg-200'><tr>
                {columnsArray.map((column, index) => {
                  return (
                    <th className="text-left" key={index}>
                      {column}
                    </th>
                  );
                })}
              </tr>
              </thead>
              <tbody id="tbody" className="details-form">
                <tr key="">
                  <td>
                  1
                  </td>
                  <td key="">
                    <EnlargableTextbox
                      name="productLine"
                      placeholder="Product Line"
                      value=""
                      disabled
                    />
                  </td>
                  <td key="">
                    <EnlargableTextbox
                      name="productCategoryName"
                      placeholder="Product Category"
                      value=""
                      disabled
                    />
                  </td>
                  <td key="">
                    <EnlargableTextbox
                      name="productName"
                      placeholder="Product"
                      value=""
                      disabled
                    />
                  </td>
                  <td key="">
                    <EnlargableTextbox
                      name="productAmount"
                      placeholder="Product Amount"
                      maxLength={5}
                      value=""
                      onKeyPress={(e) => {
                        const keyCode = e.which || e.keyCode;
                        const keyValue = String.fromCharCode(keyCode);
                        const regex = /^[^A-Za-z]+$/;

                        if (!regex.test(keyValue)) {
                          e.preventDefault();
                        }
                      }}
                      required
                    />
                  </td>
                  <td key="">
                    <FontAwesomeIcon icon={'trash'} className="fa-2x" />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default AddVendorInvoiceDetail