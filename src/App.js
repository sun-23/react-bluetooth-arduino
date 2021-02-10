import React, { useState } from 'react';

const SEND_SERVICE = 0xFFE0;
const SEND_SERVICE_CHARACTERISTIC = 0xFFE1;

function App() {

  const [character, set_characteristic] = useState();
  const [device_name, set_device_name ] = useState();

  const request_device = async () => {
    const device = await navigator.bluetooth
      .requestDevice({
          filters: [{ namePrefix:'ro' },{ services: [SEND_SERVICE] },]
      });
   const server = await device.gatt.connect();
   const service = await server.getPrimaryService(SEND_SERVICE);
   const characteristic = await service.getCharacteristic(SEND_SERVICE_CHARACTERISTIC);
   set_characteristic(characteristic);
   set_device_name(device.name);
  }

  function on(event){
    const code = Number(event.target.dataset.code);
    console.log(code);
    character.writeValue(Uint8Array.of(code));
  }

  function off(event){
    const code = Number(event.target.dataset.code);
    console.log(code);
    character.writeValue(Uint8Array.of(code));
  }

  return (
    <div>
      <h1>device: { device_name }</h1>
      <button onClick={() => request_device()}>connect</button>
      <button onClick={on} data-code="1">on</button>
      <button onClick={off} data-code="0">off</button>
    </div>
  );
}

export default App;
