import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";

const useFetch = ({
  address,
  abi,
  functionName,
  args = [],
  enabled = true,
}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    data: contractData,
    isLoading: contractLoading,
    error: contractError,
  } = useReadContract({
    address,
    abi,
    functionName,
    args,
    enabled,
  });

  useEffect(() => {
    setIsLoading(contractLoading);
    if (contractData) {
      setData(contractData);
    }
    if (contractError) {
      setError(contractError.message);
    }
  }, [contractData, contractLoading, contractError]);

  return { data, isLoading, error };
};

export default useFetch;
