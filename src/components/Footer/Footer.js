import React, { Component } from 'react';
import { Pagination } from 'antd';
import './Footer.css';

export default class Footer extends Component {

    state = {
        page: 1
    };

    handlePageChange = (page) => {
        this.setState({ page });
        this.props.onPageChange(page);
        console.log(`Текущая страница ${page}`);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    render() {
        return (
            <div className="footer__wrapper">
                <Pagination
                    defaultCurrent={1} 
                    total={50} 
                    onChange={this.handlePageChange}
                />
            </div>
        );
    }
}