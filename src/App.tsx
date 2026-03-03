import React, { useEffect } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import RequestUI from "./components/RequestUI";
import MainMenu from "./components/MainMenu";
import { useShallow } from "zustand/shallow";
import useOpenRequestsStore from "./stores/use-open-requests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Cross, CrossIcon, PlusIcon, X } from "lucide-react";
import EditableTabsTrigger from "./components/EditableTabsTrigger";
import { ScrollArea } from "./components/ui/scroll-area";

function App() {
  const openRequests = useOpenRequestsStore(
    useShallow((state) => ({
      requests: state.requests,
      activeRequestId: state.activeRequestId,

      addRequest: state.addRequest,
      removeRequest: state.removeRequest,
      clearRequests: state.clearRequests,
      setActiveRequestId: state.setActiveRequestId,
      changeName: state.changeName,
    })),
  );

  useEffect(() => {
    if (openRequests.requests.length === 0) {
      openRequests.clearRequests();
      openRequests.addRequest({
        name: "Untitled",
        method: "GET",
        url: "https://httpbin.org/json",
        headers: {
          "User-Agent": "Testament/1.0",
        }
      });
    }
  }, []);

  function createNewRequest(name?: string) {
    const newRequest = {
      name: name || `Untitled ${openRequests.requests.length + 1}`,
      method: "GET",
      url: "",
    };
    openRequests.addRequest(newRequest);
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="App">
        <MainMenu />
        <Tabs
          value={openRequests.activeRequestId}
          onValueChange={(value) => {
            console.log("Active request index changed to:", value);
            openRequests.setActiveRequestId(value);
          }}
        >
          <div className="flex justify-start">
            <Button onClick={() => createNewRequest()} variant="default">
              New
              <PlusIcon />
            </Button>
            <ScrollArea className="whitespace-nowrap flex-1">
              <TabsList variant="line" className="bg-transparent border-b-2">
                {openRequests.requests.map((request, index) => (
                  <EditableTabsTrigger
                    key={request.id}
                    id={request.id}
                    name={request.name}
                    index={index}
                    onChange={(newName) => openRequests.changeName(request.id, newName)}
                    onDelete={(id) => openRequests.removeRequest(id)} />
                ))}
              </TabsList>
            </ScrollArea>
          </div>
          {openRequests.requests.map((request) => (
            <TabsContent keepMounted={true} key={request.id} value={request.id}>
              <RequestUI method={request.method} url={request.url} headers={request.headers} body={request.body} />
            </TabsContent>
          ))}
        </Tabs>
      </div >
    </ThemeProvider >
  );
}

export default App;
