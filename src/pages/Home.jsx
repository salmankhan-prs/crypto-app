import React from "react";

import axios from "axios";
import { QueryClientProvider, QueryClient, useQuery } from "react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
const Home = () => {
  // const [assests, setAssests] = useState(null);
  const [livedata, setLiveData] = useState(null);
  const [search, setSearch] = useState("");

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
      select: (data) => data.data,
    }
  );

  // const tradeWs = new WebSocket("wss://ws.coincap.io/trades/binance");

  // tradeWs.onmessage = function (msg) {
  //   setLiveData(msg.data);
  // };

  if (isLoading) {
    return (
      <div className="mt-9 w-auto box columns  is-vcentered">
        <progress className="progress is-small is-primary" max="100">
          15%
        </progress>
      </div>
    );
  }
  const handleSearch = (e) => {
    setSearch(e.target.value);
    // setSearchAssests(assests);
    // const filterData = searchAssests.data.filter((data) =>
    //   data.name.toLowerCase().includes(e.target.value)
    // );
    // searchAssests.data = filterData;
  };

  return (
    <div>
      <Helmet>
        <title>crypto App | Home</title>
      </Helmet>
      <section className="hero is-success is-halfheight">
        <div className="hero-body">
          <div className="mx-auto">
            <p className=" title">Welcome to crypto App</p>

            <div className="columns">
              <div className="column is-three-quarters">
                <input
                  className="input is-primary"
                  type="text"
                  name="search"
                  value={search}
                  placeholder="search for crypto ..."
                  onChange={handleSearch}
                ></input>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="is-flex columns is-justify-content-space-between	  is-flex-direction-row	is-flex-wrap-wrap	">
          {assests &&
            assests.data
              .filter((data) => data.name.toLowerCase().includes(search))
              .map((data) => (
                <div className=" column ">
                  <Link to={`/crypto/${data.id}`}>
                    <div className="card">
                      <header className="card-header">
                        <div className="card-header-icon">
                          <img
                            src={`https://assets.coincap.io/assets/icons/${data.symbol.toLowerCase()}@2x.png`}
                          />
                        </div>
                        <p className="card-header-title">{data.name}</p>
                        <span className="tag is-black mr-2">
                          {" "}
                          Rank: {data.rank}
                        </span>
                        <span className="tag is-black">
                          {" "}
                          symbol: {data.symbol}
                        </span>
                      </header>
                      <div className="card-content">
                        <div className="tags"></div>
                        <h1 className="tag is-link is-light">
                          Supply: {Math.round(data.supply)}
                        </h1>
                        <h1 className="tag is-link is-light">
                          Total coins : {Math.round(data.maxSupply)}
                        </h1>
                        <h1 className="tag is-link is-light">
                          Price:$ {Math.round(data.priceUsd)}
                        </h1>
                        <h1
                          className={`tag is-link ${
                            data.changePercent24Hr > 0
                              ? "is-success"
                              : "is-danger"
                          }`}
                        >
                          Change Percent in 24 Hr:{" "}
                          {Number(data.changePercent24Hr).toFixed(2)}%
                        </h1>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
        </div>
      </section>
      {livedata && (
        <div>
          salman
          <h1>{livedata.name}</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
