import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import axios from 'axios';
import { toast } from 'react-toastify';
import { purchaseOrderProductDetailsAction, vendorInvoiceEntryDetailsAction, formChangedAction } from 'actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddVendorInvoiceDetail = () => {
  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});
  const [rowData, setRowData] = useState([]);
  const [poModal, setPoModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [formHasError, setFormError] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const dispatch = useDispatch();

  const columnsArray = [
    'S.No',
    'Product Line',
    'Product Category',
    'Product',
    'Po. Qty',
    'Po. Rate',
    'Qty',
    'Rate',
    'Product Amount',
    'Delete',
  ];

  const emptyRow = {
    id: rowData.length + 1,
    encryptedInvoiceHeaderCode: localStorage.getItem("encryptedInvoiceHeaderCode"),
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
    productLineCode: '',
    productCategoryCode: '',
    invoiceRate: '',
    productAmount: '',
    qty: '',
    itemDescription: '',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName"),
  }

  const vendorInvoiceEntryHeaderDetailsReducer = useSelector((state) => state.rootReducer.vendorInvoiceEntryHeaderDetailsReducer)
  var vendorInvoiceEntryHeaderDetails = vendorInvoiceEntryHeaderDetailsReducer.vendorInvoiceEntryHeaderDetails;

  let purchaseOrderProductDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderProductDetailsReducer)
  let purchaseOrderProductDetailsList = purchaseOrderProductDetailsReducer.purchaseOrderProductDetails;

  const vendorInvoiceEntryDetailsReducer = useSelector((state) => state.rootReducer.vendorInvoiceEntryDetailsReducer)
  var vendorInvoiceEntryDetails = vendorInvoiceEntryDetailsReducer.vendorInvoiceEntryDetails;

  const vendorInvoiceEntryErrorReducer = useSelector((state) => state.rootReducer.vendorInvoiceEntryErrorReducer)
  const vendorInvoiceEntryErr = vendorInvoiceEntryErrorReducer.vendorInvoiceEntryError;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

  useEffect(() => {
    if (vendorInvoiceEntryDetailsReducer.vendorInvoiceEntryDetails.length > 0) {
      setRowData(vendorInvoiceEntryDetails);
      setSelectedRows([]);
    } else {
      setRowData([]);
      setSelectedRows([]);
    }

  }, [vendorInvoiceEntryDetailsReducer, vendorInvoiceEntryDetails])

  const validateVendorInvoiceEntryDetailForm = () => {
    let isValid = true;

    if (vendorInvoiceEntryDetails && vendorInvoiceEntryDetails.length > 0) {
      vendorInvoiceEntryDetails.forEach((row, index) => {
        if (!row.productLineCode || !row.productCategoryCode || !row.productCode || !row.quantity || !row.poRate) {
          isValid = false;
          setFormError(true);
        }
        else if (!row.poDetailId) {
          if (!row.rate || !row.amount) {
            isValid = false;
            setFormError(true);
          }
        }
      });
    }

    if (isValid) {
      setFormError(false);
    }

    return isValid;
  }

  const handleAddItem = () => {
    if (vendorInvoiceEntryHeaderDetails.poNo) {
      setPoModal(true);
      getPoDetailList();
    }
    else {
      if (validateVendorInvoiceEntryDetailForm()) {
        vendorInvoiceEntryDetails.unshift(emptyRow);
        dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntryDetails));
      }
    }
  }

  const handleHeaderCheckboxChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows([]);
    }
  };

  const onCancelClick = () => {
    setPoModal(false);
  }

  const handleSelectedItem = () => {
    if (selectAll) {
      const updatedData = [...purchaseOrderProductDetailsList]
      dispatch(vendorInvoiceEntryDetailsAction(updatedData));
    } else {
      const updatedData = [...selectedRows, ...vendorInvoiceEntryDetails];
      dispatch(vendorInvoiceEntryDetailsAction(updatedData));
    }
    setPoModal(false);
    setSelectAll(false);
  }



  const handleCheckboxChange = (rowData) => {
    if (selectedRows.includes(rowData)) {
      setSelectedRows(selectedRows.filter(row => row !== rowData));
    } else {
      setSelectedRows([...selectedRows, rowData]);
    }
  };

  const getPoDetailList = async () => {
    const request = {
      PoNo: vendorInvoiceEntryHeaderDetails.poNo
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-po-detail-list', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })

    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        dispatch(purchaseOrderProductDetailsAction(response.data.data))
      }
    }
    else {
      dispatch(purchaseOrderProductDetailsAction([]))
    }
  }

  const handleFieldChange = async (e, index) => {
    const { name, value } = e.target;
    var vendorInvoiceEntry = [...rowData];
    vendorInvoiceEntry[index] = {
      ...vendorInvoiceEntry[index],
      [name]: value
    };
    dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry));

    // if (e.target.name == "invoiceQty") {
    //   if (vendorInvoiceEntry[index].invoiceQty) {
    //     var totalAmount = parseFloat(e.target.value) * parseFloat(vendorInvoiceEntry[index].rate)
    //     vendorInvoiceEntry[index].productAmount = totalAmount.toString();
    //     dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntry))
    //   }
    // }

  //   if(e.target.name == "invoiceRate"){
  //     if (vendorInvoiceEntry[index].invoiceQty){

  //     }else if(vendorInvoiceEntry[index].productAmount)
  //   }

  }

  const ModalPreview = (encryptedInvoiceHeaderCode) => {
    setModalShow(true);
    setParamsData({ encryptedInvoiceHeaderCode });
}

