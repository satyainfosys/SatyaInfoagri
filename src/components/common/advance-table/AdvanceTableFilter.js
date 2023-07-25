/* eslint-disable react/prop-types */
import React from 'react';
import { Form } from 'react-bootstrap';

const AdvanceTableFilter = ({
  options,
  filterName,
  handleFilterChange,
  filterValue
}) => {

  return (
    <>
      {options && options.length > 0 &&
        <Form.Select onChange={handleFilterChange} disabled={options.length == 1} value={filterValue}>
          {options.length > 1 &&
            <option value=''>Select {filterName}</option>
          }
          {options.map((option, index) => (
            <option key={index} value={option.value}>{option.key}</option>
          ))}
        </Form.Select>
      }
    </>
  );
};

export default AdvanceTableFilter;