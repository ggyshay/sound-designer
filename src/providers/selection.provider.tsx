import { Container } from 'unstated';

export interface SelectionProviderState {
    id: string;
    destId: string;
    parentId: string;
    destParentId: string;
}

export class SelectionProvider extends Container<SelectionProviderState> {
    public state = { id: null, destId: null, parentId: null, destParentId: null }

    select = (id: string, destId?: string, parentId?: string, destParentId?: string) => {
        if (this.state.id === id) {
            this.setState({ id: null, destId: null, parentId: null, destParentId: null })
        } else if (destId) {
            this.setState({ id, destId, parentId, destParentId })
        } else {
            this.setState({ id, destId: null, parentId: null, destParentId: null });
        }
    }

    isSelected = (id: string, destId?: string) => {
        return destId ? (this.state.id === id && this.state.destId === destId) : (this.state.id === id)
    }

    isNode = () => {
        return !(this.state.destId && this.state.parentId)
    }

    cleanSelection = () => {
        
        this.setState({ id: null, destId: null, parentId: null, destParentId: null })
    }
}