import React, { useState, useEffect } from 'react'
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Spinner, Modal, Button } from 'react-bootstrap';

const tabArray = ['Client Users List', 'Add Client User'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'companyName', Header: 'Company Name' },
    { accessor: 'loginName', Header: 'User Name' },
    { accessor: 'loginUserName', Header: 'Login User Id'},
    { accessor: 'loginUserEmailId', Header: 'Email Id' },
    { accessor: 'loginUserMobileNumber', Header: 'Mobile Number' },
    { accessor: 'lastLoginDate', Header: 'Last Login Date' },
    { accessor: 'status', Header: 'Active Status ' }
];

export const ClientUsers = () => {

    const [listData, setListData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add Client User"]').attr('disabled', true);
    }, []);

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let isFormChanged = Object.values(formChangedData).some(value => value === true);

    const [activeTabName, setActiveTabName] = useState();


    $('[data-rr-ui-event-key*="Add Client User"]').off('click').on('click', function () {
        setActiveTabName("Add Client User")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
        $('[data-rr-ui-event-key*="Add Client User"]').attr('disabled', false);
    })

    const newDetails = () => {
        $('[data-rr-ui-event-key*="Add Client User"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add Client User"]').trigger('click');
        $('#btnSave').attr('disabled', false);
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if (isFormChanged) {
            setModalShow(true);
        }
        else {
            $('[data-rr-ui-event-key*="Client Users"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true);
        }
        else {
            window.location.href = '/dashboard';
        }
    }

    const discardChanges = () => {
        $('#btnDiscard').attr('isDiscard', 'true');
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else
            $('[data-rr-ui-event-key*="Client Users List"]').trigger('click');

        setModalShow(false);
    }

    $('[data-rr-ui-event-key*="Client Users List"]').off('click').on('click', function () {
        let isDiscard = $('#btnDiscard').attr('isDiscard');
        if (isDiscard != 'true' && isFormChanged) {
            setModalShow(true);
            setTimeout(function () {
                $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
            }, 50);
        } else {
            $("#btnNew").show();
            $("#btnSave").hide();
            $("#btnCancel").hide();
            $('[data-rr-ui-event-key*="Add Client User"]').attr('disabled', true);
            $('#UserDetailsForm').get(0).reset();
            localStorage.removeItem("EncryptedResponseSecurityUserId");
            $("#btnDiscard").attr("isDiscard", false)
        }
    })

    return (
        <>
            {isLoading ? (
                <Spinner
                    className="position-absolute start-50 loader-color"
                    animation="border"
                />
            ) : null}

            {/* {modalShow &&
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
                        <h4>Do you want to save changes?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" >Save</Button>
                        <Button variant="danger" id='btnDiscard' onClick={discardChanges}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            } */}

            <TabPage
                listData={listData}
                tabArray={tabArray}
                listColumnArray={listColumnArray}
                module="ClientUsers"
                newDetails={newDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
            />
        </>
    )
}

export default ClientUsers;