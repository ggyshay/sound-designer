import * as React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

export interface DisplayComponentProps {
    data: number[];
    id: string;
    logarithmic?: boolean;
}

export class DisplayComponent extends React.Component<DisplayComponentProps, any> {
    private node: any = null;

    constructor(props) {
        super(props);
        this.state = {
            pathData: null
        }
    }
    componentDidUpdate() {
        this.createPath();
    }

    createPath = () => {

        const width = this.node.getBoundingClientRect().width;
        const height = this.node.getBoundingClientRect().height;
        const y = d3.scaleLinear()
            .domain([d3.min(this.props.data, d => d.y), d3.max(this.props.data, d => d.y)]).range([height - 10, 10])
        const min = d3.min(this.props.data, d => d.x || 0.01);
        const max = d3.max(this.props.data, d => d.x);
        const x = this.props.logarithmic ?
            d3.scaleLog()
                .domain([min, max])
                .range([0, width]).base(Math.E) :
            d3.scaleLinear().domain([d3.min(this.props.data, d => d.x), d3.max(this.props.data, d => d.x)])
                .range([0, width]);
        const lineGen = d3.line()
            .x((d) => x(d.x || 0.001))
            .y(d => y(d.y))
        const pathData = lineGen(this.props.data);

        if (_.isEqual(this.state.pathData, pathData)) return;
        d3.select(`#waveform${this.props.id}`).attr('d', pathData).attr('fill', 'none').attr('stroke', '#da0027')
        this.setState({ pathData });
    }

    componentDidMount() { this.createPath() }

    render() {
        return (
            <svg className="display" style={{ height: '100%', width: '100%' }} ref={this.handleRef} ><path id={'waveform' + this.props.id}></path></svg >
        )
    }

    handleRef = r => this.node = r
}