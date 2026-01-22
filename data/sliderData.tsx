import { ImageSourcePropType } from "react-native";

export type SliderItem = {
  title: string;
  image: ImageSourcePropType;
  description: string;
};

export const ImageSlider: SliderItem[] = [
  {
    title: "Discover Places",
    image: require("../assets/images/as.jpg"),
    description: "Explore amazing places around you.",
  },
  {
    title: "Find Events",
    image: require("../assets/images/g.jpg"),
    description: "Discover events happening nearby.",
  },
  {
    title: "Connect with People",
    image: require("../assets/images/s.jpg"),
    description: "Meet new people and make friends.",
  },
];
