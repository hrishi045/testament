import typer
import httpx

app = typer.Typer()
client = httpx.Client(http2=True)


@app.command()
def request(url: str, method: str = "GET"):
    try:
        response = client.request(method, url)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
    except httpx.RequestError as exc:
        print(f"An error occurred while requesting {exc.request.url!r}.")


@app.command()
def help():
    print("No help")


if __name__ == "__main__":
    app()
