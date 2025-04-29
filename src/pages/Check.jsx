import { useEffect, useState } from "react";
import { CommonGet } from "../common/httpClient";

function Check() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await CommonGet("Catogory/GetCatorgory");
        setData(result);
        console.log(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{/* Render your data */}</div>;
}

export default Check;
