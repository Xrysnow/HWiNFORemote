window.Apex = {
  chart: {
    foreColor: '#fff',
    toolbar: {
      show: false
    },
  },
  colors: ['#FCCF31', '#17ead9', '#f02fc2'],
  stroke: {
    width: 3
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    borderColor: "#40475D",
  },
  xaxis: {
    axisTicks: {
      color: '#333'
    },
    axisBorder: {
      color: "#333"
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      gradientToColors: ['#F55555', '#6078ea', '#6094ea']
    },
  },
  tooltip: {
    theme: 'dark',
    x: {
      formatter: function (val) {
        return moment(new Date(val)).format("HH:mm:ss")
      }
    }
  },
  yaxis: {
    decimalsInFloat: 2,
    opposite: true,
    labels: {
      offsetX: -10
    }
  }
};

var trigoStrength = 3
var iteration = 11

function getRandom() {
  var i = iteration;
  return (Math.sin(i / trigoStrength) * (i / trigoStrength) + i / trigoStrength + 1) * (trigoStrength * 2)
}

function getRangeRandom(yrange) {
  return Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
}

function generateMinuteWiseTimeSeries(baseval, count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
    var x = baseval;
    var y = ((Math.sin(i / trigoStrength) * (i / trigoStrength) + i / trigoStrength + 1) * (trigoStrength * 2))

    series.push([x, y]);
    baseval += 300000;
    i++;
  }
  return series;
}

function getNewData(baseval, yrange) {
  var newTime = baseval + 300000;
  return {
    x: newTime,
    y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
  }
}

var optionsColumn = {
  chart: {
    height: 350,
    type: 'bar',
    animations: {
      enabled: false
    },
    events: {
      animationEnd: function (chartCtx, opts) {
        const newData = chartCtx.w.config.series[0].data.slice()
        newData.shift()
        window.setTimeout(function () {
          chartCtx.updateOptions({
            series: [{
              data: newData
            }],
            xaxis: {
              min: chartCtx.minX,
              max: chartCtx.maxX
            },
            subtitle: {
              text: parseInt(getRangeRandom({ min: 1, max: 20 })).toString() + '%',
            }
          }, false, false)
        }, 300)
      }
    },
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 0,
  },
  series: [{
    name: 'Load Average',
    data: generateMinuteWiseTimeSeries(new Date("12/12/2016 00:20:00").getTime(), 12, {
      min: 10,
      max: 110
    })
  }],
  title: {
    text: 'Load Average',
    align: 'left',
    style: {
      fontSize: '12px'
    }
  },
  subtitle: {
    text: '20%',
    floating: true,
    align: 'right',
    offsetY: 0,
    style: {
      fontSize: '22px'
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.5,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 0.8,
      stops: [0, 100]
    }
  },
  xaxis: {
    type: 'datetime',
    range: 2700000
  },
  legend: {
    show: true
  },
}

// var chartColumn = new ApexCharts(
//   document.querySelector("#columnchart"),
//   optionsColumn
// );
// chartColumn.render();

let LegendOption = {
  show: true,
  floating: true,
  horizontalAlign: 'left',
  onItemClick: {
    toggleDataSeries: false
  },
  position: 'top',
  offsetY: -28,
  offsetX: 60
};
let LineAnimationOption = {
  enabled: true,
  easing: 'linear',
  dynamicAnimation: {
    speed: 1000
  }
};
let LineXAxisOption = {
  type: 'datetime',
  range: 3000000,
  labels: {
    show: false
  }
};
function FormatterInt(val, index) {
  return val.toFixed(0);
}

let OptionsCPULine = {
  chart: {
    height: 350,
    type: 'line',
    animations: LineAnimationOption,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'straight',
    width: 5,
  },
  grid: {
    padding: {
      left: 0,
      right: 0
    }
  },
  markers: {
    size: 0,
    hover: {
      size: 0
    }
  },
  series: [{
    name: 'Usage',
    data: [[0, 0], [100000, 0]]
  }, {
    name: 'Temp',
    data: [[0, 0], [100000, 0]]
  }],
  xaxis: LineXAxisOption,
  yaxis: { min: 0, max: 100, labels: { formatter: FormatterInt } },
  title: {
    text: 'CPU',
    align: 'left',
    style: {
      fontSize: '12px'
    }
  },
  legend: LegendOption,
}

let OptionsGPULine = {
  chart: {
    height: 350,
    type: 'line',
    animations: LineAnimationOption,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'straight',
    width: 5,
  },
  grid: {
    padding: {
      left: 0,
      right: 0
    }
  },
  markers: {
    size: 0,
    hover: {
      size: 0
    }
  },
  series: [{
    name: 'Usage',
    data: [[0, 0], [100000, 0]]
  }, {
    name: 'Temp',
    data: [[0, 0], [100000, 0]]
  }],
  xaxis: LineXAxisOption,
  yaxis: { min: 0, max: 100, labels: { formatter: FormatterInt } },
  title: {
    text: 'GPU',
    align: 'left',
    style: {
      fontSize: '12px'
    }
  },
  legend: LegendOption,
}

