import React from 'react';
import { useEffect } from 'react';
import {useSelector} from 'react-redux';
import Moment from "moment";
import { Table } from 'react-bootstrap';

const TransactionDetailList = () => {
  
  const transactionDetailReducer = useSelector((state) => state.rootReducer.transactionDetailsReducer)
  const clientDetailsErrorReducer = useSelector((state) => state.rootReducer.clientDetailsErrorReducer)
  const clientError = clientDetailsErrorReducer.clientDetailsError;

  useEffect(() => {
    const count = $('#TransactionDetailsTable tr').length;
    if (count > 1) {
      $("#TransactionDetailsTable").show();
    }else{
      $("#TransactionDetailsTable").hide();
    }

    if(clientError.transactionDetailErr.Count > 0)
    {
      $("#TransactionDetailsListCard").show();
    }
    else{
      $("#TransactionDetailsListCard").hide();
    }
  }, []);

  return (
    <>
      { 
          clientError.transactionDetailErr && 
          (
            <div className='mb-3'>
              <span className="error-message">{clientError.transactionDetailErr.transactionEmpty}</span>
            </div>
          )
        }     

       <Table striped responsive id="TransactionDetailsTable">
        <thead>
          <tr>
            <th>Module Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Payment Type</th>
            <th>Amount</th>
            <th>GST %</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactionDetailReducer &&
           transactionDetailReducer.transactionDetails && 
           transactionDetailReducer.transactionDetails.length > 0 &&
           transactionDetailReducer.transactionDetails.map(data =>
            <tr>
              <td>{data.moduleName}</td>
              <td>{Moment(data.startDate).format("DD/MM/YYYY")}</td>
              <td>{Moment(data.endDate).format("DD/MM/YYYY")}</td>
              <td>{data.paymentMode == "CQ" ? "Cheque" :
                   data.paymentMode == "CS" ? "Cash" :
                   data.paymentMode == "TT" ? "TT" :
                   data.paymentMode == "GP" ? "GPay" : "NB"}</td>
              <td>{data.amount}</td>
              <td>{data.gstPercent}%</td>
              <td>{data.totalAmount}</td>
            </tr>)}
        </tbody>
      </Table>
    </>
  )
};

export default TransactionDetailList;