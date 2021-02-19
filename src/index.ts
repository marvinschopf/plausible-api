/**
 *
 * plausible-api
 * Copyright 2021 Marvin Schopf
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright 2021 Marvin Schopf
 * @license Apache-2.0
 *
 */

import fetch, { Response } from "node-fetch";

const API_BASE: string = "https://plausible.io/api/v1/stats";

async function asyncForEach(array: any[], callback: Function) {
	for (let index: number = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

export default class PlausibleClient {
	apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	public async getRealtimeVisitors(siteId: string): Promise<number> {
		const response: Response = await fetch(
			`${API_BASE}/realtime/visitors?site_id=${siteId}`,
			{
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			}
		);
		if (response.status === 200) {
			return parseInt(await response.text());
		} else {
			let responseJson: any;
			try {
				responseJson = await response.json();
			} catch (e) {
				throw new Error(
					`HTTP API Error: ${response.status} ${response.statusText}`
				);
			}
			if (responseJson.error && responseJson.error.length >= 1) {
				throw new Error(`API Error: ${responseJson.error}`);
			} else
				throw new Error(
					`HTTP API Error: ${response.status} ${response.statusText}`
				);
		}
	}

	public async getTimeseries(
		siteId: string,
		period: "12mo" | "6mo" | "30d" | "7d" | "month" | "day",
		filters?: string,
		interval?: "date" | "month"
	): Promise<{ date: Date; value: number }[]> {
		let additionalParams: string = "";
		if (interval && interval.length >= 1) {
			additionalParams = `${additionalParams}&interval=${interval}`;
		}
		if (filters && filters.length >= 1) {
			additionalParams = `${additionalParams}&filters=${filters}`;
		}
		const response: Response = await fetch(
			`${API_BASE}/timeseries?site_id=${siteId}&period=${period}${additionalParams}`,
			{
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			}
		);
		if (response.status === 200) {
			let timeSeriesObjects: { date: Date; value: number }[] = [];
			await asyncForEach(
				await response.json(),
				async function (timeSeriesElement: { date: Date; value: number }) {
					timeSeriesObjects.push(timeSeriesElement);
				}
			);
			return timeSeriesObjects;
		} else {
			let responseJson: any;
			try {
				responseJson = await response.json();
			} catch (e) {
				throw new Error(
					`HTTP API Error: ${response.status} ${response.statusText}`
				);
			}
			if (responseJson.error && responseJson.error.length >= 1) {
				throw new Error(`API Error: ${responseJson.error}`);
			} else
				throw new Error(
					`HTTP API Error: ${response.status} ${response.statusText}`
				);
		}
	}

	public async aggregate(
		siteId: string,
		period: "12mo" | "6mo" | "30d" | "7d" | "month" | "day",
		metrics: Array<"visitors" | "pageviews" | "bounce_rate" | "visit_duration">,
		filters?: string
	): Promise<{
		bounceRate?: number;
		pageviews?: number;
		visitDuration?: number;
		visitors?: number;
	}> {
		const metricsParam: string = metrics.join(",");
		let filtersParam: string = "";
		if (filters && filters.length >= 1) {
			filtersParam = `&filters=${filters}`;
		}
		const response: Response = await fetch(
			`${API_BASE}/aggregate?site_id=${siteId}&period=${period}&metrics=${metricsParam}${filtersParam}`,
			{
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			}
		);
		if (response.status === 200) {
			let aggregateResponse: {
				bounceRate?: number;
				pageviews?: number;
				visitDuration?: number;
				visitors?: number;
			} = {};
			let value: any;
			let key: string;
			for ([key, value] of Object.entries(await response.json())) {
				aggregateResponse[key] = value.value;
			}
			return aggregateResponse;
		} else {
			let responseJson: any;
			try {
				responseJson = await response.json();
			} catch (e) {
				throw new Error(
					`HTTP API Error: ${response.status} ${response.statusText}`
				);
			}
			if (responseJson.error && responseJson.error.length >= 1) {
				throw new Error(`API Error: ${responseJson.error}`);
			} else
				throw new Error(
					`HTTP API Error: ${response.status} ${response.statusText}`
				);
		}
	}
}

module.exports = PlausibleClient;
