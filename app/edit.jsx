import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text } from "react-native";
import * as Yup from "yup";
import MyButton from "./components/MyButton";
import MyTextInput from "./components/MyTextInput";
import ScreenContainer from "./components/ScreenContainer";
import { getItemById, updateItem } from "./services/storageService";

const ItemSchema = Yup.object().shape({ title: Yup.string().required("Title required") });

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    (async () => {
      const it = await getItemById(id);
      setInitial(it);
    })();
  }, [id]);

  if (!initial) {
    return <ScreenContainer><Text style={{ padding: 20 }}>Loading...</Text></ScreenContainer>;
  }

  async function pickImage(setFieldValue) {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return alert("Permission denied");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });
    if (!res.canceled && res.assets && res.assets[0]) {
      setFieldValue("image", res.assets[0].uri);
    }
  }

  return (
    <ScreenContainer>
      <Formik
        initialValues={{
          title: initial.title,
          category: initial.category || "",
          notes: initial.notes || "",
          image: initial.image,
        }}
        validationSchema={ItemSchema}
        onSubmit={async (values) => {
          await updateItem({ ...initial, ...values });
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace({ pathname: "/(tabs)/task/[id]", params: { id } });
          }
        }}
      >
        {({ handleSubmit, handleChange, values, setFieldValue }) => (
          <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 40 }}>
            <MyTextInput label="Title" value={values.title} onChangeText={handleChange("title")} />
            <MyTextInput label="Category" value={values.category} onChangeText={handleChange("category")} />
            <MyTextInput label="Notes" value={values.notes} onChangeText={handleChange("notes")} multiline />
            {values.image ? <Image source={{ uri: values.image }} style={styles.image} /> : null}
            <MyButton text="Change Image" onPress={() => pickImage(setFieldValue)} />
            <MyButton text="Save Changes" onPress={handleSubmit} style={{ marginTop: 8 }} />
          </ScrollView>
        )}
      </Formik>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: { padding: 12 },
  image: { height: 150, width: "100%", borderRadius: 8, marginVertical: 8, backgroundColor: "#eee" },
});
