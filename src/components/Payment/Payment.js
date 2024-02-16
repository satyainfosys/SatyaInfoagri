import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { paymentDetailsAction, paymentErrorAction, paymentHeaderAction } from 'actions';
import { toast } from 'react-toastify';
const tabArray = ['Payment'];

const Payment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  let isFormChanged = Object.values(formChangedData).some(value => value === true);

  let paymentDetailsReducer = useSelector((state) => state.rootReducer.paymentDetailReducer)
  let paymentDetails = paymentDetailsReducer.paymentDetails;

  const paymentHeaderDetailsReducer = useSelector((state) => state.rootReducer.paymentHeaderReducer)
  var paymentHeaderDetails = paymentHeaderDetailsReducer.paymentHeaderDetail;

  useEffect(() => {
    $("#btnNew").hide();
    $('#btnSave').attr('disabled', true);
    $("#btnSave").show();
  }, []);

  $('[data-rr-ui-event-key*="Payment"]').off('click').on('click', function () {
    $("#btnSave").show();
    $('#btnSave').attr('disabled', true);
    $("#btnNew").hide();
  })

  const exitModule = () => {
    $('#btnExit').attr('isExit', 'true');
    if (isFormChanged) {
      setModalShow(true)
    } else {
      window.location.href = '/dashboard';
    }
  }

  const discardChanges = () => {
    $('#btnDiscard').attr('isDiscard', 'true');
    if ($('#btnExit').attr('isExit') == 'true') {
      window.location.href = '/dashboard';
    }
    setModalShow(false);
  }

  const handleSave = async () => {
    for (let i = 0; i < paymentDetails.length; i++) {
      const paymentDetailData = paymentDetails[i];
      const hasEncryptedPaymentDetailCode = paymentDetailData.encryptedPaymentDetailCode !== '';
      if (hasEncryptedPaymentDetailCode) {
        await updatePaymentDetail(paymentDetailData, i);
      } else if (paymentDetailData.paidAmount > 0 && paymentDetailData.encryptedPaymentDetailCode == '') {
        await addPaymentDetail(paymentDetailData, i);
      }
    }
    if (parseFloat(paymentHeaderDetails.invoiceAmount) == parseFloat(paymentHeaderDetails.invoicePaidAmount)) {
      const updatedPaymentDetails = paymentDetails.map(detail => {
        let status = ""
        if (parseFloat(detail.productGrandAmt) == parseFloat(detail.paidAmount)) {
          status = "Fully Paid"
        }
        else {
          status = "Partially Paid"
        }
        return {
          ...detail,
          status: status
        };
      });
      dispatch(paymentDetailsAction(updatedPaymentDetails))
    }
  };

  const paymentValidation = () => {
    const paidAmountErr = {};
    const invoicePaidAmountErr = {};
    const paymentDetailErr = {};
    let isValid = true;

    if (parseFloat(paymentHeaderDetails.invoicePaidAmount) > parseFloat(paymentHeaderDetails.invoiceAmount)) {
      invoicePaidAmountErr.invalidInvoicePaidAmountErr = "Paid amount should not be greater than invoice amount";
      setTimeout(() => {
        toast.error(invoicePaidAmountErr.invalidInvoicePaidAmountErr, {
          theme: 'colored'
        });
      }, 1000);
      isValid = false;
    }

    for (let i = 0; i < paymentDetails.length; i++) {
      const paymentDetailData = paymentDetails[i];
      if (parseFloat(paymentDetailData.paidAmount) > parseFloat(paymentDetailData.productGrandAmt)) {
        paidAmountErr.invalidPaidAmount = "Product paid amount should not be greater than product amount";
        setTimeout(() => {
          toast.error(paidAmountErr.invalidPaidAmount, {
            theme: 'colored'
          });
        }, 1000);
        isValid = false;
      }
    }


    paymentDetails.forEach((row) => {
      if(row.paidAmount > 0){
        if (row.cgstAmt == "0" || row.sgstAmt == "0") {
          paymentDetailErr.invalidPaymentDetail = "Fill the required fields"
          setTimeout(() => {
            toast.error(paymentDetailErr.invalidPaymentDetail, {
              theme: 'colored'
            });
          }, 1000);
          isValid = false;
        }
      }
     })

    if (!isValid) {
      var errorObject = {
        paidAmountErr,
        invoicePaidAmountErr,
        paymentDetailErr
      }
    }
    dispatch(paymentErrorAction(errorObject))
    return isValid;
  }

  const addPaymentDetail = async (paymentDetailData, i) => {
    if (paymentValidation()) {
      const keys = ["addUser"];
      for (const key of Object.keys(paymentDetailData).filter((key) => keys.includes(key))) {
        paymentDetailData[key] = paymentDetailData[key] ? paymentDetailData[key].toUpperCase() : "";
      }
      const request = {
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
        encryptedInvoiceDetailCode: paymentDetailData.encryptedInvoiceDetailCode,
        encryptedInvoiceHeaderCode: paymentHeaderDetails.encryptedInvoiceHeaderCode,
        vendorCode: paymentHeaderDetails.code,
        poNo: paymentHeaderDetails.poNo,
        invoiceNo: paymentHeaderDetails.invoiceNo,
        invoiceAmount: paymentHeaderDetails.invoiceAmount,
        gstTotalAmt: paymentHeaderDetails.gstTotalAmt,
        InvoiceGrandAmt: paymentHeaderDetails.invoiceGrandAmt,
        PoDetailId: paymentDetailData.poDetailId ? paymentDetailData.poDetailId : 0,
        productCode: paymentDetailData.productCode,
        netAmount: paymentDetailData.netAmount ? paymentDetailData.netAmount.toString() : 0,
        paymentAmount: paymentDetailData.paidAmount,
        itemCode: paymentDetailData.productCode,
        cgstPer: paymentDetailData.cgstPer ? paymentDetailData.cgstPer : 0,
        cgstAmt: paymentDetailData.cgstAmt ? paymentDetailData.cgstAmt : 0,
        sgstPer: paymentDetailData.sgstPer ? paymentDetailData.sgstPer : 0,
        sgstAmt: paymentDetailData.sgstAmt ? paymentDetailData.sgstAmt : 0,
        productGrandAmt: paymentDetailData.productGrandAmt ? paymentDetailData.productGrandAmt : 0,
        totalPaidAmount: paymentHeaderDetails.invoicePaidAmount,
        activeStatus: "A",
        addUser: localStorage.getItem("LoginUserName")
      };

      setIsLoading(true);
      const response = await axios.post(process.env.REACT_APP_API_URL + '/add-payment-detail', request, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
      });
      if (response.data.status !== 200) {
        toast.error(response.data.message, {
          theme: 'colored',
          autoClose: 10000
        });
      } else if (response.data.status == 200) {
        setIsLoading(false);
        toast.success(response.data.message, {
          theme: 'colored',
          autoClose: 10000
        });
        const updatedPaymentDetail = [...paymentDetails];
        let invoiceStatus = ""
        if (parseFloat(paymentHeaderDetails.invoiceAmount) == parseFloat(paymentHeaderDetails.invoicePaidAmount)) {
          invoiceStatus = "Fully Paid"
        }
        else {
          invoiceStatus = "Partially Paid"
        }
        dispatch(paymentHeaderAction({
          ...paymentHeaderDetails,
          invoiceStatus: invoiceStatus,
          gstTotalAmt: response.data.data.gstTotalAmt,
          invoiceGrandAmt: response.data.data.invoiceGrandAmt,
        }))

        let status = ""
        if (parseFloat(paymentDetailData.productGrandAmt) == parseFloat(paymentDetailData.paidAmount)) {
          status = "Fully Paid"
        }
        else {
          status = "Partially Paid"
        }

        updatedPaymentDetail[i] = {
          ...updatedPaymentDetail[i],
          status: status
        };
       
        dispatch(paymentDetailsAction(updatedPaymentDetail));
        getInvoiceDetailList()
      }
    }
  };

  const updatePaymentDetail = async (paymentDetailData, i) => {
    if (paymentValidation()) {
      if (paymentDetailData.encryptedPaymentDetailCode != '') {
        const keys = ["modifyUser"];
        for (const key of Object.keys(paymentDetailData).filter((key) => keys.includes(key))) {
          paymentDetailData[key] = paymentDetailData[key] ? paymentDetailData[key].toUpperCase() : "";
        }
        const request = {
          encryptedPaymentDetailCode: paymentDetailData.encryptedPaymentDetailCode,
          encryptedInvoiceDetailCode: paymentDetailData.encryptedInvoiceDetailCode,
          encryptedInvoiceHeaderCode: paymentHeaderDetails.encryptedInvoiceHeaderCode,
          vendorCode: paymentHeaderDetails.code,
          productCode: paymentDetailData.productCode,
          poNo: paymentHeaderDetails.poNo,
          invoiceNo: paymentHeaderDetails.invoiceNo,
          invoiceAmount: paymentHeaderDetails.invoiceAmount,
          gstTotalAmt: paymentHeaderDetails.gstTotalAmt,
          InvoiceGrandAmt: paymentHeaderDetails.invoiceGrandAmt,
          PoDetailId: paymentDetailData.poDetailId ? paymentDetailData.poDetailId : 0,
          paymentAmount: paymentDetailData.paidAmount,
          cgstPer: paymentDetailData.cgstPer ? paymentDetailData.cgstPer : 0,
          cgstAmt: paymentDetailData.cgstAmt ? paymentDetailData.cgstAmt : 0,
          sgstPer: paymentDetailData.sgstPer ? paymentDetailData.sgstPer : 0,
          sgstAmt: paymentDetailData.sgstAmt ? paymentDetailData.sgstAmt : 0,
          productGrandAmt: paymentDetailData.productGrandAmt ? paymentDetailData.productGrandAmt : 0,
          totalPaidAmount: paymentHeaderDetails.invoicePaidAmount,
          modifyUser: localStorage.getItem("LoginUserName")
        };

        setIsLoading(true);
        let response = await axios.post(process.env.REACT_APP_API_URL + '/update-payment-detail', request, {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });
        if (response.data.status !== 200) {
          toast.error(response.data.message, {
            theme: 'colored',
            autoClose: 10000
          });
          setIsLoading(false);
        }
        else if (response.data.status == 200) {
          setIsLoading(false);
          toast.success(response.data.message, {
            theme: 'colored',
            autoClose: 10000
          })

          let invoiceStatus = ""
          if (parseFloat(paymentHeaderDetails.invoiceAmount) == parseFloat(paymentHeaderDetails.invoicePaidAmount)) {
            invoiceStatus = "Fully Paid"
          }
          else {
            invoiceStatus = "Partially Paid"
          }

          dispatch(paymentHeaderAction({
            ...paymentHeaderDetails,
            invoiceStatus: invoiceStatus
          }))

          const updatedPaymentDetail = [...paymentDetails];
          let status = ""
         
          if (parseFloat(paymentDetailData.productGrandAmt) == parseFloat(paymentDetailData.paidAmount)) {
            status = "Fully Paid"
          }
          else {
            status = "Partially Paid"
          }

          updatedPaymentDetail[i] = {
            ...updatedPaymentDetail[i],
            status: status
          };
          
          dispatch(paymentDetailsAction(updatedPaymentDetail));

        }
      }
    }
  };

  const getInvoiceDetailList = async () => {
    const request = {
      InvoiceNo: paymentHeaderDetails.invoiceNo
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-invoice-entry-detail-list', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })

    if (response.data.status == 200) {
      if (response.data.data && response.data.data.length > 0) {
        const invoiceDetails = response.data.data.map(detail => {
          let taxIncluded
          if (detail.cgstAmt > 0 && detail.sgstAmt > 0) {
            taxIncluded = true
          }
          else {
            taxIncluded = false
          }

          let status = ""
          if (parseFloat(detail.productGrandAmt) == parseFloat(detail.paidAmount)) {
            status = "Fully Paid"
          }
          else {
            status = "Partially Paid"
          }

          return {
            ...detail,
            taxIncluded: taxIncluded,
            status: status
          };
        });
        dispatch(paymentDetailsAction(invoiceDetails));
      }
    }
    else{
      toast.error(response.data.message, {
        theme: 'colored',
        autoClose: 10000
      });
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading ? (
        <Spinner
          className="position-absolute start-50 loader-color"
          animation="border"
        />
      ) : null}

      {modalShow &&
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
            <Button variant="success" onClick={handleSave}>Save</Button>
            <Button variant="danger" id="btnDiscard" onClick={() => discardChanges()}>Discard</Button>
          </Modal.Footer>
        </Modal>
      }
      <TabPage
        tabArray={tabArray}
        module='Payment'
        saveDetails={handleSave}
        exitModule={exitModule}
      />
    </>
  )
}

export default Payment