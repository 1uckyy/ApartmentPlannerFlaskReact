import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MenuButton extends Component {
    render () {
        return (
            <button className="menu_btn">
                <Link to={this.props.link} style={{textDecoration: "none"}}>
                <div className="text_btn">{this.props.text}</div>
                    <div className="icon_btn">
                        <img className="icon_btn_sign_in" src={this.props.icon} alt={this.props.alt} />
                    </div>
                </Link>
            </button>
        )
    }
}

export default MenuButton;
