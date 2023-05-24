import { farmerDetailsAction, farmerDocumentDetailsAction, formChangedAction } from 'actions';
import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import EnlargableTextbox from 'components/common/EnlargableTextbox';

export const FarmersDocumentDetails = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});
  const [fileErrorMessage, setFileErrorMessage] = useState(false);

  const columnsArray = [
    'S.No',
    'ID Type',
    'ID Proof No',
    'Upload Document',
    'Action'
  ]

  const emptyRow = {
    id: rowData.length + 1,
    encryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode") ? localStorage.getItem("EncryptedFarmerCode") : '',
    encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode") ? localStorage.getItem("EncryptedCompanyCode") : '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    documentType: '',
    documentNo: '',
    farmerDocument: '',
    activeStatus: 'Active',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }

  let farmerDocumentDetailsReducer = useSelector((state) => state.rootReducer.farmerDocumentDetailsReducer)
  let farmerDocumentDetailsData = farmerDocumentDetailsReducer.farmerDocumentDetails;

  const farmerDetailsReducer = useSelector((state) => state.rootReducer.farmerDetailsReducer)
  const farmerData = farmerDetailsReducer.farmerDetails;

  const farmerDetailsErrorReducer = useSelector((state) => state.rootReducer.farmerDetailsErrorReducer)
  const farmerError = farmerDetailsErrorReducer.farmerDetailsError;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  useEffect(() => {
    setRowDataValue(farmerDocumentDetailsReducer, farmerDocumentDetailsData);
  }, [farmerDocumentDetailsData, farmerDocumentDetailsReducer]);

  const setRowDataValue = (farmerDocumentDetailsReducer, farmerDocumentDetailsData) => {
    setRowData(farmerDocumentDetailsReducer.farmerDocumentDetails.length > 0 ? farmerDocumentDetailsData : []);
  };

  const handleFieldChange = (e, index) => {
    const { name, value, files } = e.target;
    var farmerDocumentDetails = [...rowData];

    if (name === 'farmerDocument') {
      if (files[0]) {
        farmerDocumentDetails[index][name] = files[0];
        const documentURL = URL.createObjectURL(files[0])
        farmerDocumentDetails[index].documentURL = documentURL;

        if (farmerDocumentDetails[index].documentType == "Farmer Photo") {
          dispatch(farmerDetailsAction({
            ...farmerData,
            profilePhotoURL: documentURL
          }))
        }
      } else {
        farmerDocumentDetails[index].documentURL = '';
        farmerDocumentDetails[index].farmerDocument = null;
      }
    } else {
      farmerDocumentDetails[index][name] = value;
    }

    farmerDocumentDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerDocumentDetailsAction(farmerDocumentDetails))

    if (farmerDocumentDetails[index].encryptedFarmerDocumentId) {
      dispatch(formChangedAction({
        ...formChangedData,
        documentDetailUpdate: true
      }))
    } else {
      dispatch(formChangedAction({
        ...formChangedData,
        documentDetailAdd: true
      }))
    }

  }

  const validateFarmerDocumentDetailsForm = () => {
    let isValid = true;

    if (farmerDocumentDetailsData && farmerDocumentDetailsData.length > 0) {
      farmerDocumentDetailsData.forEach((row, index) => {
        if (!row.documentType) {
          isValid = false;
          setFormError(true);
        }

        if ((!row.farmerDocument && !row.documentURL)) {
          isValid = false;
          setFileErrorMessage(true)
        }

        if (row.farmerDocument && row.farmerDocument.type) {
          var fileType = ['image/jpeg', 'image/jpg', 'image/bmp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
          if (!fileType.includes(row.farmerDocument.type)) {
            isValid = false;
            toast.error("Selected file type is invalid, file type accepted are .pdf, .doc, .docx, .jpeg, .jpg", {
              theme: 'colored',
              autoClose: 5000
            })
          }

          if (row.farmerDocument.size > 1024 * 500) {
            isValid = false;
            toast.error("File size must be under 500 KB", {
              theme: 'colored',
              autoClose: 5000
            })
          }
        }
      })
    }

    if (isValid) {
      setFileErrorMessage(false)
      setFormError(false);
    }

    return isValid;
  }

  const handleAddRow = async () => {
    if (validateFarmerDocumentDetailsForm()) {
      farmerDocumentDetailsData.push(emptyRow);
      dispatch(farmerDocumentDetailsAction(farmerDocumentDetailsData));
    }
  };

  const ModalPreview = (encryptedFarmerDocumentId) => {
    setModalShow(true);
    setParamsData({ encryptedFarmerDocumentId });
  }

  const deleteFarmerDocumentDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = farmerDocumentDetailsReducer.farmerDocumentDetails.findIndex(x => x.encryptedFarmerDocumentId == paramsData.encryptedFarmerDocumentId);
    farmerDocumentDetailsReducer.farmerDocumentDetails.splice(objectIndex, 1)

    var deleteFarmerDocumentDetailsId = localStorage.getItem("DeleteFarmerDocumentIds");

    if (paramsData.encryptedFarmerDocumentId) {
      var deleteFarmerDocumentDetail = deleteFarmerDocumentDetailsId ? deleteFarmerDocumentDetailsId + "," + paramsData.encryptedFarmerDocumentId : paramsData.encryptedFarmerDocumentId;
      localStorage.setItem("DeleteFarmerDocumentIds", deleteFarmerDocumentDetail);
    }

    toast.success("Document details deleted successfully", {
      theme: 'colored'
    });

    dispatch(farmerDocumentDetailsAction(farmerDocumentDetailsData));

    dispatch(formChangedAction({
      ...formChangedData,
      documentDetailDelete: true
    }))

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
            <h4>Are you sure, you want to delete this document detail?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteFarmerDocumentDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal >
      }
      {
        (fileErrorMessage || (farmerError.documentDetailErr && farmerError.documentDetailErr.empty)) &&
        (
          <div className='mb-2'>
            <span className="error-message">Please upload the document first</span>
          </div>
        )
      }
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          id="btnAddFarmersDocumentTable"
          className="mb-2"
          onClick={handleAddRow}
        >
          Add Document Details
        </Button>
      </div>

      <Form
        noValidate
        validated={formHasError || (farmerError.documentDetailErr && farmerError.documentDetailErr.invalidDocumentDetail)}
        className="details-form"
        id="AddFarmersDocumentTableDetailsForm"
      >
        {
          farmerDocumentDetailsData && farmerDocumentDetailsData.length > 0 &&
          <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
            <thead className='custom-bg-200'>
              {rowData && <tr>
                {columnsArray.map((column, index) => (
                  <th className="text-left" key={index}>
                    {column}
                  </th>
                ))}
              </tr>}
            </thead>
            <tbody id="tbody" className="details-form">
              {rowData.map((farmerDocumentDetailsData, index) => (
                <tr key={index}>
                  <td>
                    {index + 1}
                  </td>
                  <td key={index}>
                    <Form.Select
                      type="text"
                      id="txtDocumentType"
                      name="documentType"
                      value={farmerDocumentDetailsData.documentType}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Document Type"
                      className="form-control"
                      required
                    >
                      <option value=''>Select</option>
                      <option value='Driving License'>Driving License</option>
                      <option value='Farmer Photo'>Farmer Photo</option>
                      <option value='Land Document'>Land Document</option>
                      <option value='PAN Card'>PAN Card</option>
                      <option value='Ration Card'>Ration Card</option>
                      <option value='Registration Form'>Registration Form</option>
                      <option value='Voter ID'>Voter ID</option>
                      <option value='Others'>Others</option>
                    </Form.Select>
                  </td>

                  <td key={index}>
                    <EnlargableTextbox
                      id="txtDocumentNo"
                      name="documentNo"
                      value={farmerDocumentDetailsData.documentNo}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Document No"
                      className="form-control"
                      maxLength={30}
                    />
                  </td>

                  <td key={index}>
                    {
                      farmerDocumentDetailsData.documentURL ?
                        <InputGroup>
                          <Button onClick={() => { document.getElementById(`documentFile_${index}`).click(); }}>Change</Button>
                          {farmerDocumentDetailsData && farmerDocumentDetailsData.documentURL ? (
                            <InputGroup.Text>
                              <a
                                href={farmerDocumentDetailsData.documentURL}
                                target="_blank"
                              >
                                <i className="fa-solid fa-eye" />
                              </a>
                            </InputGroup.Text>
                          ) : null
                          }
                        </InputGroup>
                        :
                        <Button onClick={() => { document.getElementById(`documentFile_${index}`).click(); }}>Upload</Button>
                    }
                    <Form.Control
                      type="file"
                      id={'documentFile_' + index}
                      name='farmerDocument'
                      onChange={(e) => handleFieldChange(e, index)}
                      className="form-control"
                      accept='.jpg,.jpeg,.bmp,.doc,.docx,application/pdf'
                      hidden
                    />
                  </td>

                  <td>
                    <i className="fa fa-trash fa-2x" onClick={() => { ModalPreview(farmerDocumentDetailsData.encryptedFarmerDocumentId) }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
      </Form>
    </>
  );
};

export default FarmersDocumentDetails;
