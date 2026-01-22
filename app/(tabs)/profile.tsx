import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
const Page = () => {
  return (
    <View style={styles.container}>

      <Text style={styles.text}>Profile screen.</Text>
    </View>
  );
}

export default Page;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "black", // you can change the color
  },
});
