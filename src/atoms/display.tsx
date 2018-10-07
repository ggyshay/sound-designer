import * as React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

export interface DisplayComponentProps {
    data: number[];
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
            .domain([-1, 1]).range([height - 10, 10])
        const x = d3.scaleLinear()
            .domain([0, this.props.data.length]).range([0, width]);
        const lineGen = d3.line()
            .x((d, i) => x(i))
            .y(d => y(d))
        const pathData = lineGen(this.props.data);

        if (_.isEqual(this.state.pathData, pathData)) return;
        d3.select('#waveform').attr('d', pathData).attr('fill', 'none').attr('stroke', '#da0027')
        this.setState({ pathData });
    }

    componentDidMount() { this.createPath() }

    render() {
        return (
            <svg className="display" style={{ height: '100%', width: '100%' }} ref={this.handleRef} ><path id='waveform'></path></svg >
        )
    }

    handleRef = r => this.node = r
}