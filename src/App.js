import React, { useState } from 'react';
import "./App.css";

const SEND_SERVICE = 0xFFE0;
const SEND_SERVICE_CHARACTERISTIC = 0xFFE1;

function App() {

  const [ character, set_characteristic] = useState();
  const [ device , setDevice ] = useState();
  const [ command, setCommand ] = useState();

  const request_device = async () => {
    const device = await navigator.bluetooth
      .requestDevice({
          filters: [{ namePrefix:'ro' },{ services: [SEND_SERVICE] },]
      });
   const server = await device.gatt.connect();
   const service = await server.getPrimaryService(SEND_SERVICE);
   const characteristic = await service.getCharacteristic(SEND_SERVICE_CHARACTERISTIC);
   set_characteristic(characteristic);
   setDevice(device);
  }

  async function disconnect(){
    if(device){
      await device.gatt.disconnect();
      setDevice();
      set_characteristic();
    }else{
      alert('no device connected.');
    }
  }

  function on(event){
    const code = Number(event.target.dataset.code);
    console.log(code);
    if(character){
      character.writeValue(Uint8Array.of(code));
    }else{
      alert('no device connected.')
    }
  }

  function off(event){
    const code = Number(event.target.dataset.code);
    console.log(code);
    if(character){
      character.writeValue(Uint8Array.of(code));
    }else{
      alert('no device connected.')
    }
  }
  
  function send_command(e){
    e.preventDefault();
    let enc = new TextEncoder(); // By default this encodes to utf-8
    // Why the <opening and closing> characters?
    // Went with this guy's example 3 for the reasons he mentions: https://forum.arduino.cc/index.php?topic=396450.0
    character.writeValue(enc.encode(`${command}`));
    setCommand('');
  }

  return (
    <div className='App'>
      <h1>device: { device ? device.name : 'nodevice' }</h1>
      <div className='Control'>
        <button onClick={() => request_device()} className='button'>connect</button>
        <button onClick={() => disconnect()} className='button'>disconnect</button>
        <button onClick={on} data-code="1" className='button'>on</button>
        <button onClick={off} data-code="0" className='button'>off</button>
        <form onSubmit={send_command}>
          <input
            type='text'
            name='command'
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
          <button type='submit'>send command</button>
        </form>
      </div>
    </div>
  );
}

export default App;
