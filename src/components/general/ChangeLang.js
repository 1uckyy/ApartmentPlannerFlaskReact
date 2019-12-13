import React, { Component } from 'react';
import earth from '../../images/PlannerPage/earth_white.png'
import uk from '../../images/IndexPage/united-kingdom.png'
import rus from '../../images/IndexPage/russia.png'

class ChangeLang extends Component {
    render () {
        return (
            <>
            <img id="earth" src={earth} alt="Выбор языка" className="change_lang" />
            <div className="choose_lang">
            <div className="english_lang">
                <img src={uk} alt="english" />
            </div>
            <div className="russian_lang">
                <img src={rus} alt="русский" />
            </div>
            </div>
            </>
        )
    }
}

export default ChangeLang;
