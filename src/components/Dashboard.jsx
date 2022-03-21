import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import numeral from "numeral";
const Dashboard = ({ id }) => {
  const [previousPrice, setPreviousPrice] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [time, setTime] = useState(false);
  const queryClient = useQueryClient();
  const {
    isLoading,
    data: assests,
    isError,
    refetch,
    isPreviousData,
    keepPreviousData,
  } = useQuery(
    ["crypto", id],
    () => {
      return axios.get("https://api.coincap.io/v2/assets/" + id);
    },
    {
      select: (data) => data.data.data,
      initialData: () => {
        const singleCrypto = queryClient
          .getQueryData("all-crypto")
          ?.data?.data?.find((crypto) => (crypto.id = id));

        if (singleCrypto) {
          return { data: singleCrypto };
        } else {
          return undefined;
        }
      },
      refetchInterval: 10000,
    }
  );
  useEffect(() => {
    setCurrentPrice({ id, price: assests?.priceUsd });
    setPreviousPrice({ id, price: assests?.priceUsd });
  }, [assests]);
  const getRealTimeData = () => {
    const pricesWs = new WebSocket("wss://ws.coincap.io/prices?assets=" + id);

    pricesWs.onmessage = function (msg) {
      setTime(true);
      const data = JSON.parse(msg.data);
      const price = data[id];
      const ob = {
        id,
        price,
      };

      setPreviousPrice(ob);

      setCurrentPrice(ob);

      setTimeout(() => {
        setTime(false);
      }, 10);
    };
    return () => pricesWs.close();
  };

  //websocket for realtime data
  useEffect(getRealTimeData, []);

  return (
    <>
      {assests && (
        <>
          <section className="hero is-medium is-link">
            <Link to="/">
              <button className="m-3 button is-light">BACK</button>
            </Link>
            <div className="hero-body">
              <div className="columns">
                <div className="column mx-5">Rank #{assests.rank}</div>

                <figure className="image is-64x64">
                  <img
                    className="is-rounded"
                    src={`https://assets.coincap.io/assets/icons/${assests?.symbol?.toLowerCase()}@2x.png`}
                  />
                </figure>
              </div>
              <p className="title">
                {assests.name}({assests.symbol})
              </p>
              <div className="columns">
                <div className="column">
                  <p className="subtitle">
                    Volume(24Hr):
                    {numeral(assests.volumeUsd24Hr).format("($ 0.00 a)")}{" "}
                  </p>
                </div>
                <div className="column">
                  <p className="subtitle">
                    supply:
                    {numeral(assests.supply).format("(0.00 a)")}{" "}
                    {assests.symbol}{" "}
                  </p>
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <p className="subtitle is-selected">
                    Price:
                    {numeral(
                      currentPrice != null
                        ? currentPrice?.price
                        : assests?.priceUsd
                    ).format("$0,0.00")}{" "}
                    {currentPrice !== null &&
                    time == true &&
                    Number(currentPrice.price) < Number(previousPrice?.price)
                      ? "↑"
                      : "↓"}
                  </p>
                </div>
                <div className="column">
                  <p className="subtitle">
                    Market Cap:
                    {numeral(assests.marketCapUsd).format("($0.00 a)")}{" "}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section></section>
        </>
      )}
    </>
  );
};

export default Dashboard;
