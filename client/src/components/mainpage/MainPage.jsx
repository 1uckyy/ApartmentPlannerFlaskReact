import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

//css
import '../../css/MainPageStyle.css';

//components
import ChangeLang from '../general/ChangeLang';
import ViewCapability from './ViewCapability';
import MenuButton from './MenuButton';

//images
//capabilities
import idea from '../../images/IndexPage/idea.png';
import plan from '../../images/IndexPage/plan.png';
import money_income from '../../images/IndexPage/money_income.png';
//buttons
import sign_in from '../../images/IndexPage/sign_in.png';
import sign_up from '../../images/IndexPage/sign_up.png';
import begin_plan from '../../images/IndexPage/begin_plan.png';
import sign_out from '../../images/IndexPage/exit.png';
import profile from '../../images/IndexPage/profile.png';

class MainPage extends Component {

  constructor() {
    super()
    this.state = {
        email: '',
    }
  }

  componentDidMount () {
    if(localStorage.usertoken){
      const token = localStorage.usertoken
      const decoded = jwt_decode(token)
      this.setState({
          email: decoded.identity.email,
      })
    }
  }

  logOut (e) {
    e.preventDefault()
    localStorage.removeItem('usertoken')
    this.props.history.push(`/`)
  }

  render () {

    const loginRegLink = (
      <>
        <MenuButton link="/login" text="Вход" icon={sign_in} alt="Войти"/>
        <MenuButton link="/registration" text="Регистрация" icon={sign_up} alt="Зарегистрироваться"/>
      </>
    )

    const userLink = (
        <>
          <MenuButton link="/profile" text={this.state.email} icon={profile} alt="Профиль"/>

          <button className="menu_btn" onClick={this.logOut.bind(this)}>
            <div className="text_btn">Выйти</div>
              <div className="icon_btn">
                <img className="icon_btn_sign_in" src={sign_out} alt="Выйти" />
              </div>
          </button>
        </>
    )

    return (
      <div className="blackout_for_bg">
  
        <header>
          <div id="logo" className="logo">
          <Link to="/" style={{textDecoration: "none"}}>
            <div className="logo_text">
              Apartment Planner
            </div>
          </Link>
          </div>
          <ChangeLang/>
        </header>
  
        <section className="main_capabilities">
          <ViewCapability src={idea} alt="Идея" text="Реализуй свои идеи"/>
          <ViewCapability src={plan} alt="Заказ проектировки" text="Закажи проектировку"/>
          <ViewCapability src={money_income} alt="Стань проектировщиком" text="Стань проектировщиком"/>
          <div className="black_line"></div>
        </section>
  
        <section className="menu">
          {localStorage.usertoken ? userLink : loginRegLink}
          <MenuButton link="/planner" text="Начать проектировать" icon={begin_plan} alt="Начать проектировать"/>
        </section>
      </div>
    )
  }
}

export default MainPage;
