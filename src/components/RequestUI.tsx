import React, { useEffect, useReducer } from "react";
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
import { Label } from "./ui/label";
import { PlusIcon } from "lucide-react";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

declare global {
  interface Window {
    electron: {
      makeHttpRequest: (
        method: string,
        url: string,
        headers?: Record<string, string>,
      ) => Promise<any>;
    };
  }
}

type RequestUIProps = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
};

type RequestState = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
};

type RequestAction =
  | { type: "setMethod"; payload: string }
  | { type: "setUrl"; payload: string }
  | { type: "setHeaders"; payload: Record<string, string> }
  | { type: "setBody"; payload: string }
  | { type: "reset" };

const requestReducer = (state: RequestState, action: RequestAction): RequestState => {
  switch (action.type) {
    case "setMethod":
      return { ...state, method: action.payload };
    case "setUrl":
      return { ...state, url: action.payload };
    case "setHeaders":
      return { ...state, headers: action.payload };
    case "setBody":
      return { ...state, body: action.payload };
    case "reset":
      return {
        method: "GET",
        url: "",
        headers: {},
        body: "",
      };
    default:
      return state;
  }
};

type ResponseState = {
  status: number;
  headers: Record<string, string>;
  body: string;
  error?: string;
};

type ResponseAction =
  | { type: "setResponseData"; payload: Partial<ResponseState> }
  | { type: "reset" };

const responseReducer = (state: ResponseState, action: ResponseAction): ResponseState => {
  switch (action.type) {
    case "setResponseData":
      return { ...state, ...action.payload };
    case "reset":
      return {
        status: 0,
        headers: {},
        body: "",
        error: undefined,
      };
    default:
      return state;
  }
};

export default function RequestUI({ method, url, headers, body }: RequestUIProps) {
  const [makingRequest, setMakingRequest] = React.useState(false);
  const [isHTMLPage, setIsHTMLPage] = React.useState(false);
  const iframeDoc = React.useRef<HTMLIFrameElement>(null);

  const [request, requestDispatch] = useReducer(requestReducer, {
    method: method,
    url: url,
    headers: headers,
    body: body,
  });

  const [response, responseDispatch] = useReducer(responseReducer, {
    status: 0,
    headers: {},
    body: "",
    error: undefined,
  });

  const handleSendRequest = async () => {
    setMakingRequest(true);

    try {
      const res = await window.electron.makeHttpRequest(request.method, request.url);
      const { status_code: status, headers, body } = JSON.parse(res);

      responseDispatch({ type: "setResponseData", payload: { status, headers, body, error: "" } });

      if (
        (headers["content-type"] && headers["content-type"].includes("text/html")) ||
        body.includes("<html")
      ) {
        setIsHTMLPage(true);
      } else {
        setIsHTMLPage(false);
      }
    } catch (err) {
      responseDispatch({
        type: "setResponseData",
        payload: { error: `Error: ${err}`, status: 0, headers: {}, body: "" },
      });
      setIsHTMLPage(false);
    } finally {
      setMakingRequest(false);
    }
  };

  function colorBasedOnStatus(status: number) {
    if (status == 0) {
      return "text-gray-500 dark:text-gray-400";
    }
    if (status >= 200 && status < 300) {
      return "text-green-500 dark:text-green-300";
    }
    if (status >= 300 && status < 400) {
      return "text-yellow-500 dark:text-yellow-300";
    }
    if (status >= 400 && status < 500) {
      return "text-red-500 dark:text-red-300";
    }
    if (status >= 500) {
      return "text-red-700 dark:text-red-400";
    }
    return "";
  }

  console.log(request);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <ButtonGroup className="flex w-full">
        <Combobox
          items={methods}
          onValueChange={(value) => requestDispatch({ type: "setMethod", payload: value })}
          value={request.method}
        >
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
            value={request.url}
            onChange={(e) => requestDispatch({ type: "setUrl", payload: e.target.value })}
            onKeyDown={async (e) => {
              if (e.ctrlKey && e.key === "Enter") {
                await handleSendRequest();
              }
            }}
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
              <TabsTrigger className="cursor-pointer" value="body">
                Body
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="headers">
                Headers
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="query">
                Query Params
              </TabsTrigger>
            </TabsList>
            <TabsContent value="body">
              <Textarea placeholder="Request Body" className="mt-4 min-h-72 max-h-72 font-mono" />
              <p className="mt-2 text-sm text-muted-foreground">
                Note: Request body is only applicable for POST, PUT, and PATCH methods.
              </p>
            </TabsContent>
            <TabsContent value="headers">
              <Table className="inline-block">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-50">Header</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {request.headers && Object.entries(request.headers).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-mono" contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => {
                        const newKey = e.currentTarget.textContent || "";
                        const newHeaders = { ...request.headers };
                        delete newHeaders[key];
                        newHeaders[newKey] = value;
                        requestDispatch({
                          type: "setHeaders",
                          payload: newHeaders,
                        });
                      }}>
                        {key}
                      </TableCell>
                      <TableCell className="font-mono text-pretty" contentEditable={true} suppressContentEditableWarning={true} onBlur={(e) => {
                        const newHeaders = e.currentTarget.textContent || "";
                        requestDispatch({
                          type: "setHeaders",
                          payload: { ...request.headers, [key]: newHeaders },
                        });
                      }}>
                        {value}
                      </TableCell>
                    </TableRow>
                  ))}
                  <Button variant="secondary" onClick={() => {
                    const newHeaders = { ...request.headers, "": "" };
                    requestDispatch({
                      type: "setHeaders",
                      payload: newHeaders,
                    });
                  }}><PlusIcon /></Button>
                </TableBody>
              </Table>
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
            <div className="flex justify-between">
              <TabsList variant="line">
                <TabsTrigger className="cursor-pointer" value="body-response">
                  Body
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="headers-response">
                  Headers
                </TabsTrigger>
                {isHTMLPage && (
                  <TabsTrigger className="cursor-pointer" value="preview">
                    Preview
                  </TabsTrigger>
                )}
              </TabsList>
              <Label className={"font-mono text-sm " + colorBasedOnStatus(response.status)}>
                {`Status: ${response.status}`}
              </Label>
            </div>

            <TabsContent value="body-response">
              <Textarea
                placeholder="Response Body"
                value={response.body || response.error}
                readOnly
                className={`mt-4 min-h-72 max-h-72 font-mono ${response.error ? "text-red-500 dark:text-red-300" : ""}`}
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
                  {Object.entries(response.headers).map(([key, value]) => (
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
                  ref={iframeDoc}
                  title="HTML Preview"
                  srcDoc={response.body}
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
