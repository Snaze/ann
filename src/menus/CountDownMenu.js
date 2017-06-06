import React from 'react';
import PropTypes from 'prop-types';
import DataSourceComponent from "../DataSourceComponent";
import "./CountDownMenu.css";
import {default as CountDownMenuModel} from "../model/menus/CountDownMenu";
import "../../node_modules/animate.css/animate.min.css";
import Entity from "../Entity";

class CountDownMenu extends DataSourceComponent {

    get countDownMenu() {
        return this.dataSource;
    }

    get countDownMenuContent() {
        if (this.countDownMenu.count > 0) {
            return this.countDownMenu.count.toString();
        }

        return this.countDownMenu.finishText;
    }

    get countDownMenuContentClassName() {
        if (this.countDownMenu.count > 0) {
            return "CountDownMenuContent"
        }

        return "CountDownMenuContent bounceIn animated";
    }

    getCountDownContent() {
        return (<div className={this.countDownMenuContentClassName}>{this.countDownMenuContent}</div>);
    }

    getAnimation() {
        if (this.countDownMenu.showAnimation) {
            return (<div style={{width: "100%", height: "100%"}}>
                <table className="CountDownMenuMoveRightAnimation">
                    <tbody>
                    <tr>
                        <td>
                            <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                                    modifier={Entity.MODIFIER_DIRECTION_RIGHT} />
                        </td>
                        <td>
                            <Entity designator={Entity.DESIGNATOR_SCARED_GHOST}
                                    modifier={Entity.MODIFIER_DIRECTION_RIGHT} />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table className="CountDownMenuMoveLeftAnimation">
                    <tbody>
                    <tr>
                        <td>
                            <Entity designator={Entity.DESIGNATOR_SCARED_GHOST}
                                    modifier={Entity.MODIFIER_DIRECTION_LEFT} />
                        </td>
                        <td>
                            <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                                    modifier={Entity.MODIFIER_DIRECTION_LEFT} />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table className="CountDownMenuMoveUpAnimation">
                    <tbody>
                    <tr>
                        <td>
                            <Entity designator={Entity.DESIGNATOR_SCARED_GHOST}
                                    modifier={Entity.MODIFIER_DIRECTION_UP} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                                    modifier={Entity.MODIFIER_DIRECTION_UP} />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table className="CountDownMenuMoveDownAnimation">
                    <tbody>
                    <tr>
                        <td>
                            <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                                    modifier={Entity.MODIFIER_DIRECTION_DOWN} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Entity designator={Entity.DESIGNATOR_SCARED_GHOST}
                                    modifier={Entity.MODIFIER_DIRECTION_DOWN} />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>);
        }

        return null;
    }

    render() {
        return (<div className="CountDownMenu">
            {this.getAnimation()}
            {this.getCountDownContent()}
        </div>);
    }
}

CountDownMenu.propTypes = {
    dataSource: PropTypes.instanceOf(CountDownMenuModel).isRequired
};

export default CountDownMenu;