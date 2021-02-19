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
	t.is(response.length, 8);
});

test("aggregate", async function (t: ExecutionContext) {
	const response = await client.aggregate(
		SITE_ID,
		"30d",
		["visitors", "visit_duration", "pageviews", "bounce_rate"],
		""
	);
	t.is(response.bounce_rate >= 1, true);
	t.is(response.visitors >= 1, true);
	t.is(response.pageviews >= 5, true);
	t.is(response.visit_duration >= 10, true);
});
