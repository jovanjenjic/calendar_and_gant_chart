const resolveColor = (state) => {
  switch (state) {
    case "CANCELED": {
      return "#FFEEEE";
    }
    case "SUCCESSFUL": {
      return "#EDFFF3";
    }
    case "EXPIRED": {
      return "#FFF3D5";
    }
    default: {
      return "#E6ECF1";
    }
  }
};

export default resolveColor;
