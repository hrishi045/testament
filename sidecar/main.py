import typer
import httpx
import json

app = typer.Typer()
client = httpx.Client(http2=True)


@app.command()
def request(url: str, method: str = "GET"):
    try:
        response = client.request(method, url)
        print(
            json.dumps(
                {
                    "status_code": response.status_code,
                    "headers": dict(response.headers),
                    "body": response.text,
                }
            )
        )
    except httpx.RequestError as exc:
        print(
            json.dumps(
                {"error": f"An error occurred while requesting {exc.request.url!r}."}
            )
        )


@app.command()
def help():
    print("No help")


if __name__ == "__main__":
    app()
