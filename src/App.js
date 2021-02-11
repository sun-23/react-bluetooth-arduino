import React, { useState, useRef } from 'react';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import "./App.css";

const SEND_SERVICE = 0xFFE0;
const SEND_SERVICE_CHARACTERISTIC = 0xFFE1;

const array_block = [
  1,2,3,4,5,6,7,8,9,10
]

function App() {

  const [ character, set_characteristic] = useState();
  const [ device , setDevice ] = useState();
  const [ command, setCommand ] = useState();

  const forwardRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const backwardRef = useRef(null);

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
    if(character){
      character.writeValue(enc.encode(`<${command}>`));
    }else{
      alert('no device connected.')
    }
    setCommand('');
  }

  const onDragStart = (e) => {
    console.log(e.target);
  }

  const onDragEnd = () => {
    console.log('drag end');
  }

  const onDragOver = () => {
    console.log('drag over');
  }

  return (
    <div className='App'>
      <h1>device: { device ? device.name : 'no device' }</h1>
      <button onClick={() => request_device()} className='button'>connect</button>
      <button onClick={() => disconnect()} className='button'>disconnect</button>
      <button onClick={on} data-code="1" className='button'>on</button>
      <button onClick={off} data-code="0" className='button'>off</button>
      <form onSubmit={send_command}>
        <input
          type='text'
          name='command'
          value={command}
          className='text-input'
          onChange={(e) => setCommand(e.target.value)}
        />
        <button type='submit' className='button'>send command</button>
      </form>

      <div className='code'>
        {array_block.map((id) => 
          <div 
            className='box'
            onDragOver={onDragOver}
          ><p>
            {id}
          </p></div>
        )}
      </div>

      <div className='code-block'>
        <div 
          ref={forwardRef} 
          className='box f draggable' 
          draggable='true' 
          value='forwardRef'
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        ><p>
          forward
        </p></div>
        <div 
          ref={leftRef} 
          className='box l draggable' 
          draggable='true' 
          value='leftRef'
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        ><p>
          left
        </p></div>
        <div 
          ref={rightRef} 
          className='box r draggable' 
          draggable='true' 
          value='rightRef'
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        ><p>
          right
        </p></div>
        <div 
          ref={backwardRef} 
          className='box b draggable' 
          draggable='true' 
          value='backwardRef'
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        ><p>
          backward
        </p></div>
        <button className='run-button'> run </button>
        <div className='box'><p><DeleteOutlineRoundedIcon/></p></div>
      </div>
    </div>
  );
}

export default App;