const deleteMaterialReceiptDetail = () => {
  if (!paramsData)
      return false;

  var objectIndex = vendorInvoiceEntryDetailsReducer.vendorInvoiceEntryDetails.findIndex(x => x.encryptedMaterialReceiptDetailId == paramsData.encryptedMaterialReceiptDetailId);
  vendorInvoiceEntryDetailsReducer.vendorInvoiceEntryDetails.splice(objectIndex, 1);

  var deleteInvoiceHeaderCode = localStorage.getItem("DeleteInvoiceHeaderCodes");

  if (paramsData.encryptedInvoiceHeaderCode) {
      var deleteInvoiceEntryDetails = deleteInvoiceHeaderCode ? deleteInvoiceHeaderCode + "," + paramsData.encryptedMaterialReceiptDetailId : paramsData.encryptedMaterialReceiptDetailId;
      localStorage.setItem("DeleteInvoiceHeaderCodes", deleteInvoiceEntryDetails);
  }

  toast.success("Vendor invoice entry detail deleted successfully", {
      theme: 'colored'
  });

  dispatch(vendorInvoiceEntryDetailsAction(vendorInvoiceEntryDetails))

  dispatch(formChangedAction({
      ...formChangedData,
      vendorInvoiceEntryDetailsDelete: true
  }));

  setModalShow(false);
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
            <Button variant="danger"  onClick={() => deleteMaterialReceiptDetail()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }
      {
        poModal &&
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
                {
                  purchaseOrderProductDetailsReducer && purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.length > 0 ?
                    <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                      <thead className='custom-bg-200'>
                        <tr>
                          <th>S.No</th>
                          <th>Select <Form.Check type="checkbox" id="vendorListChkbox" >
                            <Form.Check.Input
                              type="checkbox"
                              name="selectAll"
                              style={{ width: '15px', height: '15px' }}
                              onChange={handleHeaderCheckboxChange}
                              checked={selectAll}
                            />
                          </Form.Check>
                          </th>
                          <th>Product Category</th>
                          <th>Product</th>
                          <th>Variety</th>
                          <th>Brand</th>
                          <th>Unit</th>
                          <th>Quantity</th>
                          <th>Rate</th>
                          <th>Tax Basis</th>
                          <th>Tax Rate</th>
                          <th>Tax Amount</th>
                          <th>Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          purchaseOrderProductDetailsReducer.purchaseOrderProductDetails.map((data, index) =>
                            <tr>
                              <td>{index + 1}</td>
                              <td key={index}>
                                <Form.Check type="checkbox" className="mb-1">
                                  <Form.Check.Input
                                    type="checkbox"
                                    name="singleChkBox"
                                    style={{ width: '20px', height: '20px' }}
                                    onChange={() => handleCheckboxChange(data)}
                                    checked={selectAll || selectedRows.includes(data)}
                                  />
                                </Form.Check>
                              </td>
                              <td>{data.productCategoryName}</td>
                              <td>{data.productName}</td>
                              <td>{data.varietyName}</td>
                              <td>{data.brandName}</td>
                              <td>{data.unitName}</td>
                              <td>{data.quantity}</td>
                              <td>{data.poRate}</td>
                              <td>{data.taxBasis}</td>
                              <td>{data.taxRate}</td>
                              <td>{data.taxAmount}</td>
                              <td>{data.poAmt}</td>
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
          <Modal.Footer>
            <Button variant="success" onClick={() => handleSelectedItem()}  >Add</Button>
            <Button variant="danger" onClick={() => onCancelClick()} >Cancel</Button>
          </Modal.Footer>
        </Modal >
      }

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

        {
          vendorInvoiceEntryDetails && vendorInvoiceEntryDetails.length > 0 &&
          <Card.Body className="position-relative pb-0 p3px mr-table-card">
            <Form
              noValidate
              validated={formHasError || (vendorInvoiceEntryErr.vendorInvoiceEntryDetailErr && vendorInvoiceEntryErr.vendorInvoiceEntryDetailErr.invalidVendorInvoiceEntryDetail)}
              className="details-form"
              id="AddMaterialReceipteDetailsForm"
            >
              <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                <thead className='custom-bg-200'><tr>
                  {columnsArray.map((column, index) => {
                    if (!vendorInvoiceEntryHeaderDetails.poNo && (column == "Product Line")) {
                      return null;
                    }
                    if (!vendorInvoiceEntryHeaderDetails.poNo && (column == "Product Category")) {
                      return null;
                    }
                    if (!vendorInvoiceEntryHeaderDetails.poNo && (column == "Po. Qty")) {
                      return null;
                    }
                    if (!vendorInvoiceEntryHeaderDetails.poNo && (column == "Po. Rate")) {
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
                  {rowData.map((vendorInvoiceEntryDetails, index) => (
                    vendorInvoiceEntryHeaderDetails.poNo ?
                      <tr key={index}>
                        <td>
                          {index + 1}
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="productLine"
                            placeholder="Product Line"
                            value={vendorInvoiceEntryDetails.productLineName}
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="productCategoryName"
                            placeholder="Product Category"
                            value={vendorInvoiceEntryDetails.productCategoryName}
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="itemDescription"
                            placeholder="Product"
                            value={vendorInvoiceEntryDetails.itemDescription}
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="poQty"
                            placeholder="Po. Qty"
                            value={vendorInvoiceEntryDetails.quantity}
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="poRate"
                            placeholder="Po. Rate"
                            value={vendorInvoiceEntryDetails.poRate}
                            disabled
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="invoiceQty"
                            placeholder="Qty"
                            maxLength={5}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.invoiceQty}
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
                        <td key={index}>
                          <EnlargableTextbox
                            name="invoiceRate"
                            placeholder="Rate"
                            onChange={(e) => handleFieldChange(e, index)}
                            maxLength={5}
                            value={vendorInvoiceEntryDetails.invoiceRate}
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
                        <td key={index}>
                          <EnlargableTextbox
                            name="productAmount"
                            placeholder="Product Amount"
                            maxLength={5}
                            onChange={(e) => handleFieldChange(e, index)}
                            value={vendorInvoiceEntryDetails.productAmount}
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
                        <td key={index}>
                          <FontAwesomeIcon icon={'trash'} className="fa-2x"  onClick={() => { ModalPreview(vendorInvoiceEntryDetails.encryptedInvoiceHeaderCode) }} />
                        </td>
                      </tr>
                      :
                      <tr key={index}>
                        <td>
                          {index + 1}
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="itemDescription"
                            placeholder="Product Name"
                            value={vendorInvoiceEntryDetails.itemDescription}
                            onChange={(e) => handleFieldChange(e, index)}
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="invoiceQty"
                            placeholder="Qty"
                            maxLength={5}
                            value={vendorInvoiceEntryDetails.invoiceQty}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;

                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => handleFieldChange(e, index)}
                            required
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="invoiceRate"
                            placeholder="Rate"
                            maxLength={5}
                            value={vendorInvoiceEntryDetails.invoiceRate}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;

                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => handleFieldChange(e, index)}
                            required
                          />
                        </td>
                        <td key={index}>
                          <EnlargableTextbox
                            name="productAmount"
                            placeholder="Product Amount"
                            maxLength={5}
                            value={vendorInvoiceEntryDetails.productAmount}
                            onKeyPress={(e) => {
                              const keyCode = e.which || e.keyCode;
                              const keyValue = String.fromCharCode(keyCode);
                              const regex = /^[^A-Za-z]+$/;

                              if (!regex.test(keyValue)) {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => handleFieldChange(e, index)}
                            required
                          />
                        </td>
                        <td key={index}>
                          <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(vendorInvoiceEntryDetails.encryptedInvoiceHeaderCode) }} />
                        </td>
                      </tr>

                  ))}
                </tbody>
              </Table>
            </Form>
          </Card.Body>}
      </Card>
    </>
  )
}

export default AddVendorInvoiceDetail