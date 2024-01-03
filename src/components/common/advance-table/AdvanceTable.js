import PropTypes from 'prop-types';
import { Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { companyDetailsAction, userDetailsAction, productDetailsAction, clientContactListAction, commonContactDetailsAction, distributionCentreDetailsAction, tabInfoAction, collectionCentreDetailsAction, productLineDetailsAction, productMasterDetailsAction, oemMasterDetailsAction, vendorMasterDetailsAction, purchaseOrderDetailsAction, materialReceiptHeaderDetailsAction, vendorInvoiceEntryHeaderDetailsAction } from '../../../actions/index';
import { transactionDetailsAction } from '../../../actions/index';
import { clientDetailsAction } from '../../../actions/index';
import { farmerDetailsAction } from '../../../actions/index';
import IconButton from '../IconButton';
import $ from 'jquery';

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
    if (rowData.hasOwnProperty('encryptedSecurityUserId')) {
      if (rowData.isClientUser) {
        dispatch(userDetailsAction(rowData));
        $('[data-rr-ui-event-key*="Add Client User"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add Client User"]').trigger('click');
        localStorage.setItem('EncryptedClientSecurityUserId', rowData.encryptedSecurityUserId);
        $('#btnSave').attr('disabled', true);
      }
      else {
        dispatch(userDetailsAction(rowData));
        $('[data-rr-ui-event-key*="User Detail"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="User Detail"]').trigger('click');
        localStorage.setItem('EncryptedResponseSecurityUserId', rowData.encryptedSecurityUserId);
        $('#btnSave').attr('disabled', true);
        getClientDetail(rowData.clientName);
      }
    }
    else if (rowData.hasOwnProperty('encryptedInvoiceHeaderCode')) {
      localStorage.setItem("OldInvoiceStatus", rowData.invoiceStatus);
      localStorage.setItem('EncryptedInvoiceHeaderCode', rowData.encryptedInvoiceHeaderCode);
      dispatch(vendorInvoiceEntryHeaderDetailsAction(rowData));
      $('[data-rr-ui-event-key*="Add Vendor Invoice Entry"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add Vendor Invoice Entry"]').trigger('click');
      $('#btnSave').attr('disabled', true);
    }
    else if (rowData.hasOwnProperty('encryptedCompanyCode')) {
      dispatch(companyDetailsAction(rowData));
      $("#contactListChkBoxRow").hide();
      $("#clientChkBoxRow").hide();
      $('[data-rr-ui-event-key*="Maintenance"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Maintenance"]').trigger('click');
      $('#btnSave').attr('disabled', true);
      getCommonContactDetailsList(rowData.encryptedCompanyCode);
      localStorage.setItem('EncryptedResponseCompanyCode', rowData.encryptedCompanyCode);
    }
    else if (rowData.hasOwnProperty('encryptedModuleCode')) {
      dispatch(productDetailsAction(rowData))
      $('[data-rr-ui-event-key*="Product Detail"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Product Detail"]').trigger('click');
      $('#btnSave').attr('disabled', true);
      localStorage.setItem('EncryptedResponseModuleCode', rowData.encryptedModuleCode);
    }
    else if (rowData.hasOwnProperty('encryptedFarmerCode')) {
      localStorage.setItem("EncryptedFarmerCode", rowData.encryptedFarmerCode);
      $('[data-rr-ui-event-key*="Add Farmer"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add Farmer"]').trigger('click');
      getFarmerDetail(rowData.encryptedFarmerCode);
      $('#btnSave').attr('disabled', true);
      dispatch(tabInfoAction({
        title1: `${localStorage.getItem("CompanyName")}`,
        title2: rowData.farmerName
      }))
    }
    else if (rowData.hasOwnProperty('encryptedDistributionCentreCode')) {
      localStorage.setItem("EncryptedDistributionCentreCode", rowData.encryptedDistributionCentreCode);
      dispatch(distributionCentreDetailsAction(rowData));
      $('[data-rr-ui-event-key*="Add New Distribution"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add New Distribution"]').trigger('click');
      $('#btnSave').attr('disabled', true);
      dispatch(tabInfoAction({
        title1: `${localStorage.getItem("CompanyName")}`,
        title2: rowData.distributionName
      }))
    }
    else if (rowData.hasOwnProperty('encryptedCollectionCentreCode')) {
      localStorage.setItem("EncryptedCollectionCentreCode", rowData.encryptedCollectionCentreCode);
      dispatch(collectionCentreDetailsAction(rowData));
      $('[data-rr-ui-event-key*="Add Collection Centre"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add Collection Centre"]').trigger('click');
      $('#btnSave').attr('disabled', true);
      dispatch(tabInfoAction({
        title1: `${localStorage.getItem("CompanyName")}`,
        title2: rowData.collectionCentreName
      }))
    }
    else if (rowData.hasOwnProperty('encryptedProductCode')) {
      localStorage.setItem('EncryptedProductCode', rowData.encryptedProductCode);
      localStorage.setItem('ProductLineCode', rowData.productCode);
      dispatch(productLineDetailsAction(rowData));
      $('[data-rr-ui-event-key*="Add Product"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add Product"]').trigger('click');
      $('#btnSave').attr('disabled', true);
    }
    else if (rowData.hasOwnProperty('encryptedProductMasterCode')) {
      localStorage.setItem('EncryptedProductMasterCode', rowData.encryptedProductMasterCode);
      localStorage.setItem('ProductLineCode', rowData.productLineCode);
      localStorage.setItem('ProductCategoryCode', rowData.productCategoryCode);
      dispatch(productMasterDetailsAction(rowData));
      $('[data-rr-ui-event-key*="Add Product Master"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add Product Master"]').trigger('click');
      $('#btnSave').attr('disabled', true);
    }
    else if (rowData.hasOwnProperty('encryptedOemMasterCode')) {
      localStorage.setItem('EncryptedOemMasterCode', rowData.encryptedOemMasterCode);
      dispatch(oemMasterDetailsAction(rowData));
      $('[data-rr-ui-event-key*="Add OEM"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add OEM"]').trigger('click');
      $('#btnSave').attr('disabled', true);
    }
    else if (rowData.hasOwnProperty('encryptedVendorCode')) {
      localStorage.setItem('EncryptedVendorCode', rowData.encryptedVendorCode);
      dispatch(vendorMasterDetailsAction(rowData));
      $('[data-rr-ui-event-key*="Add Vendor"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Add Vendor"]').trigger('click');
      $('#btnSave').attr('disabled', true);
      dispatch(tabInfoAction({
        title1: `${localStorage.getItem("CompanyName")}`
      }))
    }
    else if (rowData.hasOwnProperty('encryptedPoNo')) {
      localStorage.setItem('EncryptedPoNo', rowData.encryptedPoNo);
      localStorage.setItem('OldPoStatus', rowData.poStatus)
      dispatch(purchaseOrderDetailsAction(rowData));
      $('#btnSave').attr('disabled', true);
      dispatch(tabInfoAction({
        title1: `${localStorage.getItem("CompanyName")}`
      }))

      if (rowData.farmerCode) {
        $('[data-rr-ui-event-key*="Add Crop Purchase"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add Crop Purchase"]').trigger('click');
      }
      else if (rowData.vendorCode) {
        $('[data-rr-ui-event-key*="Add PO"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add PO"]').trigger('click');
      }
    }
    else if (rowData.hasOwnProperty('encryptedMaterialReceiptId')) {
      localStorage.setItem("EncryptedMaterialReceiptId", rowData.encryptedMaterialReceiptId);
      localStorage.setItem("OldMaterialStatus", rowData.materialStatus);
      dispatch(materialReceiptHeaderDetailsAction(rowData));
      $('#btnSave').attr('disabled', true);
      dispatch(tabInfoAction({
        title1: `${localStorage.getItem("CompanyName")}`
      }))
      if (rowData.farmerCode) {
        $('[data-rr-ui-event-key*="Add Crop PurchaseV1"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add Crop PurchaseV1"]').trigger('click');
      }
      else if (rowData.vendorCode) {
        $('[data-rr-ui-event-key*="Add Material"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add Material"]').trigger('click');
      }
    }
    else if (!rowData.hasOwnProperty('encryptedCompanyCode')) {
      dispatch(clientDetailsAction(rowData));
      $('[data-rr-ui-event-key*="Details"]').attr('disabled', false);
      $('[data-rr-ui-event-key*="Customer Details"]').trigger('click');
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
          contactDetailsData = res.data.data;
          dispatch(clientContactListAction(contactDetailsData));
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
          if (res.data.data && res.data.data.length > 0) {
            dispatch(commonContactDetailsAction(res.data.data))
          }
        }
        else {
          $("#CompanyContactDetailsTable").hide();
        }
      });
  }

  const getClientDetail = (clientName) => {
    if (clientUserData && clientUserData.length > 0) {
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

  const generatePdf = async (farmerCode, vendorCode, encryptedMaterialReceiptId, encryptedPoNo, encryptedInvoiceHeaderCode) => {
    var url = "";
    if (farmerCode) {
      url = `/crop-purchase-receipt/${encryptedMaterialReceiptId}`;
    }
    else if (vendorCode) {
      url = `/material-receipt/${encryptedMaterialReceiptId}`;
    }
    else if (encryptedPoNo) {
      url = `/purchase-order-receipt/${encryptedPoNo}`;
    }
    else if (encryptedInvoiceHeaderCode) {
      url = `/vendor-invoice-entry/${encryptedInvoiceHeaderCode}`
    }

    window.open(url, '_blank');
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
                          cell.column.id !== "status" && cell.column.id !== "approvalStatus" && cell.column.id !== 'poPrintStatus' &&
                            cell.column.id !== 'printStatus' && cell.column.id !== 'materialStatus' && cell.column.id !== 'poStatus' && cell.column.id !== 'invoiceStatus' && cell.column.id !== 'vendorInvoicePrintStatus' ?
                            cell.render('Cell') :
                            cell.column.id == "status" && cell.row.values.status == "Active" ?
                              <Badge
                                pill
                                bg="success"
                              >
                                {cell.render('Cell')}
                              </Badge>
                              :
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
                                        :
                                        cell.column.id == "materialStatus" && cell.row.values.materialStatus == "Approved" ?
                                          <Badge
                                            pill
                                            bg="success"
                                          >
                                            {cell.render('Cell')}
                                          </Badge>
                                          :
                                          cell.column.id == "materialStatus" && cell.row.values.materialStatus == "Draft" ?
                                            <Badge
                                              pill
                                              bg="info"
                                            >
                                              {cell.render('Cell')}
                                            </Badge>
                                            :
                                            cell.column.id == "poStatus" && cell.row.values.poStatus == "Approved" ?
                                              <Badge
                                                pill
                                                bg="success"
                                              >
                                                {cell.render('Cell')}
                                              </Badge>
                                              :
                                              cell.column.id == "poStatus" && cell.row.values.poStatus == "Draft" ?
                                                <Badge
                                                  pill
                                                  bg="info"
                                                >
                                                  {cell.render('Cell')}
                                                </Badge>
                                                :
                                                cell.column.id == "poStatus" && cell.row.values.poStatus == "Rejected" ?
                                                  <Badge
                                                    pill
                                                    bg="danger"
                                                  >
                                                    {cell.render('Cell')}
                                                  </Badge>
                                                  :
                                                  cell.column.id == "poStatus" && cell.row.values.poStatus == "Hold" ?
                                                    <Badge
                                                      pill
                                                      bg="warning"
                                                    >
                                                      {cell.render('Cell')}
                                                    </Badge>
                                                    :
                                                    cell.column.id == "printStatus" && cell.row.values.printStatus == "Approved" ?
                                                      <IconButton
                                                        variant="falcon-default"
                                                        size="sm"
                                                        icon="print"
                                                        iconClassName="me-1"
                                                        className="me-1 mb-2 mb-sm-0 hide-on-print"
                                                        onClick={() => generatePdf(cell.row.original.farmerCode, cell.row.original.vendorCode, cell.row.original.encryptedMaterialReceiptId)}
                                                      >
                                                        Print
                                                      </IconButton>
                                                      :
                                                      cell.column.id == "poPrintStatus" && cell.row.values.poPrintStatus == "Approved" ?
                                                        <IconButton
                                                          variant="falcon-default"
                                                          size="sm"
                                                          icon="print"
                                                          iconClassName="me-1"
                                                          className="me-1 mb-2 mb-sm-0 hide-on-print"
                                                          onClick={() => generatePdf('', '', '', cell.row.original.encryptedPoNo)}
                                                        >
                                                          Print
                                                        </IconButton>
                                                        :
                                                        cell.column.id == "vendorInvoicePrintStatus" && cell.row.values.vendorInvoicePrintStatus == "Approved" ?
                                                          <IconButton
                                                            variant="falcon-default"
                                                            size="sm"
                                                            icon="print"
                                                            iconClassName="me-1"
                                                            className="me-1 mb-2 mb-sm-0 hide-on-print"
                                                            onClick={() => generatePdf('', '', '', '', cell.row.original.encryptedInvoiceHeaderCode)}
                                                          >
                                                            Print
                                                          </IconButton>
                                                          :
                                                          cell.column.id == "invoiceStatus" && cell.row.values.invoiceStatus == "Approved" ?
                                                            <Badge
                                                              pill
                                                              bg="success"
                                                            >
                                                              {cell.render('Cell')}
                                                            </Badge>
                                                            :
                                                            cell.column.id == "invoiceStatus" && cell.row.values.invoiceStatus == "Draft" ?
                                                              <Badge
                                                                pill
                                                                bg="info"
                                                              >
                                                                {cell.render('Cell')}
                                                              </Badge>
                                                              :
                                                              cell.column.id == "invoiceStatus" && cell.row.values.invoiceStatus == "Rejected" ?
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