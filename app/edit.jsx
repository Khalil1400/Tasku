import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text } from "react-native";
import * as Yup from "yup";
import { MyButton, MyTextInput, ScreenContainer } from "./ui";
import { getTask, updateTask } from "./services/taskApi";

const ItemSchema = Yup.object().shape({ title: Yup.string().required("Title required") });

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [initial, setInitial] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const it = await getTask(id);
        setInitial({
          title: it.title,
          category: it.category || "",
          notes: it.description || "",
          image: it.imageUrl || null,
        });
      } catch (err) {
        console.log("Failed to load task", err);
        setError(err?.message || "Failed to load task");
      }
    })();
  }, [id]);

  if (!initial) {
    return (
      <ScreenContainer>
        {error ? <Text style={{ padding: 20, color: "red" }}>{error}</Text> : <Text style={{ padding: 20 }}>Loading...</Text>}
      </ScreenContainer>
    );
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
          setError("");
          await updateTask(id, {
            title: values.title,
            category: values.category || null,
            description: values.notes || "",
            imageUrl: values.image || null,
          });
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
            {error ? <Text style={[styles.error, { color: "red" }]}>{error}</Text> : null}
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
  error: { marginTop: 10 },
});
