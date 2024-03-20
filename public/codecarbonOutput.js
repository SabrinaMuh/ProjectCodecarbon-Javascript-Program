//Start values
var ramPower = 0;
var cpuPower = 0;

var ramValues = [];
var cpuValues = [];
var esbValues = [];
var xValues = [];
var size = 0;
var oldSize = 0;

var diffRamValues = [0];
var diffCpuValues = [0];
var diffEsbValues = [0];
var diffXValues = [0];

var currentXValues = [];
var currentRamValues = [];
var currentCpuValues = [];
var currentEsbValues = [];
var currentDiffXValues = [];
var currentDiffRamValues = [];
var currentDiffCpuValues = [];
var currentDiffEsbValues = [];

var running = true;

var myChart;
var diffChart;

getData();
buildLineChart(xValues, ramValues, cpuValues, esbValues, diffXValues, diffRamValues, diffCpuValues, diffEsbValues);

async function getData(){
    const response = await fetch('/cc');

    console.log(response.status);
    if(response.status == 200){
        let data = await response.json();
        ramPower = data.ram_power;
        ramValues = data.ram_energy;
        cpuPower = data.cpu_power;
        cpuValues = data.cpu_energy;
        esbValues = data.energy_consumed;
        xValues = data.xValues;
        size = xValues.length;
        
        if(size > 0 && size != oldSize){
            console.log(data);
            document.getElementById('ram_index').innerText = ramValues[ramValues.length - 1];
            document.getElementById('ram_power_index').innerText = ramPower;
            document.getElementById('cpu_index').innerText = cpuValues[cpuValues.length - 1];
            document.getElementById('cpu_power_index').innerText = cpuPower;
            document.getElementById('esb_index').innerText = esbValues[esbValues.length - 1];

            calculateDiff();

            if(running){
                if(size > 10){
                    currentXValues = xValues.slice(size - 10, size + 1);
                    currentRamValues = ramValues.slice(size - 10, size + 1);
                    currentCpuValues = cpuValues.slice(size - 10, size + 1);
                    currentEsbValues = esbValues.slice(size - 10, size + 1);
                    currentDiffRamValues = diffRamValues.slice(size - 10, size + 1);
                    currentDiffCpuValues = diffCpuValues.slice(size - 10, size + 1);
                    currentDiffEsbValues = diffEsbValues.slice(size - 10, size + 1);
                    
                    updateLineChart(currentXValues, currentRamValues, currentCpuValues, currentEsbValues, currentXValues, currentDiffRamValues, currentDiffCpuValues, currentDiffEsbValues);
                }else{
                    updateLineChart(xValues, ramValues, cpuValues, esbValues, diffXValues, diffRamValues, diffCpuValues, diffEsbValues); 
                }
                
                document.getElementById("status").innerText = "Running...";
            }

            oldSize = size;
        }else{
            document.getElementById("status").innerText = "Aborted";
        }
        setTimeout(() => {
            getData();
        }, 5000);
    }
}

