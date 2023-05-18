import React, { useEffect, useState } from 'react';
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Spinner, Modal, Button } from 'react-bootstrap';
import {
  clientDetailsAction, clientContactDetailsAction, transactionDetailsAction,
  clientDetailsErrorAction, contactDetailChangedAction, transactionDetailChangedAction
} from '../../actions/index';

const tabArray = ['Customer List', 'Customer Details', 'Transaction Details'];

const listColumnArray = [
  { accessor: 'sl', Header: 'S. No' },
  { accessor: 'customerName', Header: 'Customer Name' },
  { accessor: 'fullAddress', Header: 'Address' },
  { accessor: 'state', Header: 'State' },
  { accessor: 'country', Header: 'Country' },
  { accessor: 'contactPerson', Header: 'Contact Person' },
  { accessor: 'contactNo', Header: 'Contact No' },
  { accessor: 'status', Header: 'Status' }
];

export const Client = () => {
  const dispatch = useDispatch();
  const [listData, setListData] = useState([]);
  const [perPage, setPerPage] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const fetchUsers = async (page, size = perPage) => {
    let token = localStorage.getItem('Token');

    const listFilter = {
      pageNumber: page,
      pageSize: size
    };

    const response =
      setIsLoading(true);
    await axios
      .post(process.env.REACT_APP_API_URL + '/client-list', listFilter, {
        headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
      })
      .then(res => {
        setIsLoading(false);
        if (res.data.status == 200) {
          setListData(res.data.data);
        }
      });
  };

  useEffect(() => {
    fetchUsers(1);
    localStorage.removeItem("DeleteContactDetailsId");
  }, []);


  const clientDetailsReducer = useSelector((state) => state.rootReducer.clientDetailsReducer)
  const clientData = clientDetailsReducer.clientDetails;

  const clientContactDetailsReducer = useSelector((state) => state.rootReducer.clientContactDetailsReducer)
  const contactDetailData = clientContactDetailsReducer.clientContactDetails;

  const transactionDetailsReducer = useSelector((state) => state.rootReducer.transactionDetailsReducer)
  const transactionDetailData = transactionDetailsReducer.transactionDetails;

  const contactChanged = useSelector((state) => state.rootReducer.contactDetailChangedReducer)
  let clientContactDetailChanged = contactChanged.contactDetailChanged;

  const transactionChanged = useSelector((state) => state.rootReducer.transactionDetailChangedReducer)
  let transactionDetailChanged = transactionChanged.transactionDetailChanged;

  const [formHasError, setFormError] = useState(false);

  $.fn.extend({
    trackChanges: function () {
      $(":input", this).change(function () {
        $(this.form).data("changed", true);
      });
    }
    ,
    isChanged: function () {
      return this.data("changed");
    }
  });

  $("#AddClientDetailsForm").trackChanges();

  const clearClientReducers = () => {
    dispatch(clientDetailsAction(undefined));
    dispatch(clientContactDetailsAction(undefined));
    dispatch(transactionDetailsAction(undefined));
    dispatch(clientDetailsErrorAction(undefined));
    dispatch(contactDetailChangedAction(undefined));
    dispatch(transactionDetailChangedAction(undefined));
    $("#AddClientDetailsForm").data("changed", false);
  }

  $('[data-rr-ui-event-key*="Customer List"]').click(function () {
    // $('#btnExit').attr('isExit', 'false');
    // if ($("#AddClientDetailsForm").isChanged() ||
    //   clientContactDetailChanged.contactDetailsChanged ||
    //   transactionDetailChanged.transactionDetailChanged
    // ) {
    //   setModalShow(true);
    // }

    $("#btnNew").show();
    $("#btnSave").hide();
    $("#btnCancel").hide();
    $('[data-rr-ui-event-key*="Details"]').attr('disabled', true);
    $('[data-rr-ui-event-key*="Customer List"]').attr('disabled', false);
    $('#AddClientDetailsForm').get(0).reset();
    $('#AddClientTransactionDetailsForm').get(0).reset();
    localStorage.removeItem("EncryptedResponseClientCode");
    clearClientReducers();
  })

  $('[data-rr-ui-event-key*="Customer Details"]').click(function () {
    $("#btnNew").hide();
    $("#btnSave").show();
    $("#btnCancel").show();
    $("#AddContactDetailsForm").hide();
    $("#btnUpdateClientDetail").hide();
    $("#ContactDetailsTable").show();
  })

  $('[data-rr-ui-event-key*="Transaction Details"]').click(function () {
    $("#btnNew").hide();
    $("#btnSave").show();
    $("#btnCancel").show();
  })

  const newDetails = () => {
    $('[data-rr-ui-event-key*="Details"]').attr('disabled', false);
    $('[data-rr-ui-event-key*="Customer Details"]').trigger('click');
    $('#btnSave').attr('disabled', false);
    $("#AddClientDetailsForm").trackChanges();
    $("#TransactionDetailsListCard").hide();
    clearClientReducers();
  }

  const cancelClick = () => {
    $('#btnExit').attr('isExit', 'false');
    $('[data-rr-ui-event-key*="Customer List"]').trigger('click');
    // if ($("#AddClientDetailsForm").isChanged() ||
    //   clientContactDetailChanged.contactDetailsChanged ||
    //   transactionDetailChanged.transactionDetailChanged
    // ) {
    //   setModalShow(true);
    // }
    // else {
    //   $('[data-rr-ui-event-key*="Customer List"]').trigger('click');
    // }
  }

  const clientValidation = () => {
    const customerNameErr = {};
    const clientAddressErr = {};
    const countryErr = {};
    const stateErr = {};
    const billingAddressErr = {};
    const billingCountryErr = {};
    const billingStateErr = {};
    const panNoErr = {};
    const gstNoErr = {};
    const noOfCompaniesErr = {};
    const noOfUsersErr = {};
    const contactDetailErr = {};
    const transactionDetailErr = {};
    const roleErr = {};

    let isValid = true;
    let isClientValid = true;

    if (!clientData.customerName) {
      customerNameErr.nameEmpty = "Enter customer name";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    }

    if (!clientData.address1) {
      clientAddressErr.addressEmpty = "Enter address";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    }

    if (!clientData.countryCode) {
      countryErr.empty = "Select country";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    }

    if (!clientData.stateCode) {
      stateErr.empty = "Select state";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    }

    if (!clientData.billingAddress1) {
      billingAddressErr.billAddressEmpty = "Enter billing address";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    }

    if (!clientData.billCountryCode) {
      billingCountryErr.billCountryEmpty = "Select billing country";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    }

    if (!clientData.billStateCode) {
      billingStateErr.billStateEmpty = "Select billing state";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    }

    if (!clientData.panNumber) {
      panNoErr.panNoEmpty = "Enter PAN number";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    }
    else if (!(/^[a-zA-Z]{3}[abcfghljptABCFGHLJPT][a-zA-Z][0-9]{4}[a-zA-Z]$/.test(clientData.panNumber))) {
      panNoErr.panNoInvalid = "Enter valid PAN number";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    }

    if (!clientData.gstNumber) {
      gstNoErr.gstNoEmpty = "Enter GST number";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    }
    else if (!(/^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ][0-9a-zA-Z]{1}$/.test(clientData.gstNumber))) {
      gstNoErr.gstNoInvalid = "Enter valid GST number";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    }

    if (clientData.noOfComapnies <= 0 || clientData.noOfComapnies === undefined) {
      noOfCompaniesErr.noOfCompaniesEmpty = "Number of companies must be greater than 0";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    } else if (!(/^\d{1,3}$/.test(clientData.noOfComapnies))) {
      noOfCompaniesErr.noOfCompaniesInvalid = "Number of companies can not be greater than 999";
      isValid = false;
      setFormError(true);
    }

    if (clientData.noOfUsers <= 0 || clientData.noOfUsers === undefined) {
      noOfUsersErr.noOfUsersEmpty = "Number of users must be greater than 0";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    } else if (!(/^\d{1,3}$/.test(clientData.noOfUsers))) {
      noOfUsersErr.noOfUsersInvalid = "Number of users can not be greater than 999";
      isValid = false;
      setFormError(true);
    }

    if (!clientData.role) {
      roleErr.empty = "Select role";
      isValid = false;
      isClientValid = false;
      setFormError(true);
    }

    if (!isClientValid) {
      if (!$('[data-rr-ui-event-key*="Customer Details"]').hasClass('active')) {
        $('[data-rr-ui-event-key*="Customer Details"]').trigger('click');
      }
    }

    //To-do: will open this validation once first two tabs are completed
    // if (contactDetailData.length < 1) {
    //   contactDetailErr.contactEmpty = "At least one contact detail required";
    //   setTimeout(() => {
    //     toast.error(contactDetailErr.contactEmpty, {
    //       theme: 'colored'
    //     });
    //   }, 500);
    //   isValid = false;

    //   if (isClientValid) {
    //     if (!$('[data-rr-ui-event-key*="Customer Details"]').hasClass('active')) {
    //       $('[data-rr-ui-event-key*="Customer Details"]').trigger('click');
    //     }

    //     setTimeout(() => {
    //       document.getElementById("ContactDetailsTable").scrollIntoView({ behavior: 'smooth' });
    //     }, 500)
    //   }

    //   setFormError(true);
    //   $("#TransactionDetailsListCard").show();
    // }

    if (transactionDetailData.length < 1) {
      transactionDetailErr.transactionEmpty = "At least one transaction detail required";
      setTimeout(() => {
        toast.error(transactionDetailErr.transactionEmpty, {
          theme: 'colored'
        });
      }, 1000);
      isValid = false;

      if (isClientValid &&
        !contactDetailErr.contactEmpty &&
        !$('[data-rr-ui-event-key*="Transaction Details"]').hasClass('active')) {
        $('[data-rr-ui-event-key*="Transaction Details"]').trigger('click');
      }
      setFormError(true);
    }

    if (!isValid) {
      var errorObject = {
        customerNameErr,
        clientAddressErr,
        countryErr,
        stateErr,
        billingAddressErr,
        billingCountryErr,
        billingStateErr,
        panNoErr,
        gstNoErr,
        noOfCompaniesErr,
        noOfUsersErr,
        contactDetailErr,
        transactionDetailErr,
        roleErr
      }
      dispatch(clientDetailsErrorAction(errorObject))
    }

    return isValid;
  }

  const addClientDetails = () => {
    if (clientValidation()) {
      const userData = {
        ClientName: clientData.customerName,
        ClientAddress1: clientData.address1,
        ClientAddress2: clientData.address2 ? clientData.address2 : '',
        ClientAddress3: clientData.address3 ? clientData.address3 : '',
        PINCode: clientData.pinCode ? clientData.pinCode : '',
        CountryCode: clientData.countryCode,
        StateCode: clientData.stateCode,
        ClientBillAddress1: clientData.billingAddress1,
        ClientBillAddress2: clientData.billingAddress2 ? clientData.billingAddress2 : '',
        ClientBillAddress3: clientData.billingAddress3 ? clientData.billingAddress3 : '',
        BillPINCode: clientData.billingPinCode,
        BillCountryCode: clientData.billCountryCode,
        BillStateCode: clientData.billStateCode,
        ClientPANNO: clientData.panNumber,
        ClientGSTNO: clientData.gstNumber,
        Role: clientData.role == "Super Admin" ? "S" : "C",
        ActiveStatus: clientData.status == null || clientData.status == "Active" ? "A" : "S",
        NoOfCompany: parseInt(clientData.noOfComapnies),
        NoOfUsers: parseInt(clientData.noOfUsers),
        AddUser: localStorage.getItem("LoginUserName"),
        ClientContactDetails: contactDetailData,
        ClientRegistrationAuthorization: transactionDetailData
      }

      const keys = ['ClientName', 'ClientAddress1', 'ClientAddress2', 'ClientAddress3', 'ClientBillAddress1', 'ClientBillAddress2', 'ClientBillAddress3', 'ClientPANNO', 'ClientGSTNO', 'AddUser']
      for (const key of Object.keys(userData).filter((key) => keys.includes(key))) {
        userData[key] = userData[key] ? userData[key].toUpperCase() : '';
      }

      const contactKeys = ['contactPerson', 'designation', 'addUser']
      var index = 0;
      for (var obj in userData.ClientContactDetails) {
        var contactDetailObj = userData.ClientContactDetails[obj];

        for (const key of Object.keys(contactDetailObj).filter((key) => contactKeys.includes(key))) {
          contactDetailObj[key] = contactDetailObj[key] ? contactDetailObj[key].toUpperCase() : '';
        }
        userData.ClientContactDetails[index] = contactDetailObj;
        index++;
      }
      setIsLoading(true);
      axios.post(process.env.REACT_APP_API_URL + '/add-client', userData)
        .then(res => {
          setIsLoading(false);
          if (res.data.status == 200) {
            toast.success(res.data.message, {
              theme: 'colored',
              autoClose: 10000
            });
            updateCallback(true);
            // To-do: Do not redirect to List, instead change Save button click function to updateClient after successfully add
            $('[data-rr-ui-event-key*="List"]').click();
          } else {
            toast.error(res.data.message, {
              theme: 'colored',
              autoClose: 10000
            });
          }
        })
    }
  }

  const updateCallback = (isAddClient = false) => {

    if (clientData.gstNumber === localStorage.getItem("GSTNumber")) {
      localStorage.setItem("NoOfCompany", parseInt(clientData.noOfComapnies))
    }

    $("#AddClientDetailsForm").data("changed", false);
    $('#AddClientDetailsForm').get(0).reset();

    dispatch(clientDetailsErrorAction(undefined));

    clientContactDetailChanged = {
      clientContactDetailChanged: false
    }

    dispatch(contactDetailChangedAction(clientContactDetailChanged));

    localStorage.removeItem("DeleteContactDetailsId");

    transactionDetailChanged = {
      transactionDetailChanged: false
    }

    dispatch(transactionDetailChangedAction(transactionDetailChanged));

    if (!isAddClient) {
      toast.success("Client details updated successfully!", {
        theme: 'colored'
      });
    }

    $('#btnSave').attr('disabled', true)

    fetchUsers(1);
  }

  const updateClientDetails = async () => {
    if (clientValidation()) {
      const updatedUserData = {
        EncryptedClientCode: clientData.encryptedClientCode,
        ClientName: clientData.customerName,
        ClientAddress1: clientData.address1,
        ClientAddress2: clientData.address2,
        ClientAddress3: clientData.address3,
        PINCode: clientData.pinCode,
        CountryCode: clientData.countryCode,
        StateCode: clientData.stateCode,
        ClientBillAddress1: clientData.billingAddress1,
        ClientBillAddress2: clientData.billingAddress2,
        ClientBillAddress3: clientData.billingAddress3,
        BillPINCode: clientData.billingPinCode,
        BillCountryCode: clientData.billCountryCode,
        BillStateCode: clientData.billStateCode,
        ClientPANNO: clientData.panNumber,
        ClientGSTNO: clientData.gstNumber,
        Role: clientData.role == "Super Admin" ? "S" : "C",
        ActiveStatus: !clientData.status || clientData.status == "Active" ? "A" : "S",
        NoOfCompany: parseInt(clientData.noOfComapnies),
        NoOfUsers: parseInt(clientData.noOfUsers),
        ModifyUser: localStorage.getItem("LoginUserName")
      }

      var updateRequired = $("#AddClientDetailsForm").isChanged() || clientContactDetailChanged.contactDetailsChanged || transactionDetailChanged.transactionDetailChanged;

      if (!updateRequired) {
        toast.warning("Nothing to change!", {
          theme: 'colored'
        });

        return;
      }

      const keys = ['ClientName', 'ClientAddress1', 'ClientAddress2', 'ClientAddress3', 'ClientBillAddress1', 'ClientBillAddress2', 'ClientBillAddress3', 'ClientPANNO', 'ClientGSTNO', 'ModifyUser']
      for (const key of Object.keys(updatedUserData).filter((key) => keys.includes(key))) {
        updatedUserData[key] = updatedUserData[key] ? updatedUserData[key].toUpperCase() : '';
      }

      if ($("#AddClientDetailsForm").isChanged()) {
        setIsLoading(true);
        await axios.post(process.env.REACT_APP_API_URL + '/update-client', updatedUserData, {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
          .then(res => {
            setIsLoading(false);
            if (res.data.status != 200) {
              toast.error(res.data.message, {
                theme: 'colored',
                autoClose: 10000
              });
            }
            else if (!clientContactDetailChanged.contactDetailsChanged && !transactionDetailChanged.transactionDetailChanged) {
              updateCallback();
            }
          })
      }

      var deleteContactDetailsId = localStorage.getItem("DeleteContactDetailsId");

      if (clientContactDetailChanged.contactDetailsChanged) {
        var loopBreaked = false;
        var contactDetailIndex = 1;

        for (let i = 0; i < contactDetailData.length; i++) {
          const contactDetails = contactDetailData[i];
          if (!loopBreaked) {

            const keys = ['contactPerson', 'designation', 'modifyUser']
            for (const key of Object.keys(contactDetails).filter((key) => keys.includes(key))) {
              contactDetails[key] = contactDetails[key] ? contactDetails[key].toUpperCase() : '';
            }

            if (contactDetails.encryptedClientContactDetailsId) {
              const updateContactDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-client-contact-detail', contactDetails, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
              });
              if (updateContactDetailResponse.data.status != 200) {
                toast.error(updateContactDetailResponse.data.message, {
                  theme: 'colored',
                  autoClose: 10000
                });
                loopBreaked = true;
              }
              else if (contactDetailIndex == contactDetailData.length && !loopBreaked && !deleteContactDetailsId) {
                updateCallback();
              }
              else {
                contactDetailIndex++;
              }
            }
            else if (!contactDetails.encryptedClientContactDetailsId) {
              const addContactDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-client-contact-details', contactDetails, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
              });
              if (addContactDetailResponse.data.status != 200) {
                toast.error(addContactDetailResponse.data.message, {
                  theme: 'colored',
                  autoClose: 10000
                });
                loopBreaked = true;
              }
              else if (contactDetailIndex == contactDetailData.length && !loopBreaked && !deleteContactDetailsId) {
                updateCallback();
              }
              else {
                contactDetailIndex++;
              }
            }
          }
        }

        var deleteContactDetailList = deleteContactDetailsId ? deleteContactDetailsId.split(',') : null;

        if (deleteContactDetailList) {
          var deleteContactDetailIndex = 1;

          deleteContactDetailList.forEach(async deleteContactDetailId => {
            if (!loopBreaked) {

              const data = { encryptedClientContactDetailsId: deleteContactDetailId }
              const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
              const deleteContactResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-client-contact-detail', { headers, data });
              if (deleteContactResponse.data.status != 200) {
                toast.error(deleteContactResponse.data.message, {
                  theme: 'colored',
                  autoClose: 10000
                });
                loopBreaked = true;
              }
              else if (deleteContactDetailIndex == deleteContactDetailList.length && !loopBreaked && !transactionDetailChanged.transactionDetailChanged) {
                updateCallback();
              }
              else {
                deleteContactDetailIndex++;
              }
            }
          });
        }
      }

      if (transactionDetailChanged.transactionDetailChanged && !loopBreaked) {
        var transactionDetailIndex = 1;
        var newTransactions = transactionDetailData.filter(x => !x.encryptedClientRegisterationAuthorizationId);

        for (let i = 0; i < newTransactions.length; i++) {
          const transactionDetail = newTransactions[i];
          const transactionDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-client-registration-authorization', transactionDetail, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
          });
          if (transactionDetailResponse.data.status != 200) {
            toast.error(transactionDetailResponse.data.message, {
              theme: 'colored',
              autoClose: 10000
            });

            loopBreaked = true;
          }
          else if (transactionDetailIndex == newTransactions.length && !loopBreaked) {
            updateCallback();
          }
          else {
            transactionDetailIndex++;
          }
        }
      }
    }
  };

  const exitModule = () => {
    $('#btnExit').attr('isExit', 'true');
    window.location.href = '/dashboard';
    // if (($("#AddClientDetailsForm").isChanged()) ||
    //   (clientContactDetailChanged.contactDetailsChanged) ||
    //   transactionDetailChanged.transactionDetailChanged) {
    //   setModalShow(true);
    // }
    // else {
    //   window.location.href = '/dashboard';
    // }
  }

  const discardChanges = () => {
    if ($('#btnExit').attr('isExit') == 'true')
      window.location.href = '/dashboard';
    else
      $('[data-rr-ui-event-key*="List"]').trigger('click');

    setModalShow(false);
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
            <Button variant="success" onClick={!clientData.encryptedClientCode ? addClientDetails : updateClientDetails}>Save</Button>
            <Button variant="danger" onClick={discardChanges}>Discard</Button>
          </Modal.Footer>
        </Modal>
      }

      <TabPage
        listData={listData}
        listColumnArray={listColumnArray}
        tabArray={tabArray}
        module="Client"
        saveDetails={!clientData.encryptedClientCode ? addClientDetails : updateClientDetails}
        newDetails={newDetails}
        cancelClick={cancelClick}
        exitModule={exitModule}
      />
    </>
  )
};

export default Client;