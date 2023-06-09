import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Row, Col, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { commonContactDetailsAction, clientContactListAction, formChangedAction } from 'actions';
import { toast } from 'react-toastify';
import axios from 'axios';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const CommonContactDetailsTable = () => {
    const dispatch = useDispatch();
    const [modalShow, setModalShow] = useState(false);
    const [paramsData, setParamsData] = useState({});
    const [formHasError, setFormError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rowData, setRowData] = useState([]);

    const columnsArray = [
        'S.No',
        'Contact Person',
        'Contact Type',
        'Contact Details',
        'Send Mail',
        'Action'
    ];

    const emptyRow = {
        id: rowData.length + 1,
        encryptedCompanyCode: localStorage.getItem("EncryptedResponseCompanyCode") ? localStorage.getItem("EncryptedResponseCompanyCode") : '',
        contactPerson: '',
        contactType: '',
        contactDetails: '',
        originatedFrom: 'CM',
        flag: '0',
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        addUser: localStorage.getItem("LoginUserName"),
        modifyUser: localStorage.getItem("LoginUserName")
    };

    let commonContactDetailsReducer = useSelector((state) => state.rootReducer.commonContactDetailsReducer)
    let commonContactDetailData = commonContactDetailsReducer.commonContactDetails;

    const clientContactListReducer = useSelector((state) => state.rootReducer.clientContactListReducer)
    let clientContactListData = clientContactListReducer.clientContactList;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const companyDetailsErrorReducer = useSelector((state) => state.rootReducer.companyDetailsErrorReducer)
    const companyError = companyDetailsErrorReducer.companyDetailsError;

    useEffect(() => {
        setRowDataValue(commonContactDetailsReducer, commonContactDetailData);
    }, [commonContactDetailData, commonContactDetailsReducer]);

    const setRowDataValue = (commonContactDetailsReducer, commonContactDetailData) => {
        setRowData(commonContactDetailsReducer.commonContactDetails.length > 0 ? commonContactDetailData : []);
    };

    const validateContactDetailForm = () => {
        let isValid = true;

        if (commonContactDetailData && commonContactDetailData.length > 0) {
            const seenCombination = {};
            commonContactDetailData.forEach((row, index) => {
                if (!row.contactPerson || !row.contactDetails || !row.contactType) {
                    isValid = false;
                    setFormError(true);
                }
                else {
                    const combinationString = `${row.contactDetails},${row.contactType}`;
                    if (seenCombination[combinationString]) {
                        toast.error("Contact details can not be duplicate", {
                            theme: 'colored',
                            autoClose: 10000
                        });
                        isValid = false;
                        setFormError(true);
                    } else {
                        seenCombination[combinationString] = true;
                    }
                }
            });
        }

        if (isValid) {
            setFormError(false)
        }

        return isValid;
    }

    const handleAddRow = () => {

        let formValid = validateContactDetailForm()
        if (formValid) {
            commonContactDetailData.unshift(emptyRow);
            dispatch(commonContactDetailsAction(commonContactDetailData));
        }
    };

    const handleFieldChange = (e, index) => {
        const { name, value } = e.target;
        var commonContactDetails = [...rowData];
        commonContactDetails[index][name] = value;
        commonContactDetails = Object.keys(rowData).map(key => {
            return rowData[key];
        })

        dispatch(commonContactDetailsAction(commonContactDetails))

        if (commonContactDetails[index].encryptedCommonContactDetailsId) {
            dispatch(formChangedAction({
                ...formChangedData,
                commonContactDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                commonContactDetailAdd: true
            }))
        }
    }

    const ModalPreview = (encryptedCommonContactDetailsId, contactDetailsToDelete) => {
        setModalShow(true);
        setParamsData({ encryptedCommonContactDetailsId, contactDetailsToDelete });
    }

    const deleteFarmerContactDetails = () => {
        if (!paramsData)
            return false;

        var objectIndex = commonContactDetailsReducer.commonContactDetails.findIndex(x => x.contactDetails == paramsData.contactDetailsToDelete);
        commonContactDetailsReducer.commonContactDetails.splice(objectIndex, 1)

        if (paramsData.encryptedCommonContactDetailsId) {
            var deleteCommonContactDetailsId = localStorage.getItem("DeleteCommonContactDetailsIds");
            var deleteCommonContactDetail = deleteCommonContactDetailsId ? deleteCommonContactDetailsId + "," + paramsData.encryptedCommonContactDetailsId : paramsData.encryptedCommonContactDetailsId;
            localStorage.setItem("DeleteCommonContactDetailsIds", deleteCommonContactDetail);
        }

        toast.success("Contact details deleted successfully", {
            theme: 'colored'
        });

        dispatch(commonContactDetailsAction(commonContactDetailData));

        dispatch(formChangedAction({
            ...formChangedData,
            commonContactDetailDelete: true
        }))

        setModalShow(false);
    }

    const contactSameAsClientChanged = () => {
        const request = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
        }

        if ($('#contactListChkBox').is(":checked")) {
            if (clientContactListData.length > 0) {
                setContactDetailData(clientContactListData)
            }
            else {
                setIsLoading(true);
                axios
                    .post(process.env.REACT_APP_API_URL + '/get-client-contact-detail-list', request, {
                        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                    })
                    .then(res => {
                        setIsLoading(false);
                        if (res.data.status == 200) {
                            dispatch(clientContactListAction(res.data.data));
                            setContactDetailData(res.data.data);
                        }
                        else {
                            $("#CompanyContactDetailsTable").hide();
                        }
                    });
            }
        }
        else {
            commonContactDetailsReducer.commonContactDetails.filter(x => x.encryptedClientContactDetailsId)
                .forEach(x => commonContactDetailsReducer.commonContactDetails.splice(commonContactDetailsReducer.commonContactDetails.indexOf(x), 1));

            dispatch(commonContactDetailsAction(commonContactDetailsReducer.commonContactDetails));
        }
    }

    const setContactDetailData = (contactObj) => {
        var contactListData = [];
        for (let i = 0; i < contactObj.length; i++) {
            let contactDetailsData = {
                encryptedClientContactDetailsId: contactObj[i].encryptedClientContactDetailsId,
                encryptedClientCode: contactObj[i].encryptedClientCode,
                contactPerson: contactObj[i].contactPerson ? contactObj[i].contactPerson : '',
                contactType: contactObj[i].emailId ? 'PRE' : contactObj[i].mobileNo ? 'PMN' : '',
                contactDetails: contactObj[i].emailId ? contactObj[i].emailId : contactObj[i].mobileNo,
                originatedFrom: contactObj[i].originatedFrom ? contactObj[i].originatedFrom : 'CM',
                flag: contactObj[i].sendMail == 'Y' ? '1' : '0',
                addUser: localStorage.getItem("LoginUserName")
            };

            contactListData.push(contactDetailsData);
        }

        if (commonContactDetailsReducer.commonContactDetails.length > 0) {
            var commonContactListData = contactListData.concat(commonContactDetailsReducer.commonContactDetails)
            dispatch(commonContactDetailsAction(commonContactListData))
        }
        else
            dispatch(commonContactDetailsAction(contactListData));
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
                        <h4>Are you sure, you want to delete this contact detail?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button variant="danger" onClick={() => deleteFarmerContactDetails()}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            }

            <Card className="h-100 mb-2" id='ContactDetailsTable'>
                <FalconCardHeader
                    title="Contact Details"
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
                                    onClick={handleAddRow}
                                >
                                    <i className="fa-solid fa-plus" />
                                </Button>
                            </div>
                        </Flex>
                    }
                />
                {
                    commonContactDetailData && commonContactDetailData.length > 0 &&
                    <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">

                        <div>
                            <Row className="justify-content-between align-items-center" id="contactListChkBoxRow">
                                <Col xs="auto">
                                    <Form.Check type="checkbox" id="contactListChkBox" className="mb-1">
                                        <Form.Check.Input
                                            type="checkbox"
                                            name="Same as client"
                                            onChange={contactSameAsClientChanged}
                                        />
                                        <Form.Check.Label className="mb-0 text-700">
                                            Same as client
                                        </Form.Check.Label>
                                    </Form.Check>
                                </Col>
                            </Row>
                        </div>
                        <Form
                            noValidate
                            validated={formHasError || (companyError.contactErr.invalidContactDetail)}
                            className="details-form"
                            id="AddCommonContactDetailsForm"
                        >

                            <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                <thead className='custom-bg-200'>
                                    <tr>
                                        {columnsArray.map((column, index) => (
                                            <th className="text-left" key={index}>
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody id="tbody" className="details-form">
                                    {rowData.map((commonContactDetailData, index) => (
                                        <tr key={index}>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td key={index}>
                                                <EnlargableTextbox
                                                    id="txtContactPerson"
                                                    name="contactPerson"
                                                    maxLength={45}
                                                    value={commonContactDetailData.contactPerson}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Contact Person Name"
                                                    className="form-control"
                                                    required={true}
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtContactType"
                                                    name="contactType"
                                                    value={commonContactDetailData.contactType}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    className="form-control"
                                                    required
                                                >
                                                    <option value=''>Select Contact Type</option>
                                                    <option value="OFE">Office Email Id</option>
                                                    <option value="OFM">Office Mobile No</option>
                                                    <option value="OFL">Office Land Line No</option>
                                                    <option value="OFX">Office Ext No</option>
                                                    <option value="OFF">Office Fax No</option>
                                                    <option value="PPP">PP No</option>
                                                    <option value="PMN">Personal Mobile No</option>
                                                    <option value="PRL">Personal Land Line No</option>
                                                    <option value="PRS">Spouse Mob No</option>
                                                    <option value="PRE">Personal Mail</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <EnlargableTextbox
                                                    id="txtContactDetails"
                                                    name="contactDetails"
                                                    maxLength={30}
                                                    value={commonContactDetailData.contactDetails}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    placeholder="Contact Details"
                                                    className="form-control"
                                                    required={true}
                                                />
                                            </td>
                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    id="txtFlag"
                                                    name="flag"
                                                    value={commonContactDetailData.flag}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    className="form-control"
                                                >
                                                    {/* <option value=''>Select</option> */}
                                                    <option value="1">Yes</option>
                                                    <option value="0">No</option>
                                                </Form.Select>
                                            </td>
                                            <td>
                                                <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(commonContactDetailData.encryptedCommonContactDetailsId, commonContactDetailData.contactDetails) }} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                        </Form>
                    </Card.Body>
                }
            </Card>
        </>
    );
};

export default CommonContactDetailsTable;