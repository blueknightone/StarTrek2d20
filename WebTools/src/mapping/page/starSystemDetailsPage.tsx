import * as React from 'react';
import { connect } from 'react-redux';
import { navigateTo, Navigation } from '../../common/navigator';
import { Button } from '../../components/button';
import { Header } from '../../components/header';
import {IPageProperties} from '../../pages/iPageProperties';
import { PageIdentity } from '../../pages/pageIdentity';
import { setStarSystemName } from '../../state/starActions';
import store from '../../state/store';
import { StarSystem } from '../table/starSystem';
import { EditableHeader } from '../view/editableHeader';
import NotablePhenomenonView from '../view/notablePhenomenonView';
import StarView from '../view/starView';
import WorldView from '../view/worldView';

interface IStarSystemDetailsPageProperties extends IPageProperties {
    starSystem?: StarSystem;
}

class StarSystemDetailsPage extends React.Component<IStarSystemDetailsPageProperties, {}> {

    render() {

        return (
            <div className="page container ml-0">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SystemGeneration)}>System Generation</a></li>
                        <li className="breadcrumb-item"><a href="index.html" onClick={(e) => navigateTo(e, PageIdentity.SectorDetails)}>Sector Details</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Star</li>
                    </ol>
                </nav>

                <EditableHeader prefix="System" text={this.props.starSystem.name} onChange={(text) => store.dispatch(setStarSystemName(text))}/>

                <div className="row mt-5">
                    <div className="col-md-2 view-field-label pb-2">Coordinates:</div>
                    <div className="col-md-4 text-white">
                        <div className="view-border-bottom pb-2">
                            {this.props.starSystem ? this.props.starSystem.sectorCoordinates.description : ""}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="row row-cols-1 row-cols-md-2">
                        <NotablePhenomenonView phenomenon={this.props.starSystem ? this.props.starSystem.phenomenon : undefined} />
                        <StarView star={this.props.starSystem ? this.props.starSystem.star : undefined} title="Primary Star" />
                        <StarView star={this.props.starSystem ? this.props.starSystem.companionStar : undefined} title="Companion Star" companionType={this.props.starSystem.companionType} />
                    </div>
                </div>
                <div>
                    <Header level={2} className="mb-4">Worlds</Header>
                    <div>
                        {this.renderWorlds("Inner Zone", 0, this.props.starSystem.gardenZoneInnerRadius)}
                        {this.renderWorlds("Ecosphere", this.props.starSystem.gardenZoneInnerRadius, this.props.starSystem.gardenZoneOuterRadius)}
                        {this.renderWorlds("Outer Zone", this.props.starSystem.gardenZoneOuterRadius)}
                    </div>
                </div>

                <div>
                    <Button buttonType={true} text="Back to Sector" onClick={() => navigateTo(null, PageIdentity.SectorDetails) } />
                </div>
            </div>);
    }

    renderWorlds(title: string, from: number, to?: number) {
        let worlds = this.props.starSystem.worlds.filter(w => w.orbitalRadius >= from && (to == null || w.orbitalRadius < to));
        if (worlds.length > 0) {
            let list = worlds.map((w,i) => <WorldView world={w} system={this.props.starSystem} key={'world-' + w.orbitalRadius}/>);
            return (<div>
                <div className="page-text my-3">{title}</div>
                <div className="row row-cols-1 row-cols-md-2">
                    {list}
                </div>
            </div>);
        } else {
            return undefined;
        }
    }

    renderTitle() {
        let result = "Star System";
        if (this.props.starSystem) {
            return result + ' • ' + this.props.starSystem.name;
        } else {
            return result;
        }
    }

    navigateBack(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        event.stopPropagation();
        Navigation.navigateToPage(PageIdentity.SystemGeneration);
    }

}

function mapStateToProps(state, ownProps) {
    return { 
        starSystem: state.star.starSystem
    };
}

export default connect(mapStateToProps)(StarSystemDetailsPage);