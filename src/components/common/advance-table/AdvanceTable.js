import PropTypes from 'prop-types';
import SimpleBarReact from 'simplebar-react';
import { Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clientContactDetailsAction } from '../../../actions/index';
import { transactionDetailsAction } from '../../../actions/index';
import { clientDetailsAction } from '../../../actions/index';
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

  var [srNo, setSrNo] = useState(0);

  const dispatch = useDispatch();

  const toTabPage = (rowData) => {
    dispatch(clientDetailsAction(rowData));
    $('[data-rr-ui-event-key*="Details"]').attr('disabled', false);
    $('[data-rr-ui-event-key*="Customer Details"]').trigger('click');
    $('#btnSave').attr('disabled', true);
    localStorage.setItem('EncryptedResponseClientCode', rowData.encryptedClientCode);
    $("#AddContactDetailsForm").hide();
    $("#btnAddClientDetail").hide();
    $("#btnUpdateClientDetail").show();
    getContactDetailsList(rowData.encryptedClientCode);
    getTransactionDetailsList(rowData.encryptedClientCode);
  }

  const getContactDetailsList = async (encryptedClientCode) => {

    const requestParams = {
      EncryptedClientCode: encryptedClientCode
    }

    axios
      .post(process.env.REACT_APP_API_URL + '/get-client-contact-detail-list', requestParams)
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
      .post(process.env.REACT_APP_API_URL + '/client-registration-authorization-list', requestParams)
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

  return (
    <>
      <SimpleBarReact>
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

                    //setSrNo(1);

                    return (
                      <td
                        key={index}
                        {...cell.getCellProps(cell.column.cellProps)}
                      >
                        {
                          index == 0 ?
                            srNo++ :
                            cell.column.id != "status" ?
                              cell.render('Cell') :
                              cell.row.values.status == "Active" ?
                                <Badge
                                  pill
                                  bg="success"
                                >
                                  {cell.render('Cell')}
                                </Badge> :
                                cell.row.values.status == "Suspended" ?
                                  <Badge
                                    pill
                                    bg="secondary"
                                  >
                                    {cell.render('Cell')}
                                  </Badge> : ''
                        }
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </SimpleBarReact>
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
}, 2000);

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