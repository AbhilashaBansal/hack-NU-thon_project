const graph_map = {};

const dropdown = document.getElementById('country');


dropdown.addEventListener('change', async ({target: {value}}) => {
	const url = "https://api.covid19india.org/data.json";
  const data = await getCovidData(url);
	const country_data = data[value];
  Object.values(graph_map).forEach(({graph, stat, label}) => {
    graph.config.data.datasets[0].data = country_data.map(o => o[stat]);
    graph.config.data.datasets[0].label = `${label} in ${value}`;
		graph.update();
  });
  setCountryNames(value);
  updateTotals(country_data);
});

const populateDropdown = countries => {
	const country_options = countries.map(str => `<option value="${str}">${str}</option>`).join('');	
}

const updateTotals = countries => {
  const totalMap = {
    "tot-conf": "confirmed",
    "tot-deaths": "deaths",
    "tot-rec": "recovered"
  };
  const maxs = Object.entries(totalMap).map(([k, v]) => [k, Math.max(...countries.map((o) => (+o[v]||0)))]);
  
  maxs.forEach(([elem_id, max_cnt]) => {

    const countUp = new CountUp(elem_id, 0, max_cnt);
    countUp.start();
    if(!countUp.error) {
      countUp.start();
    } else {
      console.error(countUp.error);
    }
  })
  
}


const getCovidData = async (url) => {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("HTTP Error: " + response.status);

  return await response.json();
};

const populateGraphs = async country_data => {
  const labels = country_data.map(({date}) => date.replace('2020-', ''));
};


const init = async country => {
	const url = "https://pomber.github.io/covid19/timeseries.json";
  const data = await getCovidData(url);
  const countries = Object.keys(data).sort((a, b) => a.localeCompare(b));
  const country_data = data[country];
	populateGraphs(country_data);
  populateDropdown(countries);
  updateTotals(country_data);
  setCountryNames(country);

  document.getElementById("last-updated").innerText = getUKDateFormat(country_data[country_data.length-1].date);
}

const getUKDateFormat = date => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}



const country = "Afghanistan";
init(country);
