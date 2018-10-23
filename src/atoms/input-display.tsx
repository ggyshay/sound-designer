import * as d3 from 'd3';
import _ from 'lodash';
import * as React from 'react';
import { Colors } from './colors';

export interface InputDisplayComponentProps {
    id: string;
    onChange: (Float32Array) => void;
}
export interface InputDisplayComponentState {
    pathData: any,
    rawData: { x: number, y: number }[]
}

export class InputDisplayComponent extends React.Component<InputDisplayComponentProps, InputDisplayComponentState>{
    private node: any = null;
    constructor(props) {
        super(props);
        this.state = {
            pathData: null,
            rawData: []
        }
    }

    componentDidUpdate() {
        this.createPath();
    }

    createPath = () => {
        if (this.state.rawData.length < 2) return;
        const data = this.getFilledData();
        const lineGen = d3.line()
            .x((d) => d.x)
            .y(d => d.y)
        const pathData = lineGen(data);

        if (_.isEqual(this.state.pathData, pathData)) return;
        d3.select(`#waveform${this.props.id}`).attr('d', pathData).attr('fill', 'none').attr('stroke', Colors.primary)
        this.setState({ pathData });
    }

    getFilledData = () => {
        const rawData = this.state.rawData.slice(0);
        const y = this.getIntersectPoint(rawData);
        return [
            { x: 0, y },
            ...rawData,
            { x: this.width, y }
        ]
    }

    getIntersectPoint = (rawData: { x: any, y: any }[]) => {
        const x0 = rawData[0].x;
        const y0 = rawData[0].y;
        const y1 = rawData[rawData.length - 1].y;
        const x1 = rawData[rawData.length - 1].x;
        return (this.width - x1) * (y0 - y1) / (x0 + this.width - x1) + y1;
    }

    componentDidMount() { this.createPath() }

    render() {
        return (
            <svg id="input-display" className="display" style={{ height: '100%', width: '100%' }} ref={this.handleRef} onDoubleClick={this.handleDoubleClick}>
                {this.state.rawData.map((p, idx) => <InputDisplayPoint x={p.x} y={p.y} id={idx.toString()} handleDelete={this.handleDeletePoint} key={idx.toString() + 'point'} />)}
                <path id={`waveform${this.props.id}`} />
            </svg >
        )
    }

    handleRef = r => this.node = r

    get x() {
        return this.node.getBoundingClientRect().x
    }

    get y() {
        return this.node.getBoundingClientRect().y
    }

    get width() {
        return this.node.getBoundingClientRect().width;
    }

    get height() {
        return this.node.getBoundingClientRect().height;
    }

    handleDeletePoint = (x: number) => {
        const idx = this.state.rawData.findIndex(itm => itm.x === x);
        if (typeof idx !== 'number') return;
        const rawData = this.state.rawData.slice(0);
        rawData.splice(idx, 1);
        this.setState({ rawData });
        if (rawData.length > 1) this.handleChange(rawData);
    }

    handleDoubleClick = (e) => {
        if (e.target.id === 'input-display') {
            const rawData = this.state.rawData.slice(0);
            rawData.push({ x: e.clientX - this.x, y: e.clientY - this.y });
            rawData.sort((a, b) => a.x - b.x);
            this.setState({ rawData });
            if (rawData.length > 1) this.handleChange(rawData);
        }
    }

    normalizeValue = (v: number): number => {
        return 1 - (v / this.height);
    }

    getInclination = (x: number, rawData: { x: any, y: any }[]) => {
        let p0, p1;
        if (x < rawData[0].x) {
            p0 = { x: 0, y: this.getIntersectPoint(rawData) }
            p1 = rawData[0];
        } else if (x > rawData[rawData.length - 1].x) {
            p0 = rawData[rawData.length - 1]
            p1 = { x: this.width, y: this.getIntersectPoint(rawData) };
        } else {
            const idx0 = rawData.findIndex((it, index, arr) => arr[index + 1].x >= x);
            const idx1 = rawData.findIndex(it => it.x >= x);
            p0 = rawData[idx0] || { x: 0, y: this.getIntersectPoint(rawData) };
            p1 = rawData[idx1] || { x: this.width, y: this.getIntersectPoint(rawData) };
        }
        return (p1.y - p0.y) / (p1.x - p0.x);
    }

    handleChange = (rawData: { x: any, y: any }[]): void => {
        const size = 2048
        const wf = new Float32Array(size);
        const deltaX = this.width / size;
        let y = this.getIntersectPoint(rawData);

        wf[0] = this.normalizeValue(y);
        wf[size - 1] = wf[0];
        let m = 0;
        for (let i = 1; i < size - 1; i++) {
            m = this.getInclination(i * deltaX, rawData);
            y += m * deltaX;
            wf[i] = this.normalizeValue(y);
        }
        this.props.onChange(wf);
    }
}

interface InputDisplayPointProps {
    x: number;
    y: number;
    id: string;
    handleDelete: (x: number) => void;
}


class InputDisplayPoint extends React.Component<InputDisplayPointProps> {
    private circle = null;

    componentDidMount() {
        this.circle.addEventListener('dblclick', this.handleDelete)
    }

    handleDelete = e => {
        if (e.target.id === `${this.props.x}displayinputpoint`) this.props.handleDelete(this.props.x)
    }

    render() {
        return <circle cx={this.props.x} cy={this.props.y} r={7} ref={ref => this.circle = ref} fill={Colors.primary} stroke="none" id={`${this.props.x}displayinputpoint`} />
    }
}