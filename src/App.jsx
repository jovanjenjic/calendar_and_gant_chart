import React from "react";
import Calendar from "./Calendar";
import mockData from "./mockData";

function App() {
  return (
    <div className="App">
      <Calendar
        arrayData={mockData}
        startIntervalKey="startTime"
        endIntervalKey="endTime"
        sortByKeys={["startTime", "guser.firstName"]}
        colorByKey="state"
        customColors={{
          CANCELED: "#FFEEEE",
          SUCCESSFUL: "#EDFFF3",
          EXPIRED: "#FFF3D5",
        }}
        defaultColor="#e9e9e9"
        createItemName={(item) => `${item?.time} BOO - BOO ${item?.user}`}
      />
    </div>
  );
}

export default App;
