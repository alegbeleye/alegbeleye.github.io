document.addEventListener("DOMContentLoaded", function () {
  function createEVSalesChart() {
    const data = [
      { region: "China", sales: 8.4 },
      { region: "Europe", sales: 3.2 },
      { region: "United States", sales: 1.4 },
      { region: "Rest of World", sales: 1.0 },
    ];

    const colorPalette = ["#003f5c", "#7a5195", "#ef5675", "#ffa600"];

    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 480 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    var prevColor = "";
    const svg = d3
      .select("#ev-sales-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.region))
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.sales)])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 5)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("Sales (in millions)");

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid 1px #ccc")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-family", "Satoshi, sans-serif");

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.region))
      .attr("y", (d) => y(d.sales))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.sales))
      .attr("fill", (d, i) => colorPalette[i])
      .on("mouseover", function (event, d) {
        d3.select(this).attr(
          "fill",
          d3.color(d3.select(this).attr("fill")).darker(0.3)
        );
        tooltip
          .style("visibility", "visible")
          .html(`<strong>${d.sales.toFixed(1)} million</strong> units`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 15 + "px")
          .style("left", event.pageX + 15 + "px");
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr(
          "fill",
          d3.color(d3.select(this).attr("fill")).brighter(0.3)
        );
        tooltip.style("visibility", "hidden");
      });
  }

  function createCreativeArt() {
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 480 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select("#creative-art")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const colorPalette = [
      "#003f5c",
      "#58508d",
      "#bc5090",
      "#ff6361",
      "#ffa600",
    ];
    const numCircles = 40;
    const circles = [];

    for (let i = 0; i < numCircles; i++) {
      circles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 20 + 5, // radius between 5 and 25
        dx: (Math.random() - 0.5) * 2, // horizontal velocity
        dy: (Math.random() - 0.5) * 2, // vertical velocity
        color: colorPalette[i % colorPalette.length],
      });
    }

    const circleSelection = svg
      .selectAll("circle")
      .data(circles)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r)
      .style("fill", (d) => d.color)
      .style("opacity", 0.7);

    // Animation loop
    d3.timer(() => {
      circleSelection
        .attr("cx", (d) => {
          d.x += d.dx;
          // Boundary detection: if circle hits left/right edge, reverse direction
          if (d.x < d.r || d.x > width - d.r) d.dx = -d.dx;
          return d.x;
        })
        .attr("cy", (d) => {
          d.y += d.dy;
          // Boundary detection: if circle hits top/bottom edge, reverse direction
          if (d.y < d.r || d.y > height - d.r) d.dy = -d.dy;
          return d.y;
        });
    });
  }

  // Run the functions based on which containers are on the page
  if (document.getElementById("ev-sales-chart")) {
    createEVSalesChart();
  }
  if (document.getElementById("creative-art")) {
    createCreativeArt();
  }
});
