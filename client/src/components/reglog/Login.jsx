import React, { Component } from 'react';
import { Link } from 'react-router-dom';

//components
import ChangeLang from '../general/ChangeLang';

//functions
import { login } from './UserFunctions'

class Login extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            password: ''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit (e) {
        e.preventDefault()

        const user = {
            email: this.state.email,
            password: this.state.password
        }

        login(user).then(res => {
            if (!res.error) {
                this.props.history.push(`/profile`)
            }
        })
    }

    render () {
        return (
            <>
            <header id="header" className="header">
                <div className="logo_text_around">
                <Link to="/" style={{textDecoration: "none"}}>
                    <div id="logo" className="logo_text">
                        Apartment Planner
                    </div>
                </Link>
                </div>

                <ChangeLang />
            </header>

            <div className="container" style={{flexGrow:1}}>
                    <div className="row">
                        <div className="col-md-6 mt-5 mx-auto" style={{ backgroundColor: "white", borderRadius: "10px", padding: "30px" }}>
                            <form noValidate onSubmit={this.onSubmit}>
                                <h1 className="h3 mb-3 font-weight-normal">Вход</h1>
                                <div className="form-group">
                                    <label htmlFor="email">Адрес Email</label>
                                    <input type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Введите Email"
                                        value={this.state.email}
                                        onChange={this.onChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Пароль</label>
                                    <input type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Введите пароль"
                                        value={this.state.password}
                                        onChange={this.onChange} />
                                </div>
                                <button type="submit" className="btn btn-lg btn-primary">
                                    Войти
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Login;
