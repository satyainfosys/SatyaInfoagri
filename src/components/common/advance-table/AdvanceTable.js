import PropTypes from 'prop-types';
import { Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clientContactDetailsAction, companyDetailsAction, commonContactDetailsListAction, userDetailsAction, productDetailsAction } from '../../../actions/index';
import { transactionDetailsAction } from '../../../actions/index';
import { clientDetailsAction } from '../../../actions/index';
import { farmerDetailsAction } from '../../../actions/index';
import $ from 'jquery'

const AdvanceTable = ({
  getTableProps,
  headers,
  page,
  prepareRow,
  headerClassName,
  rowClassName,
  tableProps
}) => {

  const dispatch = useDispatch();
  const clientDataReducer = useSelector((state) => state.rootReducer.clientDataReducer)
  var clientUserData = clientDataReducer.clientData;

  const toTabPage = (rowData) => {
    if (rowData.hasOwnProperty('encryptedCompanyCode')) {
      dispatch(companyDetailsAction(rowData));
      $("#contactListChkBoxRow").hide();
      $("#clientChkBoxRow").hide();
      $('[data-rr-ui-event-key*="Maintenance"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Maintenance"]').trigger('click');
      $("#AddCompanyDetailsForm").trackChanges();
      $('#btnSave').attr('disabled', true);
      getCommonContactDetailsList(rowData.encryptedCompanyCode);
      localStorage.setItem('EncryptedResponseCompanyCode', rowData.encryptedCompanyCode);
    }
    else if (rowData.hasOwnProperty('encryptedSecurityUserId')) {
      dispatch(userDetailsAction(rowData));
      $('[data-rr-ui-event-key*="User Detail"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="User Detail"]').trigger('click');
      localStorage.setItem('EncryptedResponseSecurityUserId', rowData.encryptedSecurityUserId);
      $("#UserDetailsForm").trackChanges();
      $('#btnSave').attr('disabled', true);
      getClientDetail(rowData.clientName);
    }
    else if (rowData.hasOwnProperty('encryptedModuleCode')) {
      dispatch(productDetailsAction(rowData))
      $('[data-rr-ui-event-key*="Product Detail"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Product Detail"]').trigger('click');
      $("#AddProductDetailsForm").trackChanges();
      $('#btnSave').attr('disabled', true);
      localStorage.setItem('EncryptedResponseModuleCode', rowData.encryptedModuleCode);
    }
    else if (rowData.hasOwnProperty('encryptedFarmerCode')) {
      localStorage.setItem("EncryptedFarmerCode", rowData.encryptedFarmerCode);
      $('[data-rr-ui-event-key*="Add Farmer"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add Farmer"]').trigger('click');
      getFarmerDetail(rowData.encryptedFarmerCode);
      $("#AddFarmersDetailForm").trackChanges();
      $('#btnSave').attr('disabled', true);
    }
    else if (!rowData.hasOwnProperty('encryptedCompanyCode')) {
      dispatch(clientDetailsAction(rowData));
      $('[data-rr-ui-event-key*="Details"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Customer Details"]').trigger('click');
      $("#AddClientDetailsForm").trackChanges();
      $('#btnSave').attr('disabled', true);
      localStorage.setItem('EncryptedResponseClientCode', rowData.encryptedClientCode);
      $("#AddContactDetailsForm").hide();
      $("#btnAddClientDetail").hide();
      $("#btnUpdateClientDetail").show();
      $("#ContactDetailsTable").show();
      getContactDetailsList(rowData.encryptedClientCode);
      getTransactionDetailsList(rowData.encryptedClientCode);
    }

  }

  const getContactDetailsList = async (encryptedClientCode) => {

    const requestParams = {
      EncryptedClientCode: encryptedClientCode
    }

    axios
      .post(process.env.REACT_APP_API_URL + '/get-client-contact-detail-list', requestParams, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
      })
      .then(res => {

        if (res.data.status == 200) {
          let contactDetailsData = [];
          if ($('#ContactDetailsTable tbody tr').length > 1) {
            $('#ContactDetailsTable tbody tr').remove();
          }

          contactDetailsData = res.data.data;
          dispatch(clientContactDetailsAction(contactDetailsData));

          if (res.data && res.data.data.length > 0) {
            $("#ClientContactDetailsTable").show();
          } else {
            $("#ClientContactDetailsTable").hide();
          }
        }
        else {
          $("#ClientContactDetailsTable").hide();
        }
      });
  }

  const getTransactionDetailsList = async (encryptedClientCode) => {
    const requestParams = {
      EncryptedClientCode: encryptedClientCode
    }

    axios
      .post(process.env.REACT_APP_API_URL + '/client-registration-authorization-list', requestParams, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
      })
      .then(res => {

        if ($('#TransactionDetailsTable tbody tr').length > 1) {
          $('#TransactionDetailsTable tbody tr').remove();
        }
        let transactionDetailsData = [];
        transactionDetailsData = res.data.data.length > 0 ? res.data.data : [];
        dispatch(transactionDetailsAction(transactionDetailsData));

        if (res.data.status == 200) {
          if (res.data && res.data.data.length > 0) {
            $("#TransactionDetailsTable").show();
            $("#TransactionDetailsListCard").show();
          } else {
            $("#TransactionDetailsTable").hide();
            $("#TransactionDetailsListCard").hide();
          }
        }
        else {
          $("#TransactionDetailsTable").hide();
        }
      });
  }

  const getCommonContactDetailsList = async (encryptedCompanyCode) => {
    const request = {
      EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
      EncryptedCompanyCode: encryptedCompanyCode,
      OriginatedFrom: "CM"
    }

    axios
      .post(process.env.REACT_APP_API_URL + '/get-common-contact-detail-list', request, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
      })
      .then(res => {

        if (res.data.status == 200) {
          let commonContactDetailsData = [];
          if ($('#CommonContactDetailsCard tbody tr').length > 1) {
            $('#CommonContactDetailsCard tbody tr').remove();
          }
          commonContactDetailsData = res.data.data;
          dispatch(commonContactDetailsListAction(commonContactDetailsData));

          if (res.data && res.data.data.length > 0) {
            $("#CompanyContactDetailsTable").show();
          } else {
            $("#CompanyContactDetailsTable").hide();
          }
        }
        else {
          $("#CompanyContactDetailsTable").hide();
        }
      });
  }

  const getClientDetail = (clientName) => {
    if (clientUserData) {
      const clientDetail = clientUserData.find(x => x.customerName == clientName);
      $('#txtCountry').val(clientDetail.country);
      $('#txtState').val(clientDetail.state);
    }
  }

  const getFarmerDetail = async (encryptedFarmerCode) => {
    const request = {
      EncryptedFarmerCode: encryptedFarmerCode
    }

    let farmerResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-farmer-master-detail', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })

    if (farmerResponse.data.status == 200) {
      if (farmerResponse.data.data) {
        dispatch(farmerDetailsAction(farmerResponse.data.data));
      }
    }
  }

  return (
    <>
      <Table id="advanceTable" {...getTableProps(tableProps)}>
        <thead className={headerClassName}>
          <tr>
            {headers.map((column, index) => (
              <th
                key={index}
                {...column.getHeaderProps(
                  column.getSortByToggleProps(column.headerProps)
                )}
              >
                {column.render('Header')}
                {column.canSort ? (
                  column.isSorted ? (
                    column.isSortedDesc ? (
                      <span className="sort desc" />
                    ) : (
                      <span className="sort asc" />
                    )
                  ) : (
                    <span className="sort" />
                  )
                ) : (
                  ''
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} className={rowClassName} {...row.getRowProps()} onDoubleClick={() => toTabPage(row.original)}>
                {row.cells.map((cell, index) => {

                  return (
                    <>
                      <td
                        key={index}
                        {...cell.getCellProps(cell.column.cellProps)}
                      >
                        {
                          cell.column.id != "status" && cell.column.id != "approvalStatus" ?
                            cell.render('Cell') :
                            cell.column.id == "status" && cell.row.values.status == "Active" ?
                              <Badge
                                pill
                                bg="success"
                              >
                                {cell.render('Cell')}
                              </Badge> :
                              cell.column.id == "status" && cell.row.values.status == "Suspended" ?
                                <Badge
                                  pill
                                  bg="secondary"
                                >
                                  {cell.render('Cell')}
                                </Badge> :
                                cell.column.id == "approvalStatus" && cell.row.values.approvalStatus == "Approved" ?
                                  <Badge
                                    pill
                                    bg="success"
                                  >
                                    {cell.render('Cell')}
                                  </Badge>
                                  :
                                  cell.column.id == "approvalStatus" && cell.row.values.approvalStatus == "Draft" ?
                                    <Badge
                                      pill
                                      bg="info"
                                    >
                                      {cell.render('Cell')}
                                    </Badge>
                                    :
                                    cell.column.id == "approvalStatus" && cell.row.values.approvalStatus == "Send for Verification" ?
                                      <Badge
                                        pill
                                        bg="warning"
                                      >
                                        {cell.render('Cell')}
                                      </Badge>
                                      :
                                      cell.column.id == "approvalStatus" && cell.row.values.approvalStatus == "Suspended" ?
                                        <Badge
                                          pill
                                          bg="danger"
                                        >
                                          {cell.render('Cell')}
                                        </Badge>
                                        : ''
                        }
                      </td>
                    </>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

setTimeout(() => {
  $("#advanceTable tbody tr").click(function () {
    if ($(this).hasClass("row-selected")) {
      return;
    }
    $("#advanceTable tr.row-selected").removeClass("row-selected");
    $(this).addClass("row-selected");
  });
}, 1000);

AdvanceTable.propTypes = {
  getTableProps: PropTypes.func,
  headers: PropTypes.array,
  page: PropTypes.array,
  prepareRow: PropTypes.func,
  headerClassName: PropTypes.string,
  rowClassName: PropTypes.string,
  tableProps: PropTypes.object
};

export default AdvanceTable;