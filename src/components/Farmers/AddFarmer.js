import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import FalconComponentCard from 'components/common/FalconComponentCard';

// Temp Commit

const AddFarmer = () => {

    const [formHasError, setFormError] = useState(false);

    return (
        <>
            <Form>
                <Row className="g-3 mb-3">
                    <Col sm={4} lg={3}>
                        <FalconComponentCard>
                            <FalconComponentCard.Header title="Farmer Information" light={false} />
                            <FalconComponentCard.Body language="jsx">
                                <Row>
                                    <Col className="me-3 ms-3">
                                        <Row className="mb-3">
                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Farmer Code
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtFarmerCode" name="farmerCode" placeholder="Farmer Code" />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    First Name
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtFirstName" name="firstName" className="mb-1" placeholder="First Name" />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Middle Name
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtMiddleName" name="middleName" className="mb-1" placeholder="Middle Name" />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Last Name
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtLastName" name="lastName" className="mb-1" placeholder="Last Name" />
                                                </Col>
                                            </Form.Group>
                                        </Row>
                                    </Col>
                                </Row>
                            </FalconComponentCard.Body>
                        </FalconComponentCard>
                    </Col>

                    <Col sm={4} lg={3}>
                        <FalconComponentCard>
                            <FalconComponentCard.Header title="Information" light={false} />
                            <FalconComponentCard.Body language="jsx">
                                <Row>
                                    <Col className="me-3 ms-3">
                                        <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                            <Form.Label column sm={4}>
                                                Farmer DOB
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control type='date' id="dtFarmerDOB" name="farmerDOB" placeholder="Farmer Code" />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                            <Form.Label column sm={4}>
                                                Farmer Gender
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Select id="txtGender" name="farmerGender">
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </Form.Select>
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                            <Form.Label column sm={4}>
                                                Farmer Name
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control id="txtFatherName" name="fatherName" className="mb-1" placeholder="Father Name" />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </FalconComponentCard.Body>
                        </FalconComponentCard>
                    </Col>

                    <Col sm={4} lg={3}>
                        <FalconComponentCard>
                            <FalconComponentCard.Header title="Status" light={false} />
                            <FalconComponentCard.Body language="jsx">
                                <Row>
                                    <Col className="me-3 ms-3">
                                        <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                            <Form.Label column sm={4}>
                                                Approval Status
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Select id="txtApprovalStatus" name="approvalStatus">
                                                    <option value="Draft">Draft</option>
                                                </Form.Select>
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                            <Form.Label column sm={4}>
                                                Active Status
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Select id="txtStatus" name="status">
                                                    <option value="Active">Active</option>
                                                    <option value="Suspended">Suspended</option>
                                                </Form.Select>
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                            <Form.Label column sm={4}>
                                                Address
                                            </Form.Label>
                                            <Col sm={8}>
                                                <Form.Control as="textarea" id='txtAddress' name='address' />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </FalconComponentCard.Body>
                        </FalconComponentCard>
                    </Col>

                    <Col sm={4} lg={3}>
                        <FalconComponentCard>
                            <FalconComponentCard.Header title="Photo" light={false} />
                            <FalconComponentCard.Body language="jsx">
                                <Row>
                                    <Col className="me-3 ms-3">
                                        <Row className="mb-3">
                                            <img src='' alt='Farmer'></img>                                        
                                        </Row>
                                    </Col>
                                </Row>
                            </FalconComponentCard.Body>
                        </FalconComponentCard>
                    </Col>
                </Row>

                <Row className="g-3 mb-3">
                    <FalconComponentCard>
                        <FalconComponentCard.Header title="Other Information" light={false} />
                        <FalconComponentCard.Body language="jsx">
                            <Row>
                                <Col sm={6} lg={4}>
                                    <Form.Group as={Row} className="mb-2">
                                        <Form.Label column sm={4}>
                                            Educational Status
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Select id="txtEducationalStatus" name=''>
                                                <option value=''>Select Education</option>
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </Col>

                                <Col sm={6} lg={4}>
                                    <Form.Group as={Row} className="mb-2">
                                        <Form.Label column sm={4}>
                                            Marital Status
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Select id="txtMaritalStatus" name="maritalStatus">
                                                <option value="">Select Marital Status</option>
                                                <option value="Married">Married</option>
                                                <option value="Unmarried">Unmarried</option>
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </Col>

                                <Col sm={6} lg={4}>
                                    <Form.Group as={Row} className="mb-2">
                                        <Form.Label column sm={4}>
                                            Social Category
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Select id="txtSocialCategory" name="">
                                                <option value=''>Select Category</option>
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </Col>

                            </Row>
                        </FalconComponentCard.Body>
                    </FalconComponentCard>
                </Row>

                <Row className="g-3 mb-3">
                    <Col sm={6} lg={4}>
                        <FalconComponentCard>
                            <FalconComponentCard.Header title="GEO Information" light={false} />
                            <FalconComponentCard.Body language="jsx">
                                <Row>
                                    <Col className="me-3 ms-3">
                                        <Row className="mb-3">
                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    Country Name
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtCountryName" name="">
                                                        <option value=''>Select country</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    State Name
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtStateName" name="">
                                                        <option value=''>Select state</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    District Name
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtDistrictName" name="">
                                                        <option value=''>Select district</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    Tehsil Name
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtTehsilName" name="">
                                                        <option value=''>Select tehsil</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    Block Name
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtBlockName" name="">
                                                        <option value=''>Select block</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    PostOffice Name
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtPostOfficeName" name="">
                                                        <option value=''>Select PostOffice</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    Village Name
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtVillageName" name="">
                                                        <option value=''>Select Village</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>
                                        </Row>
                                    </Col>
                                </Row>
                            </FalconComponentCard.Body>
                        </FalconComponentCard>
                    </Col>

                    <Col sm={6} lg={4}>
                        <FalconComponentCard>
                            <FalconComponentCard.Header title="Operational Information" light={false} />
                            <FalconComponentCard.Body language="jsx">
                                <Row>
                                    <Col className="me-3 ms-3">
                                        <Row className="mb-3">

                                            <Form.Group as={Row} className="mb-2" controlId="formHorizontalEmail">
                                                <Form.Label column sm={4}>
                                                    Total Land
                                                </Form.Label>
                                                <Col sm={4}>
                                                    <Form.Control id="txtTotalLand" name="totalLand" className="mb-1" placeholder="Total Land" />
                                                </Col>
                                                <Col sm={4}>
                                                    <Form.Control id="txtHectare" name="" className="mb-1" placeholder="Hectare" />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    FIG Name
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Select id="txtFIGName" name="">
                                                        <option value=''>Select FIG</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    FPO
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtFPO" name="FPO" className="mb-1" placeholder="FPO" />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    FPC
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtFPC" name="FPC" className="mb-1" placeholder="FPC" />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    Collection Centre
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtCollectionCentre" name="collectionCentre" className="mb-1" placeholder="Collection Centre" />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    Distribution Centre
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtDistributionCentre" name="distributionCentre" className="mb-1" placeholder="Distribution Centre" />
                                                </Col>
                                            </Form.Group>
                                        </Row>
                                    </Col>
                                </Row>
                            </FalconComponentCard.Body>
                        </FalconComponentCard>
                    </Col>

                    <Col sm={6} lg={4}>
                        <FalconComponentCard>
                            <FalconComponentCard.Header title="Contact Information" light={false} />
                            <FalconComponentCard.Body language="jsx">
                                <Row>
                                    <Col className="me-3 ms-3">
                                        <Row className="mb-3">
                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    STD Code
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtStdCode" name="stdCode" className="mb-1" placeholder="STD Code" />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    Landline No
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtLandlineNo" name="landlineNo" className="mb-1" placeholder="Landline No" />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    PP No
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtPPNo" name="ppNo" className="mb-1" placeholder="PP No" />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    Mobile No 1
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtMobileNo1" name="mobileNo1" className="mb-1" placeholder="Mobile No" />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    Mobile No 2
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtMobileNo2" name="mobileNo2" className="mb-1" placeholder="Mobile No" />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="mb-2">
                                                <Form.Label column sm={4}>
                                                    Pin Code
                                                </Form.Label>
                                                <Col sm={8}>
                                                    <Form.Control id="txtPinCode" name="pinCode" className="mb-1" placeholder="Pin Code" />
                                                </Col>
                                            </Form.Group>
                                        </Row>
                                    </Col>
                                </Row>
                            </FalconComponentCard.Body>
                        </FalconComponentCard>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default AddFarmer