// Global Data variables
let populationStat = [];
let sampleStat = [];
let sampleDistStat = [];
let sampleDistMeans = [];

// Box Mular Transformation
function randBoxMularTransform(min, max) {
  let u = 0;
  let v = 0;
  while (u === 0) {
    u = Math.random();
  }

  while (v === 0) {
    v = Math.random();
  }

  num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  if (num > max || num < min) {
    num = randBoxMularTransform(min, max);
  }

  return num + Math.abs(min);
}

// Generating a uniform distribution of size 'n'
function generateUniform(n) {
  let data = [];
  for (let i = 0; i < n; i++) {
    data.push(Math.floor(Math.random() * 30));
  }

  return data;
}

// Generating a normal distribution of size 'n' 
function generateNormal(n) {
  let data = [];
  for (let i = 0; i < n; i++) {
    num = randBoxMularTransform(-4, 4) * 3.8;
    data.push(Math.floor(num));
  }

  return data;
}

// Generating a negatively skewed distribution
function generateNeg(n) {
  let data = [];
  for (let i = 0; i < n; i++) {
    num = randBoxMularTransform(0, 1);
    num = Math.pow(num, 2.0) * 30;
    data.push(Math.floor(num));
  }

  return data;
}

// Generating a positively skewed distribution 
function generatePos(n) {
  let data = [];
  for (let i = 0; i < n; i++) {
    num = randBoxMularTransform(0, 1);
    num = -Math.pow(num, 2.0) * 30 + 30;
    data.push(Math.floor(num));
  }

  return data;
}

// Draw histogram
function drawHistogram(points, counts, id, range_min, range_max, title) {
  let canvas = document.getElementById(id);
  let ctx = canvas.getContext('2d');

  let chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: points,
      datasets: [{
        label: title,
        borderColor: '#43963D',
        borderWidth: 1,
        data: counts,
        backgroundColor: '#D1FBCD',
        barPercentage: 1.3,
      }]
    },
    options: {
      responsive: true,
      scales: {
        xAxes: [{
          //display: true,
          gridLines: {
            drawBorder: true,
            lineWidth: 2,
            color: "black",
            drawOnChartArea: false
          },
          ticks: {
            autoSkip: false,
            max: range_max - range_min + 1,
            fontColor: "black"
          }
        }],
        yAxes: [{
          gridLines: {
            drawBorder: true,
            lineWidth: 2,
            color: "black",
            drawOnChartArea: false
          },
          ticks: {
            beginAtZero: true,
            fontColor: "black",
            stepSize: 1
          }
        }]
      }
    }
  });

  return chart;
}

// Calculate average(or mean) of given data
function average(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }

  return total / arr.length;
}

// Calculate standard deviation for given 'data' and 'mean'
function stddev(data, mean) {
  let sumSqu = 0;
  for (let i = 0; i < data.length; i++) {
    sumSqu += Math.pow(data[i] - mean, 2);
  }

  return Math.sqrt(sumSqu / data.length);
}

// Generate a population of size 'n' with given distribution 'dist'
function generateDist(dist, n) {
  // Generate n random number
  let random = [];
  switch(dist.toLowerCase()) {
    case "uniform":
      random = generateUniform(n);
      break;
    case "normal":
      random = generateNormal(n);
      break;
    case "negatively skewed":
      random = generateNeg(n);
      break;
      case "positively skewed":
        random = generatePos(n);
        break;
  }

  return random;
}

// Extract the selected distribution from 'form'
function getSelectedDist() {
  return document.getElementById("dist1").value;
}

// Select a random sample of size 'n' from population
function selectSample(data, n) {
  let sample = [];
  let tmp;
  let tmpValue;
  for (let i = data.length - 1, j = data.length - 1 - n; i > j; i--) {
    tmp = Math.floor(Math.random() * (i + 1));
    tmpValue = data[tmp];
    data[tmp] = data[i];
    data[i] = tmpValue;
    sample.push(tmpValue);
  }

  return sample;
}

// select m random samples each of size 'n' and calculate their average(or mean)
function meansOfRandomSamples(data) {
  let n = parseInt(document.getElementById("sample-size2").value);
  let m = parseInt(document.getElementById("samples").value);

  sample_means = [];
  for (let i = 0; i < m; i++) {
    sample_means.push(Math.round(average(selectSample(data, n)) * 100) / 100);
  }

  return sample_means;
}

