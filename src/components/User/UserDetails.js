import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { userDetailsAction, clientDataAction, formChangedAction, selectedProductsAction } from '../../actions/index';
import { toast } from 'react-toastify';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import Treeview from 'components/common/Treeview';
import FalconComponentCard from 'components/common/FalconComponentCard';
import FalconCardBody from 'components/common/FalconCardBody';

export const UserDetails = () => {

    const [formHasError, setFormError] = useState(false);
    const [clientList, setClientList] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const dispatch = useDispatch();
    const [treeViewItems, setTreeViewItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMenuTree = async () => {
        let token = localStorage.getItem('Token');

        const encryptedModuleCode = {
            encryptedModuleCode: localStorage.getItem("EncryptedResponseModuleCode") ? localStorage.getItem("EncryptedResponseModuleCode") : ''
        }

        setIsLoading(true);
        await axios
            .post(process.env.REACT_APP_API_URL + '/get-security-menu-tree-master-list', encryptedModuleCode, {
                headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
            })
            .then(res => {
                setIsLoading(false);
                if (res.data.status == 200) {
                    setTreeViewItems(res.data.data);
                }
            });
    };

    useEffect(() => {
        getClientList();
        fetchMenuTree();
    }, []);

    useEffect(() => {
        dispatch(selectedProductsAction(selectedItems));
    }, [selectedItems]);

    const resetUserDetail = () => {
        dispatch(userDetailsAction({
            "encryptedClientCode": "",
            "loginUserName": "",
            "loginUserEmailId": "",
            "loginUserMobileNumber": "",
            "status": "Active"
        }))
        setSelectedItems([]);
    }

    const userDetailsReducer = useSelector((state) => state.rootReducer.userDetailsReducer)
    var userData = userDetailsReducer.userDetails;

    const userDetailsErrorReducer = useSelector((state) => state.rootReducer.userDetailsErrorReducer)
    const userError = userDetailsErrorReducer.userDetailsError;

    const clientDataReducer = useSelector((state) => state.rootReducer.clientDataReducer)
    var clientUserData = clientDataReducer.clientData;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const handleSelectedItems = () => {
        if (userDetailsReducer.userDetails && userData.treeIds && userData.treeIds.length > 0) {
            setSelectedItems(userData.treeIds)
        }
    }

    if (Object.keys(userDetailsReducer.userDetails).length == 0 && !userDetailsReducer.userDetails.encryptedSecurityUserId) {
        resetUserDetail();
    }
    else if (userDetailsReducer.userDetails.encryptedSecurityUserId && (!selectedItems || selectedItems.length <= 0)
        && (!formChangedData.moduleDetailAdd && !formChangedData.moduleDetailDelete)) {
        handleSelectedItems();
    }

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

    const getClientModuleDetail = async (encryptedClientCode) => {
        const request = {
            encryptedClientCode: encryptedClientCode
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/client-registration-authorization-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(moduleData => {
                    localStorage.setItem("ModuleCode", moduleData.moduleCode);
                    getSelectedTreeItems(moduleData.moduleCode);
                })
            }

        }
    }

    const getSelectedTreeItems = async (moduleCode) => {
        let treeData = [];
        const request = {
            moduleCode: moduleCode
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-security-module-detail-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                let treeItemsData = response.data.data;
                treeData = treeItemsData.map((x) => x.tree_Id);
            }
            setSelectedItems(treeData);
        }
    }

    if (userData.clientName && !$('#txtClient').val()) {
        $('#txtClient option:contains(' + userData.clientName + ')').prop('selected', true);
    }

    const handleFieldChange = e => {
        if (e.target.name == 'encryptedClientCode' && (!userData || $('#txtClient option:selected').val() != userData.encryptedClientCode)) {

            const client = clientUserData.find(x => x.customerName == $('#txtClient option:selected').text());

            !client || client.role == "Client" ? setIsAdmin(false) : setIsAdmin(true);

            if (!userData.encryptedSecurityUserId && (!client || (client.role == "Client" && client.noOfCreatedUser > 0))) {
                toast.error("User for this client is already created", {
                    theme: 'colored',
                    autoClose: 5000
                })
                dispatch(userDetailsAction(undefined))
                $("#UserDetailsForm").data("changed", false);
                $('#UserDetailsForm').get(0).reset();
                $('#btnSave').attr('disabled', false);
                setIsAdmin(false);
            } else if (client.status == "Suspended") {
                toast.error("Client’s account is not active", {
                    theme: 'colored',
                    autoClose: 10000
                })
                dispatch(userDetailsAction(undefined))
                $("#UserDetailsForm").data("changed", false);
                $('#UserDetailsForm').get(0).reset();
                $('#btnSave').attr('disabled', false);
                setIsAdmin(false);
            }
            else {
                dispatch(userDetailsAction({
                    ...userData,
                    encryptedClientCode: client.encryptedClientCode,
                    clientName: client.customerName,
                    loginUserEmailId: client.emailId,
                    loginUserMobileNumber: client.mobileNo,
                    noOfUser: client.noOfCreatedUser
                }))
                $('#txtCountry').val(client.country)
                $('#txtState').val(client.state)
                if (client.encryptedClientCode) {
                    getClientModuleDetail(client.encryptedClientCode)
                }
            }

        }
        else {
            dispatch(userDetailsAction({
                ...userData,
                [e.target.name]: e.target.value
            }));
        }

        if (userData.encryptedSecurityUserId) {
            dispatch(formChangedAction({
                ...formChangedData,
                userDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                userDetailAdd: true
            }))
        }
    }

    return (
        <>
            {/* {userData &&

                <Form noValidate validated={formHasError} className="details-form" id='UserDetailsForm'>
                    <Row>
                        <Col className="me-3 ms-3">
                            <Row className="mb-3">
                                <Form.Label>Client<span className="text-danger">*</span></Form.Label>
                                <Form.Select id="txtClient" name="encryptedClientCode" onChange={handleFieldChange} required disabled={userData.encryptedSecurityUserId}>
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
                                <Form.Control id="txtCountry" name="country" disabled />
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>State</Form.Label>
                                <Form.Control id="txtState" name="state" disabled />
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <EnlargableTextbox id="txtEmail" name="loginUserEmailId" maxLength={50} value={userData.loginUserEmailId} onChange={handleFieldChange} className="mb-1" placeholder={isAdmin ? null : "Enter email"} disabled={!isAdmin} />
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Mobile Number</Form.Label>
                                <EnlargableTextbox id="txtMobile" name="loginUserMobileNumber" maxLength={10} value={userData.loginUserMobileNumber} onChange={handleFieldChange} className="mb-1" placeholder="Enter mobile number" disabled={!isAdmin}
                                    onKeyPress={(e) => {
                                        const regex = /[0-9]|\./;
                                        const key = String.fromCharCode(e.charCode);
                                        if (!regex.test(key)) {
                                            e.preventDefault();
                                        }
                                    }} />
                            </Row>
                            <Row className="mb-3">
                                <Form.Label>Username<span className="text-danger">*</span></Form.Label>
                                <EnlargableTextbox id="txtUserName" name="loginUserName" maxLength={20} value={userData.loginUserName} onChange={handleFieldChange} placeholder="Enter Username" required={true} />
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
                        <Col className="me-3 ms-3">
                            <Treeview
                                data={treeViewItems}
                                selection
                                defaultSelected={[]}
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                            // expanded={['1', '2', '3', '7', '18']}
                            />
                        </Col>
                    </Row>
                </Form>
            } */}

            <Row>
                <Col lg={3} className="no-pd-card no-right-pad">
                    <FalconComponentCard className="farmer-card-row1">
                        <FalconCardBody className="full-tab-page-card-body">
                            <Form noValidate validated={formHasError} className="details-form" id='UserDetailsForm'>
                                <Row>
                                    <Col className="me-3 ms-3">
                                        <Row className="mb-3">
                                            <Form.Label>Client<span className="text-danger">*</span></Form.Label>
                                            <Form.Select id="txtClient" name="encryptedClientCode" onChange={handleFieldChange} required disabled={userData.encryptedSecurityUserId}>
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
                                            <Form.Control id="txtCountry" name="country" disabled />
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>State</Form.Label>
                                            <Form.Control id="txtState" name="state" disabled />
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <EnlargableTextbox id="txtEmail" name="loginUserEmailId" maxLength={50} value={userData.loginUserEmailId} onChange={handleFieldChange} className="mb-1" placeholder={isAdmin ? null : "Enter email"} disabled={!isAdmin} />
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Mobile Number</Form.Label>
                                            <EnlargableTextbox id="txtMobile" name="loginUserMobileNumber" maxLength={10} value={userData.loginUserMobileNumber} onChange={handleFieldChange} className="mb-1" placeholder="Enter mobile number" disabled={!isAdmin}
                                                onKeyPress={(e) => {
                                                    const regex = /[0-9]|\./;
                                                    const key = String.fromCharCode(e.charCode);
                                                    if (!regex.test(key)) {
                                                        e.preventDefault();
                                                    }
                                                }} />
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Username<span className="text-danger">*</span></Form.Label>
                                            <EnlargableTextbox id="txtUserName" name="loginUserName" maxLength={20} value={userData.loginUserName} onChange={handleFieldChange} placeholder="Enter Username" required={true} />
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
                        </FalconCardBody>
                    </FalconComponentCard>
                </Col>
                <Col lg={9} className="no-pd-card col-left-pad">
                    <FalconComponentCard className="farmer-card-row1">
                        <FalconCardBody className="full-tab-page-card-body" language="jsx">
                            <Col className="me-3 ms-3">
                                <Treeview
                                    data={treeViewItems}
                                    selection
                                    defaultSelected={[]}
                                    selectedItems={selectedItems}
                                    setSelectedItems={setSelectedItems}
                                // expanded={['1', '2', '3', '7', '18']}
                                />
                            </Col>
                        </FalconCardBody>
                    </FalconComponentCard>
                </Col>
            </Row>

        </>
    )
}

export default UserDetails;