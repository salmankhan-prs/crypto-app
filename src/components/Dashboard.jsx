import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import numeral from "numeral";
const Dashboard = ({ id }) => {
  const [previousPrice, setPreviousPrice] = useState(null);
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
        console.log(singleCrypto);
        if (singleCrypto) {
          return { data: singleCrypto };
        } else {
          return undefined;
        }
      },
      refetchInterval: 10000,
    }
  );

  console.log(isPreviousData);
  console.log(keepPreviousData);
  return (
    <>
      {assests && (
        <>
          <section class="hero is-medium is-link">
            <Link to="/">
              <button class="m-3 button is-light">BACK</button>
            </Link>
            <div class="hero-body">
              <div className="columns">
                <div className="column mx-5">Rank #{assests.rank}</div>
                <figure class="image is-64x64">
                  <img
                    class="is-rounded"
                    src={`https://assets.coincap.io/assets/icons/${assests?.symbol?.toLowerCase()}@2x.png`}
                  />
                </figure>
              </div>
              <p class="title">
                {assests.name}({assests.symbol})
              </p>
              <div className="columns">
                <div className="column">
                  <p class="subtitle">
                    Volume(24Hr):
                    {numeral(assests.volumeUsd24Hr).format("($ 0.00 a)")}{" "}
                  </p>
                </div>
                <div className="column">
                  <p class="subtitle">
                    supply:
                    {numeral(assests.supply).format("(0.00 a)")}{" "}
                    {assests.symbol}{" "}
                  </p>
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <p class="subtitle">
                    Price:
                    {numeral(assests.priceUsd).format("$0,0.00")}{" "}
                  </p>
                </div>
                <div className="column">
                  <p class="subtitle">
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
