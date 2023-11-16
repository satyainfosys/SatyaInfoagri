import React, { useState } from 'react';
import Flex from './Flex';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

const TablePagination = ({
    pageCount,
    handlePageClick,
    pageSize,
    handlePageSizeChange,
    previousClick,
    nextClick,
    isDisablePrevious,
    isDisableNext
}) => {

    const [rowsPerPage, setRowsPerPage] = useState([5, 10, 20, 30, 40])

    return (
        <>
            <Flex >
                <Form.Label column className='col-auto'>
                    Rows per page:
                </Form.Label>
                <Col sm="2">
                    <Form.Select
                        size="sm"
                        className="w-auto"
                        onChange={handlePageSizeChange}
                        defaultValue={pageSize}
                    >
                        {rowsPerPage.map(value => (
                            <option value={value} key={value}>
                                {value}
                            </option>
                        ))}
                    </Form.Select>
                </Col>

                <div>
                    {
                        pageCount > 0 &&
                        <>
                            <Flex alignItems="center" justifyContent="center">
                                <Button
                                    size="sm"
                                    variant="falcon-default"
                                    className={classNames({ disabled: isDisablePrevious })}
                                    onClick={previousClick}
                                >
                                    <FontAwesomeIcon icon="chevron-left" />
                                </Button>

                                <ul className="pagination mb-0 mx-1">
                                    {Array.from(Array(pageCount).keys()).map((page, index) => (
                                        <li key={page} className={classNames({ active: page })}>
                                            <Button
                                                size="sm"
                                                variant="falcon-default"
                                                className={classNames('page', {
                                                    'me-1': index + 1 !== pageCount
                                                })}
                                                onClick={() => handlePageClick({ selected: page })}
                                            >
                                                {page + 1}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    size="sm"
                                    variant="falcon-default"
                                    onClick={nextClick}
                                    // disabled={isDisableNext}
                                    className={classNames({ disabled: isDisableNext })}
                                >
                                    <FontAwesomeIcon icon="chevron-right" />
                                </Button>
                            </Flex>
                        </>
                    }
                </div>
            </Flex >
        </>
    )
}

export default TablePagination