/*Logger Version
function getData(){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "log.txt", false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4)  {
            if(rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                var textArray = allText.split('\n');
                console.log(allText);
                if(textArray.length>20){

                    if(textArray.length>23){
                        counter = localStorage.getItem('counter');
                        xValues = JSON.parse(localStorage.getItem('xValues'));
                        ramValues = JSON.parse(localStorage.getItem('ramValues'));
                        cpuValues = JSON.parse(localStorage.getItem('cpuValues'));
                        esbValues = JSON.parse(localStorage.getItem('esbValues'));
                        counterDiff = localStorage.getItem('counterDiff');
                        diffXValues = JSON.parse(localStorage.getItem('diffXValues'));
                        diffRamValues = JSON.parse(localStorage.getItem('diffRamValues'));
                        diffCpuValues = JSON.parse(localStorage.getItem('diffCpuValues'));
                        diffEsbValues = JSON.parse(localStorage.getItem('diffEsbValues'));
                    }

                    var textRAM = textArray[textArray.length - 4];
                    var textCPU = textArray[textArray.length - 3];
                    var textESB = textArray[textArray.length - 2];
                    
                    if(textRAM.includes("RAM") && textCPU.includes("CPU") && textESB.includes("electricity used since the beginning")){
                        ram = textRAM.split("]")[1].split(":")[1].split(" ")[1];
                        ramPower = textRAM.split("]")[1].split(":")[2].split(" ")[1];
                        

                        cpu = textCPU.split("]")[1].split(":")[1].split(" ")[1];
                        cpuPower = textCPU.split("]")[1].split(":")[2].split(" ")[1];

                        esb = textESB.split("]")[1].split(" ")[1];

                        if(ram != ramValues[ramValues.length-1] && cpu != cpuValues[cpuValues.length-1] && esb != esbValues[esbValues.length-1]){
                            ramValues.push(ram);
                            cpuValues.push(cpu);
                            esbValues.push(esb);
                            xValues.push(counter++);
                            if(xValues.length>=2){
                                calculateDiff();
                            }
                        }

                        document.getElementById('ram_index').innerText = ram;
                        document.getElementById('ram_power_index').innerText = ramPower;
                        document.getElementById('cpu_index').innerText = cpu;
                        document.getElementById('cpu_power_index').innerText = cpuPower;
                        document.getElementById('esb_index').innerText = esb;
                        document.getElementById('status').innerText = "";

                        localStorage.setItem("counter", counter);
                        localStorage.setItem("xValues", JSON.stringify(xValues));
                        localStorage.setItem("ramValues", JSON.stringify(ramValues));
                        localStorage.setItem("cpuValues", JSON.stringify(cpuValues));
                        localStorage.setItem("esbValues", JSON.stringify(esbValues));
                        localStorage.setItem("counterDiff", counterDiff);
                        localStorage.setItem("diffXValues", JSON.stringify(diffXValues));
                        localStorage.setItem("diffRamValues", JSON.stringify(diffRamValues));
                        localStorage.setItem("diffCpuValues", JSON.stringify(diffCpuValues));
                        localStorage.setItem("diffEsbValues", JSON.stringify(diffEsbValues));
                        
                        if(running){
                            buildLineChart(xValues, ramValues, cpuValues, esbValues, diffXValues, diffRamValues, diffCpuValues, diffEsbValues);
                            document.getElementById("status").innerText = "Running...";
                        }
                        
                        setTimeout(() => {
                            getData();
                        }, 10000);
                    } else if(textRAM.includes("Aborted!") || textCPU.includes("Aborted!") || textESB.includes("Aborted!")){
                        document.getElementById("status").innerText = "Codecarbon is aborted";
                    } else{
                        setTimeout(() => {
                            getData();
                        }, 1000);
                    }
                }else{
                    document.getElementById('status').innerText = "Data is loading...";
                    setTimeout(() => {
                        getData();
                    }, 10000);
                }
            }
        }
    }
    rawFile.send(null);
}*/

function calculateDiff(){
    diffRamValues = [0];
    diffCpuValues = [0];
    diffEsbValues = [0];
    diffXValues = [0];
    for (let i = 1; i < xValues.length; i++){
        diffXValues.push(i*5);
        diffRamValues.push(ramValues[i] - ramValues[i-1]);
        diffCpuValues.push(cpuValues[i] - cpuValues[i-1]);
        diffEsbValues.push(esbValues[i] - esbValues[i-1]);
    }
}

function filterData(){
    var start = parseInt(document.getElementById("start").value);
    var end = parseInt(document.getElementById("end").value);
    if(start >= 0 && end >= 0 && end<xValues.length){
        running = false;
        var xValuesFilter = xValues.slice(start, end+1);
        var ramValuesFilter = ramValues.slice(start, end+1);
        var cpuValuesFilter = cpuValues.slice(start,end+1);
        var esbValuesFilter = esbValues.slice(start,end+1);
        var diffXValuesFilter = diffXValues.slice(start,end+1);
        var diffRamValuesFilter = diffRamValues.slice(start,end+1);
        var diffCpuValuesFilter = diffCpuValues.slice(start,end+1);
        var diffEsbValuesFilter = diffEsbValues.slice(start,end+1);

        updateLineChart(xValuesFilter, ramValuesFilter, cpuValuesFilter, esbValuesFilter, diffXValuesFilter, diffRamValuesFilter, diffCpuValuesFilter, diffEsbValuesFilter);

        document.getElementById("errorMessage").style.display = "none";
        document.getElementById('status').innerText = "Filtermodus...";
    }else{
        document.getElementById("errorMessage").style.display = "inline";
    }
}

