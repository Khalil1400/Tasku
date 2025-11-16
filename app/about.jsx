// app/about.jsx
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
        <Text style={{marginTop:8}}>This is a demo tasks app built for a course assignment. It shows usage of SecureStore, AsyncStorage, ImagePicker, Formik/Yup, and typical app flows.</Text>

        <MyButton text="Back" onPress={()=>router.back()} style={{marginTop:12}} />
      </View>
    </ScreenContainer>
  );
}