import React from "react";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "./ui/combobox";
import { Textarea } from "./ui/textarea";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

declare global {
  interface Window {
    electron: {
      makeHttpRequest: (method: string, url: string) => Promise<any>;
    };
  }
}

export default function RequestUI() {
  const [method, setMethod] = React.useState("GET");
  const [url, setUrl] = React.useState("");
  const [makingRequest, setMakingRequest] = React.useState(false);
  const [responseBody, setResponseBody] = React.useState("");
  const [responseHeaders, setResponseHeaders] = React.useState<Record<string, string>>({});
  const [statusCode, setStatusCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [isHTMLPage, setIsHTMLPage] = React.useState(false);
  const iframeDoc = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (!makingRequest) {
      if (iframeDoc.current && url && url.startsWith("http") && isHTMLPage) {
        const doc = iframeDoc.current.contentDocument || iframeDoc.current.contentWindow?.document;
        if (doc) {
          doc.open();
          iframeDoc.current.srcdoc = responseBody;
          doc.close();
        }
      }
    }
  }, [makingRequest]);

  const handleSendRequest = async () => {
    setMakingRequest(true);

    try {
      const response = await window.electron.makeHttpRequest(method, url);
      const { status, headers, body } = JSON.parse(response);

      setResponseBody(body);
      setResponseHeaders(headers);
      setStatusCode(status);
      setError("");

      if (
        (headers["content-type"] && headers["content-type"].includes("text/html")) ||
        body.includes("<html")
      ) {
        setIsHTMLPage(true);
      } else {
        setIsHTMLPage(false);
      }
    } catch (err) {
      setError(`Error: ${err}`);
      setResponseBody("");
      setResponseHeaders({});
      setStatusCode("");
      setIsHTMLPage(false);
    } finally {
      setMakingRequest(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <ButtonGroup className="flex w-full">
        <Combobox items={methods} onValueChange={(value) => setMethod(value)} value={method}>
          <ComboboxInput placeholder="Select Method" />
          <ComboboxContent>
            <ComboboxEmpty>No methods found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <InputGroup>
          <InputGroupInput
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <InputGroupAddon align="inline-end">Valid URL</InputGroupAddon>
        </InputGroup>
        <Button variant="outline" onClick={handleSendRequest} disabled={makingRequest}>
          {makingRequest ? "Sending..." : "Send"}
        </Button>
      </ButtonGroup>

      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel className="p-4 pl-1">
          <Tabs defaultValue="body">
            <TabsList variant="line">
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="query">Query Params</TabsTrigger>
            </TabsList>
            <TabsContent value="body">
              <Textarea placeholder="Request Body" className="mt-4 min-h-72 max-h-72 font-mono" />
              <p className="mt-2 text-sm text-muted-foreground">
                Note: Request body is only applicable for POST, PUT, and PATCH methods.
              </p>
            </TabsContent>
            <TabsContent value="headers">
              <Textarea
                placeholder="Request Headers"
                className="mt-4 min-h-72 max-h-72 font-mono"
              />
            </TabsContent>
            <TabsContent value="query">
              <Textarea
                placeholder="Query Parameters"
                className="mt-4 min-h-72 max-h-72 font-mono"
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="p-4 pr-1">
          <Tabs defaultValue="body-response">
            <TabsList variant="line">
              <TabsTrigger value="body-response">Body</TabsTrigger>
              <TabsTrigger value="headers-response">Headers</TabsTrigger>
              {isHTMLPage && <TabsTrigger value="preview">Preview</TabsTrigger>}
            </TabsList>

            <TabsContent value="body-response">
              <Textarea
                placeholder="Response Body"
                value={responseBody || error}
                readOnly
                className={`mt-4 min-h-72 max-h-72 font-mono ${error ? "text-red-500 dark:text-red-300" : ""}`}
              />
            </TabsContent>
            <TabsContent value="headers-response">
              <Table className="inline-block">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-50">Header</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(responseHeaders).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-mono">{key || " "}</TableCell>
                      {/* split every 30 chars */}
                      <TableCell className="font-mono text-pretty">
                        {value
                          ?.match(/.{1,45}/g)
                          ?.map((chunk, index) => (
                            <div key={`chunk-${key}-${index}`}>{chunk}</div>
                          )) || " "}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            {isHTMLPage && (
              <TabsContent value="preview">
                <iframe
                  // srcDoc={responseBody}
                  ref={iframeDoc}
                  title="HTML Preview"
                  className="mt-4 w-full h-100 bg-white"
                />
              </TabsContent>
            )}
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
