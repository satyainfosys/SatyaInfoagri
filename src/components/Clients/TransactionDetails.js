import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

export const TransactionDetails = () => {

    const [formData, setFormData] = useState({
        moduleName: '',
        startDate: '',
        endDate: '',
        paymentMode: '',
        chequeNo: '',
        chequeDate: '',
        chequeBank: '',
        amount: 0,
        gstPercentage: 0,
        status: ''
    });
    const [amountPayable, setAmountPayable] = useState(0);
    const [moduleList, setModuleList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formHasError, setFormError] = useState(false);
    const [moduleNameErr, setModuleNameErr] = useState({});
    const [startDateErr, setStartDateErr] = useState({});
    const [endDateErr, setEndDateErr] = useState({});
    const [amountErr, setAmountErr] = useState({});

    useEffect(() => {
        getModule();
    }, []);

    const getModule = async () => {
        axios
            .get(process.env.REACT_APP_API_URL + '/security-module-master-list')
            .then(res => {
                if (res.data.status == 200) {
                    let moduleData = [];
                    if (res.data && res.data.data.length > 0)
                        res.data.data.forEach(module => {
                            moduleData.push({
                                key: module.moduleName,
                                value: module.encryptedModuleCode
                            });
                        });
                    setModuleList(moduleData);
                }
            });
    }

    const handleValidation = () => {
        const moduleNameErr = {};
        const startDateErr = {};
        const endDateErr = {};
        const amountErr = {};

        let isValid = true;

        if (!formData.moduleName) {
            moduleNameErr.moduleNameEmpty = "Select module name";
            isValid = false;
            setFormError(true);
        }

        if (!formData.startDate) {
            startDateErr.startDateEmpty = "Select start date";
            isValid = false;
            setFormError(true);
        }

        if (!formData.endDate) {
            endDateErr.endDateEmpty = "Select end date";
            isValid = false;
            setFormError(true);
        }

        if (formData.amount <= 0) {
            amountErr.amountEmpty = "Amount should be greater than zero";
            isValid = false;
            setFormError(true);
        }

        if (!isValid) {
            setModuleNameErr(moduleNameErr);
            setStartDateErr(startDateErr);
            setEndDateErr(endDateErr);
            setAmountErr(amountErr);
        }

        return isValid;
    }

    const handleSubmit = e => {
        e.preventDefault();

        const form = e.currentTarget;

        if (handleValidation()) {
            const transactionData = {
                EncryptedClientCode: localStorage.getItem("EncryptedResponseClientCode"),
                EncryptedModuleCode: formData.moduleName,
                Startdate: formData.startDate,
                EndDate: formData.endDate,
                PaymentMode: formData.paymentMode,
                ChequeNo: formData.chequeNo,
                ChequeDate: formData.chequeDate,
                ChequeBank: formData.chequeBank,
                GSTPercent: parseFloat(formData.gstPercentage),
                Amount: parseFloat(formData.amount),
                ActiveStatus: formData.status,
                AddUser: localStorage.getItem("LoginUserName")
            }

            setIsLoading(true);

            axios.post(process.env.REACT_APP_API_URL + '/add-client-registration-authorization', transactionData)
                .then(res => {
                    setIsLoading(false);
                    if (res.data.status == 200) {
                        toast.success(res.data.message, {
                            theme: 'colored'
                        });
                        $("#TransactionDetailsTable").show();
                    } else {
                        toast.error(res.data.message, {
                            theme: 'colored'
                        });
                    }
                })
        }
    };

    const handleFieldChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAmountChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (e.target.value > 0) {
            getTotalAmountWithGST(e.target.value, formData.gstPercentage);
        }
        else {
            setAmountPayable(0)
        }
    }

    const handleGstChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (e.target.value > 0) {
            getTotalAmountWithGST(formData.amount, e.target.value);
        }
        else {
            getTotalAmountWithGST(formData.amount);
        }
    }

    const getTotalAmountWithGST = (amount, gstPercentage = 0) => {
        var gstAmount = gstPercentage > 0 ? parseFloat((amount * gstPercentage) / 100) : 0;
        setAmountPayable(parseFloat(amount) + gstAmount);
    }

    return (
        <>
            {isLoading ? (
                <Spinner
                    className="position-absolute start-50 loader-color"
                    animation="border"
                />
            ) : null}

            <Form noValidate validated={formHasError} className="details-form" onSubmit={e => { handleSubmit(e) }} id='AddClientDetailsForm'>
                <Row>
                    <Col className="me-5 ms-5">
                        <Row className="mb-3">
                            <Form.Label>Module Name<span className="text-danger">*</span></Form.Label>
                            <Form.Select id="txtCountry" name="moduleName" onChange={handleFieldChange} required>
                                <option value=''>Select Module</option>
                                {moduleList.map((option, index) => (
                                    <option key={index} value={option.value}>{option.key}</option>
                                ))}
                            </Form.Select>
                            {Object.keys(moduleNameErr).map((key) => {
                                return <span className="error-message">{moduleNameErr[key]}</span>
                            })}
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Start Date<span className="text-danger">*</span></Form.Label>
                            <Form.Control type='date' id="dtStartDate" name="startDate" onChange={handleFieldChange} required />
                            {Object.keys(startDateErr).map((key) => {
                                return <span className="error-message">{startDateErr[key]}</span>
                            })}
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>End Date<span className="text-danger">*</span></Form.Label>
                            <Form.Control type='date' id="dtEndDate" name="endDate" onChange={handleFieldChange} required />
                            {Object.keys(endDateErr).map((key) => {
                                return <span className="error-message">{endDateErr[key]}</span>
                            })}
                        </Row>
                    </Col>

                    <Col className="me-5 ms-5">
                        <Row className="mb-3">
                            <Form.Label>Payment Mode</Form.Label>
                            <Form.Select id="txtPaymentMode" name="paymentMode" onChange={handleFieldChange}>
                                <option value=''>Select payment mode</option>
                                <option value="CQ">Cheque</option>
                                <option value="CS">Cash</option>
                                <option value="TT">TT</option>
                            </Form.Select>
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Cheque No.</Form.Label>
                            <Form.Control id="txtChequeNo" name="chequeNo" onChange={handleFieldChange} placeholder="Enter cheque number" />
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Cheque Date</Form.Label>
                            <Form.Control type='date' id="txtPassword" name="chequeDate" onChange={handleFieldChange} placeholder="Select cheque date" />
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Cheque Bank</Form.Label>
                            <Form.Control id="txtChequeBank" name="chequeBank" onChange={handleFieldChange} placeholder="Enter cheque bank name" />
                        </Row>
                    </Col>

                    <Col className="me-5 ms-5">
                        <Row className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type='number' id="txtAmount" name="amount" min={0} onChange={handleAmountChange} placeholder="Enter amount" required />
                            {Object.keys(amountErr).map((key) => {
                                return <span className="error-message">{amountErr[key]}</span>
                            })}
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>GST Percentage</Form.Label>
                            <Form.Control type='number' id="numGstPercent" name="gstPercentage" min={0} onChange={handleGstChange} placeholder="Enter gst percentage" />
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select id="txtStatus" name="status" onChange={handleFieldChange}>
                                <option value=''>Select status</option>
                                <option value="A">Active</option>
                                <option value="S">Expired</option>
                            </Form.Select>
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Total Amount Payable</Form.Label>
                            <Form.Control type='number' id="numAmountPayable" name="amountPayable" value={amountPayable} onChange={handleFieldChange} placeholder="Total amount" />
                        </Row>
                        <Row className="mb-3">
                            <Button variant="primary" type="submit">
                                Add
                            </Button>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default TransactionDetails;