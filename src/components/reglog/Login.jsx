import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

//components
import ChangeLang from '../general/ChangeLang';

class MenuButton extends Component {

    constructor(props){
        super(props);

        this.state = {
            users: []
        };
    }

    componentWillMount(){
        axios.get('/api/users')
            .then(res => {
                var data = []
                Object.keys(res.data).forEach(function(key) {
                    var val = res.data[key]
                    data.push([val._id, val.first_name, val.last_name])
                })
                console.log(data)
                this.setState({users: data})
            })
            .catch(function(error){
                console.log(error);
            })
    }

    render () {
        return (
            <>
            <header id="header" className="header">
                <Link to="/" style={{textDecoration: "none"}}>
                <div className="logo_text_around">
                    <div id="logo" className="logo_text">
                        Apartment Planner
                    </div>
                </div>
                </Link>

                <ChangeLang />
            </header>

        <div>{this.state.users}</div>
            </>
        )
    }
}

export default MenuButton;
