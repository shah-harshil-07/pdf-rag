import ChatComponent from "./components/chat";
import FileUploadComponent from "./components/file-upload";

export default function Home() {
  return (
    <div className="h-screen w-screen flex">
      <div className="w-[30vw] min-h-screen border-r-2 p-4 flex justify-center items-center">
        <FileUploadComponent />
      </div>
      <div className="w-[70vw] min-h-screen border-l-2 bg-gray-50 overflow-y-scroll">
        <ChatComponent />
      </div>
    </div>
  );
}
