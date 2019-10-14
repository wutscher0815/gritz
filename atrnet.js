
var dmxlib=require('dmxnet');



var dmxnet = new dmxlib.dmxnet({
  verbose: 0, //Verbosity, default 0
  oem: 0, //OEM Code from artisticlicense, default to dmxnet OEM.
  sName: "Text", // 17 char long node description, default to "dmxnet"
  lName: "Long description" // 63 char long node description, default to "dmxnet - OpenSource ArtNet Transceiver"
});

console.log(dmxnet);
var options={
  ip: "127.0.0.1", //IP to send to, default 255.255.255.255
  subnet: 0, //Destination subnet, default 0
  universe: 0, //Destination universe, default 0
  net: 0, //Destination net, default 0
  port: 6454, //Destination UDP Port, default 6454
  base_refresh_interval: 1000 // Default interval for sending unchanged ArtDmx
}

var sender=dmxnet.newSender(options);
let i=0;
setInterval(()=>{

for(j=0;j<255;j++){
	sender.setChannel(i,i)
}
},400)

/*
var e131 = require('e131');
 
var client = new e131.Client('192.168.43.244');  // or use a universe
var packet = client.createPacket(24);  // we want 8 RGB (x3) slots
var slotsData = packet.getSlotsData();
packet.setSourceName('test E1.31 client');
packet.setUniverse(1);  // make universe number consistent with the client
packet.setOption(packet.Options.PREVIEW, true);  // don't really change any fixture
packet.setPriority(packet.DEFAULT_PRIORITY);  // not strictly needed, done automatically
 
// slotsData is a Buffer view, you can use it directly
var color = 0;
function cycleColor() {
  for (var idx=0; idx<slotsData.length; idx++) {
    slotsData[idx] = color % 0xff;
    color = color + 90;
  }
  client.send(packet, function () {
    setTimeout(cycleColor, 125);
  });
}
cycleColor();*/
