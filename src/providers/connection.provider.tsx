import { Container } from 'unstated';
import { ConnectorMeta, ConnectionMeta } from '../atoms';
import _ from 'lodash';

interface ConnectionProviderState {
    Smetadata: ConnectorMeta | null;
    Emetadata: ConnectorMeta | null;
    isValid: boolean;
}

export class ConnectionProvider extends Container<ConnectionProviderState> {
    state = { Smetadata: null, Emetadata: null, isValid: false };

    areConnected = () => {
        return !!this.state.Smetadata.connections.find((cn: ConnectionMeta) => (cn.id === this.state.Emetadata.id)) || !!this.state.Emetadata.connections.find((cn: ConnectionMeta) => (cn.id === this.state.Smetadata.id));
    }

    pointsAreValid = () => {
        return !!(this.state.Smetadata && this.state.Smetadata.Position.x && this.state.Smetadata.Position.y &&
            this.state.Emetadata && this.state.Emetadata.Position.x && this.state.Emetadata.Position.y) &&
            !this.areConnected()
    }

    setSPoint = async (Smetadata: ConnectorMeta) => {
        if(_.isEqual(Smetadata, this.state.Smetadata)) { return }
        await this.setState({ Smetadata })
        if (this.pointsAreValid()) { this.setState({ isValid: true }) }
    }

    setEPoint = async (Emetadata: ConnectorMeta) => {
        if(_.isEqual(Emetadata, this.state.Emetadata)) { return }
        if (Emetadata === null) {
            this.setState({ Emetadata });
        } else if (this.state.Smetadata && this.state.Smetadata.isOutp !== undefined &&
            this.state.Smetadata.isOutp !== Emetadata.isOutp) {
            await this.setState({ Emetadata });
            if (this.pointsAreValid()) { this.setState({ isValid: true }) }
        }
    }

    getInput = (): ConnectorMeta => {
        if (this.state.Emetadata && !this.state.Emetadata.isOutp) { return this.state.Emetadata }
        if (this.state.Smetadata && !this.state.Smetadata.isOutp) { return this.state.Smetadata }
        return null;
    }

    getOutput = (): ConnectorMeta => {
        if (this.state.Emetadata && this.state.Emetadata.isOutp) { return this.state.Emetadata }
        if (this.state.Smetadata && this.state.Smetadata.isOutp) { return this.state.Smetadata }
        return null;
    }

    onConnectorLost = e => {
        this.setState({ isValid: false, Emetadata: null })
    }

    cleanConnection = () => {
        this.setState({ isValid: false, Emetadata: null, Smetadata: null });
    }
}