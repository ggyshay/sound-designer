import * as React from 'react';
import './number-input.css';

export interface NumberInputProps {
    onChange?: (v: number) => void;
}

export class NumberInput extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        }
    }

    render() {
        return (
            <div className="number-input-container">
                <div style={{ flex: 1 }} />
                <div style={{ flex: 2 }}>
                    <button className='number-input-button unselectable' onClick={this.increment}>+</button>
                </div>
                <div style={{ flex: 2 }}>
                    <input disabled className='number-input-input unselectable' value={this.state.value} />
                </div>
                <div style={{ flex: 2 }}>
                    <button className='number-input-button unselectable' onClick={this.decrement}>-</button>
                </div>
                <div style={{ flex: 1 }} />
            </div>
        );
    }

    increment = () => {
        this.props.onChange && this.props.onChange(this.state.value + 1);
        this.setState(state => state.value++);

    }

    decrement = () => {
        this.props.onChange && this.props.onChange(this.state.value - 1);
        this.setState(state => state.value--);
    }
}