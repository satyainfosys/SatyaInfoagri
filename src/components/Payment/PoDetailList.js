import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import axios from 'axios';

const PoDetailList = () => {
  const [productModal, setProductModal] = useState(false);

  const handleAddItem = () => {
    setProductModal(true);
  }

  return (
    <>
      <Card className="h-100">
        <FalconCardHeader
          title="PO Details"
          titleTag="h6"
          className="py-2"
          light
          endEl={
            <Flex>
              <div >
                <div >
                  <Button
                    variant="primary"
                    size="sm"
                    className="btn-reveal"
                    type="button"
                    onClick={() => handleAddItem()}
                  >
                    Get PO
                  </Button>
                </div>
              </div>
            </Flex>
          }
        />
      </Card>

      {
        productModal &&
        <Modal
          show={productModal}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Product Line</Modal.Title>
          </Modal.Header>
          <Modal.Body className="max-five-rows">
            <Form className="details-form" id="OemDetailsForm" >
              <Row>
                <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                  <thead className='custom-bg-200'>
                    <tr>
                      <th>S.No</th>
                      <th>Select
                        <Form.Check type="checkbox" id="vendorListChkbox" >
                          <Form.Check.Input
                            type="checkbox"
                            name="selectAll"
                            style={{ width: '15px', height: '15px' }}
                          />
                        </Form.Check>
                      </th>
                      <th>PO No.</th>
                      <th>PO Date</th>
                      <th>PO Amount</th>
                      <th>Vendor Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      <tr>
                        <td>1</td>
                      </tr>
                    }
                  </tbody>
                </Table>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success">Add</Button>
            <Button variant="danger">Cancel</Button>
          </Modal.Footer>
        </Modal >
      }
    </>
  )
}

export default PoDetailList