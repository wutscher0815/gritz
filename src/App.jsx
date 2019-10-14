import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Pixel } from './Pixel';
import { Grid } from './Grid';
import conf from './dmxconf.js';
import { rotatingImage, movingblock, blocks, movingblockvertical, movingblockcross } from './scenes';

function getDMXMessage(context) {

  const dmxMessage = [];
  const imageData = context.getImageData(0, 0, conf[0].length, conf.length).data
  conf.forEach((row, rowindex) => {
    row.forEach((cell, colIndex) => {

      // if (colIndex == 27 && rowindex == 1) {
      //   debugger
      // }
      // if (colIndex == 27 && rowindex == 2) {
      //   debugger
      // }
      if (cell && cell > 0) {


        const index = (rowindex * conf[0].length + colIndex) * 4
        var p = imageData.slice(index, index + 4);

        dmxMessage[cell] = Math.floor(p[0])
        dmxMessage[cell + 1] = Math.floor(p[1])
        dmxMessage[cell + 2] = Math.floor(p[2])
        if (cell >= 359 && cell < 362) debugger
      }
    });
  });

  dmxMessage.shift()
  return dmxMessage;
}


class App extends React.Component {

  constructor(props) {
    super(props);

    console.log(conf)
    let storedState = {};
    if (localStorage.state) {
      storedState = JSON.parse(localStorage.state);
    }
    this.state = {
      speed: 255,
      hue: 0,
      saturation: 255,
      lightness: 255,
      v1: 1,
      v2: 1,
      v3: 1,
      ...storedState
    }

    this.handleChangeSpeed = this.handleChangeSpeed.bind(this);
    this.handleChangeHue = this.handleChangeHue.bind(this);
    this.handleChangeSaturation = this.handleChangeSaturation.bind(this);
    this.handleChangeLightness = this.handleChangeLightness.bind(this);
    this.handleChangev1 = this.handleChangev1.bind(this);
    this.handleChangev2 = this.handleChangev2.bind(this);
    this.handleChangev3 = this.handleChangev3.bind(this);

    this.bloxhori = this.bloxhori.bind(this);
    this.bloxcross = this.bloxcross.bind(this);
    this.bloxvert = this.bloxvert.bind(this);
    this.rotateImg = this.rotateImg.bind(this);
    this.squares = this.squares.bind(this);
  }

  handleChangeSpeed(event) {
    this.setState({ speed: event.target.value });
  }
  handleChangeHue(event) {
    this.setState({ hue: event.target.value });
  }
  handleChangeSaturation(event) {
    this.setState({ saturation: event.target.value });
  }
  handleChangeLightness(event) {
    this.setState({ lightness: event.target.value });
  }

  handleChangev1(event) {
    this.setState({ v1: event.target.value });
  }

  handleChangev2(event) {
    this.setState({ v2: event.target.value });
  }

  handleChangev3(event) {
    this.setState({ v3: event.target.value });


  }

  update = () => null


  async componentDidMount() {
    var exampleSocket = new WebSocket('ws:/localhost:3001');

    let socketConnected = false;

    exampleSocket.onmessage = evt => {
      console.log(evt.data)
      socketConnected = true;
    };



    const { input, output, img } = this.refs;
    this.ctx = input.getContext("2d")
    this.ctxOut = output.getContext("2d")

    this.input = input;
    this.output = output;
    this.img = img;

    this.img.onload = () => {
      this.img.loadeded = true
    }


    this.update = await movingblockcross(this.ctx, this.state.v1, this.state.v2, this.state.hue, '#ff00ff', this.state.v3 - 1, 0);
    this.startAnimation();
    setInterval(() => {
      this.ctxOut.filter = `brightness(${this.state.lightness / 255})`;
      this.ctxOut.drawImage(input, 0, 0, 28, 19);

      // if (socketConnected)
      //   exampleSocket.send(getDMXMessage(ctxOut).join(','))

      fetch("/set_dmx", {
        body: "u=1&d=" + getDMXMessage(this.ctxOut).join(','),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      })
    }, 80);



  }

  setState(state) {
    super.setState(state);
    localStorage.state = JSON.stringify(this.state);
  }

  startAnimation() {
    const update = () => {

      let running = true;
      this.stop = () => running = false;

      this.update(this.state);

      if (running) {
        setTimeout(() => {
          requestAnimationFrame(() => update());
        }, 60)
      }
    };

    update();
  }

  async rotateImg() {
    this.stop()
    this.update = await rotatingImage(this.ctx, this.img, this.state.hue, this.state.saturation, this.state.speed);
    this.startAnimation();
  }

  async bloxhori() {
    this.stop()
    this.update = await movingblock(this.ctx, 8, 19, this.state.hue, '#ff00ff', 12, 5);
    this.startAnimation();
  }
  async bloxvert() {
    this.stop()
    this.update = await movingblockvertical(this.ctx, 12, 19, this.state.hue, '#ff00ff', 12, 0);
    this.startAnimation();
  }
  async bloxcross() {
    this.stop()
    this.setState({ v1: 14, v2: 18, v3: 12, hue: 0, speed: 73 })
    this.update = await movingblockcross(this.ctx, this.state.v1, this.state.v2, this.state.hue, '#ff00ff', this.state.v3, 142);
    this.startAnimation();
  }

  async squares() {
    this.stop()
    this.update = await blocks(this.ctx, 5, 19, this.state.hue, '#ff00ff', 20, 142);
    this.startAnimation();
  }

  render() {

    return (<div className="App" >
      <img ref="img" alt="ey bongo" src="logo512.png" />
      <canvas ref="input" width={560} height={380} />
      <canvas className="output" ref="output" width={28} height={19} />

      <div className="row">
        <span>
          <div>speed<input type="range" min="0" max="255" value={this.state.speed} onChange={this.handleChangeSpeed} />{this.state.speed}</div>
          <div>hue<input type="range" min="0" max="255" value={this.state.hue} onChange={this.handleChangeHue} />{this.state.hue}</div>
          <div>sat<input type="range" min="0" max="255" value={this.state.saturation} onChange={this.handleChangeSaturation} />{this.state.saturation}</div>
          <div>light<input type="range" min="0" max="255" value={this.state.lightness} onChange={this.handleChangeLightness} />{this.state.lightness}</div>
        </span>
        <span>

          <div>v1<input type="range" min="1" max="30" value={this.state.v1} onChange={this.handleChangev1} />{this.state.v1}</div>
          <div>v2<input type="range" min="1" max="30" value={this.state.v2} onChange={this.handleChangev2} />{this.state.v2}</div>
          <div>v3<input type="range" min="1" max="30" value={this.state.v3} onChange={this.handleChangev3} />{this.state.v3}</div>
        </span>

      </div>
      <div className="row">
        <button onClick={this.bloxhori}>bloxhori</button>
        <button onClick={this.bloxvert}>bloxvert</button>
        <button onClick={this.bloxcross}>bloxcross</button>
        <button onClick={this.rotateImg}>rotateImg</button>
        <button onClick={this.squares}>squares</button>
      </div>

      <div>

      </div>
    </div>
    );
  }

}

export default App;