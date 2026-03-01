import React, { useEffect } from "react";
import { ThemeProvider } from "./components/theme-provider";
import RequestUI from "./components/request-ui";
import MainMenu from "./components/main-menu";
import { useShallow } from "zustand/shallow";
import useOpenRequestsStore from "./stores/use-open-requests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { PlusIcon } from "lucide-react";

function App() {
  const openRequests = useOpenRequestsStore(
    useShallow((state) => ({
      requests: state.requests,
      activeRequestIndex: state.activeRequestName,

      addRequest: state.addRequest,
      removeRequest: state.removeRequest,
      clearRequests: state.clearRequests,
      setActiveRequestName: state.setActiveRequestName,
    })),
  );

  useEffect(() => {
    if (openRequests.requests.length === 0) {
      openRequests.clearRequests();
      openRequests.addRequest({
        name: "Untitled",
        method: "GET",
        url: "https://httpbin.org/json",
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
          value={openRequests.activeRequestIndex}
          onValueChange={(value) => {
            console.log("Active request index changed to:", value);
            openRequests.setActiveRequestName(value);
          }}
        >
          <div className="flex">
            <TabsList variant="line" className="bg-transparent border-b-2 h-12 px-4">
              {openRequests.requests.map((request) => (
                <TabsTrigger key={request.name} value={request.name}>
                  {request.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button onClick={() => createNewRequest()} variant="default">
              New
              <PlusIcon />
            </Button>
          </div>
          {openRequests.requests.map((request) => (
            <TabsContent keepMounted={true} key={request.name} value={request.name}>
              <RequestUI method={request.method} url={request.url} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ThemeProvider>
  );
}

export default App;
