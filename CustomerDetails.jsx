import { useState } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";
import stockCodesJson from "../apis/stockCodes.json";
import { AutoComplete, Button, Input, Select, Table } from "antd";

const CustomerDetails = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [stockCode, setStockCode] = useState();
  const [stockSuggestion, setStockSuggestion] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [interval, setInterval] = useState("5minute");
  const columns = [
    {
      title: "Exchange Code",
      dataIndex: "exchange_code",
      key: "exchange_code",
    },
    {
      title: "Date Time",
      dataIndex: "datetime",
      key: "datetime",
    },
    {
      title: "Open",
      dataIndex: "open",
      key: "open",
    },
    {
      title: "Close",
      dataIndex: "close",
      key: "close",
    },
    {
      title: "High",
      dataIndex: "high",
      key: "high",
    },
    {
      title: "Low",
      dataIndex: "low",
      key: "low",
    },
    {
      title: "Stock code",
      dataIndex: "stock_code",
      key: "stock_code",
    },
    {
      title: "Volume",
      dataIndex: "volume",
      key: "volume",
    },
  ];
  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/historicalData",
        {
          stockCode,
          fromDate: `${fromDate}T09:15:00.000Z`,
          toDate: `${toDate}T15:30:00.000Z`,
          interval,
        },
        {
          baseURL: "/",
        }
      );
      setData(response.data.data.Success);
    } catch (error) {
      setError(error);
      console.error("Error fetching data:", error);
    }
  };
  const handleClick = () => {
    fetchData();
  };
  const handleSearch = (value) => {
    setStockSuggestion(
      value
        ? stockCodesJson
            .filter((item) =>
              item?.CompanyName.toLowerCase().includes(value?.toLowerCase())
            )
            .map((item) => ({ value: item.CompanyName, key: item.ShortName }))
        : []
    );
  };

  return (
    <div>
      <h1>Hostirical Data</h1>
      <div style={{ display: "flex" }}>
        <h5>Upload file to update stock codes</h5>
        <FileUpload />
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <AutoComplete
          options={stockSuggestion}
          onSearch={handleSearch}
          onSelect={(value, option) => setStockCode(option.key)}
          style={{ width: "100%" }}
          placeholder="Search for stock code here"
        >
          <Input value={stockCode} />
        </AutoComplete>
        <Input
          type="date"
          id="fromDate"
          placeholder="select from date and time"
          onChange={(e) => setFromDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
        />
        <Input
          type="date"
          id="toDate"
          placeholder="select to date and time"
          onChange={(e) => setToDate(e.target.value)}
          min={fromDate}
          max={new Date().toISOString().split("T")[0]}
        />
        <Select
          id="interval"
          onChange={(value) => setInterval(value)}
          style={{ width: "100%" }}
        >
          {["1minute", "5minute", "30minute", "1day"].map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
        <Button onClick={handleClick}>search</Button>
      </div>
      {error && <p>Error: {error.message}</p>}
      {data && (
        <Table
          dataSource={data.filter((item) => {
            const time = item.datetime.substring(11, 16);
            return time >= "09:15" && time <= "15:30";
          })}
          columns={columns}
        />
      )}
    </div>
  );
};

export default CustomerDetails;
