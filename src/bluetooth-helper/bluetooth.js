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
        await characteristic.writeValue(enc.encode(`<${command}>`)).then(() => {
            console.log('send code ok');
        }).catch((error) => {
            alert('cannot send')
            console.log('error', error);
        })
        await delay(2000);
    }else{
      alert('no device connected.')
    }
}

function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

const run_cmd = async (obj_blocks, characteristic) => {
    let enc = new TextEncoder();
    var array_temp = [];
    console.log('run', obj_blocks);
    if(characteristic){
        Object.keys(obj_blocks).map((list,index) => {
            if(obj_blocks[list].cmd !== undefined){
                if(obj_blocks[list].option == "fn"){
                    const loop_n = obj_blocks[list].loop_n;
                    const start_block = obj_blocks[list].start;
                    const end_block = obj_blocks[list].end;
                    for(var j=1; j<=loop_n; j++){
                        Object.keys(obj_blocks).map((uuid, number) => {
                            if(number >= start_block && number <= end_block){ // block in start and end number block
                                const cmd = obj_blocks[uuid].cmd;
                                if(cmd !== undefined){
                                    array_temp.push(cmd);
                                } else {
                                    array_temp.push('s');
                                }
                            }
                        })
                    }
                } else {
                    array_temp.push(obj_blocks[list].cmd);
                }
            } else {
                array_temp.push('s');
            }
        })
        for(var m=0; m<array_temp.length; m++){
            await characteristic.writeValue(enc.encode(`<UI,${array_temp[m]}>`)).then(() => {
                console.log(`sent command <UI,${array_temp[m]}>`);
            }).catch((error) => {
                console.log('cannot send code', error);
            })
            await delay(2000);
        }
    }else{
        alert('no device connected.')
    }
}

export { request_Device, disconnect_Device, send_01, send_command_to_device, run_cmd }