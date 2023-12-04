import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import Treeview from 'components/common/Treeview';
import FalconComponentCard from 'components/common/FalconComponentCard';
import FalconCardBody from 'components/common/FalconCardBody';

export const AddClientUser = () => {
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
        fetchMenuTree();
    }, []);

    return (
        <>
            <Row>
                <Col lg={3} className="no-pd-card no-right-pad">
                    <FalconComponentCard className="farmer-card-row1">
                        <FalconCardBody className="full-tab-page-card-body">
                            <Form noValidate  className="details-form" id='UserDetailsForm'>
                                <Row>
                                    <Col className="me-3 ms-3">
                                    <Row className="mb-3">
                                    <Form.Label><b>Client Name: RISHAB TYAGI & SONS LTD </b></Form.Label>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Company<span className="text-danger">*</span></Form.Label>
                                            <Form.Select id="txtCompany" name="company" 
                                            >
                                                <option value=''>Select Company</option>
                                            </Form.Select>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Distribution Center<span className="text-danger">*</span></Form.Label>
                                            <Form.Select id="txtDistributionCenter" name="distributionCenter" 
                                            >
                                                <option value=''>Select Distribution Center</option>
                                            </Form.Select>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Collection Center<span className="text-danger">*</span></Form.Label>
                                            <Form.Select id="txtCollectionCenter" name="collectionCenter" 
                                            >
                                                <option value=''>Select Collection Center</option>
                                            </Form.Select>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>User Name<span className="text-danger">*</span></Form.Label>
                                            <EnlargableTextbox id="txtName" name="loginName" maxLength={20} value=""  placeholder="User Name" required={true} />                            
                                        </Row>
                                        <Row className="mb-3">
                                                <Form.Label>Login User Id<span className="text-danger">*</span></Form.Label>
                                                <EnlargableTextbox id="txtUserName" name="loginUserName" maxLength={20} value="" placeholder="Login User Id" required={true} />
                                            </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select id="txtStatus" name="status" value="" >
                                                <option value="Active">Active</option>
                                                <option value="Suspended">Suspended</option>
                                            </Form.Select>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Mobile Number<span className="text-danger">*</span></Form.Label>
                                            <EnlargableTextbox id="txtMobile" name="loginUserMobileNumber" maxLength={10} value=""  className="mb-1" placeholder="Mobile Number"
                                                onKeyPress={(e) => {
                                                    const regex = /[0-9]|\./;
                                                    const key = String.fromCharCode(e.charCode);
                                                    if (!regex.test(key)) {
                                                        e.preventDefault();
                                                    }
                                                }} />
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                                            <EnlargableTextbox id="txtEmail" name="loginUserEmailId" maxLength={50} value="" className="mb-1" placeholder="Email" />
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Country<span className="text-danger">*</span></Form.Label>
                                            <Form.Select id="txtCountry" name="country" 
                                            >
                                                <option value=''>Select Country</option>
                                            </Form.Select>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>State<span className="text-danger">*</span></Form.Label>
                                            <Form.Select id="txtState" name="state" 
                                            >
                                                <option value=''>Select State</option>
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

export default AddClientUser;