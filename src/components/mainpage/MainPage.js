//css
import '../../css/MainPageStyle.css';

//components
import React, { Component } from 'react';
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

class MainPage extends Component {
  render () {
    return (
      <div className="blackout_for_bg">
  
        <header>
          <div id="logo" className="logo">
            <div className="logo_text">
              Apartment Planner
            </div>
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
          <MenuButton text="Вход" icon={sign_in} alt="Войти"/>
          <MenuButton text="Регистрация" icon={sign_up} alt="Зарегистрироваться"/>
          <MenuButton text="Начать проектировать" icon={begin_plan} alt="Начать проектировать"/>
        </section>
      </div>
    )
  }
}

export default MainPage;
