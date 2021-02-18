const SEND_SERVICE = 0xFFE0;
const SEND_SERVICE_CHARACTERISTIC = 0xFFE1;

const request_Device = async () => {
    if (!navigator.bluetooth) {
      alert('Sorry, your browser doesn\'t support Bluetooth API');
    }

    // const device = await navigator.bluetooth.requestDevice({
    //     filters: [{ namePrefix:'robot' },{ services: [SEND_SERVICE] }]
    // }) ถ้าไม่ใส่ then ก็จะไม่ต้องเขียน return ใส่ catch ไม่มีปัญหา

    const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix:'robot' },{ services: [SEND_SERVICE] }]
    }).then((device) => {
        console.log("request device ok", device);
        return device; //ต้อง retrun ไม่งั้นจะไม่คืนค่า device กลับไป
    }).catch((error) => {
        console.log('error cannot request device', error);
    })

    const server = await device.gatt.connect().then((server) => {
        console.log("connect device ok");
        return server; //ต้อง retrun ไม่งั้นจะไม่คืนค่า server กลับไป
    }).catch((error) => {
        console.log("cannot connect device", error);
    })

    const service = await server.getPrimaryService(SEND_SERVICE).then((service) => {
        console.log("get service ok");
        return service; //ต้อง retrun ไม่งั้นจะไม่คืนค่า service กลับไป
    }).catch((error) => {
        console.log("cannot get service", error);
    })

    const characteristic = await service.getCharacteristic(SEND_SERVICE_CHARACTERISTIC).then((character) => {
        console.log("get characteristic ok");
        console.log("device name", device.name);
        alert('connect to device!');
        return character; //ต้อง retrun ไม่งั้นจะไม่คืนค่า characteristic กลับไป
    }).catch((error) => {
        console.log("cannot get characteristic", error);
        alert('cannot connect to device!');
    })

    return { device, characteristic }
}

const disconnect_Device = async (device) => {
    if(device){
      await device.gatt.disconnect();
    }else{
      alert('no device connected.');
    }
}

const send_01 = (characteristic, event) => {
    const code = Number(event.target.dataset.code);
    let enc = new TextEncoder(); 
    console.log(code);
    if(characteristic){
        characteristic.writeValue(enc.encode(`<${code}>`)).then(() => {
            alert('send code ok')
        }).catch(() => {
            alert('cannot send')
        })
    }else{
      alert('no device connected.')
    }
}

const send_command_to_device = async (characteristic, command) => {
    let enc = new TextEncoder(); // By default this encodes to utf-8
    // Why the <opening and closing> characters?
    // Went with this guy's example 3 for the reasons he mentions: https://forum.arduino.cc/index.php?topic=396450.0
    if(characteristic){
        characteristic.writeValue(enc.encode(`<${command}>`)).then(() => {
            alert('send code ok')
        }).catch(() => {
            alert('cannot send')
        })
    }else{
      alert('no device connected.')
    }
}

const run_cmd = async (obj_blocks, characteristic) => {
    let enc = new TextEncoder();
    var text = '';
    console.log('run', obj_blocks);
    if(characteristic){
        text = text + '<CODE,'
        Object.keys(obj_blocks).map((list,index) => {
            if(obj_blocks[list].cmd !== undefined){
                if(obj_blocks[list].option == "fn"){
                    const loop_n = obj_blocks[list].loop_n;
                    const start_block = obj_blocks[list].start;
                    const end_block = obj_blocks[list].end;
                    var function_cmd = '';
                    var function_cmd_loop = '';
                    Object.keys(obj_blocks).map((uid, id) => {
                      if(id >= start_block && id <= end_block){
                        const cmd = obj_blocks[uid].cmd;
                        function_cmd = function_cmd + ((cmd != undefined) ? cmd : 's') + ','
                      } 
                    })
                    for(var i=1; i<=loop_n; i++){
                      function_cmd_loop = function_cmd_loop + function_cmd;
                    }
                    console.log('func loop', function_cmd_loop);
                    text = text + function_cmd_loop;
                } else {
                    console.log(obj_blocks[list].cmd);
                    //character.writeValue(enc.encode(`<${obj_blocks[list].cmd}>`));
                    text = text + obj_blocks[list].cmd + ','
                }
            } else {
                console.log('s');
                //character.writeValue(enc.encode('<s>'));
                text = text + 's,'
            }
        })
        text = text + 'End>'
        console.log('text',text);
        characteristic.writeValue(enc.encode(text)).then(() => {
            alert('send code ok')
        }).catch(() => {
            alert('cannot send')
        })
    }else{
        alert('no device connected.')
    }
}

export { request_Device, disconnect_Device, send_01, send_command_to_device, run_cmd }