// Count the frequency of number in data
function countFreq(data) {
  let counts = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ];

  for (let i = 0; i < data.length; i++) {
    counts[Math.round(data[i])]++;
  }

  return counts;
}

function minimum(arr) {
  let min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (min > arr[i]) {
      min = arr[i];
    }
  }

  return min;
}

function maximum(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (max < arr[i]) {
      max = arr[i];
    }
  }

  return max;
}

function initilize(data_points, counts, min, max) {
  let step = Math.round((max - min) / 20 * 100) / 100;
  if (step === 0) {
    step = 0.1;
  }

  for (let i = min - step; i <= max + step; i += step) {
    data_points.push(Math.round(i * 100) / 100);
    counts.push(0);
  }

  return step;
}
 
function countFreqWithStep(stat) {
  let data_points = []
  let counts = [];
  let min = minimum(stat[0]);
  let max = maximum(stat[0]);

  console.log(min, max);

  let step = initilize(data_points, counts, min, max);
  console.log(step);
  let index;
  for (let j = 0; j < stat[0].length; j++) {
    index = Math.round((stat[0][j] - min) / step) + 1;
    counts[index]++;
  }

  stat.push(data_points);
  stat.push(counts);

  console.log(data_points);
  console.log(counts);
 
  return;
}

function updateSampleDist(mean) {
  sampleDistMeans.push(mean);
  return calculateStat(sampleDistMeans);
}

function createPopulationAndDraw() {
  // To destroy previous chart
  destroyChart(populationStat);
  destroyChart(sampleStat);
  destroyChart(sampleDistStat);
  
  let dist = getSelectedDist();
  let stat = [generateDist(dist, 10000)];
  stat.push(average(stat[0]));
  stat.push(stddev(stat[0], stat[1]));
  let data_points = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29
  ];
  stat.push(data_points);
  stat.push(countFreq(stat[0]));
  stat.push(drawHistogram(stat[3], stat[4], 'histogram1', 0, 29, "POPULATION"));

  let html = "<ul><li>Population distribution: " + dist + "</li>";
  html += "<li>Size: " + stat[0].length + "</li>"; 
  html += "<li>Mean: " + stat[1].toFixed(3) + "</li>";
  html += "<li>Standard Deviation: " + stat[2].toFixed(3) + "</li></ul>";

  document.getElementById("data1").innerHTML = html;
  document.getElementById("data2").innerHTML = "";
  document.getElementById("data3").innerHTML = "";

  return stat;
}

function selectSampleAndDraw(data) {
  // To destroy previous chart
  destroyChart(sampleStat);
  destroyChart(sampleDistStat);

  let n = document.getElementById("sample-size1").value;
  let stat = [selectSample(data, n)];
  stat.push(average(stat[0]));
  stat.push(stddev(stat[0], stat[1]));
  let data_points = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29
  ];
  stat.push(data_points);
  stat.push(countFreq(stat[0]));
  stat.push(drawHistogram(stat[3], stat[4], 'histogram2', 0, 29, "SAMPLE"));

  let html = "<ul><li>Sample Size: " + stat[0].length + "</li>"; 
  html += "<li>Mean: " + stat[1].toFixed(3) + "</li>";
  html += "<li>Standard Deviation: " + stat[2].toFixed(3) + "</li></ul>";

  document.getElementById("data2").innerHTML = html;

  sampleDistStat = updateSampleDist(stat[1]);

  return stat;
}

function sampleDistAndDraw(data) {
  // To destroy previous chart
  destroyChart(sampleDistStat);

  let means = meansOfRandomSamples(data);

  return calculateStat(means);
}

function calculateStat(means) {
  let stat = [means];
  stat.push(average(stat[0]));
  stat.push(stddev(stat[0], stat[1]));
  countFreqWithStep(stat);
  stat.push(drawHistogram(stat[3], stat[4], 'histogram3', 0, 29, "SAMPLING DISCTRIBUTION"));

  let html = "<ul><li>Samples: " + stat[0].length + "</li>";
  html += "<li> Sample Size: " + parseInt(document.getElementById("sample-size2").value) + "</li>"; 
  html += "<li>Mean: " + stat[1].toFixed(3) + "</li>";
  html += "<li>Standard Deviation: " + stat[2].toFixed(3) + "</li></ul>";

  document.getElementById("data3").innerHTML = html;

  return stat;
}

// Destroy the chart if is present
function destroyChart(stat) {
  console.log("yes");
  console.log(stat);
  if (stat.length > 0) {
    stat[5].destroy();
  }
}