function removeFilter(){
    running = true;

    if(size > 10){
        currentXValues = xValues.slice(size - 10, size + 1);
        currentRamValues = ramValues.slice(size - 10, size + 1);
        currentCpuValues = cpuValues.slice(size - 10, size + 1);
        currentEsbValues = esbValues.slice(size - 10, size + 1);
        currentDiffRamValues = diffRamValues.slice(size - 10, size + 1);
        currentDiffCpuValues = diffCpuValues.slice(size - 10, size + 1);
        currentDiffEsbValues = diffEsbValues.slice(size - 10, size + 1);
        
        updateLineChart(currentXValues, currentRamValues, currentCpuValues, currentEsbValues, currentXValues, currentDiffRamValues, currentDiffCpuValues, currentDiffEsbValues);
    }else{
        updateLineChart(xValues, ramValues, cpuValues, esbValues, diffXValues, diffRamValues, diffCpuValues, diffEsbValues); 
    }
}

function showWholeChart(){
    running = false;
    document.getElementById('status').innerText = "Fullmodus...";
    updateLineChart(xValues, ramValues, cpuValues, esbValues, diffXValues, diffRamValues, diffCpuValues, diffEsbValues);
}

function buildLineChart(){
    //const exampleValues = [0,1,2,3,4,5,6,7,8,9,10];

    myChart = new Chart("myChart", {
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
            label:'Energy Usage',
            data: esbValues,
            fill: false
          },
        ]},
        options:{
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            tooltips: {
                callbacks:{
                    label: (tooltipItems, data) => {
                        return data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' kWh';
                    }
                },
                titleFontSize: 0,
                titleMarginBottom: 0,
                bodyFontSize: 14
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 14,
                    }
                }],
                yAxes: [{
                    scaleLabel:{
                        display: true,
                        labelString: 'kWh',
                        fontSize: 14
                    },
                    ticks: {
                        fontSize: 14,
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    /*const containerBody = document.querySelector('.containerBody');
    const lengthXValues = xValues.length;

    if(lengthXValues > 10){
        const newWidth = 700 + ((lengthXValues - 10) * 50);
        containerBody.style.width = `${newWidth}px`;
    }else{
        containerBody.style.width = '700px';
    }*/


    diffChart = new Chart("myChartDiff", {
        type: "line",
        data: {
          labels: diffXValues,
          datasets: [{
            borderColor: "red",
            label:'Difference RAM',
            data: diffRamValues,
            fill: false
          },{
            borderColor: "orange",
            label:'Difference CPU',
            data: diffCpuValues,
            fill: false
          },{
            borderColor: "blue",
            label:'Difference Energy Usage',
            data: diffEsbValues,
            fill: false
          },
        ]},
        options:{
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            tooltips: {
                callbacks:{
                    label: (tooltipItems, data) => {
                        return data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' kWh';
                    }
                },
                titleFontSize: 0,
                titleMarginBottom: 0,
                bodyFontSize: 14
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 14,
                    }
                }],
                yAxes: [{
                    scaleLabel:{
                        display: true,
                        labelString: 'kWh',
                        fontSize: 14
                    },
                    ticks: {
                        fontSize: 14,
                        beginAtZero: true,
                        stepSize: 0.0000015,
                        suggestedMax: 0.00001
                    }
                }]
            },
        }
      });

    /*const containerBodyDiff = document.querySelector('.containerBodyDiff');
    const lengthDiffXValues = diffXValues.length;
  
    if(lengthDiffXValues > 10){
        const newWidth = 700 + ((lengthDiffXValues - 10) * 50);
        containerBodyDiff.style.width = `${newWidth}px`;
    }else{
        containerBodyDiff.style.width = '700px';
    }*/
}

function updateLineChart(xValues, ramValues, cpuValues, esbValues, diffXValues, diffRamValues, diffCpuValues, diffEsbValues){
    myChart.data.labels = xValues;
    myChart.data.datasets[0].data = ramValues;
    myChart.data.datasets[1].data = cpuValues;
    myChart.data.datasets[2].data = esbValues;
    myChart.update();

    diffChart.data.labels = diffXValues;
    diffChart.data.datasets[0].data = diffRamValues;
    diffChart.data.datasets[1].data = diffCpuValues;
    diffChart.data.datasets[2].data = diffEsbValues;
    diffChart.update();
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