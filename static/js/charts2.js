function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var metadata2 = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray2 = metadata2.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result2 = resultArray2[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = result2.otu_ids;
    var otu_lab = result2.otu_labels;
    var samp_values = result2.sample_values;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    var yValue = otu_id.slice(0,10);
    var descsort = yValue;
    var yticks = descsort.map(val => "OTU " + val.toString() + " ");
    //console.log(yticks);
    var xValue = samp_values.slice(0,10);
    var otu_lab1 = otu_lab.reverse();
    
    // 8. Create the trace for the bar chart. 
    var trace200 = {
      x: xValue.reverse(),
      y: yticks.reverse(),
      text: otu_lab1,
      type: 'bar',
      orientation: "h"
    };

    var bData = [trace200];

    // 9. Create the layout for the bar chart. 
    var bLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", bData, bLayout);

    var size = samp_values;
    // 1. Create the trace for the bubble chart.
    
    var trace5 = {
      x: otu_id,
      y: samp_values,
      mode: 'markers',
      text: otu_lab1,
      marker: {
        size: size,
        color: otu_id,
      }
    };
    var bubbleData = [trace5];
    
    // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {
          title: "OTU ID"},
        height: 500,
        width: 1200
      };
  
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugedata = data.metadata;
    var resultArray3 = gaugedata.filter(sampleObj => sampleObj.id == sample);
    var gaugeresult = resultArray3[0].wfreq;
    var gaugenumber = gaugeresult.toFixed(5);
    // var text = "EWW, TAKE A BATH!"
    // if (gaugenumber < 1) {
    //   gaugenumber = text} else {
    //     text = "";
    // }
    gaugeresult.toFixed(5);
    //console.log(gaugenumber);
    var gaugeData = [
      {
      type: "indicator",
      mode: "gauge+number",
      value: gaugenumber,
      title: { text: "Belly Button Washing Frequency" },
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }
          ]
        }
      }   
    ];
    
    // 5. Create the layout for the gauge chart.
    
    var gaugeLayout = { 
      width: 600, height: 450, margin: { t: 0, b: 0 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
