import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';

const PoDetailList = () => {
  const [productModal, setProductModal] = useState(false);

  const columnsArray = [
    "S.No",
    "Product Name",
    "Unit",
    "Quantity",
    "Rate",
    "Amount",
    "Paid Amount",
    "Balance Amount",
    "View"
  ];

  const handleViewItem = () => {
    setProductModal(true);
  }

  const onCancelClick = () => {
    setProductModal(false);
  }

  return (
    <>
      <Card className="h-100 mb-2 mt-2">
        <Card.Body className="position-relative pb-0 p3px cp-table-card">
          <Form
            noValidate
            validated=""
            className="details-form"
            id="AddCropPurchaseDetails"
          >
            <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
              <thead className='custom-bg-200'>
                <tr>
                  {columnsArray.map((column, index) => {
                    if (column === 'Action') {
                      return null;
                    }
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
                      name="productName"
                      placeholder="Product Name"
                      disabled
                    />
                  </td>
                  <td key="">
                    <EnlargableTextbox
                      name="unit"
                      placeholder="Unit"
                      maxLength={13}
                      required
                      disabled
                    />
                  </td>
                  <td key="">
                    <EnlargableTextbox
                      name="quantity"
                      placeholder="Quantity"
                      disabled
                    />
                  </td>
                  <td key="">
                    <EnlargableTextbox
                      name="rate"
                      placeholder="Rate"
                      disabled
                    />
                  </td>
                  <td key="">
                    <EnlargableTextbox
                      name="amount"
                      placeholder="Amount"
                      disabled
                    />
                  </td>
                  <td key="">
                    <EnlargableTextbox
                      name="paidAmount"
                      placeholder="Paid Amount"

                    />
                  </td>
                  <td key="">
                    <EnlargableTextbox
                      name="balanceAmount"
                      placeholder="Balance Amount"
                      disabled
                    />
                  </td>
                  <td key="">
                    <Button
                      variant="primary"
                      size="sm"
                      className="btn-reveal"
                      type="button"
                      onClick={() => handleViewItem()}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Form>
        </Card.Body>
      </Card>

      {
        productModal &&
        <Modal
          show={productModal}
          onHide={() => setProductModal(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Invoice Detail</Modal.Title>
          </Modal.Header>
          <Modal.Body className="max-five-rows">
            <Form
              noValidate
              className="details-form"
            >
              <Row>
                <Table
                  style={{ paddingLeft: 0 }}
                  striped bordered responsive className="text-nowrap tab-page-table">
                  <thead className='custom-bg-200'>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        Sr. No
                      </td>
                      <td>
                        1
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Invoice No
                      </td>
                      <td>
                        123456
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Po No
                      </td>
                      <td>
                        CYY/00000000291
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Quantity
                      </td>
                      <td>
                        4
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Unit
                      </td>
                      <td>
                        km
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Amount
                      </td>
                      <td>
                        10000
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Paid Amount
                      </td>
                      <td>
                        5000
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Balance Amount
                      </td>
                      <td>
                        5000
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => onCancelClick()} >Cancel</Button>
          </Modal.Footer>
        </Modal >
      }
    </>
  )
}

export default PoDetailList