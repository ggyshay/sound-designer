import * as React from 'react';
import './knob.css';

export interface KnobState {
    value: number;
    angle: number;
    startY: number;
    startAngle: number;
    startValue: number;
}

export interface KnobProps {
    onChange?: (value: number) => void;
    min: number;
    max: number;
    arc?: number;
    logarithmic?: boolean;
    value?: number;
    label?: string;
    trailColor?: string;
    lineColor?: string;
    color?: string;
}


export class Knob extends React.Component<KnobProps, KnobState> {
    private circle = null;
    private R: number = 0;
    private width: number = 0;
    private height: number = 0;

    constructor(props) {
        super(props);

        this.state = {
            value: props.min,
            angle: 0,
            startY: null,
            startAngle: null,
            startValue: null,
        }
        this.R = props.R || 20;
        this.width = 2 * this.R + 6;
        this.height = this.width;
    }

    componentDidMount() { this.circle.addEventListener('mousedown', this.handleDragStart) }
    componentWillUnmount() { this.circle.addEventListener('mousedown', this.handleDragStart) }

    render() {
        const value = this.state.value;
        const displayValue = value < 10 ? value.toFixed(3) : (value < 100 ? value.toFixed(2) : (value < 1000 ? value.toFixed(1) : value.toFixed(0)))
        return (
            <div className="knob-container">
                <div style={{ width: this.width, height: this.height, position: 'relative' }}>
                    <svg className="knob" width={this.width} height={this.height} transform="rotate (-150) ">
                        <circle cx={this.width / 2} cy={this.height / 2} r={this.R} ref={ref => this.circle = ref} fill="transparent" stroke="none" />
                        <path d={`M${this.R + 3},3 L${this.R + 3}, 10`} stroke={this.props.trailColor || '#202020'} transform={`rotate(${this.state.angle} ${this.width / 2} ${this.height / 2})`} />
                        <path d={this.createArc(300)} stroke={this.props.lineColor || '#202020'} fill="none" strokeWidth="3px" />
                        <path d={this.createArc(this.state.angle)} stroke={this.props.color || '#00DACD'} fill="none" strokeWidth="3px" />
                    </svg>
                    <p className="value-text">{displayValue}</p>
                </div>
                <p className="label">{this.props.label}</p>
            </div>
        )
    }

    handleDragStart = e => {
        e.preventDefault();
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.handleDragEnd);
        this.setState({ startY: e.clientY, startAngle: this.state.angle, startValue: this.state.value });
    }

    handleDrag = e => {
        let angle = this.state.angle;
        let value = this.state.value;
        let deltaY = -e.pageY + this.state.startY;

        if (deltaY > 400) deltaY = 400;
        if (deltaY < -400) deltaY = -400;

        angle = 3 * deltaY / 4 + this.state.startAngle;
        if (angle > 300) angle = 300;
        else if (angle < 0) angle = 0;

        value = this.calculateValue(deltaY / 400);

        if (value < this.props.min) value = this.props.min;
        if (value > this.props.max) value = this.props.max;
        if (this.props.onChange) this.props.onChange(value);
        this.setState({ value, angle });
    }


    calculateValue = deltaY1 => {
        if (this.props.logarithmic) {
            const alpha = Math.log(this.props.max / this.props.min);
            const pt = 1 / alpha * Math.log(this.state.startValue / this.props.min);
            return this.props.min * Math.exp(alpha * (deltaY1 + pt))
        }
        return deltaY1 * (this.props.max - this.props.min) + this.state.startValue;
    }

    createArc = (ang: number) => {
        const x0 = this.width / 2, y0 = 3;
        const xp = x0 + Math.sin(toRadians(ang)) * this.R;
        const yp = y0 + (1 - Math.cos(toRadians(ang))) * this.R;
        return `M${x0} ${y0} A ${this.R} ${this.R}, 0, ${ang > 180 ? 1 : 0}, 1, ${xp}, ${yp}`
    }

    handleDragEnd = e => {
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);
        this.setState({ startY: null, startValue: null, startAngle: null })
    }

}
const toRadians = a => Math.PI * a / 180