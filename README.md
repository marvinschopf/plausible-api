# 📊 plausible-api

📈 Unofficial Node.js client for the **API** of [Plausible Analytics](https://plausible.io/).

**Important note:** Plausible's API is currently still in public beta. The functionality can be changed at any time. I try to keep the library up to date and adapt it to the API changes, but I cannot guarantee this.

## Installation

The library can be installed as usual via `npm`:

```bash
npm install plausible-api
```

Or also using `yarn`:

```bash
yarn add plausible-api
```

## Usage

The client must first be imported and an instance created:

```javascript
const Plausible = require("plausible-api");

const client = new Plausible("<YOUR API KEY>");
```

### `getRealtimeVisitors`

**Parameters:**

- `siteId` (`string`): The domain of the website that is set at Plausible.

```javascript
await client.getRealtimeVisitors("example.com");
// => 191
```

### `getTimeseries`

**Parameters:**

- `siteId` (`string`): The domain of the website that is set at Plausible.
- `period` (`"12mo" | "6mo" | "30d" | "7d" | "month" | "day"`): Time periods
- `filters` (`string`, _optional_): Optional filters as documented [here](https://plausible.io/docs/stats-api#filtering)
- `interval` (`"date" | "month"`, _optional_): Choose your reporting interval

```javascript
await client.getTimeseries("example.com", "month", "", "date");
// => [
//      { date: '2021-02-01', value: 5968 },
//      { date: '2021-02-02', value: 1234 },
//      { date: '2021-02-03', value: 22234 },
//      { date: '2021-02-04', value: 19921 },
//      { date: '2021-02-05', value: 17892 },
//      { date: '2021-02-06', value: 1002 },
//      { date: '2021-02-07', value: 2999 },
//      { date: '2021-02-08', value: 21111 },
//      { date: '2021-02-09', value: 1222 },
//      { date: '2021-02-10', value: 3939 },
//      { date: '2021-02-11', value: 4111 },
//      { date: '2021-02-12', value: 48481 },
//      { date: '2021-02-13', value: 3012 },
//      { date: '2021-02-14', value: 59182 },
//      { date: '2021-02-15', value: 3919 },
//      { date: '2021-02-16', value: 4818 },
//      { date: '2021-02-17', value: 23124 },
//      { date: '2021-02-18', value: 12312 },
//      { date: '2021-02-19', value: 20123 },
//      { date: '2021-02-20', value: 4888 },
//      { date: '2021-02-21', value: 5922 },
//      { date: '2021-02-22', value: 27981 },
//      { date: '2021-02-23', value: 3234 },
//      { date: '2021-02-24', value: 1211 },
//      { date: '2021-02-25', value: 5790 },
//      { date: '2021-02-26', value: 9080 },
//      { date: '2021-02-27', value: 14900 },
//      { date: '2021-02-28', value: 12289 }
//    ]
```

### `aggregate`

**Parameters:**

- `siteId` (`string`): The domain of the website that is set at Plausible.
- `period` (`"12mo" | "6mo" | "30d" | "7d" | "month" | "day"`): Time periods
- `metrics` (`Array<"visitors" | "pageviews" | "bounce_rate" | "visit_duration">`): List of metrics to aggregate
- `filters` (`string`, _optional_): Optional filters as documented [here](https://plausible.io/docs/stats-api#filtering)

```javascript
await client.aggregate("example.com", "7d", [
	"visit_duration",
	"visitors",
	"pageviews",
	"bounce_rate",
	"visit_duration",
]);
// => { bounce_rate: 50, pageviews: 6, visit_duration: 14, visitors: 2 }
```

## License

Copyright 2021 Marvin Schopf

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
