import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import MyButton from "./components/MyButton";
import ScreenContainer from "./components/ScreenContainer";

export default function About() {
  const router = useRouter();
  return (
    <ScreenContainer>
      <View style={{padding:20}}>
        <Text style={{fontSize:20,fontWeight:"700"}}>About TaskMate</Text>
        <Text style={{marginTop:8}}>Demo task app made by Khalil.</Text>

        <MyButton text="Back" onPress={()=>router.back()} style={{marginTop:12}} />
      </View>
    </ScreenContainer>
  );
}