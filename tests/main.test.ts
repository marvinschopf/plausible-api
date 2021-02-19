import test, { ExecutionContext } from "ava";
import PlausibleClient from "./../src";

const PLAUSIBLE_API_KEY: string = process.env.PLAUSIBLE_API_KEY;
const SITE_ID: string = process.env.SITE_ID;

const client: PlausibleClient = new PlausibleClient(PLAUSIBLE_API_KEY);

test("getRealtimeUsers", async function (t: ExecutionContext) {
	const response: number = await client.getRealtimeVisitors(SITE_ID);
	t.is(response >= 0, true);
});

test("getTimeseries 12mo month", async function (t: ExecutionContext) {
	const response = await client.getTimeseries(SITE_ID, "12mo", "", "month");
	t.is(response.length, 12);
});

test("getTimeseries 7d date", async function (t: ExecutionContext) {
	const response = await client.getTimeseries(SITE_ID, "7d", "", "date");
	t.is(response.length, 7);
});

test("getTimeseries day date", async function (t: ExecutionContext) {
	const response = await client.getTimeseries(SITE_ID, "day", "", "date");
	t.is(response.length, 7);
});
