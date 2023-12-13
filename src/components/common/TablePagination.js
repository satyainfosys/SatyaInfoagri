import React, { useState } from 'react';
import Flex from './Flex';
import { Form, Button, Col} from 'react-bootstrap';
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
    isDisableNext,
    pageIndex
}) => {

    const [rowsPerPage, setRowsPerPage] = useState([5, 10, 20, 30, 40])

    return (
        <>
            <Flex alignItems="center" justifyContent="center">
                <Form.Label column className='col-auto'>
                    Rows per page&nbsp;
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

                <Col column className="col-auto">
                    {
                        pageCount > 0 &&
                        <>
                            <Flex className="ms-5">
                                <Button
                                    size="lg"
                                    variant="falcon-default"
                                    className={classNames({ disabled: isDisablePrevious })}
                                    onClick={previousClick}
                                >
                                    <FontAwesomeIcon icon="chevron-left" />
                                </Button>

                                <ul className="pagination mb-0 mx-1">
                                    {Array.from(Array(pageCount).keys()).map((page, index) => (
                                        <li key={page} className={classNames({ active: pageIndex == page })}>
                                            <Button
                                                size="lg"
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
                                    size="lg"
                                    variant="falcon-default"
                                    onClick={nextClick}
                                    className={classNames({ disabled: isDisableNext })}
                                >
                                    <FontAwesomeIcon icon="chevron-right" />
                                </Button>
                            </Flex>
                        </>
                    }
                </Col>
            </Flex >
        </>
    )
}

export default TablePagination