let chartLine1 = new ApexCharts(
  document.querySelector("#linechart1"),
  OptionsCPULine
);
chartLine1.render();

let chartLine2 = new ApexCharts(
  document.querySelector("#linechart2"),
  OptionsGPULine
);
chartLine2.render();

var optionsCircle = {
  chart: {
    type: 'radialBar',
    height: 320,
    offsetY: -30,
    offsetX: 20
  },
  plotOptions: {
    radialBar: {
      size: undefined,
      inverseOrder: false,
      hollow: {
        margin: 5,
        size: '48%',
        background: 'transparent',
      },
      track: {
        show: true,
        background: '#40475D',
        strokeWidth: '10%',
        opacity: 1,
        margin: 3, // margin is in pixels
      },


    },
  },
  series: [71, 63],
  labels: ['Device 1', 'Device 2'],
  legend: {
    show: true,
    position: 'left',
    offsetX: -30,
    offsetY: 10,
    formatter: function (val, opts) {
      return val + " - " + opts.w.globals.series[opts.seriesIndex] + '%'
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100]
    }
  }
}

// var chartCircle = new ApexCharts(document.querySelector('#circlechart'), optionsCircle);
// chartCircle.render();

var optionsProgress1 = {
  chart: {
    height: 70,
    type: 'bar',
    stacked: true,
    sparkline: {
      enabled: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '20%',
      colors: {
        backgroundBarColors: ['#40475D']
      }
    },
  },
  stroke: {
    width: 0,
  },
  series: [{
    name: 'Process 1',
    data: [44]
  }],
  title: {
    floating: true,
    offsetX: -10,
    offsetY: 5,
    text: 'Process 1'
  },
  subtitle: {
    floating: true,
    align: 'right',
    offsetY: 0,
    text: '44%',
    style: {
      fontSize: '20px'
    }
  },
  tooltip: {
    enabled: false
  },
  xaxis: {
    categories: ['Process 1'],
  },
  yaxis: {
    max: 100
  },
  fill: {
    opacity: 1
  }
}

// var chartProgress1 = new ApexCharts(document.querySelector('#progress1'), optionsProgress1);
// chartProgress1.render();

//

function updateLineChart(chart, dx, y) {
  if (typeof (y) == 'number') {
    chart.updateSeries([{
      data: [...chart.w.config.series[0].data,
      [
        chart.w.globals.maxX + dx,
        y
      ]
      ]
    }]);
  } else {
    try {
      let series = [];
      let x = chart.w.globals.maxX + dx;
      for (let i = 0; i < y.length; i++) {
        let point = [x, y[i]];
        let data = { data: [...chart.w.config.series[i].data, point] };
        series.push(data);
      }
      chart.updateSeries(series);
    } catch (error) {
    }
  }
}

function updateCharts(data) {
  if (!data) {
    return;
  }
  let dataLine1 = [data[1].elements[68].value, data[4].elements[0].value];
  let dataLine2 = [data[20].elements[41].value, data[20].elements[0].value];
  updateLineChart(chartLine1, 100000, dataLine1);
  updateLineChart(chartLine2, 100000, dataLine2);
}

let manager = {};
manager.ws = new WebSocket("ws://localhost:55005");
manager.reset = function () {
  let ws = manager.ws;
  ws.onopen = function () {
    // console.log("ws open");
  }
  ws.onmessage = function (e) {
    manager.data = JSON.parse(e.data);
    updateCharts(manager.data);
  }
  ws.onclose = function (e) {
    // console.log("ws close");
    manager.ws = new WebSocket("ws://localhost:55005");
    manager.reset();
    // console.log("ws reopen");
  }
  ws.onerror = function (e) {
    console.log(error);
  }
}
manager.reset();
manager.update = function () {
  // console.log("ws send");
  // console.log(ws.OPEN, ws.CONNECTING);
  manager.ws.send('query');
}

window.setInterval(function () {

  iteration++;

  if (iteration == 13) {
    console.log(manager.data);
  }
  manager.update();

  // chartColumn.updateSeries([{
  //   data: [...chartColumn.w.config.series[0].data,
  //   [
  //     chartColumn.w.globals.maxX + 300000,
  //     getRandom()
  //   ]
  //   ]
  // }])

  // chartCircle.updateSeries([getRangeRandom({ min: 10, max: 100 }), getRangeRandom({ min: 10, max: 100 })]);

  // var p1Data = getRangeRandom({ min: 10, max: 100 });
  // chartProgress1.updateOptions({
  //   series: [{
  //     data: [p1Data]
  //   }],
  //   subtitle: {
  //     text: p1Data + "%"
  //   }
  // });

}, 1000);
