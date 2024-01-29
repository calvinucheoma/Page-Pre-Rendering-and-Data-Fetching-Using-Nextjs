import { useEffect, useState } from 'react';
import useSWR from 'swr';

const LastSalesPage = (props) => {
  const [sales, setSales] = useState(props.sales);
  // const [isLoading, setIsLoading] = useState(false);

  const { isLoading, error, data } = useSWR(
    'https://nextjs-dummy-data-4a03c-default-rtdb.firebaseio.com/sales.json',
    (url) => fetch(url).then((response) => response.json())
  );

  useEffect(() => {
    if (data) {
      const transformedSales = [];

      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }
      setSales(transformedSales);
    }
  }, [data]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch(
  //     'https://nextjs-dummy-data-4a03c-default-rtdb.firebaseio.com/sales.json'
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const transformedSales = [];

  //       for (const key in data) {
  //         transformedSales.push({
  //           id: key,
  //           username: data[key].username,
  //           volume: data[key].volume,
  //         });
  //       }
  //       setSales(transformedSales);
  //       setIsLoading(false);
  //       //data we are getting from firebase would be an object so we need to transform it into an array
  //     }); //fetching a request from firebase API. Need to add the database folder name after the / and then include '.json'
  // }, []);

  if (error) {
    return <p>Failed to load</p>;
  }

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  if (!sales) {
    return <p>No data yet..</p>;
  }

  return (
    <>
      <ul>
        {sales.map((sale) => (
          <li key={sale.id}>
            {sale.username} - ${sale.volume}
          </li>
        ))}
      </ul>
    </>
  );
};

export async function getStaticProps() {
  // return fetch(
  //   'https://nextjs-dummy-data-4a03c-default-rtdb.firebaseio.com/sales.json'
  // )
  //   .then((response) => response.json())
  //   .then((data) => {
  //     const transformedSales = [];
  //     for (const key in data) {
  //       transformedSales.push({
  //         id: key,
  //         username: data[key].username,
  //         volume: data[key].volume,
  //       });
  //     }

  const response = await fetch(
    'https://nextjs-dummy-data-4a03c-default-rtdb.firebaseio.com/sales.json'
  );
  const data = await response.json();

  const transformedSales = [];
  for (const key in data) {
    transformedSales.push({
      id: key,
      username: data[key].username,
      volume: data[key].volume,
    });
  }

  return {
    props: { sales: transformedSales },
    // revalidate: 10,
  };
  // });
}

export default LastSalesPage;
