import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import numeral from "numeral";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
//b6814d1c-d987-44d8-a8de-9038a52e8038
const Crypto = () => {
  const [coindata, setCoinData] = useState(null);
  const [historyTime, setHistoryTime] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState(null);
  const params = useParams();
  const coincapApi = axios.create({
    baseURL: "https://api.coincap.io/v2/",
  });

  const options = {
    responsive: true,
    scales: {},
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text:
          coindata &&
          historyData &&
          `${coindata.assests.name} (${dayjs(historyData[0].date).format(
            "MMM DD YYYY"
          )})`,
      },
    },
  };
  const getDetails = async () => {
    const [assests, markets, rates] = await Promise.all([
      coincapApi.get(`/assets/${params.id}`),

      coincapApi.get(`/assets/${params.id}/markets`),
      coincapApi.get(`/rates/${params.id}`),
    ]);
    const data = {
      assests: assests.data.data,
      markets: markets.data.data,
      rates: rates.data,
    };
    setCoinData(data);
    console.log(data);
    console.log(numeral(2000000).format("($ 0.00 a)"));
  };
  const getHistoryDetails = async () => {
    const { data } = await coincapApi.get(
      `/assets/${params.id}/history?interval=m1`
    );
    const newData = data.data.map((obj) => {
      let hours = dayjs(obj.time).format("HH");
      let min = dayjs(obj.time).format("mm");
      let AmOrPm = hours >= 12 ? "pm" : "am";
      hours = hours % 12 || 12;
      return `${hours}:${min}${AmOrPm}`;
    });
    const priceInUsd = data.data.map((obj) => obj.priceUsd);
    const min = Math.min(...priceInUsd);
    const max = Math.max(...priceInUsd);
    const avg =
      priceInUsd.reduce((a, b) => Number(a) + Number(b), 0) / priceInUsd.length;

    setAdditionalDetails({
      min,
      max,
      avg,
    });
    setHistoryTime(newData);
    setHistoryData(data.data);
  };
  //   setInterval(getHistoryDetails, 100000);

  const labels = historyTime && historyTime;
  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: historyData && historyData.map((obj) => obj.priceUsd),
        backgroundColor:
          coindata && coindata.assests.changePercent24Hr > 0
            ? "#e5ffe5"
            : "#ffe5e5",
        borderColor:
          coindata && coindata.assests.changePercent24Hr > 0
            ? "#00e600"
            : "#ff4d4d",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };
  useEffect(() => {
    getDetails();
    getHistoryDetails();
  }, []);
  if (!coindata) {
    return <h1>Nothing found ....</h1>;
  }
  return (
    <>
      {coindata && (
        <>
          <section class="hero is-medium is-link">
            <Link to="/">
              <button class="m-3 button is-light">BACK</button>
            </Link>
            <div class="hero-body">
              <div className="columns">
                <div className="column mx-5">Rank #{coindata.assests.rank}</div>
                <figure class="image is-64x64">
                  <img
                    class="is-rounded"
                    src={`https://assets.coincap.io/assets/icons/${coindata.assests.symbol.toLowerCase()}@2x.png`}
                  />
                </figure>
              </div>
              <p class="title">
                {coindata.assests.name}({coindata.assests.symbol})
              </p>
              <div className="columns">
                <div className="column">
                  <p class="subtitle">
                    Volume(24Hr):
                    {numeral(coindata.assests.volumeUsd24Hr).format(
                      "($ 0.00 a)"
                    )}{" "}
                  </p>
                </div>
                <div className="column">
                  <p class="subtitle">
                    supply:
                    {numeral(coindata.assests.supply).format("($0.00 a)")}{" "}
                    {coindata.assests.symbol}{" "}
                  </p>
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <p class="subtitle">
                    Price:
                    {numeral(coindata.assests.priceUsd).format("$0,0.00")}{" "}
                  </p>
                </div>
                <div className="column">
                  <p class="subtitle">
                    Market Cap:
                    {numeral(coindata.assests.marketCapUsd).format(
                      "($0.00 a)"
                    )}{" "}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <div className="container mt-5">
            {additionalDetails && (
              <>
                <div className="columns  is-family-secondary	 auto has-background-grey-lighter">
                  <div className="column	 ">
                    <h1 className="subtitle ">
                      HIGH: ${additionalDetails.max.toFixed(5)}
                    </h1>
                  </div>
                  <div className="column	 ">
                    <h1 className="subtitle ">
                      Low: ${additionalDetails.min.toFixed(5)}
                    </h1>
                  </div>
                  <div className="column	 ">
                    <h1 className="subtitle ">
                      Average: ${additionalDetails.avg.toFixed(5)}
                    </h1>
                  </div>

                  <div
                    className={`column ${
                      coindata.assests.changePercent24Hr <= 0
                        ? "has-background-danger"
                        : "has-background-primary"
                    }               
                     
                  }`}
                  >
                    <h1 className="subtitle ">
                      Change:
                      {Number(coindata.assests.changePercent24Hr).toFixed(2)}%
                    </h1>
                  </div>
                </div>
              </>
            )}

            <div className="columns">
              <div className="column is-four-fifths">
                <div className="box">
                  <Line options={options} data={data} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Crypto;
