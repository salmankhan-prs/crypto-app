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
import Dashboard from "../components/Dashboard";
import Helmet from "react-helmet";
import { useQuery } from "react-query";
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
  const [realTimeData, setRealTimeData] = useState(null);
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
  const {
    isLoading,
    data: assests,
    error,
    isError,
  } = useQuery(
    "all-crypto",
    () => {
      return axios.get("https://api.coincap.io/v2/assets");
    },
    {
      select: (data) =>
        data.data.data.map((data) => {
          return { id: data.id, priceUsd: data.priceUsd };
        }),
    }
  );
  useEffect(() => {
    setRealTimeData(assests);
  }, [assests]);

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

  return (
    <>
      <Helmet>
        <title>{params.id} | Crypto APP</title>
      </Helmet>
      <Dashboard id={params.id} />
      {coindata && (
        <>
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
          <section className="table-container mt-5">
            <h2 className="is-centered title">Exchange Prices:</h2>
            <table
              className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth
"
            >
              <thead>
                <tr>
                  <th>baseId</th>
                  <th>exchangeId</th>
                  <th>priceUsd</th>
                  <th>quoteId</th>
                  <th>volumePercent</th>
                  <th>volumeUsd24Hr</th>
                </tr>
              </thead>
              <tbody>
                {coindata.markets.map((item) => (
                  <tr key={item.priceUsd}>
                    <td>{item.baseId}</td>
                    <td>{item.exchangeId}</td>
                    <td>{Number(item.priceUsd).toFixed(2)}</td>
                    <td>{item.quoteId}</td>
                    <td>{Number(item.volumePercent).toFixed(2)}%</td>
                    <td>{Number(item.volumeUsd24Hr).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </>
  );
};

export default Crypto;
