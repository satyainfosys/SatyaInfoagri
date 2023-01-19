import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { userDetailsAction, clientDataAction } from '../../actions/index';
import { toast } from 'react-toastify';


export const UserDetails = () => {

    const [formHasError, setFormError] = useState(false);
    const [clientList, setClientList] = useState([]);
    const dispatch = useDispatch();

    const resetUserDetail = () => {
        dispatch(userDetailsAction({
            "encryptedClientCode": "",
            "loginUserName": "",
            "loginUserEmailId": "",
            "loginUserMobileNumber": "",
            "status": "Active"
        }))
    }

    const userDetailsReducer = useSelector((state) => state.rootReducer.userDetailsReducer)
    var userData = userDetailsReducer.userDetails;

    if (!userDetailsReducer.userDetails ||
        userDetailsReducer.userDetails.length <= 0) {
        resetUserDetail();
    }

    const userDetailsErrorReducer = useSelector((state) => state.rootReducer.userDetailsErrorReducer)
    const userError = userDetailsErrorReducer.userDetailsError;

    const clientDataReducer = useSelector((state) => state.rootReducer.clientDataReducer)
    var clientUserData = clientDataReducer.clientData;

    const getClientList = async () => {
        axios
            .get(process.env.REACT_APP_API_URL + '/get-client-list', {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
            .then(res => {
                if (res.data.status == 200) {
                    let clientListData = [];
                    if (res.data && res.data.data.length > 0) {

                        res.data.data.forEach(client => {
                            clientListData.push({
                                key: client.customerName,
                                value: client.encryptedClientCode
                            });
                        });
                        setClientList(clientListData);
                        dispatch(clientDataAction(res.data.data))
                    }
                } else {
                    toast.error(res.data.message, {
                        theme: 'colored',
                        autoClose: 10000
                    })
                }
            });
    }

    useEffect(() => {
        getClientList();
    }, []);

    if (userData.clientName && !$('#txtClient').val()) {
        $('#txtClient option:contains(' + userData.clientName + ')').prop('selected', true);
    }

    const handleFieldChange = e => {
        const newTransactions = clientUserData.find(x => x.customerName == $('#txtClient option:selected').text());

        if (newTransactions.noOfCreatedUser > 0) {
            toast.error("You have reached the user limit", {
                theme: 'colored',
                autoClose: 5000
            })
            dispatch(userDetailsAction(undefined))
            $("#UserDetailsForm").data("changed", false);
            $('#UserDetailsForm').get(0).reset();
        } else {
            if (e.target.name == 'encryptedClientCode') {
                dispatch(userDetailsAction({
                    ...userData,
                    encryptedClientCode: newTransactions.encryptedClientCode,
                    loginUserEmailId: newTransactions.emailId,
                    loginUserMobileNumber: newTransactions.mobileNo,
                    noOfUser: newTransactions.noOfCreatedUser
                }))

                $('#txtCountry').val(newTransactions.country)
                $('#txtState').val(newTransactions.state)
            }
            else {
                dispatch(userDetailsAction({
                    ...userData,
                    [e.target.name]: e.target.value
                }));
            }
        }
    };


    return (
        <>
            {userData &&

                <Form noValidate validated={formHasError} className="details-form" id='UserDetailsForm'>
                    <Row>
                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Client<span className="text-danger">*</span></Form.Label>
                                <Form.Select id="txtClient" name="encryptedClientCode" onChange={handleFieldChange} required>
                                    <option value=''>Select Client</option>
                                    {clientList.map((option, index) => (
                                        <option key={index} value={option.value}>{option.key}</option>
                                    ))}
                                </Form.Select>
                                {Object.keys(userError.clientErr).map((key) => {
                                    return <span className="error-message">{userError.clientErr[key]}</span>
                                })}
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Country</Form.Label>
                                <Form.Control id="txtCountry" name="country" readOnly />
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>State</Form.Label>
                                <Form.Control id="txtState" name="state" readOnly />
                            </Row>
                        </Col>
                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control id="txtEmail" name="loginUserEmailId" maxLength={50} value={userData.loginUserEmailId} onChange={handleFieldChange} className="mb-1" placeholder="Enter email" readOnly />
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control id="txtMobile" name="loginUserMobileNumber" maxLength={10} value={userData.loginUserMobileNumber} onChange={handleFieldChange} className="mb-1" placeholder="Enter mobile number" readOnly />
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Username<span className="text-danger">*</span></Form.Label>
                                <Form.Control id="txtUserName" name="loginUserName" maxLength={20} value={userData.loginUserName} onChange={handleFieldChange} placeholder="Enter Username" required />
                                {Object.keys(userError.loginUserNameErr).map((key) => {
                                    return <span className="error-message">{userError.loginUserNameErr[key]}</span>
                                })}
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select id="txtStatus" name="status" value={userData.status} onChange={handleFieldChange}>
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                </Form.Select>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            }
        </>
    )
}

export default UserDetails;