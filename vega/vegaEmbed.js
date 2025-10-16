// Load data from datasets/videogames_wide.csv using d3.csv and then make visualizations
async function fetchData() {
  const data = await d3.csv("./dataset/videogames_wide.csv");
  return data;
}

fetchData().then(async (data) => {
  const vlSpec = vl
    .markBar()
    .data(data)
    .encode(
      vl.y().fieldN("Platform").sort("-x"),
      vl.x().fieldQ("Global_Sales").aggregate("sum")
    )
    .width("container")
    .height(400)
    .toSpec();

  const vlSpec2 = vl
    .markBar()
    .data(data)
    .encode(
      vl.y().fieldN("Genre").sort("-x"),
      vl.x().fieldQ("Global_Sales").aggregate("sum"),
      vl.color().value("teal")
    )
    .width("container")
    .height(400)
    .toSpec();

  render("#view", vlSpec);
  render("#view2", vlSpec2);
});

async function render(viewID, spec) {
  const result = await vegaEmbed(viewID, spec);
  result.view.run();
}

const spec1 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { url: "dataset/videogames_wide.csv" },
  title: "Global Sales (in Millions) by Genre and Platform",
  width: 600,
  height: 400,
  mark: "rect",
  encoding: {
    x: {
      field: "Genre",
      type: "nominal",
      axis: { title: "Genre", labelAngle: -45 },
    },
    y: { field: "Platform", type: "nominal", axis: { title: "Platform" } },
    color: {
      field: "Global_Sales",
      type: "quantitative",
      aggregate: "sum",
      title: "Total Sales",
      scale: { scheme: "viridis" },
    },
  },
  config: {
    axis: { grid: true, tickBand: "extent" },
  },
};
vegaEmbed("#vis1", spec1);

// Visualization 2: Sales Over Time with Default Selection
const spec2 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { url: "dataset/videogames_wide.csv" },
  title: "Sales Over Time by Platform and Genre",
  params: [
    // Added "value" to set a default selection
    {
      name: "platform_selection",
      value: "Wii",
      bind: {
        input: "select",
        options: [null, "Wii", "PS2", "X360", "PS3", "DS"],
      },
    },
    {
      name: "genre_selection",
      value: "Sports",
      bind: {
        input: "select",
        options: [null, "Sports", "Action", "Shooter", "Misc", "Role-Playing"],
      },
    },
  ],
  transform: [
    { filter: "datum.Platform == platform_selection" },
    { filter: "datum.Genre == genre_selection" },
  ],
  mark: "line",
  encoding: {
    x: { field: "Year", type: "ordinal", title: "Year" },
    y: {
      field: "Global_Sales",
      type: "quantitative",
      aggregate: "sum",
      title: "Global Sales (in Millions)",
    },
    color: { field: "Platform", type: "nominal", title: "Platform" },
  },
};
vegaEmbed("#vis2", spec2);

// Visualization 3: 100% Stacked Bar Chart for Regional Sales (FIXED)
const spec3 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { url: "dataset/videogames_long.csv" },
  title: "Regional Sales Share by Platform",
  width: 600,
  mark: "bar",
  encoding: {
    x: {
      field: "platform",
      type: "nominal",
      axis: {
        labelAngle: -45,
      },
      sort: "-y",
    },
    y: {
      field: "sales_amount",
      type: "quantitative",
      aggregate: "sum",
      axis: { title: "Percentage of Sales" },
      stack: "normalize",
    },
    color: {
      field: "sales_region",
      type: "nominal",
      title: "Sales Region",
    },
    tooltip: [
      { field: "platform", type: "nominal" },
      { field: "sales_region", type: "nominal", title: "Region" },
      {
        field: "sales_amount",
        aggregate: "sum",
        type: "quantitative",
        title: "Sales (in millions)",
      },
    ],
  },
};
vegaEmbed("#vis3", spec3);

const spec4 = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { url: "dataset/videogames_wide.csv" },
  transform: [
    {
      filter: {
        field: "Publisher",
        oneOf: [
          "Nintendo",
          "Electronic Arts",
          "Activision",
          "Sony Computer Entertainment",
          "Ubisoft",
        ],
      },
    },
  ],
  mark: "line",
  encoding: {
    x: { field: "Year", type: "ordinal" },
    y: { field: "Global_Sales", type: "quantitative", aggregate: "sum" },
    color: { field: "Publisher", type: "nominal" },
  },
};
vegaEmbed("#vis4", spec4);
