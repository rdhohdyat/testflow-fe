import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

const ServerStatus = () => {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/ping")
      .then((res) => {
        if (res.ok) {
          setStatus(true);
        } else {
          setStatus(false);
        }
      })
      .catch((err) => {
        console.log("Server disconnected:", err);
        setStatus(false);
      });
  }, []);

  return (
    <div className="flex items-center">
      {status === true ? (
        <Badge className="bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-100 transition-colors h-10 px-4 rounded-xl flex items-center gap-2 shadow-sm shadow-emerald-100/50">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider">Server Connected</span>
        </Badge>
      ) : (
        <Badge className="bg-red-50 text-red-600 border-none hover:bg-red-100 transition-colors h-10 px-4 rounded-xl flex items-center gap-2 shadow-sm shadow-red-100/50">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider">Server Disconnected</span>
        </Badge>
      )}
    </div>
  );
};

export default ServerStatus;
