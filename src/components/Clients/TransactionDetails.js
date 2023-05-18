import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { transactionDetailsAction } from 'actions';
import { transactionDetailChangedAction } from '../../actions/index'
import { toast } from 'react-toastify';
import Moment from "moment";

export const TransactionDetails = () => {

    var initialState = {
        moduleName: '',
        startDate: '',
        endDate: '',
        paymentMode: '',
        chequeNo: '',
        chequeDate: '',
        chequeBank: '',
        amount: 0,
        gstPercentage: 0
    }

    const transactionDetailsReducer = useSelector((state) => state.rootReducer.transactionDetailsReducer)
    const transactionDetailData = transactionDetailsReducer.transactionDetails;

    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const [amountPayable, setAmountPayable] = useState();
    const [moduleList, setModuleList] = useState([]);
    const [formHasError, setFormError] = useState(false);
    const [moduleNameErr, setModuleNameErr] = useState({});
    const [startDateErr, setStartDateErr] = useState({});
    const [endDateErr, setEndDateErr] = useState({});
    const [amountErr, setAmountErr] = useState({});
    const [paymentModeErr, setPaymentModeErr] = useState({});
    const [chequeNoErr, setChequeNoErr] = useState({});
    const [chequeDateErr, setChequeDateErr] = useState({});
    const [chequeBankErr, setChequeBankErr] = useState({});

    useEffect(() => {
        getModule();
        $('.payment-mode-details').hide();
    }, []);

    const getModule = async () => {
        axios
            .get(process.env.REACT_APP_API_URL + '/security-module-master-list',{
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
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

    const validateTransactionDetails = () => {
        const moduleNameErr = {};
        const startDateErr = {};
        const endDateErr = {};
        const amountErr = {};
        const paymentModeErr = {};
        const chequeNoErr = {};
        const chequeDateErr = {};
        const chequeBankErr = {};

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
        } else if (formData.endDate <= formData.startDate) {
            endDateErr.endDateInvalid = "End date cannot be same or less than Start Date";
            isValid = false;
            setFormError(true);
        }

        if (formData.amount <= 0) {
            amountErr.amountEmpty = "Amount should be greater than zero";
            isValid = false;
            setFormError(true);
        }

        if (!formData.paymentMode) {
            paymentModeErr.paymentModeEmpty = "Select payment mode";
            isValid = false;
            setFormError(true);
        }

        if (formData.paymentMode === "CQ") {
            if (!formData.chequeNo) {
                chequeNoErr.chequeNoEmpty = "Enter cheque no.";
                isValid = false;
                setFormError(true);
            }

            if (!formData.chequeDate) {
                chequeDateErr.chequeDateEmpty = "Select cheque date";
                isValid = false;
                setFormError(true);
            }

            if (!formData.chequeBank) {
                chequeBankErr.chequeBankEmpty = "Enter cheque bank name";
                isValid = false;
                setFormError(true);
            }
        }
        else if (formData.paymentMode === "TT") {
            if (!formData.chequeNo) {
                chequeNoErr.TTNoEmpty = "Enter TT no";
                isValid = false;
                setFormError(true);
            }

            if (!formData.chequeDate) {
                chequeDateErr.TTDateEmpty = "Select TT date";
                isValid = false;
                setFormError(true);
            }

            if (!formData.chequeBank) {
                chequeBankErr.TTBankEmpty = "Enter TT bank name";
                isValid = false;
                setFormError(true);
            }
        }
        else if (formData.paymentMode === "GP") {
            if (!formData.chequeNo) {
                chequeNoErr.gPayNoEmpty = "Enter GPay transaction no.";
                isValid = false;
                setFormError(true);
            }

            if (!formData.chequeDate) {
                chequeDateErr.gPayDateEmpty = "Select GPay date";
                isValid = false;
                setFormError(true);
            }
        }
        else if (formData.paymentMode === "NB") {
            if (!formData.chequeNo) {
                chequeNoErr.nBNoEmpty = "Enter NetBanking transaction no.";
                isValid = false;
                setFormError(true);
            }

            if (!formData.chequeDate) {
                chequeDateErr.nBDateEmpty = "Select NetBanking date";
                isValid = false;
                setFormError(true);
            }
        }
        else if (formData.paymentMode === "CS") {
            if (!formData.chequeDate) {
                chequeDateErr.cashDateEmpty = "Select date";
                isValid = false;
                setFormError(true);
            }
        }


        if (!isValid) {
            setModuleNameErr(moduleNameErr);
            setStartDateErr(startDateErr);
            setEndDateErr(endDateErr);
            setAmountErr(amountErr);
            setPaymentModeErr(paymentModeErr);
            setChequeNoErr(chequeNoErr);
            setChequeDateErr(chequeDateErr);
            setChequeBankErr(chequeBankErr);
        }

        return isValid;
    }

    const clearStates = () => {
        setFormError(false);
        setModuleNameErr({});
        setStartDateErr({});
        setEndDateErr({});
        setAmountErr({});
        setPaymentModeErr({});
        setChequeNoErr({});
        setChequeDateErr({});
        setChequeBankErr({});
    }

    const submitTransactionDetails = e => {
        e.preventDefault();

        const form = e.currentTarget;

        if (validateTransactionDetails()) {
            const transactionData = {
                encryptedClientRegisterationAuthorizationId: "",
                encryptedClientCode: localStorage.getItem("EncryptedResponseClientCode"),
                encryptedModuleCode: formData.moduleName,
                moduleName: $("#selModuleName").find("option:selected").text(),
                startDate: formData.startDate,
                endDate: formData.endDate,
                paymentMode: formData.paymentMode,
                chequeNo: formData.chequeNo,
                chequeDate: formData.chequeDate ? formData.chequeDate : new Date(),
                chequeBank: formData.chequeBank,
                gstPercent: parseFloat(formData.gstPercentage),
                amount: parseFloat(formData.amount),
                addUser: localStorage.getItem("LoginUserName"),
                totalAmount: amountPayable
            }

            var loopBreaked = false;
            transactionDetailData.forEach(transactionDetail => {
                if (!loopBreaked) {
                    if (transactionDetail.moduleName == transactionData.moduleName) {
                        if ((Moment(transactionDetail.startDate).format("YYYY-MM-DD") <= formData.startDate && Moment(transactionDetail.endDate).format("YYYY-MM-DD") >= formData.startDate) ||                        
                            (Moment(transactionDetail.startDate).format("YYYY-MM-DD") <= formData.endDate && Moment(transactionDetail.endDate).format("YYYY-MM-DD") >= formData.endDate) ||
                            (Moment(transactionDetail.startDate).format("YYYY-MM-DD") >= formData.startDate)) {
                            toast.error(`For this date range ${transactionData.moduleName} already exists, please select other date range`, {
                                theme: 'colored'
                            });

                            loopBreaked = true;
                        }
                    }
                }
            })

            if (!loopBreaked) {
                dispatch(transactionDetailsAction(transactionData));

                const addTransactionDetail = {
                    transactionDetailChanged: true
                }

                dispatch(transactionDetailChangedAction(addTransactionDetail));

                if ($("#btnSave").attr('disabled'))
                    $("#btnSave").attr('disabled', false);

                toast.success("Transaction Added Successfully", {
                    theme: 'colored'
                });

                $("#TransactionDetailsTable").show();
                $("#TransactionDetailsListCard").show();

                setAmountPayable('');
                $(form)[0].reset();
                setFormData(initialState);
                clearStates();
                $('.payment-mode-details').hide();
            }
        }
    };

    const handleFieldChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if (e.target.name == "paymentMode") {

            setPaymentModeErr({});
            setChequeNoErr({});
            setChequeDateErr({});
            setChequeBankErr({});

            if (e.target.value != '') {
                if (e.target.value == "TT") {
                    $('#lblPaymentModeNo').text('TT No.').show();
                    $('#txtChequeNo').show();
                    $('#lblPaymentModeDate').text('TT Date');
                    $('#lblPaymentModeBankName').text('TT Bank').show();
                    $('#txtChequeBank').show();
                    $('.payment-mode-details').show();
                }
                else if (e.target.value == "CQ") {
                    $('#lblPaymentModeNo').text('Cheque No.').show();
                    $('#txtChequeNo').show();
                    $('#lblPaymentModeDate').text('Cheque Date');
                    $('#lblPaymentModeBankName').text('Cheque Bank').show();
                    $('#txtChequeBank').show();
                    $('.payment-mode-details').show();
                }
                else if (e.target.value == "GP") {
                    $('#lblPaymentModeNo').text('GPay Transaction No.').show();
                    $('#txtChequeNo').show();
                    $('#lblPaymentModeDate').text('GPay Date');
                    $('#lblPaymentModeBankName').hide();
                    $('#txtChequeBank').hide();
                    $('.payment-mode-details').show();
                }
                else if (e.target.value == "NB") {
                    $('#lblPaymentModeNo').text('NB Transaction No.').show();
                    $('#txtChequeNo').show();
                    $('#lblPaymentModeDate').text('NB Date');
                    $('#lblPaymentModeBankName').hide();
                    $('#txtChequeBank').hide();
                    $('.payment-mode-details').show();
                }
                else if (e.target.value == "CS") {
                    $('#lblPaymentModeNo').hide();
                    $('#txtChequeNo').hide();
                    $('#lblPaymentModeDate').text('Date');
                    $('#lblPaymentModeBankName').hide();
                    $('#txtChequeBank').hide();
                    $('.payment-mode-details').show();
                }
            }
            else {
                $('.payment-mode-details').hide();
            }
        }
        if ($("#btnSave").attr('disabled'))
            $("#btnSave").attr('disabled', false);
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
            <Form noValidate validated={formHasError} className="details-form" onSubmit={e => { submitTransactionDetails(e) }} id='AddClientTransactionDetailsForm'>
                <Row>
                    <Col className="me-3 ms-3">
                        <Row className="mb-3">
                            <Form.Label>Module Name<span className="text-danger">*</span></Form.Label>
                            <Form.Select name="moduleName" id="selModuleName" onChange={handleFieldChange} required>
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
                            <Form.Control type='date' id="dtStartDate" name="startDate" value={formData.startDate} onChange={handleFieldChange} required />
                            {Object.keys(startDateErr).map((key) => {
                                return <span className="error-message">{startDateErr[key]}</span>
                            })}
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>End Date<span className="text-danger">*</span></Form.Label>
                            <Form.Control type='date' id="dtEndDate" name="endDate" value={formData.endDate} onChange={handleFieldChange} required />
                            {Object.keys(endDateErr).map((key) => {
                                return <span className="error-message">{endDateErr[key]}</span>
                            })}
                        </Row>
                    </Col>

                    <Col className="me-3 ms-3">
                        <Row className="mb-3">
                            <Form.Label>Payment Mode<span className="text-danger">*</span></Form.Label>
                            <Form.Select id="txtPaymentMode" name="paymentMode" onChange={handleFieldChange} required>
                                <option value=''>Select payment mode</option>
                                <option value="CQ">Cheque</option>
                                <option value="CS">Cash</option>
                                <option value="TT">TT</option>
                                <option value="GP">GPay</option>
                                <option value="NB">NetBanking</option>
                            </Form.Select>
                            {Object.keys(paymentModeErr).map((key) => {
                                return <span className="error-message">{paymentModeErr[key]}</span>
                            })}
                        </Row>
                        <Row className="mb-3 payment-mode-details">
                            <Form.Label id="lblPaymentModeNo">Cheque No.</Form.Label>
                            <Form.Control id="txtChequeNo" name="chequeNo" maxLength={15} onChange={handleFieldChange} placeholder="Enter number" />
                            {Object.keys(chequeNoErr).map((key) => {
                                return <span className="error-message">{chequeNoErr[key]}</span>
                            })}
                        </Row>
                        <Row className="mb-3 payment-mode-details">
                            <Form.Label id="lblPaymentModeDate">Cheque Date</Form.Label>
                            <Form.Control type='date' id="txtChequeDate" name="chequeDate" value={formData.chequeDate} onChange={handleFieldChange} placeholder="Select date" />
                            {Object.keys(chequeDateErr).map((key) => {
                                return <span className="error-message">{chequeDateErr[key]}</span>
                            })}
                        </Row>
                        <Row className="mb-3 payment-mode-details">
                            <Form.Label id="lblPaymentModeBankName">Cheque Bank</Form.Label>
                            <Form.Control id="txtChequeBank" name="chequeBank" onChange={handleFieldChange} placeholder="Enter bank name" />
                            {Object.keys(chequeBankErr).map((key) => {
                                return <span className="error-message">{chequeBankErr[key]}</span>
                            })}
                        </Row>
                    </Col>

                    <Col className="me-3 ms-3">
                        <Row className="mb-3">
                            <Form.Label>Amount<span className="text-danger">*</span></Form.Label>
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
                            <Form.Label>Total Amount Payable</Form.Label>
                            <Form.Control type='number' id="numAmountPayable" name="totalAmount" value={amountPayable} onChange={handleFieldChange} placeholder="Total amount" />
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