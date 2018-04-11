const url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
const width = 800;
const height = 500;

d3.json(url, function (data) {
  data.nodes.forEach((node, i) => {
    node.id = i;
  });
  const container = d3.select('.container')
  const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

  const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-100).distanceMax(100))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("vertical", d3.forceY().strength(0.03))
    .force("horizontal", d3.forceX().strength(0.03));


  const link = svg.append("g")
    .attr("class", "links")
    .selectAll("link")
    .data(data.links)
    .enter().append("line")
    .attr("class", "link");

  const tooltip = d3.select("#tooltip");
  const node = container.select('.flagbox')
    .selectAll('.flag')
    .data(data.nodes)
    .enter()
    .append('img')
    .attr('class', (d) => 'flag flag-' + d.code)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .on("mouseover", (d) => {
      tooltip.style("display", "block");
      tooltip.html(d.country)
        .style("left", (d3.event.x - 15) + "px")
        .style("top", (d3.event.pageY - 38) + "px");
    })
    .on("mouseout", (d) => {
      tooltip.style("display", "none");
    });

  simulation
    .nodes(data.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(data.links);

  function ticked() {
    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    node
      .style('left', d => (d.x - 8) + "px")
      .style('top', d => (d.y - 5) + "px");
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

});