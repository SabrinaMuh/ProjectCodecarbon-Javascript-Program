//Start values
var ram = 0;
var ramPower = 0;
var cpu = 0;
var cpuPower = 0;
var esb = 0;
var counter = 0;

var ramValues = [];
var cpuValues = [];
var esbValues = [];
var xValues = [];

var running = true;

getData();
buildLineChart();

/*localStorage.setItem("ram", ram);
localStorage.setItem("ramPower", ramPower);
localStorage.setItem("cpu", cpu);
localStorage.setItem("cpuPower", cpuPower);
localStorage.setItem("esb", esb);
localStorage.setItem("counter", counter);

localStorage.setItem('ramValues', JSON.stringify(ramValues));
localStorage.setItem("cpuValues", JSON.stringify(cpuValues));
localStorage.setItem("esbValues", JSON.stringify(esbValues));
localStorage.setItem("xValues", JSON.stringify(xValues));*/
//localStorage.setItem("running", JSON.stringify(running));

function getData(){
    //running = localStorage.getItem("running");
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "log.txt", false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4)  {
            if(rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                var textArray = allText.split('\n');
                console.log(allText);
                if(textArray.length>20){
                    /*let currentRAMValues = localStorage.getItem('ramValues');
                    let currentCPUValues = localStorage.getItem('cpuValues');
                    let currentESBValues = localStorage.getItem('esbValues');
                    let currenXValues = localStorage.getItem('xValues');

                    counter = localStorage.getItem('counter');
                    ramValues = currentRAMValues ? JSON.parse(currentRAMValues) : [0.0];
                    cpuValues = currentCPUValues ? JSON.parse(currentCPUValues) : [0.0];
                    esbValues = currentESBValues ? JSON.parse(currentESBValues) : [0.0];
                    xValues = currenXValues ? JSON.parse(currenXValues) : [0];*/

                    var textRAM = textArray[textArray.length - 4];
                    var textCPU = textArray[textArray.length - 3];
                    var textESB = textArray[textArray.length - 2];
                    
                    if(textRAM.includes("RAM") && textCPU.includes("CPU") && textESB.includes("electricity used since the beginning")){
                        ram = textRAM.split("]")[1].split(":")[1].split(" ")[1];
                        ramPower = textRAM.split("]")[1].split(":")[2].split(" ")[1];
                        ramValues.push(ram);

                        cpu = textCPU.split("]")[1].split(":")[1].split(" ")[1];
                        cpuPower = textCPU.split("]")[1].split(":")[2].split(" ")[1];
                        cpuValues.push(cpu);

                        esb = textESB.split("]")[1].split(" ")[1];
                        esbValues.push(esb);
                        xValues.push(counter++);
                        
                        if(xValues.length > 5){
                            xValues.shift();
                            ramValues.shift();
                            cpuValues.shift();
                            esbValues.shift();
                        }
                        document.getElementById('ram_index').innerText = ram;
                        document.getElementById('ram_power_index').innerText = ramPower;
                        document.getElementById('cpu_index').innerText = cpu;
                        document.getElementById('cpu_power_index').innerText = cpuPower;
                        document.getElementById('esb_index').innerText = esb;
                        document.getElementById('loading').innerText = "";
                        buildLineChart();
                        setTimeout(() => {
                            getData();
                        }, 10000);
                    } else if(textRAM.includes("Aborted!") || textCPU.includes("Aborted!") || textESB.includes("Aborted!")){
                        //console.log("here1");
                        document.getElementById("loading").innerText = "Codecarbon is aborted";
                    } else{
                        //console.log("here2");
                        setTimeout(() => {
                            getData();
                        }, 10000);
                    }
                }else{
                    document.getElementById('loading').innerText = "Data is loading...";
                    setTimeout(() => {
                        getData();
                    }, 10000);
                }
            }
        }
    }
    rawFile.send(null);
    /*console.log(xValues);
    console.log(ramValues);
    console.log(cpuValues);
    console.log(esbValues);*/
}

/* first version of logger (python version)
function getData(){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "codecarbon.log", false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4)  {
            if(rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                if (allText.length != 0){
                    let currentRAMValues = localStorage.getItem('ramValues');
                    let currentCPUValues = localStorage.getItem('cpuValues');
                    let currentESBValues = localStorage.getItem('esbValues');
                    let currenXValues = localStorage.getItem('xValues');
                    counter = localStorage.getItem('counter');
                    ramValues = currentRAMValues ? JSON.parse(currentRAMValues) : [0.0];
                    cpuValues = currentCPUValues ? JSON.parse(currentCPUValues) : [0.0];
                    esbValues = currentESBValues ? JSON.parse(currentESBValues) : [0.0];
                    xValues = currenXValues ? JSON.parse(currenXValues) : [0];

                    //To see the log
                    var textArray = allText.split('/n');
                    textArray.forEach(element => {
                        console.log(element);
                    });

                    var textRAM = textArray[textArray.length - 4];
                    var textCPU = textArray[textArray.length - 3];
                    var textESB = textArray[textArray.length - 2];
                    if (!textRAM.includes("ERROR") && !textCPU.includes("ERROR") && !textESB.includes("ERROR")){
                        var messageRAM = textRAM.split('|');
                        var messageCPU = textCPU.split('|');
                        var messageESB = textESB.split('|');

                        var splitValuesRAM = messageRAM[1].split(':');
                        ram = splitValuesRAM[1].split(' ')[1];
                        ramPower = splitValuesRAM[2].split(' ')[1];

                        var splitValuesCPU = messageCPU[1].split(':');
                        cpu = splitValuesCPU[1].split(' ')[1];
                        cpuPower = splitValuesCPU[2].split(' ')[1];

                        esb = messageESB[1].split(' ')[0];

                        ramValues.push(parseFloat(ram));

                        cpuValues.push(parseFloat(cpu));

                        esbValues.push(parseFloat(esb));

                        xValues.push(++counter);

                    }else{
                        document.write("There was a error message in codecarbon. Please check console.");
                        ram = localStorage.getItem("ram");
                        ramPower = localStorage.getItem("ramPower");
                        cpu = localStorage.getItem("cpu");
                        cpuPower = localStorage.getItem("cpuPower");
                        esb = localStorage.getItem("esb");
                    }
                }else{
                    document.write("Data are loading...")
                }
        }
        }
    }
    rawFile.send(null)
    console.log(xValues);
    console.log(ramValues);
    console.log(cpuValues);
    console.log(esbValues);
}*/

function buildLineChart(){
    //const exampleValues = [0,1,2,3,4,5,6,7,8,9,10];

    new Chart("myChart", {
        type: "line",
        data: {
          labels: xValues,
          datasets: [{
            borderColor: "red",
            label:'RAM',
            data: ramValues,
            fill: false
          },{
            borderColor: "orange",
            label:'CPU',
            data: cpuValues,
            fill: false
          },{
            borderColor: "blue",
            label:'Electricity used since beginning',
            data: esbValues,
            fill: false
          },
        ]},
        options:{
            responsive: true,
            maintainAspectRatio: false
        }
      });
}

function writeRAM(){
    document.write(ram);
}

function writeRAMPower(){
    document.write(ramPower);
}

function writeCPU(){
    document.write(cpu);
}

function writeCPUPower(){
    document.write(cpuPower);
}

function writeESB(){
    document.write(esb);
}