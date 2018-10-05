import * as React from 'react';
import { Knob as KnobComponent } from "react-rotary-knob";
import skin from './knob-skin';
import './knob.css'

export const Knob = (props: any) => {
    return (
        <div className='knob-holder'>
            <KnobComponent skin={skin} {...props} step={0.1}/>
            <label>{props.label || null}</label>
        </div>
    )
}