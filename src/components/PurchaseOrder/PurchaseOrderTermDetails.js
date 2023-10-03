import { formChangedAction, purchaseOrderTermDetailsAction } from 'actions';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

const PurchaseOrderTermDetails = () => {

    const dispatch = useDispatch();
    const [formHasError, setFormError] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [paramsData, setParamsData] = useState({});

    const emptyRow = {
        id: rowData.length + 1,
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
        encryptedPoNo: localStorage.getItem("EncryptedPoNo"),
        poTerms: '',
        addUser: localStorage.getItem("LoginUserName"),
        modifyUser: localStorage.getItem("LoginUserName")
    }

    let purchaseOrderTermDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderTermDetailsReducer)
    let purchaseOrderTermData = purchaseOrderTermDetailsReducer.purchaseOrderTermDetails;

    const purchaseOrderDetailsReducer = useSelector((state) => state.rootReducer.purchaseOrderDetailsReducer)
    var purchaseOrderData = purchaseOrderDetailsReducer.purchaseOrderDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const columnsArray = [
        'S.No',
        'Term',
        'Delete'
    ];

    useEffect(() => {
        if (purchaseOrderTermDetailsReducer.purchaseOrderTermDetails.length > 0) {
            setRowData(purchaseOrderTermData);
        }

        if (purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved") {
            $("#btnSave").attr('disabled', true);
        }
    }, [purchaseOrderTermData, purchaseOrderTermDetailsReducer])

    const validatePoTermDetailsForm = () => {
        let isValid = true;
        if (purchaseOrderTermData && purchaseOrderTermData.length > 0) {
            purchaseOrderTermData.forEach((row, index) => {
                if (!row.poTerms) {
                    isValid = false;
                    setFormError(true);
                }
            });
        }

        if (isValid) {
            setFormError(false);
        }

        return isValid;
    }

    const handleAddRow = async () => {
        if (validatePoTermDetailsForm()) {
            purchaseOrderTermData.unshift(emptyRow);
            dispatch(purchaseOrderTermDetailsAction(purchaseOrderTermData));
        }
    }

    const handleFieldChange = (e, index) => {
        const { name, value } = e.target;
        var poTermDetails = [...rowData];
        poTermDetails[index][name] = value;
        poTermDetails = Object.keys(rowData).map(key => {
            return rowData[key];
        })

        dispatch(purchaseOrderTermDetailsAction(poTermDetails))

        if (poTermDetails[index].encryptedPoTermId) {
            dispatch(formChangedAction({
                ...formChangedData,
                poTermDetailsUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                poTermDetailsAdd: true
            }))
        }
    }

    const ModalPreview = (encryptedPoTermId) => {
        setModalShow(true);
        setParamsData({ encryptedPoTermId });
    }

    const deletePoTermDetails = () => {
        if (!paramsData)
            return false;

        var objectIndex = purchaseOrderTermDetailsReducer.purchaseOrderTermDetails.findIndex(x => x.encryptedPoTermId == paramsData.encryptedPoTermId);
        purchaseOrderTermDetailsReducer.purchaseOrderTermDetails.splice(objectIndex, 1)

        var deletePoTermDetailId = localStorage.getItem("DeletePoTermDetailIds");

        if (paramsData.encryptedPoTermId) {
            var deletePoTermDetail = deletePoTermDetailId ? deletePoTermDetailId + "," + paramsData.encryptedPoTermId : paramsData.encryptedPoTermId;
            localStorage.setItem("DeletePoTermDetailIds", deletePoTermDetail);
        }

        toast.success("PO term details deleted successfully", {
            theme: 'colored'
        });

        dispatch(purchaseOrderTermDetailsAction(purchaseOrderTermData));

        dispatch(formChangedAction({
            ...formChangedData,
            poTermDetailsDelete: true
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
                        <h4>Are you sure, you want to delete this PO Term detail?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button variant="danger" onClick={() => deletePoTermDetails()}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            }

            <Card className="h-100 mb-2">
                <FalconCardHeader
                    title="Purchase Order Term Detail"
                    titleTag="h6"
                    className="py-2"
                    light
                    endEl={
                        <Flex>
                            {
                                purchaseOrderData.poStatus != "Approved" &&
                                <div >
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="btn-reveal"
                                        type="button"
                                        onClick={() => handleAddRow()}
                                    >
                                        <i className="fa-solid fa-plus" />
                                    </Button>
                                </div>
                            }
                        </Flex>
                    }
                />
                {
                    purchaseOrderTermData && purchaseOrderTermData.length > 0 &&
                    <Card.Body className="position-relative pb-0 p3px full-tab-card-body">
                        <Form
                            noValidate
                            validated={formHasError}
                            className="details-form"
                            id="AddPoTermDetailsForm"
                        >
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
                                    {rowData.map((poTermData, index) => (
                                        <tr key={index}>
                                            <td>
                                                {index + 1}
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    name="poTerms"
                                                    value={poTermData.poTerms}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Terms"
                                                    maxLength={45}
                                                    disabled={purchaseOrderData.encryptedPoNo && purchaseOrderData.poStatus == "Approved"}
                                                />
                                            </td>
                                            {
                                                purchaseOrderData.poStatus != "Approved" &&
                                                <td key={index}>
                                                    <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(poTermData.encryptedPoTermId) }} />
                                                </td>
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Form>
                    </Card.Body>
                }
            </Card>
        </>
    )
}

export default PurchaseOrderTermDetails;