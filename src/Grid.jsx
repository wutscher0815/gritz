
import React from 'react';
import './Grid.css';
import { Pixel } from './Pixel';

export class Grid extends React.Component {

    constructor(props) {
        super(props);

        const { width, height } = props;

        const rows = Array
            .from({
                length: height
            })
            .map(() => Array
                .from({
                    length: width
                }).map(() => ({
                    color: '#000'
                })));

        this.state = {}
    }

    render() {
        const { width, height } = this.props;
        const rows = Array
            .from({
                length: height
            })
            .map(() => Array
                .from({
                    length: width
                }).map(() => ({
                    color: '#000'
                })));

        return (<div>
            {rows.map((row, i) => (<div id={'grz_row_' + i} className="grz-grid-row">
                {row.map((row, j) => (<Pixel id={'grz_pix_' + j} color={row.color} />))}
            </div>))}
        </div>)
    }
}

export default Grid;