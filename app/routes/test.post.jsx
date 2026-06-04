export async function loader() {
  return new Response("GET ok", { status: 200 });
}

export async function action() {
  return new Response("POST ok", { status: 200 });
}