// Local stub for the Statsig SDK. The snapshot's StatsigProvider blocks
// rendering until /initialize succeeds, so we answer it first-party with
// empty gates instead of letting the SDK phone the original vendor account.
const body = {
  feature_gates: {},
  dynamic_configs: {},
  layer_configs: {},
  sdkParams: {},
  has_updates: true,
  generator: "local-stub",
  time: 1,
  company_lcut: 1,
  evaluated_keys: {},
  hash_used: "djb2",
  derived_fields: {},
};

function respond() {
  return Response.json(body, {
    headers: { "cache-control": "no-store" },
  });
}

export async function POST() {
  return respond();
}

export async function GET() {
  return respond();
}
