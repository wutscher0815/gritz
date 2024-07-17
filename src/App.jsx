import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Pixel } from './Pixel';
import { Grid } from './Grid';
import conf from './dmxconf.js';
import 'bootstrap/dist/css/bootstrap.min.css'


import { rotatingImage, movingstripevertical, pulsateBackground, verticalstripes, movingblock, blocks, movingblockvertical, movingblockcross, blinkBackground, movingstripehorizontal } from './scenes';

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
      scene: 'reset',
      ...storedState
    }

    this.handleChangeSpeed = this.handleChangeSpeed.bind(this);
    this.handleChangeHue = this.handleChangeHue.bind(this);
    this.handleChangeSaturation = this.handleChangeSaturation.bind(this);
    this.handleChangeLightness = this.handleChangeLightness.bind(this);
    this.handleChangev1 = this.handleChangev1.bind(this);
    this.handleChangev2 = this.handleChangev2.bind(this);
    this.handleChangev3 = this.handleChangev3.bind(this);

    this.run = this.run.bind(this);
  }

  handleChangeSpeed(event) {
    this.setState({ speed: parseInt(event.target.value) });
  }
  handleChangeHue(event) {
    this.setState({ hue: parseInt(event.target.value) });
  }
  handleChangeSaturation(event) {
    this.setState({ saturation: parseInt(event.target.value) });
  }
  handleChangeLightness(event) {
    this.setState({ lightness: parseInt(event.target.value) });
  }

  handleChangev1(event) {
    this.setState({ v1: parseInt(event.target.value) });
  }

  handleChangev2(event) {
    this.setState({ v2: parseInt(event.target.value) });
  }

  handleChangev3(event) {
    this.setState({ v3: parseInt(event.target.value) });


  }

  update = () => { }
  stop = () => { }


  async componentDidMount() {
    // var exampleSocket = new WebSocket('ws:/localhost:3001');

    // let socketConnected = false;

    // exampleSocket.onmessage = evt => {
    //   console.log(evt.data)
    //   socketConnected = true;
    // };



    const { input, output, img } = this.refs;
    this.ctx = input.getContext("2d")
    this.ctxOut = output.getContext("2d")

    this.input = input;
    this.output = output;
    this.img = img;

    this.img.onload = () => {
      this.img.loadeded = true
    }

    this.run(this.state.scene, false);
    setInterval(() => {
      this.ctxOut.filter = `brightness(${this.state.lightness / 255})`;
      this.ctxOut.drawImage(input, 0, 0, 28, 19);

      this.ctxOut.fillStyle = '#000'
      this.ctxOut.fillRect(1, 1, 8, 8);
      this.ctxOut.fillRect(10, 1, 8, 8);
      this.ctxOut.fillRect(19, 1, 8, 8);

      this.ctxOut.fillRect(1, 10, 8, 8);
      this.ctxOut.fillRect(10, 10, 8, 8);
      this.ctxOut.fillRect(19, 10, 8, 8);


      fetch("/ola/set_dmx", {
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
    localStorage.state = JSON.stringify({ ...this.state, ...state });
  }

  startAnimation() {
    setTimeout(() => {

      this.ctx.resetTransform();
      this.firstFrame = (new Date()).getTime();
      this.frame = 0

      const update = () => {

        let running = true;
        this.stop = () => running = false;

        this.frame = ((new Date()).getTime() - this.firstFrame) / 16;

        this.update(this.state, this.frame);

        if (running) {
          setTimeout(() => {
            requestAnimationFrame(() => update());
          }, 16)
        }
      };

      update();
    }, 10);
  }

  async run(event, setstate = true) {
    this.ctx.resetTransform();
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, this.refs.input.width, this.refs.input.height);
    this.update = () => { }
    this.stop()
    const scene = (event.target && event.target.name) || event;

    try {
      this.update = await this[scene](setstate);

      console.log(scene);
      this.setState({ scene })
      localStorage.state = JSON.stringify({ ...this.state, scene });

    } catch (e) {
    }
    this.startAnimation();

  }


  async countryRoadsCalm(setstate) {
    if (setstate) { this.setState({ "speed": 80, "hue": 19, "saturation": 255, "v1": 21 }) }
    return rotatingImage(this.ctx, this.img, "windwheel.png");
  }


  async countryRoadsFlash(setstate) {
    if (setstate) { this.setState({ "speed": 150, "hue": 0, "saturation": 255, "v1": 3, "v2": 180 }) }
    return blinkBackground(this.ctx, '#ff0000')
  }

  async countryRoadsPunk(setstate) {
    if (setstate) { this.setState({ v1: 2, v2: 2, v3: 12, hue: 0, speed: 255, saturation: 255 }) }
    return blinkBackground(this.ctx, '#ff0000')
  }

  async believerCalm(setstate) {
    if (setstate) { this.setState({ "speed": 60, "hue": 0, "saturation": 255, "v1": 21, "v2": 12, v3: 1 }) }
    return movingstripevertical(this.ctx, 15, 0, 0, '#0000ff', 0.3, true)
  };

  async believerChorus(setstate) {
    if (setstate) { this.setState({ "speed": 220, "hue": 0, "saturation": 255, "v1": 21, "v2": 12, v3: 4 }) }
    return movingstripevertical(this.ctx, 15, 0, 0, '#0000ff', 0.3, true)
  }

  async believerFinale(setstate) {
    if (setstate) { this.setState({ "speed": 125, "hue": 0, "saturation": 255, "v1": 21, "v2": 12, v3: 4 }) }
    return blinkBackground(this.ctx, '#0000ff', true);
  }

  async umbrella(setstate) {
    if (setstate) { this.setState({ "speed": 125, "hue": 0, "saturation": 255, "v1": 21, "v2": 12, v3: 4 }) }
    return this.mia(setstate)
  }

  rollingChorus(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 14, hue: 140, speed: 180, saturation: 255 }) }
    return movingblockvertical(this.ctx, 12, 19, this.state.hue, '#ff0000', 12, 142);
  }

  rollingCalm(setstate) {
    if (setstate) { this.setState({ v1: 2, v2: 18, v3: 12, hue: 0, speed: 45, saturation: 255 }) }
    return blocks(this.ctx, this.state.hue, '#ff0000');
  }



  async stripesvertivcal(setstate) {
    if (setstate) { this.setState({ "speed": 60, "hue": 0, "saturation": 255, "v1": 21 }) }
    return movingstripevertical(this.ctx, 15, 0, 0, '#0000ff', 0.3, true)
  }

  async stripeshorizontal(setstate) {
    if (setstate) { this.setState({ "speed": 60, "hue": 0, "saturation": 255, "v1": 21 }) }
    return movingstripehorizontal(this.ctx, 15, 0, 0, '#0000ff', 0.3, true)
  }

  async psychoKillerCalm(setstate) {
    if (setstate) { this.setState({ "speed": 60, "hue": 0, "saturation": 255, "v1": 21 }) }
    return pulsateBackground(this.ctx, '#0000ff', 0.3, true)
  }

  async psychoKillerChorus(setstate) {
    if (setstate) { this.setState({ "speed": 80, "hue": 0, "saturation": 255, "v1": 3 }) }
    return blocks(this.ctx, 0, '#0000ff');
  }

  async psychoKillerFinale(setstate) {
    if (setstate) { this.setState({ "speed": 255, "hue": 80, "saturation": 255, "v1": 6, "v1": 6 }) }
    return blinkBackground(this.ctx, '#0000ff', true)
  }

  kreiskyLaut(setstate) {
    if (setstate) { this.setState({ "speed": 150, "hue": 0, "saturation": 255, "v1": 2 }) }
    return blocks(this.ctx, 0, '#0000ff');
  }

  kreiskyFlash(setstate) {
    if (setstate) { this.setState({ "speed": 200, "hue": 0, "saturation": 255, "v1": 3, "v2": 180 }) }
    return blinkBackground(this.ctx, '#0000ff')
  }

  kreiskyFinale(setstate) {
    if (setstate) { this.setState({ "speed": 80, "hue": 0, "saturation": 255, "v1": 3, saturation: 255 }) }
    return blocks(this.ctx, 0, '#0000ff');
  }

  helterSkelter(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 14, hue: 140, speed: 180, saturation: 255 }) }
    return movingblockvertical(this.ctx, 12, 19, this.state.hue, '#ff00ff', 12, 142);
  }

  async tits(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 12, hue: 200, speed: 73, saturation: 255 }) }
    return movingblockcross(this.ctx, this.state.v1, this.state.v2, this.state.hue, '#ff00ff', this.state.v3, 142);
  }

  async queen(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 12, hue: 0, speed: 73 }) }
    return movingblock(this.ctx, 8, 19, -40, '#ff0000', 12, 5);
  }

  async bilderbuchLaut(setstate) {
    if (setstate) { this.setState({ v1: 3, v2: 18, v3: 12, hue: 0, speed: 200, saturation: 255 }) }
    return blocks(this.ctx, this.state.hue, '#ffff00');
  }

  async bilderbuchLeise(setstate) {
    if (setstate) { this.setState({ v1: 2, v2: 18, v3: 12, hue: 0, speed: 45, saturation: 255 }) }
    return blocks(this.ctx, this.state.hue, '#ffff00');
  }

  async highVoltage(setstate) {
    if (setstate) { this.setState({ v1: 2, v2: 18, v3: 12, hue: 0, speed: 255, saturation: 255 }) }
    return rotatingImage(this.ctx, this.img, "logo512.png");
  }

  async hardestButton(setstate) {
    if (setstate) { this.setState({ "speed": 60, "hue": 0, "v1": 21, saturation: 255 }) }
    return pulsateBackground(this.ctx, '#ff0000', 0.3)
  }

  async shouldIStay(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 12, hue: 0, speed: 73, saturation: 255 }) }
    return movingblockcross(this.ctx, this.state.v1, this.state.v2, this.state.hue, '#ff00ff', this.state.v3, 142);
  }

  async mia(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 12, hue: 0, speed: 21, saturation: 255 }) }
    return rotatingImage(this.ctx, this.img, "windwheel.png");
  }
  async praiseYou(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 12, hue: 0, speed: 33, saturation: 255 }) }
    return movingblockcross(this.ctx, this.state.v1, this.state.v2, this.state.hue, '#ff00ff', this.state.v3, 142);
  }
  async gigi(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 12, hue: 0, speed: 73, saturation: 255 }) }
    return movingblock(this.ctx, 8, 19, this.state.hue, '#ff00ff', 12, 5);
  }
  async moveItScooter(setstate) {
    if (setstate) { this.setState({ "speed": 80, "hue": 120, "saturation": 255, "v1": 3 }) }
    return blocks(this.ctx, 0, '#0000ff');
  }
  async reaggae(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 12, hue: 0, speed: 60, saturation: 255 }) }
    return rotatingImage(this.ctx, this.img, "psychadelic.jpg");
  }
  async slayer(setstate) {
    if (setstate) { this.setState({ v1: 2, v2: 2, v3: 12, hue: 0, speed: 255, saturation: 255 }) }
    return blinkBackground(this.ctx, '#ff0000')
  }
  async arbeitNervt(setstate) {
    if (setstate) { this.setState({ "speed": 80, "hue": 0, "saturation": 255, "v1": 3 }) }
    return blocks(this.ctx, 0, '#0000ff');
  }
  async sevenNation(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 12, hue: 0, speed: 200, saturation: 0 }) }
    return rotatingImage(this.ctx, this.img, "windwheel.png");
  }
  async sabotage(setstate) {
    if (setstate) { this.setState({ v1: 4, v2: 4, v3: 12, hue: 0, speed: 255, saturation: 255 }) }
    return blinkBackground(this.ctx, '#ffffff', false)
  }




  async rotateImg(setstate) {

    return rotatingImage(this.ctx, this.img, "logo512.png");
  }

  async bloxhori(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 12, hue: 0, speed: 73 }) }
    return movingblock(this.ctx, 8, 19, this.state.hue, '#ff00ff', 12, 5);
  }
  async bloxvert(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 12, hue: 0, speed: 73 }) }
    return movingblockvertical(this.ctx, 12, 19, this.state.hue, '#ff00ff', 12, 0);
  }
  async bloxcross(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 12, hue: 0, speed: 73 }) }
    return movingblockcross(this.ctx, this.state.v1, this.state.v2, this.state.hue, '#ff00ff', this.state.v3, 142);
  }

  async squares(setstate) {
    if (setstate) { this.setState({ v1: 14, v2: 18, v3: 12, hue: 0, speed: 73 }) }
    return blocks(this.ctx, this.state.hue, '#ffff00');
  }

  reset() {
    this.setState({
      speed: 255,
      hue: 0,
      saturation: 255,
      v1: 1,
      v2: 1,
      v3: 1,
    })
    this.ctx.resetTransform();
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, this.refs.input.width, this.refs.input.height);
    return Promise.resolve(() => null)
  }

  button(scene, name) {
    return <div className="col-12 col-md-4 col-lg-3 col-sm-6 mb-2">
      <button id="scene" className="btn btn-primary btn-block" id="scene" name={scene} onClick={this.run}>{name || scene}</button>
    </div>
  }

  render() {

    return (<div className="App container" >
      <div className="sticky-top row bg-white pt-3">
        <div className="col">
          <img ref="img" alt="ey bongo" />
          <canvas ref="input" width={280} height={190} />
          <canvas className="output ml-2" ref="output" width={28} height={19} />
        </div>

        <div className="col-12 col-md-6">
          <span>
            <div className="row">
              <div className="col-2">
                speed
              </div>
              <input className="col" type="range" min="0" max="255" value={this.state.speed} onChange={this.handleChangeSpeed} /> <div className="col-1">{this.state.speed}</div></div>
            <div className="row">
              <div className="col-2">
                hue
              </div>
              <input className="col" type="range" min="0" max="255" value={this.state.hue} onChange={this.handleChangeHue} /> <div className="col-1">{this.state.hue}</div></div>
            <div className="row">
              <div className="col-2">
                sat
              </div>
              <input className="col" type="range" min="0" max="255" value={this.state.saturation} onChange={this.handleChangeSaturation} /> <div className="col-1">{this.state.saturation}</div></div>
            <div className="row">
              <div className="col-2">
                light
              </div>
              <input className="col" type="range" min="0" max="255" value={this.state.lightness} onChange={this.handleChangeLightness} /> <div className="col-1">{this.state.lightness}</div></div>
            <div className="row">
              <div className="col-2">
                v1
              </div>
              <input className="col" type="range" min="1" max="30" value={this.state.v1} onChange={this.handleChangev1} /> <div className="col-1">{this.state.v1}</div></div>
            <div className="row">
              <div className="col-2">
                v2
              </div>
              <input className="col" type="range" min="1" max="30" value={this.state.v2} onChange={this.handleChangev2} /> <div className="col-1">{this.state.v2}</div></div>
            <div className="row">
              <div className="col-2">
                v3
              </div>
              <input className="col" type="range" min="1" max="30" value={this.state.v3} onChange={this.handleChangev3} /> <div className="col-1">{this.state.v3}</div></div>
          </span>

        </div>
      </div>

      <div className="row">
        <h3 className="col-12">1.Country roads</h3>
        <p classNmae="col">2 Strophen, bridge nach 2.strophe bleibt im chorusmodus, alles in Calm reset  Schalala flash Flash Finale nach 3. refrain, Keine pause zwischen dem nächsten lied</p>
      </div>
      <div className="row">
        {
          ['countryRoadsCalm', 'reset', 'countryRoadsFlash', 'countryRoadsPunk', 'countryRoadsCalm', 'reset'].map(scene => this.button(scene))
        }
      </div>

      <div className="row">
        <h3 className="col-12">2. believer</h3>
        <p classNmae="col">3 Strophen, reset im brak (vor 'Pain, you make me a believer</p>
      </div>
      <div className="row">
        {
          ['believerCalm', 'reset', 'believerChorus', 'believerFinale', 'reset'].map(scene => this.button(scene))
        }
      </div>


      <div className="row">
        <h3 className="col-12">3. Umbrella</h3>
      </div>
      <div className="row">
        {
          ['umbrella', 'reset'].map(scene => this.button(scene))
        }
      </div>



      <div className="row">
        <h3 className="col-12">3. Rolling in the Deep</h3>
      </div>
      <div className="row">
        {
          ['rollingCalm', 'rollingChorus', 'reset'].map(scene => this.button(scene))
        }
      </div>


      <div className="row">
        <h3 className="col-12">4. Rolling in the Deep</h3>
      </div>
      <div className="row">
        {
          ['rollingCalm', 'rollingChorus', 'reset'].map(scene => this.button(scene))
        }
      </div>
      <div className="row">
        <h3 className="col-12">5 Kosola</h3>
      </div>
      <div className="row">
        {
          ['kosola', 'rollingChorus', 'reset'].map(scene => this.button(scene))
        }
      </div>

      <div className="row">
        <h3 className="col-12">8. Tits on the Radio</h3>
        <p classNmae="col">davor ein lied Pause.</p>
      </div>
      <div className="row">
        {
          ['tits', 'reset'].map(scene => this.button(scene))
        }
      </div>
      <div className="row">
        <h3 className="col-12">9. Another on bites the dust</h3>
        <p classNmae="col">durchgehend.</p>
      </div>
      <div className="row">
        {
          ['queen', 'reset'].map(scene => this.button(scene))
        }
      </div>

      <div className="row">
        <h3 className="col-12">10. Maschin</h3>
        <p classNmae="col">Laut im intro und nach dem Refrain, leise in der strophe, reset nach 2.Refrain (3x "Aha")</p>
      </div>
      <div className="row">
        {
          ['bilderbuchLaut', 'bilderbuchLeise', 'reset'].map(scene => this.button(scene))
        }
      </div>


      <div className="row">
        <h3 className="col-12">12. Danger! high voltage!</h3>
        <p classNmae="col">durhgehend</p>
      </div>
      <div className="row">
        {
          ['highVoltage', 'reset'].map(scene => this.button(scene))
        }
      </div>




      <div className="row">
        <h3 className="col-12">19. The hardest button to button</h3>
        <p classNmae="col">durhgehend</p>
      </div>
      <div className="row">
        {
          ['hardestButton', 'reset'].map(scene => this.button(scene))
        }
      </div>

      <div className="row">
        <h3 className="col-12">20. Should I Stay or should I go</h3>
        <p classNmae="col">durchgehend. Danach Pause</p>
      </div>
      <div className="row">
        {
          ['shouldIStay', 'reset'].map(scene => this.button(scene))
        }
      </div>


      <div className="row">
        <h3 className="col-12">21. Paper planes</h3>
        <p classNmae="col">durchgehend</p>
      </div>
      <div className="row">
        {
          ['mia', 'reset'].map(scene => this.button(scene))
        }
      </div>

      <div className="row">
        <h3 className="col-12">21. Medley</h3>
        <p classNmae="col">Fliesende übergänge</p>
      </div>
      <div className="row">
        {
          ['praiseYou', 'gigi', 'moveItScooter', 'reaggae', 'slayer', 'arbeitNervt', 'sevenNation', 'reset'].map(scene => this.button(scene))
        }
      </div>
      <div className="row">
        <h3 className="col-12">21. Sabotage</h3>
        <p classNmae="col">durchgehend</p>
      </div>
      <div className="row">
        {
          ['sabotage',].map(scene => this.button(scene))
        }
      </div>

      <div className="pb-5"></div>











      <div>

      </div>

      {
        ['bloxhori', 'bloxvert', 'stripeshorizontal', 'stripesvertivcal', 'bloxcross', 'rotateImg', 'squares', 'psychoKillerCalm', 'psychoKillerChorus', 'reset'].map(scene => this.button(scene))
      }
    </div>
    );
  }

}

export default App;